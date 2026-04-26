/** Auto Email Reports — schedule + render + dispatch pipeline.
 *
 *  A scheduled report is one row in `auto_email_reports` with:
 *    - report_kind   ('gl-trial-balance' | 'gl-profit-loss' | …)
 *    - report_args   (filters specific to that report)
 *    - cron_expr     (when to fire — minute granularity)
 *    - subject_tpl   (subject — rendered via the template engine)
 *    - body_tpl      (body  — rendered with the report data in scope)
 *    - recipients    (string[] of email addresses)
 *
 *  The scheduler ticks once a minute (re-using the cron parser shipped
 *  by notification-scheduler). When a row matches, we:
 *    1. Run the named report with its args.
 *    2. Render `subject_tpl` and `body_tpl` against the report payload.
 *    3. Enqueue a notification_deliveries row (channel=email) so the
 *       existing notification dispatcher delivers it. This keeps the
 *       single email pipeline + retry/backoff/dead-letter for free.
 */

import { db, nowIso } from "@gutu-host";
import { uuid } from "@gutu-host";
import { renderTemplate } from "@gutu-plugin/template-core";
import { recordAudit } from "@gutu-host";
import {
  trialBalance as glTrialBalance,
  profitAndLoss as glProfitAndLoss,
  balanceSheet as glBalanceSheet,
} from "@gutu-plugin/accounting-core";
import { stockBalance, reorderSuggestions } from "@gutu-plugin/inventory-core";

export type ReportKind =
  | "gl-trial-balance"
  | "gl-profit-loss"
  | "gl-balance-sheet"
  | "stock-balance"
  | "reorder-suggestions"
  | "sales-aging"
  | "purchase-aging";

export interface AutoEmailReport {
  id: string;
  tenantId: string;
  name: string;
  reportKind: ReportKind;
  reportArgs: Record<string, unknown>;
  cronExpr: string;
  subjectTpl: string;
  bodyTpl: string;
  recipients: string[];
  enabled: boolean;
  lastRunAt: string | null;
  lastRunStatus: string | null;
  lastError: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export class AutoEmailError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "AutoEmailError";
  }
}

interface Row {
  id: string;
  tenant_id: string;
  name: string;
  report_kind: ReportKind;
  report_args: string | null;
  cron_expr: string;
  subject_tpl: string;
  body_tpl: string;
  recipients: string;
  enabled: number;
  last_run_at: string | null;
  last_run_status: string | null;
  last_error: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function rowToReport(r: Row): AutoEmailReport {
  return {
    id: r.id,
    tenantId: r.tenant_id,
    name: r.name,
    reportKind: r.report_kind,
    reportArgs: parseJson<Record<string, unknown>>(r.report_args, {}),
    cronExpr: r.cron_expr,
    subjectTpl: r.subject_tpl,
    bodyTpl: r.body_tpl,
    recipients: parseJson<string[]>(r.recipients, []),
    enabled: r.enabled === 1,
    lastRunAt: r.last_run_at,
    lastRunStatus: r.last_run_status,
    lastError: r.last_error,
    createdBy: r.created_by,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export interface CreateArgs {
  tenantId: string;
  name: string;
  reportKind: ReportKind;
  reportArgs?: Record<string, unknown>;
  cronExpr: string;
  subjectTpl: string;
  bodyTpl: string;
  recipients: string[];
  enabled?: boolean;
  createdBy: string;
}

export function createReport(args: CreateArgs): AutoEmailReport {
  if (!args.recipients || args.recipients.length === 0)
    throw new AutoEmailError("invalid", "At least one recipient required");
  validateCron(args.cronExpr);
  const id = uuid();
  const now = nowIso();
  db.prepare(
    `INSERT INTO auto_email_reports
       (id, tenant_id, name, report_kind, report_args, cron_expr, subject_tpl, body_tpl,
        recipients, enabled, last_run_at, last_run_status, last_error,
        created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, ?, ?, ?)`,
  ).run(
    id,
    args.tenantId,
    args.name,
    args.reportKind,
    JSON.stringify(args.reportArgs ?? {}),
    args.cronExpr,
    args.subjectTpl,
    args.bodyTpl,
    JSON.stringify(args.recipients),
    args.enabled === false ? 0 : 1,
    args.createdBy,
    now,
    now,
  );
  return getReport(args.tenantId, id)!;
}

export function getReport(tenantId: string, id: string): AutoEmailReport | null {
  const r = db
    .prepare(`SELECT * FROM auto_email_reports WHERE id = ? AND tenant_id = ?`)
    .get(id, tenantId) as Row | undefined;
  return r ? rowToReport(r) : null;
}

export function listReports(tenantId: string): AutoEmailReport[] {
  const rows = db
    .prepare(`SELECT * FROM auto_email_reports WHERE tenant_id = ? ORDER BY name ASC`)
    .all(tenantId) as Row[];
  return rows.map(rowToReport);
}

export function updateReport(
  tenantId: string,
  id: string,
  patch: Partial<Omit<CreateArgs, "tenantId" | "createdBy">>,
): AutoEmailReport | null {
  const existing = getReport(tenantId, id);
  if (!existing) return null;
  const fields: string[] = [];
  const params: unknown[] = [];
  if (patch.name !== undefined) { fields.push("name = ?"); params.push(patch.name); }
  if (patch.reportKind !== undefined) { fields.push("report_kind = ?"); params.push(patch.reportKind); }
  if (patch.reportArgs !== undefined) { fields.push("report_args = ?"); params.push(JSON.stringify(patch.reportArgs)); }
  if (patch.cronExpr !== undefined) {
    validateCron(patch.cronExpr);
    fields.push("cron_expr = ?");
    params.push(patch.cronExpr);
  }
  if (patch.subjectTpl !== undefined) { fields.push("subject_tpl = ?"); params.push(patch.subjectTpl); }
  if (patch.bodyTpl !== undefined) { fields.push("body_tpl = ?"); params.push(patch.bodyTpl); }
  if (patch.recipients !== undefined) { fields.push("recipients = ?"); params.push(JSON.stringify(patch.recipients)); }
  if (patch.enabled !== undefined) { fields.push("enabled = ?"); params.push(patch.enabled ? 1 : 0); }
  if (fields.length === 0) return existing;
  fields.push("updated_at = ?");
  params.push(nowIso());
  params.push(id);
  db.prepare(`UPDATE auto_email_reports SET ${fields.join(", ")} WHERE id = ?`).run(...params);
  return getReport(tenantId, id);
}

export function deleteReport(tenantId: string, id: string): boolean {
  const r = db.prepare(`DELETE FROM auto_email_reports WHERE id = ? AND tenant_id = ?`).run(id, tenantId);
  return r.changes > 0;
}

/* ----------------------------- Cron ------------------------------------- */

function validateCron(expr: string): void {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) throw new AutoEmailError("invalid-cron", "Cron must have 5 fields");
}

function cronMatches(expr: string, when: Date): boolean {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return false;
  const [minute, hour, dom, month, dow] = parts;
  return (
    fieldMatches(minute!, when.getUTCMinutes(), 0, 59) &&
    fieldMatches(hour!, when.getUTCHours(), 0, 23) &&
    fieldMatches(dom!, when.getUTCDate(), 1, 31) &&
    fieldMatches(month!, when.getUTCMonth() + 1, 1, 12) &&
    fieldMatches(dow!, when.getUTCDay(), 0, 6)
  );
}

function fieldMatches(field: string, value: number, min: number, max: number): boolean {
  if (field === "*") return true;
  if (field.includes("/")) {
    const [head, stepStr] = field.split("/");
    const step = Number(stepStr);
    if (!Number.isFinite(step) || step <= 0) return false;
    const start = head === "*" ? min : Number(head);
    if (!Number.isFinite(start)) return false;
    return value >= start && value <= max && (value - start) % step === 0;
  }
  const parts = field.split(",").map((p) => Number(p.trim()));
  return parts.includes(value);
}

/* ----------------------------- Run --------------------------------------- */

interface RunReportResult {
  payload: Record<string, unknown>;
  summary: string;
}

function runReport(report: AutoEmailReport): RunReportResult {
  const args = report.reportArgs as Record<string, string | undefined>;
  switch (report.reportKind) {
    case "gl-trial-balance": {
      const tb = glTrialBalance({
        tenantId: report.tenantId,
        companyId: args.companyId ?? null,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      return {
        payload: tb as unknown as Record<string, unknown>,
        summary: `Trial balance: ${tb.rows.length} accounts, debits=${tb.totalDebitMinor}, credits=${tb.totalCreditMinor}`,
      };
    }
    case "gl-profit-loss": {
      const pnl = glProfitAndLoss({
        tenantId: report.tenantId,
        companyId: args.companyId ?? null,
        fromDate: args.fromDate,
        toDate: args.toDate,
      });
      return {
        payload: pnl as unknown as Record<string, unknown>,
        summary: `P&L net=${pnl.netIncomeMinor}`,
      };
    }
    case "gl-balance-sheet": {
      const bs = glBalanceSheet({
        tenantId: report.tenantId,
        companyId: args.companyId ?? null,
        asOf: args.asOf ?? new Date().toISOString().slice(0, 10),
      });
      return {
        payload: bs as unknown as Record<string, unknown>,
        summary: `Balance sheet ${bs.asOf}: assets=${bs.totalAssetsMinor}`,
      };
    }
    case "stock-balance": {
      const rows = stockBalance({
        tenantId: report.tenantId,
        itemId: args.itemId,
      });
      return {
        payload: { rows } as Record<string, unknown>,
        summary: `Stock balance: ${rows.length} bins`,
      };
    }
    case "reorder-suggestions": {
      const rows = reorderSuggestions({ tenantId: report.tenantId });
      return {
        payload: { rows } as Record<string, unknown>,
        summary: `Reorder: ${rows.length} items below threshold`,
      };
    }
    case "sales-aging":
    case "purchase-aging": {
      const kind = report.reportKind === "sales-aging" ? "sales" : "purchase";
      const rows = db
        .prepare(
          `SELECT id, number, party_resource, party_id, posting_date, due_date,
                  total_minor, paid_minor, currency, status
             FROM sales_invoices
            WHERE tenant_id = ? AND kind = ? AND status IN ('submitted','paid')
            ORDER BY due_date ASC NULLS LAST`,
        )
        .all(report.tenantId, kind);
      return {
        payload: { rows } as Record<string, unknown>,
        summary: `${kind} aging: ${(rows as unknown[]).length} invoices`,
      };
    }
  }
}

/** Tick once: fire any rule whose cron matches `now`, idempotent via
 *  last_run_at = the matching minute bucket. Returns counts. */
export function autoEmailTick(now: Date = new Date()): {
  attempted: number;
  fired: number;
  errors: number;
} {
  const reports = (db
    .prepare(`SELECT * FROM auto_email_reports WHERE enabled = 1`)
    .all() as Row[]).map(rowToReport);
  const bucket = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
    ),
  ).toISOString();
  let attempted = 0;
  let fired = 0;
  let errors = 0;
  for (const r of reports) {
    if (!cronMatches(r.cronExpr, now)) continue;
    if (r.lastRunAt && r.lastRunAt.startsWith(bucket.slice(0, 16))) continue; // already fired this minute
    attempted++;
    try {
      const out = runReport(r);
      const ctx: Record<string, unknown> = {
        ...out.payload,
        report: { name: r.name, kind: r.reportKind, summary: out.summary },
        now: now.toISOString(),
      };
      const subject = renderTemplate(r.subjectTpl, ctx, {}).output;
      const body = renderTemplate(r.bodyTpl, ctx, { dateFormat: "YYYY-MM-DD" }).output;
      // Enqueue an email delivery via the notification_deliveries queue.
      db.prepare(
        `INSERT INTO notification_deliveries
           (id, tenant_id, rule_id, resource, record_id, channel, status, attempts, payload, created_at, updated_at)
         VALUES (?, ?, ?, 'auto-email-report', ?, 'email', 'pending', 0, ?, ?, ?)`,
      ).run(
        uuid(),
        r.tenantId,
        `auto-email:${r.id}`,
        r.id,
        JSON.stringify({
          subject,
          body,
          recipients: r.recipients,
          channelConfig: { to: r.recipients },
        }),
        nowIso(),
        nowIso(),
      );
      db.prepare(
        `UPDATE auto_email_reports
           SET last_run_at = ?, last_run_status = 'queued', last_error = NULL, updated_at = ?
         WHERE id = ?`,
      ).run(now.toISOString(), nowIso(), r.id);
      fired++;
      recordAudit({
        actor: "system:auto-email",
        action: "auto-email-report.queued",
        resource: "auto-email-report",
        recordId: r.id,
        payload: { name: r.name },
      });
    } catch (err) {
      errors++;
      const msg = err instanceof Error ? err.message : String(err);
      db.prepare(
        `UPDATE auto_email_reports
           SET last_run_at = ?, last_run_status = 'failed', last_error = ?, updated_at = ?
         WHERE id = ?`,
      ).run(now.toISOString(), msg.slice(0, 500), nowIso(), r.id);
    }
  }
  return { attempted, fired, errors };
}

let timer: ReturnType<typeof setInterval> | null = null;
export function startAutoEmailScheduler(): void {
  if (timer) return;
  // Run immediately so dev/tests don't wait.
  try { autoEmailTick(); } catch { /* tolerate */ }
  timer = setInterval(() => {
    try { autoEmailTick(); } catch (err) {
      console.error("[auto-email-reports] tick failed", err);
    }
  }, 60_000);
}

export function stopAutoEmailScheduler(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

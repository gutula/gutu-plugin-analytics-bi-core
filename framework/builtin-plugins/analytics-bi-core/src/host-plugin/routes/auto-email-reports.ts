/** Auto Email Reports REST API.
 *
 *  Routes:
 *    GET    /                  list
 *    GET    /:id               fetch one
 *    POST   /                  create
 *    PATCH  /:id               update
 *    DELETE /:id               delete
 *    POST   /_tick             manual tick (for ops)
 */

import { Hono } from "@gutu-host";
import { requireAuth, currentUser } from "@gutu-host";
import { getTenantContext } from "@gutu-host";
import {
  AutoEmailError,
  autoEmailTick,
  createReport,
  deleteReport,
  getReport,
  listReports,
  updateReport,
} from "@gutu-plugin/analytics-bi-core";

export const autoEmailRoutes = new Hono();
autoEmailRoutes.use("*", requireAuth);

function tenantId(): string {
  return getTenantContext()?.tenantId ?? "default";
}

function handle(err: unknown, c: Parameters<Parameters<typeof autoEmailRoutes.get>[1]>[0]) {
  if (err instanceof AutoEmailError) return c.json({ error: err.message, code: err.code }, 400);
  throw err;
}

autoEmailRoutes.get("/", (c) => c.json({ rows: listReports(tenantId()) }));

autoEmailRoutes.get("/:id", (c) => {
  const r = getReport(tenantId(), c.req.param("id"));
  if (!r) return c.json({ error: "not found" }, 404);
  return c.json(r);
});

autoEmailRoutes.post("/", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const user = currentUser(c);
  try {
    const r = createReport({
      tenantId: tenantId(),
      name: String(body.name ?? ""),
      reportKind: (body.reportKind as never) ?? "gl-trial-balance",
      reportArgs: (body.reportArgs as never) ?? {},
      cronExpr: String(body.cronExpr ?? "0 9 * * *"),
      subjectTpl: String(body.subjectTpl ?? "{{ report.name }}"),
      bodyTpl: String(body.bodyTpl ?? "{{ report.summary }}"),
      recipients: Array.isArray(body.recipients) ? (body.recipients as string[]) : [],
      enabled: body.enabled !== false,
      createdBy: user.email,
    });
    return c.json(r, 201);
  } catch (err) {
    return handle(err, c) as never;
  }
});

autoEmailRoutes.patch("/:id", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as never;
  try {
    const r = updateReport(tenantId(), c.req.param("id"), body);
    if (!r) return c.json({ error: "not found" }, 404);
    return c.json(r);
  } catch (err) {
    return handle(err, c) as never;
  }
});

autoEmailRoutes.delete("/:id", (c) => {
  const ok = deleteReport(tenantId(), c.req.param("id"));
  if (!ok) return c.json({ error: "not found" }, 404);
  return c.json({ ok: true });
});

autoEmailRoutes.post("/_tick", (c) => {
  const out = autoEmailTick();
  return c.json(out);
});

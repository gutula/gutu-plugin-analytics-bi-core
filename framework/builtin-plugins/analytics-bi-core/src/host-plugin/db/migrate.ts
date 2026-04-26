/** Plugin-owned migrations for analytics-bi-core.
 *
 *  Idempotent CREATE TABLE / CREATE INDEX statements. Re-running this
 *  on an existing database is a no-op. */
import { db } from "@gutu-host";

export function migrate(): void {
  db.exec(`
CREATE INDEX IF NOT EXISTS auto_email_reports_tenant_idx
      ON auto_email_reports(tenant_id, enabled);
  `);
}

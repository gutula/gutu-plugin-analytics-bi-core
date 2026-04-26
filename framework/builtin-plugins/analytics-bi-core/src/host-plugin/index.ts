/** Host-plugin contribution for analytics-bi-core.
 *
 *  Owns the entire BI surface: the BI explorer + dashboards + charts +
 *  saved deliveries (`/api/analytics-bi/*`) AND the auto-email
 *  scheduler (`/api/auto-email-reports/*`). The scheduler is wrapped
 *  in `withLeadership("analytics:auto-email")` so multi-instance
 *  clusters elect a single sender. */
import type { HostPlugin } from "@gutu-host/plugin-contract";
import { withLeadership } from "@gutu-host/leader";
import { migrate } from "./db/migrate";
import { autoEmailRoutes } from "./routes/auto-email-reports";
import { analyticsBiRoutes } from "./routes/analytics-bi";
import { startAutoEmailScheduler, stopAutoEmailScheduler } from "./lib/auto-email-reports";

let stopLeader: (() => void) | null = null;

export const hostPlugin: HostPlugin = {
  id: "analytics-bi-core",
  version: "1.0.0",
  manifest: {
    label: "Analytics & BI",
    description: "Charts, dashboards, saved explorations, and the auto-email-report scheduler. Builds on accounting + inventory.",
    icon: "BarChart3",
    vendor: "gutu",
    permissions: ["db.read", "db.write", "audit.write", "net.outbound"],
  },
  dependsOn: [
    { id: "accounting-core", versionRange: "^1.0.0" },
    { id: "inventory-core", versionRange: "^1.0.0" },
  ],
  migrate,
  routes: [
    { mountPath: "/auto-email-reports", router: autoEmailRoutes },
    { mountPath: "/analytics-bi", router: analyticsBiRoutes },
  ],
  start: () => {
    stopLeader = withLeadership("analytics:auto-email", () => {
      startAutoEmailScheduler();
      return () => stopAutoEmailScheduler();
    });
  },
  stop: () => { stopLeader?.(); stopLeader = null; },
  health: async () => ({ ok: true }),
};

// Re-export the lib API so other plugins can `import` from
// "@gutu-plugin/analytics-bi-core".
export * from "./lib";

import {
  defineAdminNav,
  defineCommand,
  definePage,
  defineWorkspace,
  type AdminContributionRegistry
} from "@platform/admin-contracts";

import { BusinessAdminPage } from "./admin/main.page";

export const adminContributions: Pick<AdminContributionRegistry, "workspaces" | "nav" | "pages" | "commands"> = {
  workspaces: [
    defineWorkspace({
      id: "analytics",
      label: "Analytics & BI",
      icon: "chart-column",
      description: "Business datasets, KPIs, and warehouse sync posture.",
      permission: "analytics.datasets.read",
      homePath: "/admin/business/analytics",
      quickActions: ["analytics-bi-core.open.control-room"]
    })
  ],
  nav: [
    defineAdminNav({
      workspace: "analytics",
      group: "control-room",
      items: [
        {
          id: "analytics-bi-core.overview",
          label: "Control Room",
          icon: "chart-column",
          to: "/admin/business/analytics",
          permission: "analytics.datasets.read"
        }
      ]
    })
  ],
  pages: [
    definePage({
      id: "analytics-bi-core.page",
      kind: "dashboard",
      route: "/admin/business/analytics",
      label: "Analytics & BI Control Room",
      workspace: "analytics",
      group: "control-room",
      permission: "analytics.datasets.read",
      component: BusinessAdminPage
    })
  ],
  commands: [
    defineCommand({
      id: "analytics-bi-core.open.control-room",
      label: "Open Analytics & BI Core",
      permission: "analytics.datasets.read",
      href: "/admin/business/analytics",
      keywords: ["analytics & bi core","analytics & bi","business"]
    })
  ]
};

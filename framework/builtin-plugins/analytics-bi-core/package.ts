import { definePackage } from "@platform/kernel";

export default definePackage({
  "id": "analytics-bi-core",
  "kind": "plugin",
  "version": "0.1.0",
  "contractVersion": "1.0.0",
  "sourceRepo": "gutu-plugin-analytics-bi-core",
  "displayName": "Analytics & BI Core",
  "domainGroup": "Operational Data",
  "defaultCategory": {
    "id": "business",
    "label": "Business",
    "subcategoryId": "analytics_reporting",
    "subcategoryLabel": "Analytics & Reporting"
  },
  "description": "Business datasets, KPI models, warehouse-sync posture, and governed analytics projections across the full operating suite.",
  "extends": [],
  "dependsOn": [
    "auth-core",
    "org-tenant-core",
    "role-policy-core",
    "audit-core",
    "workflow-core",
    "dashboard-core",
    "traceability-core"
  ],
  "dependencyContracts": [
    {
      "packageId": "auth-core",
      "class": "required",
      "rationale": "Required for Analytics & BI Core to keep its boundary governed and explicit."
    },
    {
      "packageId": "org-tenant-core",
      "class": "required",
      "rationale": "Required for Analytics & BI Core to keep its boundary governed and explicit."
    },
    {
      "packageId": "role-policy-core",
      "class": "required",
      "rationale": "Required for Analytics & BI Core to keep its boundary governed and explicit."
    },
    {
      "packageId": "audit-core",
      "class": "required",
      "rationale": "Required for Analytics & BI Core to keep its boundary governed and explicit."
    },
    {
      "packageId": "workflow-core",
      "class": "required",
      "rationale": "Required for Analytics & BI Core to keep its boundary governed and explicit."
    },
    {
      "packageId": "dashboard-core",
      "class": "required",
      "rationale": "Required for Analytics & BI Core to keep its boundary governed and explicit."
    },
    {
      "packageId": "traceability-core",
      "class": "required",
      "rationale": "Required for Analytics & BI Core to keep its boundary governed and explicit."
    },
    {
      "packageId": "accounting-core",
      "class": "optional",
      "rationale": "Recommended with Analytics & BI Core for smoother production adoption and operator experience."
    },
    {
      "packageId": "sales-core",
      "class": "capability-enhancing",
      "rationale": "Improves Analytics & BI Core with deeper downstream automation, visibility, or workflow coverage."
    },
    {
      "packageId": "procurement-core",
      "class": "capability-enhancing",
      "rationale": "Improves Analytics & BI Core with deeper downstream automation, visibility, or workflow coverage."
    },
    {
      "packageId": "inventory-core",
      "class": "capability-enhancing",
      "rationale": "Improves Analytics & BI Core with deeper downstream automation, visibility, or workflow coverage."
    },
    {
      "packageId": "projects-core",
      "class": "capability-enhancing",
      "rationale": "Improves Analytics & BI Core with deeper downstream automation, visibility, or workflow coverage."
    },
    {
      "packageId": "support-service-core",
      "class": "capability-enhancing",
      "rationale": "Improves Analytics & BI Core with deeper downstream automation, visibility, or workflow coverage."
    },
    {
      "packageId": "manufacturing-core",
      "class": "capability-enhancing",
      "rationale": "Improves Analytics & BI Core with deeper downstream automation, visibility, or workflow coverage."
    },
    {
      "packageId": "hr-payroll-core",
      "class": "capability-enhancing",
      "rationale": "Improves Analytics & BI Core with deeper downstream automation, visibility, or workflow coverage."
    }
  ],
  "recommendedPlugins": [
    "accounting-core"
  ],
  "capabilityEnhancingPlugins": [
    "sales-core",
    "procurement-core",
    "inventory-core",
    "projects-core",
    "support-service-core",
    "manufacturing-core",
    "hr-payroll-core"
  ],
  "integrationOnlyPlugins": [],
  "suggestedPacks": [
    "localization-global-base",
    "localization-india",
    "localization-united-states",
    "sector-ecommerce",
    "sector-education",
    "sector-epc-professional-delivery",
    "sector-financial-services-compliance",
    "sector-healthcare",
    "sector-manufacturing",
    "sector-nonprofit",
    "sector-professional-services",
    "sector-retail",
    "sector-trading-distribution"
  ],
  "standaloneSupported": false,
  "installNotes": [
    "Analytics becomes more valuable as more write-model plugins are present; it should usually be installed after the operational core."
  ],
  "optionalWith": [
    "accounting-core"
  ],
  "conflictsWith": [],
  "providesCapabilities": [
    "analytics.datasets",
    "analytics.kpis",
    "analytics.warehouse-sync"
  ],
  "requestedCapabilities": [
    "ui.register.admin",
    "api.rest.mount",
    "data.write.analytics",
    "events.publish.analytics"
  ],
  "ownsData": [
    "analytics.datasets",
    "analytics.kpis",
    "analytics.warehouse-sync",
    "analytics.exceptions"
  ],
  "extendsData": [],
  "publicCommands": [
    "analytics.datasets.publish",
    "analytics.kpis.refresh",
    "analytics.warehouse-sync.enqueue",
    "analytics.datasets.hold",
    "analytics.datasets.release",
    "analytics.datasets.amend",
    "analytics.datasets.reverse"
  ],
  "publicQueries": [
    "analytics.dataset-summary",
    "analytics.kpi-summary"
  ],
  "publicEvents": [
    "analytics.dataset-published.v1",
    "analytics.kpi-refreshed.v1",
    "analytics.warehouse-sync-enqueued.v1"
  ],
  "domainCatalog": {
    "erpnextModules": [
      "Report Center",
      "Accounts",
      "Selling",
      "Buying",
      "Stock",
      "Projects"
    ],
    "erpnextDoctypes": [
      "Financial Report Template",
      "Ledger Health Monitor",
      "Quick Stock Balance",
      "Project Update"
    ],
    "ownedEntities": [
      "Dataset",
      "KPI Definition",
      "Warehouse Sync Job",
      "Analytics Exception",
      "Derived Snapshot"
    ],
    "reports": [
      "Executive KPI Summary",
      "Dataset Freshness",
      "Cross-Domain Exception Dashboard"
    ],
    "exceptionQueues": [
      "warehouse-sync-failures",
      "stale-kpi-refresh",
      "dataset-contract-drift"
    ],
    "operationalScenarios": [
      "dataset-publication",
      "kpi-refresh",
      "warehouse-sync-enqueue"
    ],
    "settingsSurfaces": [
      "Report Center",
      "Financial Report Template"
    ],
    "edgeCases": [
      "stale projections",
      "cross-domain schema drift",
      "late-arriving facts"
    ]
  },
  "slotClaims": [],
  "trustTier": "first-party",
  "reviewTier": "R1",
  "isolationProfile": "same-process-trusted",
  "compatibility": {
    "framework": "^0.1.0",
    "runtime": "bun>=1.3.12",
    "db": [
      "postgres",
      "sqlite"
    ]
  }
});

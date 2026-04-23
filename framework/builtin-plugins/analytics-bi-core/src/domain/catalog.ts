export const domainCatalog = {
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
} as const;

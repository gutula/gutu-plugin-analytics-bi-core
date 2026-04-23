export const exceptionQueueDefinitions = [
  {
    "id": "warehouse-sync-failures",
    "label": "Warehouse Sync Failures",
    "severity": "medium",
    "owner": "analyst",
    "reconciliationJobId": "analytics.reconciliation.run"
  },
  {
    "id": "stale-kpi-refresh",
    "label": "Stale Kpi Refresh",
    "severity": "medium",
    "owner": "analyst",
    "reconciliationJobId": "analytics.reconciliation.run"
  },
  {
    "id": "dataset-contract-drift",
    "label": "Dataset Contract Drift",
    "severity": "medium",
    "owner": "analyst",
    "reconciliationJobId": "analytics.reconciliation.run"
  }
] as const;

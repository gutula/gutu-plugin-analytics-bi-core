export const reportDefinitions = [
  {
    "id": "analytics-bi-core.report.01",
    "label": "Executive KPI Summary",
    "owningPlugin": "analytics-bi-core",
    "source": "erpnext-parity",
    "exceptionQueues": [
      "warehouse-sync-failures",
      "stale-kpi-refresh",
      "dataset-contract-drift"
    ]
  },
  {
    "id": "analytics-bi-core.report.02",
    "label": "Dataset Freshness",
    "owningPlugin": "analytics-bi-core",
    "source": "erpnext-parity",
    "exceptionQueues": [
      "warehouse-sync-failures",
      "stale-kpi-refresh",
      "dataset-contract-drift"
    ]
  },
  {
    "id": "analytics-bi-core.report.03",
    "label": "Cross-Domain Exception Dashboard",
    "owningPlugin": "analytics-bi-core",
    "source": "erpnext-parity",
    "exceptionQueues": [
      "warehouse-sync-failures",
      "stale-kpi-refresh",
      "dataset-contract-drift"
    ]
  }
] as const;

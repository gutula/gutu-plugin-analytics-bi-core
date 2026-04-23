export const scenarioDefinitions = [
  {
    "id": "dataset-publication",
    "owningPlugin": "analytics-bi-core",
    "workflowId": "analytics-bi-lifecycle",
    "actionIds": [
      "analytics.datasets.publish",
      "analytics.kpis.refresh",
      "analytics.warehouse-sync.enqueue"
    ],
    "downstreamTargets": {
      "create": [],
      "advance": [
        "traceability.links.record"
      ],
      "reconcile": [
        "traceability.reconciliation.queue"
      ]
    }
  },
  {
    "id": "kpi-refresh",
    "owningPlugin": "analytics-bi-core",
    "workflowId": "analytics-bi-lifecycle",
    "actionIds": [
      "analytics.datasets.publish",
      "analytics.kpis.refresh",
      "analytics.warehouse-sync.enqueue"
    ],
    "downstreamTargets": {
      "create": [],
      "advance": [
        "traceability.links.record"
      ],
      "reconcile": [
        "traceability.reconciliation.queue"
      ]
    }
  },
  {
    "id": "warehouse-sync-enqueue",
    "owningPlugin": "analytics-bi-core",
    "workflowId": "analytics-bi-lifecycle",
    "actionIds": [
      "analytics.datasets.publish",
      "analytics.kpis.refresh",
      "analytics.warehouse-sync.enqueue"
    ],
    "downstreamTargets": {
      "create": [],
      "advance": [
        "traceability.links.record"
      ],
      "reconcile": [
        "traceability.reconciliation.queue"
      ]
    }
  }
] as const;

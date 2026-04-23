import {
  advancePrimaryRecord,
  createPrimaryRecord,
  reconcilePrimaryRecord,
  type AdvancePrimaryRecordInput,
  type CreatePrimaryRecordInput,
  type ReconcilePrimaryRecordInput
} from "../services/main.service";

export const businessFlowDefinitions = [
  {
    "id": "analytics.datasets.publish",
    "label": "Publish Analytics Dataset",
    "phase": "create",
    "methodName": "publishAnalyticsDataset"
  },
  {
    "id": "analytics.kpis.refresh",
    "label": "Refresh KPI Definitions",
    "phase": "advance",
    "methodName": "refreshKpiDefinitions"
  },
  {
    "id": "analytics.warehouse-sync.enqueue",
    "label": "Enqueue Warehouse Sync",
    "phase": "reconcile",
    "methodName": "enqueueWarehouseSync"
  }
] as const;

export async function publishAnalyticsDataset(input: CreatePrimaryRecordInput) {
  return createPrimaryRecord(input);
}

export async function refreshKpiDefinitions(input: AdvancePrimaryRecordInput) {
  return advancePrimaryRecord(input);
}

export async function enqueueWarehouseSync(input: ReconcilePrimaryRecordInput) {
  return reconcilePrimaryRecord(input);
}

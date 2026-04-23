import {
  advancePrimaryRecord,
  amendPrimaryRecord,
  createPrimaryRecord,
  placePrimaryRecordOnHold,
  reconcilePrimaryRecord,
  releasePrimaryRecordHold,
  reversePrimaryRecord,
  type AdvancePrimaryRecordInput,
  type AmendPrimaryRecordInput,
  type CreatePrimaryRecordInput,
  type PlacePrimaryRecordOnHoldInput,
  type ReconcilePrimaryRecordInput,
  type ReleasePrimaryRecordHoldInput,
  type ReversePrimaryRecordInput
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
  },
  {
    "id": "analytics.datasets.hold",
    "label": "Place Record On Hold",
    "phase": "hold",
    "methodName": "placeRecordOnHold"
  },
  {
    "id": "analytics.datasets.release",
    "label": "Release Record Hold",
    "phase": "release",
    "methodName": "releaseRecordHold"
  },
  {
    "id": "analytics.datasets.amend",
    "label": "Amend Record",
    "phase": "amend",
    "methodName": "amendRecord"
  },
  {
    "id": "analytics.datasets.reverse",
    "label": "Reverse Record",
    "phase": "reverse",
    "methodName": "reverseRecord"
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

export async function placeRecordOnHold(input: PlacePrimaryRecordOnHoldInput) {
  return placePrimaryRecordOnHold(input);
}

export async function releaseRecordHold(input: ReleasePrimaryRecordHoldInput) {
  return releasePrimaryRecordHold(input);
}

export async function amendRecord(input: AmendPrimaryRecordInput) {
  return amendPrimaryRecord(input);
}

export async function reverseRecord(input: ReversePrimaryRecordInput) {
  return reversePrimaryRecord(input);
}

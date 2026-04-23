import { defineAction } from "@platform/schema";
import { z } from "zod";

import {
  createPrimaryRecord,
  advancePrimaryRecord,
  reconcilePrimaryRecord,
  placePrimaryRecordOnHold,
  releasePrimaryRecordHold,
  amendPrimaryRecord,
  reversePrimaryRecord
} from "../services/main.service";
import {
  approvalStateSchema,
  fulfillmentStateSchema,
  postingStateSchema,
  recordStateSchema,
  createPrimaryRecordInputSchema,
  advancePrimaryRecordInputSchema,
  reconcilePrimaryRecordInputSchema,
  placePrimaryRecordOnHoldInputSchema,
  releasePrimaryRecordHoldInputSchema,
  amendPrimaryRecordInputSchema,
  reversePrimaryRecordInputSchema
} from "../model";

export const publishAnalyticsDatasetAction = defineAction({
  id: "analytics.datasets.publish",
  description: "Publish Analytics Dataset",
  input: createPrimaryRecordInputSchema,
  output: z.object({
    ok: z.literal(true),
    recordId: z.string(),
    recordState: recordStateSchema,
    approvalState: approvalStateSchema,
    postingState: postingStateSchema,
    fulfillmentState: fulfillmentStateSchema,
    revisionNo: z.number().int().positive(),
    eventIds: z.array(z.string()),
    jobIds: z.array(z.string())
  }),
  permission: "analytics.datasets.write",
  idempotent: true,
  audit: true,
  handler: ({ input }) => createPrimaryRecord(input)
});

export const refreshKpiDefinitionsAction = defineAction({
  id: "analytics.kpis.refresh",
  description: "Refresh KPI Definitions",
  input: advancePrimaryRecordInputSchema,
  output: z.object({
    ok: z.literal(true),
    recordId: z.string(),
    recordState: recordStateSchema,
    approvalState: approvalStateSchema,
    postingState: postingStateSchema,
    fulfillmentState: fulfillmentStateSchema,
    revisionNo: z.number().int().positive(),
    eventIds: z.array(z.string()),
    jobIds: z.array(z.string())
  }),
  permission: "analytics.kpis.write",
  idempotent: false,
  audit: true,
  handler: ({ input }) => advancePrimaryRecord(input)
});

export const enqueueWarehouseSyncAction = defineAction({
  id: "analytics.warehouse-sync.enqueue",
  description: "Enqueue Warehouse Sync",
  input: reconcilePrimaryRecordInputSchema,
  output: z.object({
    ok: z.literal(true),
    recordId: z.string(),
    exceptionId: z.string(),
    status: z.enum(["open", "under-review", "resolved", "closed"]),
    revisionNo: z.number().int().positive(),
    eventIds: z.array(z.string()),
    jobIds: z.array(z.string())
  }),
  permission: "analytics.warehouse-sync.write",
  idempotent: false,
  audit: true,
  handler: ({ input }) => reconcilePrimaryRecord(input)
});

export const placeRecordOnHoldAction = defineAction({
  id: "analytics.datasets.hold",
  description: "Place Record On Hold",
  input: placePrimaryRecordOnHoldInputSchema,
  output: z.object({
    ok: z.literal(true),
    recordId: z.string(),
    status: z.enum(["open", "under-review", "resolved", "closed"]),
    revisionNo: z.number().int().positive(),
    eventIds: z.array(z.string()),
    jobIds: z.array(z.string())
  }),
  permission: "analytics.datasets.write",
  idempotent: false,
  audit: true,
  handler: ({ input }) => placePrimaryRecordOnHold(input)
});

export const releaseRecordHoldAction = defineAction({
  id: "analytics.datasets.release",
  description: "Release Record Hold",
  input: releasePrimaryRecordHoldInputSchema,
  output: z.object({
    ok: z.literal(true),
    recordId: z.string(),
    status: z.enum(["open", "under-review", "resolved", "closed"]),
    revisionNo: z.number().int().positive(),
    eventIds: z.array(z.string()),
    jobIds: z.array(z.string())
  }),
  permission: "analytics.datasets.write",
  idempotent: false,
  audit: true,
  handler: ({ input }) => releasePrimaryRecordHold(input)
});

export const amendRecordAction = defineAction({
  id: "analytics.datasets.amend",
  description: "Amend Record",
  input: amendPrimaryRecordInputSchema,
  output: z.object({
    ok: z.literal(true),
    recordId: z.string(),
    amendedRecordId: z.string(),
    revisionNo: z.number().int().positive(),
    eventIds: z.array(z.string()),
    jobIds: z.array(z.string())
  }),
  permission: "analytics.datasets.write",
  idempotent: false,
  audit: true,
  handler: ({ input }) => amendPrimaryRecord(input)
});

export const reverseRecordAction = defineAction({
  id: "analytics.datasets.reverse",
  description: "Reverse Record",
  input: reversePrimaryRecordInputSchema,
  output: z.object({
    ok: z.literal(true),
    recordId: z.string(),
    reversalRecordId: z.string(),
    revisionNo: z.number().int().positive(),
    eventIds: z.array(z.string()),
    jobIds: z.array(z.string())
  }),
  permission: "analytics.datasets.write",
  idempotent: false,
  audit: true,
  handler: ({ input }) => reversePrimaryRecord(input)
});

export const businessActions = [
  publishAnalyticsDatasetAction,
  refreshKpiDefinitionsAction,
  enqueueWarehouseSyncAction,
  placeRecordOnHoldAction,
  releaseRecordHoldAction,
  amendRecordAction,
  reverseRecordAction
] as const;

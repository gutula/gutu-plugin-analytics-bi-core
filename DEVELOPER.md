# Analytics & BI Core Developer Guide

Business datasets, KPI models, warehouse-sync posture, and governed analytics projections across the full operating suite.

**Maturity Tier:** `Hardened`

## Purpose And Architecture Role

Owns governed datasets, KPI models, and warehouse-sync posture so heavy analytics does not sprawl into transactional plugins.

### This plugin is the right fit when

- You need **datasets**, **KPIs**, **warehouse sync** as a governed domain boundary.
- You want to integrate through declared actions, resources, jobs, workflows, and UI surfaces instead of implicit side effects.
- You need the host application to keep plugin boundaries honest through manifest capabilities, permissions, and verification lanes.

### This plugin is intentionally not

- Not a full vertical application suite; this plugin only owns the domain slice exported in this repo.
- Not a replacement for explicit orchestration in jobs/workflows when multi-step automation is required.

## Repo Map

| Path | Purpose |
| --- | --- |
| `package.json` | Root extracted-repo manifest, workspace wiring, and repo-level script entrypoints. |
| `framework/builtin-plugins/analytics-bi-core` | Nested publishable plugin package. |
| `framework/builtin-plugins/analytics-bi-core/src` | Runtime source, actions, resources, services, and UI exports. |
| `framework/builtin-plugins/analytics-bi-core/tests` | Unit, contract, integration, and migration coverage where present. |
| `framework/builtin-plugins/analytics-bi-core/docs` | Internal domain-doc source set kept in sync with this guide. |
| `framework/builtin-plugins/analytics-bi-core/db/schema.ts` | Database schema contract when durable state is owned. |
| `framework/builtin-plugins/analytics-bi-core/src/postgres.ts` | SQL migration and rollback helpers when exported. |

## Manifest Contract

| Field | Value |
| --- | --- |
| Package Name | `@plugins/analytics-bi-core` |
| Manifest ID | `analytics-bi-core` |
| Display Name | Analytics & BI Core |
| Domain Group | Operational Data |
| Default Category | Business / Analytics & Reporting |
| Version | `0.1.0` |
| Kind | `plugin` |
| Trust Tier | `first-party` |
| Review Tier | `R1` |
| Isolation Profile | `same-process-trusted` |
| Framework Compatibility | ^0.1.0 |
| Runtime Compatibility | bun>=1.3.12 |
| Database Compatibility | postgres, sqlite |

## Dependency Graph And Capability Requests

| Field | Value |
| --- | --- |
| Depends On | `auth-core`, `org-tenant-core`, `role-policy-core`, `audit-core`, `workflow-core`, `dashboard-core`, `traceability-core`, `accounting-core`, `sales-core`, `procurement-core`, `inventory-core` |
| Requested Capabilities | `ui.register.admin`, `api.rest.mount`, `data.write.analytics`, `events.publish.analytics` |
| Provides Capabilities | `analytics.datasets`, `analytics.kpis`, `analytics.warehouse-sync` |
| Owns Data | `analytics.datasets`, `analytics.kpis`, `analytics.warehouse-sync`, `analytics.exceptions` |

### Dependency interpretation

- Direct plugin dependencies describe package-level coupling that must already be present in the host graph.
- Requested capabilities tell the host what platform services or sibling plugins this package expects to find.
- Provided capabilities and owned data tell integrators what this package is authoritative for.

## Public Integration Surfaces

| Type | ID / Symbol | Access / Mode | Notes |
| --- | --- | --- | --- |
| Action | `analytics.datasets.publish` | Permission: `analytics.datasets.write` | Publish Analytics Dataset<br>Idempotent<br>Audited |
| Action | `analytics.kpis.refresh` | Permission: `analytics.kpis.write` | Refresh KPI Definitions<br>Non-idempotent<br>Audited |
| Action | `analytics.warehouse-sync.enqueue` | Permission: `analytics.warehouse-sync.write` | Enqueue Warehouse Sync<br>Non-idempotent<br>Audited |
| Resource | `analytics.datasets` | Portal disabled | Dataset definitions, governed exports, and projection-ready analytics records.<br>Purpose: Own business-facing datasets without coupling reporting logic into transactional domains.<br>Admin auto-CRUD enabled<br>Fields: `title`, `recordState`, `approvalState`, `postingState`, `fulfillmentState`, `updatedAt` |
| Resource | `analytics.kpis` | Portal disabled | KPI definitions, refresh posture, and threshold records.<br>Purpose: Keep executive and operational metrics explicit, versioned, and reviewable.<br>Admin auto-CRUD enabled<br>Fields: `label`, `status`, `requestedAction`, `updatedAt` |
| Resource | `analytics.warehouse-sync` | Portal disabled | Warehouse or BI sync queues and exception records.<br>Purpose: Expose heavy analytics sync work and repair state explicitly.<br>Admin auto-CRUD enabled<br>Fields: `severity`, `status`, `reasonCode`, `updatedAt` |

### Job Catalog

| Job | Queue | Retry | Timeout |
| --- | --- | --- | --- |
| `analytics.projections.refresh` | `analytics-projections` | Retry policy not declared | No timeout declared |
| `analytics.reconciliation.run` | `analytics-reconciliation` | Retry policy not declared | No timeout declared |


### Workflow Catalog

| Workflow | Actors | States | Purpose |
| --- | --- | --- | --- |
| `analytics-bi-lifecycle` | `analyst`, `revops`, `controller` | `draft`, `pending_approval`, `active`, `reconciled`, `closed`, `canceled` | Keep analytics projection and sync work explicit across warehouse and dashboard surfaces. |


### UI Surface Summary

| Surface | Present | Notes |
| --- | --- | --- |
| UI Surface | Yes | A bounded UI surface export is present. |
| Admin Contributions | Yes | Additional admin workspace contributions are exported. |
| Zone/Canvas Extension | No | No dedicated zone extension export. |

## Hooks, Events, And Orchestration

This plugin should be integrated through **explicit commands/actions, resources, jobs, workflows, and the surrounding Gutu event runtime**. It must **not** be documented as a generic WordPress-style hook system unless such a hook API is explicitly exported.

- No standalone plugin-owned lifecycle event feed is exported today.
- Job surface: `analytics.projections.refresh`, `analytics.reconciliation.run`.
- Workflow surface: `analytics-bi-lifecycle`.
- Recommended composition pattern: invoke actions, read resources, then let the surrounding Gutu command/event/job runtime handle downstream automation.

## Storage, Schema, And Migration Notes

- Database compatibility: `postgres`, `sqlite`
- Schema file: `framework/builtin-plugins/analytics-bi-core/db/schema.ts`
- SQL helper file: `framework/builtin-plugins/analytics-bi-core/src/postgres.ts`
- Migration lane present: Yes

The plugin ships explicit SQL helper exports. Use those helpers as the truth source for database migration or rollback expectations.

## Failure Modes And Recovery

- Action inputs can fail schema validation or permission evaluation before any durable mutation happens.
- If downstream automation is needed, the host must add it explicitly instead of assuming this plugin emits jobs.
- There is no separate lifecycle-event feed to rely on today; do not build one implicitly from internal details.
- Schema regressions are expected to show up in the migration lane and should block shipment.

## Mermaid Flows

### Primary Lifecycle

```mermaid
flowchart LR
  caller["Host or operator"] --> action["analytics.datasets.publish"]
  action --> validation["Schema + permission guard"]
  validation --> service["Analytics & BI Core service layer"]
  service --> state["analytics.datasets"]
  service --> jobs["Follow-up jobs / queue definitions"]
  service --> workflows["Workflow state transitions"]
  state --> ui["Admin contributions"]
```

### Workflow State Machine

```mermaid
stateDiagram-v2
  [*] --> draft
  draft --> pending_approval
  draft --> active
  draft --> reconciled
  draft --> closed
  draft --> canceled
```


## Integration Recipes

### 1. Host wiring

```ts
import { manifest, createPrimaryRecordAction, BusinessPrimaryResource, jobDefinitions, workflowDefinitions, adminContributions, uiSurface } from "@plugins/analytics-bi-core";

export const pluginSurface = {
  manifest,
  createPrimaryRecordAction,
  BusinessPrimaryResource,
  jobDefinitions,
  workflowDefinitions,
  adminContributions,
  uiSurface
};
```

Use this pattern when your host needs to register the plugin’s declared exports without reaching into internal file paths.

### 2. Action-first orchestration

```ts
import { manifest, createPrimaryRecordAction } from "@plugins/analytics-bi-core";

console.log("plugin", manifest.id);
console.log("action", createPrimaryRecordAction.id);
```

- Prefer action IDs as the stable integration boundary.
- Respect the declared permission, idempotency, and audit metadata instead of bypassing the service layer.
- Treat resource IDs as the read-model boundary for downstream consumers.

### 3. Cross-plugin composition

- Register the workflow definitions with the host runtime instead of re-encoding state transitions outside the plugin.
- Drive follow-up automation from explicit workflow transitions and resource reads.
- Pair workflow decisions with notifications or jobs in the outer orchestration layer when humans must be kept in the loop.

## Test Matrix

| Lane | Present | Evidence |
| --- | --- | --- |
| Build | Yes | `bun run build` |
| Typecheck | Yes | `bun run typecheck` |
| Lint | Yes | `bun run lint` |
| Test | Yes | `bun run test` |
| Unit | Yes | 1 file(s) |
| Contracts | Yes | 1 file(s) |
| Integration | Yes | 1 file(s) |
| Migrations | Yes | 2 file(s) |

### Verification commands

- `bun run build`
- `bun run typecheck`
- `bun run lint`
- `bun run test`
- `bun run test:contracts`
- `bun run test:unit`
- `bun run test:integration`
- `bun run test:migrations`
- `bun run docs:check`

## Current Truth And Recommended Next

### Current truth

- Exports 3 governed actions: `analytics.datasets.publish`, `analytics.kpis.refresh`, `analytics.warehouse-sync.enqueue`.
- Owns 3 resource contracts: `analytics.datasets`, `analytics.kpis`, `analytics.warehouse-sync`.
- Publishes 2 job definitions with explicit queue and retry policy metadata.
- Publishes 1 workflow definition with state-machine descriptions and mandatory steps.
- Adds richer admin workspace contributions on top of the base UI surface.
- Ships explicit SQL migration or rollback helpers alongside the domain model.
- Documents 5 owned entity surface(s): `Dataset`, `KPI Definition`, `Warehouse Sync Job`, `Analytics Exception`, `Derived Snapshot`.
- Carries 3 report surface(s) and 3 exception queue(s) for operator parity and reconciliation visibility.
- Tracks ERPNext reference parity against module(s): `Report Center`, `Accounts`, `Selling`, `Buying`, `Stock`, `Projects`.
- Operational scenario matrix includes `dataset-publication`, `kpi-refresh`, `warehouse-sync-enqueue`.
- Governs 2 settings or policy surface(s) for operator control and rollout safety.

### Current gaps

- Repo-local documentation verification entrypoints were missing before this pass and need to stay green as the repo evolves.

### Recommended next

- Deepen dataset versioning, refresh controls, and warehouse-failure diagnostics as analytics usage broadens.
- Clarify dashboard and BI integration contracts before more consumers depend on the shared dataset layer.
- Broaden lifecycle coverage with deeper orchestration, reconciliation, and operator tooling where the business flow requires it.
- Add more explicit domain events or follow-up job surfaces when downstream systems need tighter coupling.
- Convert more ERP parity references into first-class runtime handlers where needed, starting from `Financial Report Template`, `Ledger Health Monitor`, `Quick Stock Balance`.

### Later / optional

- Outbound connectors, richer analytics, or portal-facing experiences once the core domain contracts harden.

# Analytics & BI Core Flows

## Happy paths

- `analytics.datasets.publish`: Publish Analytics Dataset
- `analytics.kpis.refresh`: Refresh KPI Definitions
- `analytics.warehouse-sync.enqueue`: Enqueue Warehouse Sync
- `analytics.datasets.hold`: Place Record On Hold
- `analytics.datasets.release`: Release Record Hold
- `analytics.datasets.amend`: Amend Record
- `analytics.datasets.reverse`: Reverse Record

## Operational scenario matrix

- `dataset-publication`
- `kpi-refresh`
- `warehouse-sync-enqueue`

## Action-level flows

### `analytics.datasets.publish`

Publish Analytics Dataset

Permission: `analytics.datasets.write`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `analytics.datasets`, `analytics.kpis`, `analytics.warehouse-sync`.
- May schedule or describe follow-up background work.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `analytics.kpis.refresh`

Refresh KPI Definitions

Permission: `analytics.kpis.write`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s non-idempotent semantics.

Side effects:

- Mutates or validates state owned by `analytics.datasets`, `analytics.kpis`, `analytics.warehouse-sync`.
- May schedule or describe follow-up background work.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `analytics.warehouse-sync.enqueue`

Enqueue Warehouse Sync

Permission: `analytics.warehouse-sync.write`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s non-idempotent semantics.

Side effects:

- Mutates or validates state owned by `analytics.datasets`, `analytics.kpis`, `analytics.warehouse-sync`.
- May schedule or describe follow-up background work.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `analytics.datasets.hold`

Place Record On Hold

Permission: `analytics.datasets.write`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s non-idempotent semantics.

Side effects:

- Mutates or validates state owned by `analytics.datasets`, `analytics.kpis`, `analytics.warehouse-sync`.
- May schedule or describe follow-up background work.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `analytics.datasets.release`

Release Record Hold

Permission: `analytics.datasets.write`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s non-idempotent semantics.

Side effects:

- Mutates or validates state owned by `analytics.datasets`, `analytics.kpis`, `analytics.warehouse-sync`.
- May schedule or describe follow-up background work.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `analytics.datasets.amend`

Amend Record

Permission: `analytics.datasets.write`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s non-idempotent semantics.

Side effects:

- Mutates or validates state owned by `analytics.datasets`, `analytics.kpis`, `analytics.warehouse-sync`.
- May schedule or describe follow-up background work.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `analytics.datasets.reverse`

Reverse Record

Permission: `analytics.datasets.write`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s non-idempotent semantics.

Side effects:

- Mutates or validates state owned by `analytics.datasets`, `analytics.kpis`, `analytics.warehouse-sync`.
- May schedule or describe follow-up background work.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


## Cross-package interactions

- Direct dependencies: `auth-core`, `org-tenant-core`, `role-policy-core`, `audit-core`, `workflow-core`, `dashboard-core`, `traceability-core`
- Requested capabilities: `ui.register.admin`, `api.rest.mount`, `data.write.analytics`, `events.publish.analytics`
- Integration model: Actions+Resources+Jobs+Workflows+UI
- ERPNext doctypes used as parity references: `Financial Report Template`, `Ledger Health Monitor`, `Quick Stock Balance`, `Project Update`
- Recovery ownership should stay with the host orchestration layer when the plugin does not explicitly export jobs, workflows, or lifecycle events.

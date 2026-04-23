# Analytics & BI Core TODO

**Maturity Tier:** `Hardened`

## Shipped Now

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

## Current Gaps

- Repo-local documentation verification entrypoints were missing before this pass and need to stay green as the repo evolves.

## Recommended Next

- Deepen dataset versioning, refresh controls, and warehouse-failure diagnostics as analytics usage broadens.
- Clarify dashboard and BI integration contracts before more consumers depend on the shared dataset layer.
- Broaden lifecycle coverage with deeper orchestration, reconciliation, and operator tooling where the business flow requires it.
- Add more explicit domain events or follow-up job surfaces when downstream systems need tighter coupling.
- Convert more ERP parity references into first-class runtime handlers where needed, starting from `Financial Report Template`, `Ledger Health Monitor`, `Quick Stock Balance`.

## Later / Optional

- Outbound connectors, richer analytics, or portal-facing experiences once the core domain contracts harden.

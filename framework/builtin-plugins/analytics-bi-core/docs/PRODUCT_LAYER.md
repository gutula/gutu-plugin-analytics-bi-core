# Native BI Product Layer

`analytics-bi-core` remains the governed spine. It is responsible for the
plugin manifest, actions, resources, jobs, workflows, migrations, and audit
posture around analytics operations.

The native BI product layer is implemented outside the plugin so the authoring
experience can evolve without breaking existing plugin consumers:

- `libraries/gutu-lib-analytics/framework/libraries/analytics` defines the BI
  contracts, deterministic local-record warehouse adapter, query runtime, chart
  rendering contract, dashboard validation, and schedule validation helpers.
- `admin-panel/backend/src/routes/analytics-bi.ts` exposes the product API and
  persists BI content through generic records.
- `admin-panel/src/examples/analytics-bi/*` implements the explorer, chart
  pages, dashboard builder, spaces, metrics catalog, SQL runner, schedules,
  validation center, and shared-link library.

This split keeps Framework's strengths intact:

- BI actions remain governed and auditable.
- Product content uses the admin runtime, auth, records, audit, and realtime
  behavior.
- Unsupported future capabilities stay explicit instead of being faked.
- Live warehouse/dbt connectors can be added behind the `WarehouseAdapter`
  contract without changing the saved chart/dashboard model.

The current product layer includes explorer query state URLs, saved chart
versions and rollback, dashboard tabs, drag reorder, tile sizing, markdown
tiles, dashboard filters, dashboard sharing/scheduling actions, spaces,
metrics catalog, SQL runner, validation center, and local delivery-run logs.

# Analytics & BI Core

`analytics-bi-core` is the governed operational spine for Framework BI. It owns
the plugin contract, action/resource/job/workflow envelope, lifecycle
verification, audit posture, and integration boundaries for analytics datasets,
KPIs, and warehouse-sync work.

It is not a fork of Lightdash and it does not claim live warehouse connector,
dbt parser, or external scheduler-delivery parity by itself.

## Native BI Product Layer

The BI authoring product now lives beside this plugin:

- Shared contracts and deterministic local-record query runtime:
  `libraries/gutu-lib-analytics/framework/libraries/analytics`
- Admin backend API:
  `admin-panel/backend/src/routes/analytics-bi.ts`
- Admin product routes:
  `admin-panel/src/examples/analytics-bi/*`

Those layers add explores, dimensions, metrics, metric queries, compiled SQL
preview, saved charts, chart versions, dashboards, dashboard versions, spaces,
share URLs, schedules, delivery runs, and validation results while this plugin
continues to provide the governed business-runtime backbone.

## Current Boundary

Supported now:

- Governed analytics dataset/KPI/warehouse-sync actions.
- Core plugin resources, migrations, jobs, workflows, and admin contribution.
- Native BI content persisted through the admin records API by the product
  layer.
- Local-record BI query evaluation through the shared `WarehouseAdapter`
  contract for seeded/admin records.
- Saved chart renderers for table, bar, line, area, donut, funnel, big number,
  gauge, treemap, and map-ready regional summaries.
- Dashboard authoring with tabs, markdown tiles, filters, sizing, drag reorder,
  duplication, removal, versions, rollback, sharing, and schedules.
- Honest validation and explicit unsupported states for external connector or
  delivery capabilities that are not configured.

Not claimed yet:

- Live Snowflake, BigQuery, Postgres, or dbt semantic sync adapters without a
  configured provider adapter and credentials.
- External email/Slack/Teams delivery execution without a configured delivery
  adapter.
- Embedded BI public portal hardening beyond token lookup and target fetch.
- Fine-grained chart/dashboard/space ACLs beyond the host auth and tenant
  boundary.

## Verification

Run this plugin directly with:

```sh
bun test --cwd plugins/gutu-plugin-analytics-bi-core/framework/builtin-plugins/analytics-bi-core
```

When touching the native BI product layer, also run the analytics library and
admin-panel checks documented in `docs/bi-lightdash-gap-report.md`.

# Analytics & BI Core TODO

## Complete in the Native BI Product Layer

- BI shared contracts in `@platform/analytics`.
- Deterministic local-record query runner, SQL preview, drill-down, validation,
  and chart/dashboard version helpers.
- Admin API route group at `/api/analytics-bi/*`.
- Admin explorer, chart, dashboard, space, metrics, SQL runner, schedule,
  validation, and share-link views.
- Seeded explores, charts, dashboard content, spaces, schedule, share URL, and
  delivery-run history.
- Admin typecheck/build blockers resolved for the native BI product.
- Gauge, treemap, and map-ready chart rendering.
- Dashboard drag reorder, tile sizing, duplication, removal, markdown tiles,
  dashboard filters, dashboard share/schedule actions, and stronger content
  validation.

## Still Open

- Add live external warehouse adapters through the `WarehouseAdapter` contract
  once credentials and provider-specific execution tests are available. The
  local-record adapter is implemented and tested.
- Add dbt/YAML or Framework semantic-source sync instead of seeded-only
  semantic models.
- Add external delivery adapters for email, Slack, Teams, Sheets, CSV/XLSX,
  image, and PDF exports.
- Add granular BI permissions for spaces, charts, dashboards, schedules, and
  share links.
- Add validation fix actions and lineage/freshness pages.
- Add production embedding policy for tokenized shared views.

## Guardrails

- Do not claim connector or delivery support until an adapter is implemented
  and tested.
- Keep `analytics-bi-core` as the governance spine.
- Keep authoring and UI flows in the shared analytics/admin product layer.
- Preserve action/resource/job/workflow compatibility for existing plugin
  consumers.

import { describe, expect, it } from "bun:test";

import {
  buildAnalyticsBiCoreMigrationSql,
  buildAnalyticsBiCoreRollbackSql,
  getAnalyticsBiCoreLookupIndexName,
  getAnalyticsBiCoreStatusIndexName
} from "../../src/postgres";

describe("analytics-bi-core postgres helpers", () => {
  it("creates the business tables and indexes", () => {
    const sql = buildAnalyticsBiCoreMigrationSql().join("\n");

    expect(sql).toContain("CREATE TABLE IF NOT EXISTS analytics_bi_core.primary_records");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS analytics_bi_core.secondary_records");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS analytics_bi_core.exception_records");
    expect(sql).toContain(getAnalyticsBiCoreLookupIndexName());
    expect(sql).toContain(getAnalyticsBiCoreStatusIndexName());
  });

  it("rolls the schema back safely", () => {
    const sql = buildAnalyticsBiCoreRollbackSql({ schemaName: "analytics_bi_core_preview", dropSchema: true }).join("\n");
    expect(sql).toContain("DROP TABLE IF EXISTS analytics_bi_core_preview.exception_records");
    expect(sql).toContain("DROP SCHEMA IF EXISTS analytics_bi_core_preview CASCADE");
  });
});

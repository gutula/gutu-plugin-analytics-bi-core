import { describe, expect, it } from "bun:test";

import {
  buildAnalyticsBiCoreSqliteMigrationSql,
  buildAnalyticsBiCoreSqliteRollbackSql,
  getAnalyticsBiCoreSqliteLookupIndexName,
  getAnalyticsBiCoreSqliteStatusIndexName
} from "../../src/sqlite";

describe("analytics-bi-core sqlite helpers", () => {
  it("creates the business tables and indexes", () => {
    const sql = buildAnalyticsBiCoreSqliteMigrationSql().join("\n");

    expect(sql).toContain("CREATE TABLE IF NOT EXISTS analytics_bi_core_primary_records");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS analytics_bi_core_secondary_records");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS analytics_bi_core_exception_records");
    expect(sql).toContain(getAnalyticsBiCoreSqliteLookupIndexName("analytics_bi_core_"));
    expect(sql).toContain(getAnalyticsBiCoreSqliteStatusIndexName("analytics_bi_core_"));
  });

  it("rolls the sqlite tables back safely", () => {
    const sql = buildAnalyticsBiCoreSqliteRollbackSql({ tablePrefix: "analytics_bi_core_preview_" }).join("\n");
    expect(sql).toContain("DROP TABLE IF EXISTS analytics_bi_core_preview_exception_records");
  });
});

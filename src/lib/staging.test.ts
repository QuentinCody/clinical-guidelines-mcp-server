import { expect, it } from "vitest";
import { createGuidelinesApiFetch } from "./api-adapter";
import { clinicalTables, clinicalSchemaHints } from "./staging";

const api = createGuidelinesApiFetch();
it("projects all schedule families and preserves exact annotated rows and response context", async () => {
  const { data } = await api({ method: "GET", path: "/cdc/schedule/all" });
  const tables = clinicalTables(data);
  const source = data as Record<string, { entries: unknown[] }>;
  expect(tables.immunizations).toHaveLength(54);
  expect(tables.immunizations.map(row => JSON.parse(String(row.native_json)))).toEqual([
    ...source.child.entries, ...source.adult.entries, ...source.catchup.entries,
  ]);
  expect(tables.immunizations[0].source_path).toBe("/child/entries/0");
  expect(JSON.parse(String(tables.response_context[0].native_json))).toEqual(JSON.parse(JSON.stringify(data)));
  expect(clinicalSchemaHints(data).columnTypes).toMatchObject({ _source: "TEXT", contraindications: "TEXT", minAge: "TEXT", native_json: "TEXT" });
});

it("preserves vaccine-family relationships without converting them into product eligibility", async () => {
  const { data } = await api({ method: "GET", path: "/cdc/vaccines/pcv" });
  const tables = clinicalTables(data);
  expect(tables.vaccines).toHaveLength(1);
  expect(tables.immunizations).toHaveLength(5);
  expect(tables.immunizations.every(row => String(row.source_path).startsWith("/scheduleEntries/"))).toBe(true);
  expect(JSON.parse(String(tables.vaccines[0].native_json))).toEqual(data);
});

it("handles composed results, provenance, array roots and restaged SQL rows without reserved-column collisions", async () => {
  const { data } = await api({ method: "GET", path: "/uspstf/recommendations" });
  const composed = { "a/b~c": data, again: data };
  const tables = clinicalTables({ content: [], structuredContent: { data: composed } });
  expect(tables.recommendations).toHaveLength(54);
  expect(tables.recommendations[0].source_path).toBe("/a~1b~0c/recommendations/0");
  expect(clinicalTables([composed]).recommendations).toHaveLength(54);
  const query = { sql: "SELECT * FROM recommendations", rows: [{ _rowid: 1, text: "001", _source: { reviewed_on: "2026-10-04" } }] };
  const projection = clinicalTables(query);
  expect(projection.query_rows[0]).not.toHaveProperty("_rowid");
  expect(projection.query_rows[0].text).toBe("001");
  expect(JSON.parse(String(projection.query_rows[0].native_json))).toEqual(query.rows[0]);
});

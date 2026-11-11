import type { SchemaHints } from "@bio-mcp/shared/staging/schema-inference";

type Row = Record<string, unknown>;
const record = (value: unknown): value is Row => value !== null && typeof value === "object" && !Array.isArray(value);
const row = (value: unknown, path: string): Row => ({
  ...(record(value) ? Object.fromEntries(Object.entries(value).filter(([key]) => key !== "_rowid").map(([key, cell]) =>
    [key, cell !== null && typeof cell === "object" ? JSON.stringify(cell) : cell])) : { value }),
  native_json: JSON.stringify(value), source_path: path,
});

/** Keep exact annotated records and their location, including combined and vaccine-detail reads. */
export function clinicalTables(value: unknown) {
  const data = record(value) && Array.isArray(value.content) && record(value.structuredContent) && "data" in value.structuredContent
    ? value.structuredContent.data : value;
  const tables: Record<string, Row[]> = {};
  if (record(data) && typeof data.sql === "string" && Array.isArray(data.rows)) tables.query_rows = data.rows.map((item, index) => row(item, `/rows/${index}`));
  else collect(data, "", tables);
  const context = JSON.stringify(data);
  tables.response_context = [{ native_json: context === undefined ? "null" : context }];
  return tables;
}

function collect(value: unknown, path: string, tables: Record<string, Row[]>) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => { collect(item, `${path}/${index}`, tables); });
    return;
  }
  if (!record(value)) return;
  const table = typeof value.id !== "string" ? undefined
    : "vaccine" in value && "doseNumber" in value ? "immunizations"
    : "grade" in value && "clinicalSummary" in value ? "recommendations"
    : "diseasePrevented" in value && "manufacturer" in value ? "vaccines" : undefined;
  if (table) {
    tables[table] ??= [];
    tables[table].push(row(value, path));
  }
  // Vaccine detail includes related schedule rows, even though its root is itself a record.
  for (const [key, child] of Object.entries(value)) {
    if (table && key !== "scheduleEntries") continue;
    collect(child, `${path}/${key.replace(/~/g, "~0").replace(/\//g, "~1")}`, tables);
  }
}

export function clinicalSchemaHints(value: unknown): SchemaHints {
  const columnTypes: Record<string, string> = { native_json: "TEXT", source_path: "TEXT" };
  for (const values of Object.values(clinicalTables(value))) for (const item of values) {
    for (const [key, cell] of Object.entries(item)) if (typeof cell === "string") columnTypes[key] = "TEXT";
  }
  return { columnTypes };
}

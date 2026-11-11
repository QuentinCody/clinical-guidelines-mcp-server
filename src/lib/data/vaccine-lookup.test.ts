import { expect, it } from "vitest";
import { createApiProxyTool } from "@bio-mcp/shared/tools/api-proxy";
import { createGuidelinesApiFetch } from "../api-adapter";
import { guidelinesCatalog } from "../../spec/catalog";
import { findVaccine, getAllVaccines } from "./cdc-immunization-schedule";
import { sourceRegistry } from "./review-metadata";
import { VACCINE_NAMES_SOURCE } from "./vaccine-review";

const api = createGuidelinesApiFetch();
const detail = (id: string) => api({ method: "GET", path: `/cdc/vaccines/${encodeURIComponent(id)}` });

it.each([["PCV21", "pcv"], ["PCV20", "pcv"], ["RIV", "flu"], ["MenABCWY", "menabcwy"], [" HepA ", "hepa"], ["Respiratory Syncytial Virus", "rsv"]])(
  "resolves %s to the correct family %s through the API and legacy helper", async (query, id) => {
    expect(findVaccine(query)?.id).toBe(id);
    expect(await detail(query)).toMatchObject({ status: 200, data: { id, schedule_match_scope: "vaccine_family" } });
  },
);

it.each([
  ["Hepatitis", ["hepb", "hepa"]],
  ["Pneumococcal", ["pcv", "ppsv"]],
  ["Meningococcal", ["menacwy", "menb", "menabcwy"]],
] as const)("preserves ambiguity for %s through Code Mode instead of choosing the first record", async (query, ids) => {
  expect(findVaccine(query)).toBeUndefined();
  const proxy = createApiProxyTool({ apiFetch: api, catalog: guidelinesCatalog });
  const result = await proxy.handler({ method: "GET", path: `/cdc/vaccines/${query}` }, { sql: () => [] });
  expect(result).toMatchObject({ __api_error: true, status: 409, data: { candidates: ids.map(id => ({ id })) } });
});

it("does not make empty or unknown queries select a vaccine", async () => {
  for (const query of [" ", "not-a-vaccine"]) {
    expect(findVaccine(query)).toBeUndefined();
    expect(await detail(query)).toMatchObject({ status: 404 });
  }
});

it("keeps HepA details free of HepB schedule rows", async () => {
  const result = await detail("hepa");
  expect(result).toMatchObject({ data: { scheduleEntries: [
    { id: "child-hepa-1" }, { id: "child-hepa-2" }, { id: "adult-hepa-1" },
  ] } });
  expect((result.data as { scheduleEntries: unknown[] }).scheduleEntries).toHaveLength(3);
});

it("labels PCV references as family-wide and keeps PCV21 out of the child-specific filter", async () => {
  expect(await detail("PCV21")).toMatchObject({ data: { id: "pcv", schedule_match_scope: "vaccine_family",
    scheduleEntries: [{ id: "child-pcv-1" }, { id: "child-pcv-2" }, { id: "child-pcv-3" }, { id: "child-pcv-4" }, { id: "adult-pneumo-1" }],
  } });
  expect(await api({ method: "GET", path: "/cdc/schedule/child", params: { vaccine: "PCV21" } })).toMatchObject({ data: { total: 0, entries: [] } });
});

it("retains MenABCWY product and subsequent-dose distinctions without inventing a bundled schedule", async () => {
  const result = await detail("menabcwy");
  expect(result).toMatchObject({ data: { manufacturer: ["Pfizer (Penbraya)", "GSK (Penmenvy)"], scheduleEntries: [],
    description: expect.stringContaining("both are indicated at the same visit"),
    _source: { reviewed_on: "2026-10-01", reviewed_fields: ["type", "manufacturer", "name", "abbreviation", "diseasePrevented", "description"] },
  } });
  expect((result.data as { description: string }).description).toContain("Trumenba after Penbraya or Bexsero after Penmenvy");
});

it("corrects current manufacturer/type discovery and separates RSV maternal products", async () => {
  expect(await detail("menacwy")).toMatchObject({ data: { manufacturer: ["Sanofi Pasteur (MenQuadfi)", "GSK (Menveo)"] } });
  expect(await detail("mmr")).toMatchObject({ data: { manufacturer: ["Merck (M-M-R II)", "GSK (Priorix)"] } });
  expect(await detail("hib")).toMatchObject({ data: { manufacturer: ["Merck (PedvaxHIB)", "Sanofi Pasteur (ActHIB)", "GSK (Hiberix)"] } });
  expect(await detail("hepb")).toMatchObject({ data: { type: "Recombinant" } });
  expect(await detail("rsv")).toMatchObject({ data: { type: "Recombinant protein or mRNA", manufacturer: ["GSK (Arexvy)", "Pfizer (Abrysvo)", "Moderna (mResvia)"],
    description: expect.stringContaining("Arexvy and mResvia are not approved during pregnancy") } });
});

it("qualifies zoster and PPSV descriptions without treating them as interchangeable vaccines", async () => {
  expect(await detail("zoster")).toMatchObject({ data: { description: expect.stringContaining("19 years and older who are or will be immunodeficient") } });
  expect(await detail("ppsv")).toMatchObject({ data: { description: expect.stringContaining("not needed after PCV20 or PCV21") } });
  expect(await detail("var")).toMatchObject({ data: { description: expect.stringContaining("Shingles prevention uses a separate") } });
});

it("preserves all legacy IDs and per-field source scope without treating the product date as a schedule update", async () => {
  const ids = ["hepb", "rv", "dtap", "hib", "ipv", "pcv", "mmr", "var", "hepa", "tdap", "hpv", "menacwy", "menb", "flu", "covid", "rsv", "zoster", "ppsv", "menabcwy"];
  expect(getAllVaccines().map(row => row.id)).toEqual(ids);
  expect(await detail("hepb")).toMatchObject({ data: { _source: { source_url: VACCINE_NAMES_SOURCE,
		reviewed_fields: ["type", "manufacturer", "name", "abbreviation", "diseasePrevented", "description"], reviewed_on: "2026-10-04", field_reviews: { manufacturer: { reviewed_on: "2026-10-01" } }, provider_updated_on: "2026-07-21", provider_publication_date: null } } });
  const registry = sourceRegistry();
  expect(new Set(registry.reviewed_record_ids).size).toBe(registry.reviewed_record_ids.length);
  expect(registry.sources.cdc).toMatchObject({ observed_schedule_label: "2025; addendum July 2, 2025",
    vaccine_inventory: { observed_on: "2026-10-01", provider_updated_on: "2026-07-21" } });
});

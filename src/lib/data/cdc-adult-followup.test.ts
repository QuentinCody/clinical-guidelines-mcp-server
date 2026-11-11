import { expect, it } from "vitest";
import { createGuidelinesApiFetch } from "../api-adapter";
import { adultSchedule } from "./cdc-immunization-schedule";
import { annotateRecords, sourceRegistry } from "./review-metadata";
import { CDC_FLU_GUIDANCE } from "./adult-review";

function adult(id: string) {
  const entry = adultSchedule.find(row => row.id === id);
  if (!entry) throw new Error(`Missing adult record: ${id}`);
  return entry;
}

// Clinical expectations come from the official sources in the October 1 source ledger.
it("distinguishes influenza product eligibility, preferred-product availability and egg allergy", () => {
  const row = adult("adult-flu-annual");
  expect(row.minInterval).toBe("Annual");
  expect(row.notes).toContain("use another age-appropriate product if those are unavailable");
  expect(row.notes).toContain("only ages 19-49 within this adult summary");
  expect(row.notes).toContain("Egg allergy alone does not preclude vaccination");
  expect(row.notes).toContain("Pregnancy permits IIV or RIV, not LAIV");
  expect(row.contraindications).toEqual([
    "Severe allergy to a non-egg component of the selected product; prior vaccine reactions require CDC's product-specific assessment",
    "LAIV: pregnancy or immunocompromise; other LAIV exclusions also apply",
  ]);
});

it("separates HepA and combination-product intervals and retains the accelerated booster", () => {
  const row = adult("adult-hepa-1");
  expect(row.minInterval).toBe("Single-antigen HepA: 6 months; standard Twinrix: 4 weeks from dose 1 to 2, then 5 months from dose 2 to 3");
  expect(row.notes).toContain("Havrix uses two doses 6-12 months apart; Vaqta uses two 6-18 months apart");
  expect(row.notes).toContain("month-12 booster after days 0, 7 and 21-30");
  expect(row.notes).toContain("requested without a risk factor");
  expect(row.notes).toContain("Post-exposure prophylaxis needs separate assessment");
  expect(row.contraindications[0]).toContain("neomycin; Twinrix also includes yeast");
});

it("keeps Tdap primary-series completion separate from routine boosters and wound management", () => {
  const row = adult("adult-tdap-1");
  expect(row.catchupAge).toContain("Unknown or incomplete primary series");
  expect(row.catchupAge).toContain("age 10 or older");
  expect(row.notes).toContain("three-dose primary series");
  expect(row.notes).toContain("at least 4 weeks later, then Td/Tdap 6-12 months later");
  expect(row.notes).toContain("Each pregnancy requires Tdap");
  expect(row.notes).toContain("Wound management has separate timing");
  expect(row.contraindications[1]).toBe("Tdap only: unexplained encephalopathy within 7 days after DTP, DTaP or Tdap");
});

it.each([
  ["Influenza", "adult-flu-annual", "2026-09-01", ["recommendedAge", "minInterval", "notes", "contraindications"]],
  ["HepA", "adult-hepa-1", "2025-07-02", ["recommendedAge", "minInterval", "notes", "contraindications"]],
  ["Tdap", "adult-tdap-1", "2025-07-02", ["minInterval", "catchupAge", "notes", "contraindications[1]", "contraindications"]],
] as const)("returns %s corrections with dated field-level evidence through the existing API", async (vaccine, id, updated, fields) => {
  const result = await createGuidelinesApiFetch()({ method: "GET", path: "/cdc/schedule/adult", params: { vaccine } });
  expect(result).toMatchObject({ status: 200, data: { total: 1, entries: [{ ...adult(id), _source: {
    review_status: "selected_fields_reviewed", reviewed_on: "2026-10-04", provider_updated_on: updated,
    provider_publication_date: null, reviewed_fields: expect.arrayContaining([...fields]), executable: false,
  } }] } });
});

it("records current influenza guidance separately and preserves prior and unreviewed record dates", () => {
  expect(annotateRecords(adult("adult-flu-annual"))).toMatchObject({ _source: { source_url: CDC_FLU_GUIDANCE } });
  expect(annotateRecords(adult("adult-hepb-1"))).toMatchObject({ _source: { reviewed_on: "2026-10-04", reviewed_fields: expect.arrayContaining(["recommendedAge", "notes", "contraindications"]), field_reviews: { notes: { reviewed_on: "2026-09-29" }, contraindications: { reviewed_on: "2026-10-01" } } } });
  expect(annotateRecords({ id: "child-ipv-2", schedule: "child" })).toMatchObject({ _source: { reviewed_on: null, review_status: "not_reviewed" } });
  const registry = sourceRegistry();
  expect(registry).toMatchObject({ bundle_revision: "2026-10-04", collection_review_status: "partial", complete_provider_dataset: false, sources: { cdc: {
    contraindications_are_exhaustive: false, observed_schedule_label: "2025; addendum July 2, 2025",
    influenza_guidance: { url: CDC_FLU_GUIDANCE, observed_season: "2026-2027", observed_on: "2026-10-01", provider_updated_on: "2026-09-01", status: "interim_clinical_considerations" },
  } } });
  expect(new Set(registry.reviewed_record_ids).size).toBe(registry.reviewed_record_ids.length);
});

it.each([["child", 2], ["adult", 1], ["catchup", 0]] as const)("prefers the HepA abbreviation over the Hepatitis B substring in the %s schedule", async (schedule, count) => {
  const result = await createGuidelinesApiFetch()({ method: "GET", path: `/cdc/schedule/${schedule}`, params: { vaccine: "hepa" } });
  const data = result.data as { total: number; entries: Array<{ abbreviation: string }> };
  expect(data.total).toBe(count);
  expect(data.entries.every(row => row.abbreviation === "HepA")).toBe(true);
});

it("retains broad discovery and combined-product matches when there is no exact identity", async () => {
  const api = createGuidelinesApiFetch();
  expect(await api({ method: "GET", path: "/cdc/schedule/adult", params: { vaccine: "Hepatitis" } })).toMatchObject({ data: { total: 2, entries: [{ id: "adult-hepa-1" }, { id: "adult-hepb-1" }] } });
  expect(await api({ method: "GET", path: "/cdc/schedule/adult", params: { vaccine: "PCV21" } })).toMatchObject({ data: { total: 1, entries: [{ id: "adult-pneumo-1" }] } });
  expect(await api({ method: "GET", path: "/cdc/schedule/catchup", params: { vaccine: "Tdap" } })).toMatchObject({ data: { total: 1, entries: [{ id: "catchup-dtap" }] } });
  expect(await api({ method: "GET", path: "/cdc/schedule/adult", params: { vaccine: "Td" } })).toMatchObject({ data: { total: 1, entries: [{ id: "adult-tdap-1" }] } });
  expect(await api({ method: "GET", path: "/cdc/schedule/adult", params: { vaccine: "unknown-vaccine" } })).toMatchObject({ data: { total: 0, entries: [] } });
});

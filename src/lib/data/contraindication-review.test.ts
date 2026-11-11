import { afterEach, expect, it, vi } from "vitest";
import { adultSchedule, catchupSchedule, childSchedule } from "./cdc-immunization-schedule";
import { annotateRecords, sourceRegistry } from "./review-metadata";
import { ADULT_APPENDIX, CHILD_APPENDIX, reviewedContraindications } from "./contraindication-review";
import { createGuidelinesApiFetch } from "../api-adapter";

const entries = [...childSchedule, ...adultSchedule, ...catchupSchedule];
const row = (id: string) => entries.find(entry => entry.id === id)!;
const text = (id: string) => row(id).contraindications.join("; ");
afterEach(() => vi.unstubAllGlobals());

// Expectations follow the CDC child/adult appendices, observed October 1, 2026.
it("retains the cause and timing qualifications for pertussis-containing vaccines", () => {
  for (let dose = 1; dose <= 5; dose++) {
    expect(text(`child-dtap-${dose}`)).toContain("Unexplained encephalopathy within 7 days after DTP or DTaP");
  }
  for (const id of ["child-tdap-1", "adult-tdap-1", "catchup-dtap"]) {
    expect(text(id)).toContain("Tdap only: unexplained encephalopathy within 7 days after DTP, DTaP or Tdap");
  }
});

it("preserves the Hib minimum-age contraindication across product alternatives", () => {
  const hib = childSchedule.filter(entry => entry.id.startsWith("child-hib-"));
  expect(hib).toHaveLength(5);
  for (const entry of hib) {
    expect(entry.contraindications).toContain("Age younger than 6 weeks");
    expect(entry.contraindications[0]).toContain("after a prior dose");
  }
});

it("keeps the diphtheria-carrier allergy scoped to PCV in the combined adult row", () => {
  for (let dose = 1; dose <= 4; dose++) expect(text(`child-pcv-${dose}`)).toContain("diphtheria-toxoid");
  expect(row("adult-pneumo-1").contraindications[1]).toBe("PCV only: severe allergic reaction to a diphtheria-toxoid vaccine or its ingredients");
});

it("distinguishes Menveo and MenQuadfi carrier allergies", () => {
  for (const id of ["child-menacwy-1", "child-menacwy-2", "adult-menacwy-1"]) {
    expect(text(id)).toContain("Menveo only: severe allergic reaction to a vaccine containing diphtheria toxoid or CRM197");
    expect(text(id)).toContain("MenQuadfi only: severe allergic reaction to a tetanus-toxoid vaccine");
  }
});

it("qualifies live-vaccine family immune history without treating all HIV infection as a contraindication", () => {
  for (const entry of entries.filter(item => /-(mmr|var)(-|$)/.test(item.id))) {
    expect(entry.contraindications).toEqual(expect.arrayContaining([
      "Pregnancy", "Severe immunodeficiency",
      "Family history of impaired immunity unless the recipient is confirmed immunocompetent",
    ]));
    expect(entry.contraindications.join(" ")).not.toMatch(/HIV infection of any severity/);
  }
});

it("retains rotavirus-specific contraindications without promoting general precautions", () => {
  for (let dose = 1; dose <= 3; dose++) {
    expect(row(`child-rv-${dose}`).contraindications).toEqual(expect.arrayContaining(["Severe combined immunodeficiency (SCID)", "Previous intussusception"]));
    expect(text(`child-rv-${dose}`)).not.toMatch(/chronic gastrointestinal|fever/i);
  }
});

it("keeps hepatitis component allergies associated with the corresponding vaccine", () => {
  for (const id of ["child-hepb-1", "child-hepb-2", "child-hepb-3", "adult-hepb-1", "catchup-hepb"]) expect(text(id)).toContain("including yeast");
  for (const id of ["child-hepa-1", "child-hepa-2"]) {
    expect(text(id)).toContain("including neomycin");
    expect(text(id)).not.toContain("yeast");
  }
});

it("limits the new review to its exact field values and retains earlier field dates", () => {
  expect(annotateRecords(row("adult-hepb-1"))).toMatchObject({ _source: {
    reviewed_on: "2026-10-04", field_reviews: {
      notes: { reviewed_on: "2026-09-29" },
      contraindications: { reviewed_on: "2026-10-01", provider_updated_on: "2025-07-02", source_urls: [ADULT_APPENDIX] },
    },
  } });
  for (const record of [
    { ...row("child-ipv-2"), contraindications: ["unreviewed edit"] },
    { ...row("child-ipv-2"), id: "child-ipv-new" },
  ]) expect(annotateRecords(record)).toMatchObject({ _source: { reviewed_fields: expect.not.arrayContaining(["contraindications"]) } });
  expect(annotateRecords(row("child-covid-annual"))).toMatchObject({ _source: { field_reviews: { notes: { reviewed_on: "2026-09-30" }, contraindications: { reviewed_on: "2026-10-04" } } } });
});

it("exposes the corrected values and scoped evidence through combined and vaccine-detail API reads", async () => {
  const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
  const api = createGuidelinesApiFetch();
  expect(await api({ method: "GET", path: "/cdc/vaccines/menacwy" })).toMatchObject({ data: {
    scheduleEntries: expect.arrayContaining([expect.objectContaining({ id: "child-menacwy-1", _source: expect.objectContaining({ field_reviews: expect.objectContaining({ contraindications: expect.objectContaining({ source_urls: [CHILD_APPENDIX] }) }) }) })]),
  } });
  expect(await api({ method: "GET", path: "/cdc/schedule/all" })).toMatchObject({ data: {
    child: { entries: expect.arrayContaining([expect.objectContaining({ id: "child-ipv-2", _source: expect.objectContaining({ reviewed_fields: expect.arrayContaining(["contraindications"]), field_reviews: expect.objectContaining({ contraindications: expect.objectContaining({ reviewed_on: "2026-10-01" }) }) }) })]) },
  } });
  expect(fetcher).not.toHaveBeenCalled();
});

it("records all reviewed IDs without claiming complete clinical validation", () => {
  const reviewed = Object.keys(reviewedContraindications);
  expect(reviewed).toHaveLength(44);
  for (const id of reviewed) {
    expect(row(id)).toBeDefined();
    expect(annotateRecords(row(id))).toMatchObject({ _source: { reviewed_fields: expect.arrayContaining(["contraindications"]), executable: false } });
  }
  expect(sourceRegistry()).toMatchObject({ collection_review_status: "partial", sources: { cdc: {
    contraindications_are_exhaustive: false, contraindication_review: { reviewed_record_ids: reviewed },
  } } });
});

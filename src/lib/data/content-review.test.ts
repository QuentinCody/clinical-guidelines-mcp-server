import { expect, it } from "vitest";
import { createGuidelinesApiFetch } from "../api-adapter";
import { adultSchedule, catchupSchedule, childSchedule, vaccines } from "./cdc-immunization-schedule";
import { annotateRecords } from "./review-metadata";
import { filterUspstfRecommendations, matchingUspstfRecommendations, uspstfRecommendations } from "./uspstf-recommendations";

const rows = [...childSchedule, ...adultSchedule, ...catchupSchedule, ...vaccines, ...uspstfRecommendations];
function evidence(record: unknown) {
  return (annotateRecords(record) as { _source: {
    reviewed_fields: string[]; unreviewed_fields: string[]; recommendation_status?: string;
    field_reviews: Record<string, { reviewed_on: string; source_urls: string[]; scope?: string }>;
  } })._source;
}

it.each(rows)("requires independent value matches for every reviewed field of $id", original => {
  const fields = evidence(original).reviewed_fields;
  const content = Object.keys(original).filter(key => !["id", "schedule"].includes(key));
  expect(fields).toEqual(expect.arrayContaining(content));
  expect(evidence(original).unreviewed_fields).toEqual([]);
  for (const field of content) {
    const changed = { ...original, [field]: "unreviewed change" };
    const missing = { ...original, [field]: undefined };
    for (const edited of [changed, missing]) {
      const source = evidence(edited);
      expect(source.reviewed_fields.filter(key => key === field || key.startsWith(field + "["))).toEqual([]);
      expect(source.unreviewed_fields).toContain(field);
    }
  }
});

it("does not transfer evidence to a new record, schedule, publication URL or date", () => {
  const uspstf = uspstfRecommendations[0];
  const candidates = [
    { ...childSchedule[0], schedule: "adult" },
    { ...uspstf, datePublished: "2099-01-01" }, { ...uspstf, url: "https://example.org/changed" },
    { ...uspstf, url: undefined }, { ...uspstf, datePublished: undefined },
    ...["constructor", "toString", "__proto__", "new-record"].map(id => ({ ...vaccines[0], id })),
  ];
  for (const candidate of candidates) {
    expect(evidence(candidate).reviewed_fields).toEqual([]);
    expect(evidence(candidate).recommendation_status).toBeUndefined();
  }
  expect(evidence({ ...uspstf, newClinicalClaim: "unreviewed" }).unreviewed_fields).toEqual(["newClinicalClaim"]);
});

it("preserves older field dates alongside the new content review", () => {
  expect(evidence(vaccines[0]).field_reviews).toMatchObject({
    type: { reviewed_on: "2026-10-01" }, name: { reviewed_on: "2026-10-04" },
  });
  expect(evidence(uspstfRecommendations[0]).field_reviews).toMatchObject({
    grade: { reviewed_on: "2026-09-29" }, population: { reviewed_on: "2026-10-04" },
    riskFactors: { reviewed_on: "2026-10-04", scope: expect.stringContaining("not exhaustive") },
    sex: { scope: expect.stringContaining("Local navigation") },
  });
});

it("does not use gender navigation to exclude anatomy- or pregnancy-based populations", () => {
  const male = filterUspstfRecommendations({ sex: "male" });
  for (const suffix of ["breast-cancer-screening", "cervical-cancer-screening", "folic-acid-supplementation", "gestational-diabetes-screening", "preeclampsia-screening", "aspirin-preeclampsia-prevention"]) {
    expect(male.some(row => row.id === `uspstf-${suffix}`)).toBe(true);
  }
  expect(uspstfRecommendations[0].population).toContain("assigned female at birth");
  expect(uspstfRecommendations[1].population).toContain("with a cervix");
  expect(uspstfRecommendations[1].clinicalSummary).toContain("immunocompromise");
});

it("retains conjunctions and population-specific risk qualifications", () => {
  const risk = (suffix: string) => uspstfRecommendations.find(row => row.id === `uspstf-${suffix}`)!.riskFactors.join(" ");
  expect(risk("statin-use-cvd-prevention")).toContain("AND estimated 10-year");
  expect(risk("diabetes-screening")).toContain("23");
  expect(risk("hepatitis-b-screening")).toContain(">= 2%");
  expect(risk("hepatitis-b-screening")).toContain(">= 8%");
  expect(risk("hepatitis-b-screening")).toContain("men who have sex with men");
  expect(risk("sti-counseling")).toContain("separate population criteria");
  expect(childSchedule.find(row => row.id === "child-dtap-1")!.notes).toContain("not all five doses");
});

it("requires disambiguation when a keyword spans several grades or populations", async () => {
  const api = createGuidelinesApiFetch();
  expect(matchingUspstfRecommendations("colorectal")).toHaveLength(3);
  expect(matchingUspstfRecommendations(" ")).toEqual([]);
  const ambiguous = await api({ method: "GET", path: "/uspstf/recommendations/colorectal" });
  expect(ambiguous).toMatchObject({ status: 409, data: { candidates: [
    { id: "uspstf-colorectal-cancer-screening", grade: "A", ageRange: "50-75" },
    { id: "uspstf-colorectal-cancer-screening-45-49", grade: "B", ageRange: "45-49" },
    { id: "uspstf-colorectal-cancer-screening-76-85", grade: "C", ageRange: "76-85" },
  ] } });
  expect(await api({ method: "GET", path: "/uspstf/recommendations/USPSTF-COLORECTAL-CANCER-SCREENING" })).toMatchObject({ status: 200, data: { grade: "A" } });
  expect(await api({ method: "GET", path: "/uspstf/recommendations/breast" })).toMatchObject({ status: 200, data: { id: "uspstf-breast-cancer-screening" } });
});

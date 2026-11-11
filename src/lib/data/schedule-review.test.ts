import { expect, it } from "vitest";
import { adultSchedule, catchupSchedule, childSchedule } from "./cdc-immunization-schedule";
import { annotateRecords, sourceRegistry } from "./review-metadata";
import { reviewedFollowupValues, SCHEDULE_REVIEW_FIELDS } from "./schedule-review-values";

const rows = [...childSchedule, ...adultSchedule, ...catchupSchedule];
const row = (id: string) => rows.find(value => value.id === id)!;
function evidence(value: Record<string, unknown>) {
  return (annotateRecords(value) as { _source: { reviewed_fields: string[]; field_reviews: Record<string, { reviewed_on: string; source_urls: string[] }>; reviewed_on: string | null } })._source;
}

it.each(rows)("pins every reviewed timing value independently for $id", original => {
  const source = evidence({ ...original });
  for (const field of SCHEDULE_REVIEW_FIELDS) {
    expect(source.field_reviews[field].reviewed_on).toBe("2026-10-04");
    for (const edited of [{ ...original, [field]: "unreviewed edit" }, { ...original, [field]: undefined }]) {
      const changed = evidence(edited);
      expect(changed.reviewed_fields).not.toContain(field);
      expect(changed.field_reviews).not.toHaveProperty(field);
      for (const untouched of SCHEDULE_REVIEW_FIELDS.filter(key => key !== field)) {
        expect(changed.field_reviews[untouched]).toEqual(source.field_reviews[untouched]);
      }
    }
  }
});

it.each(Object.entries(reviewedFollowupValues))("does not reuse follow-up review evidence after edits to %s", (id, values) => {
  for (const field of Object.keys(values)) {
    expect(evidence({ ...row(id) }).field_reviews[field].reviewed_on).toBe("2026-10-04");
    expect(evidence({ ...row(id), [field]: "unreviewed edit" }).reviewed_fields).not.toContain(field);
    expect(evidence({ ...row(id), [field]: undefined }).reviewed_fields).not.toContain(field);
  }
});

it("does not certify new IDs, missing fields or a different schedule using the reviewed values", () => {
  for (const value of [{ ...row("child-ipv-2"), id: "child-new" }, { id: "child-ipv-2", schedule: "child" }, { ...row("child-ipv-2"), schedule: "adult", contraindications: [] }]) {
    for (const field of SCHEDULE_REVIEW_FIELDS) expect(evidence(value).field_reviews).not.toHaveProperty(field);
  }
  expect(evidence({ id: "adult-hpv-1", schedule: "adult" }).reviewed_fields).toEqual([]);
  for (const id of ["toString", "constructor", "__proto__"]) expect(evidence({ id, schedule: id }).reviewed_fields).toEqual([]);
});

it("retains earlier field dates and the 2025 schedule label without claiming full validation", () => {
  expect(evidence({ ...row("child-hepb-1") })).toMatchObject({ reviewed_on: "2026-10-04", field_reviews: {
    recommendedAge: { reviewed_on: "2026-10-04" }, notes: { reviewed_on: "2026-10-01" }, contraindications: { reviewed_on: "2026-10-01" },
  } });
  expect(evidence({ ...row("child-covid-annual") }).field_reviews.contraindications.source_urls[0]).toContain("contraindications-precautions");
  expect(sourceRegistry()).toMatchObject({ collection_review_status: "partial", executable_clinical_logic: false, sources: { cdc: {
    observed_schedule_label: "2025; addendum July 2, 2025", schedule_field_review: { value_pinned: true, reviewed_record_ids: rows.map(value => value.id) },
  } } });
});

it("qualifies adult summary ages, product-dependent dose intervals and exceptions", () => {
  expect(row("adult-hpv-1").minAge).toContain("lower bound of this adult summary");
  expect(row("adult-hpv-1").minInterval).toContain("12 weeks from 2 to 3, and 5 months from 1 to 3");
  expect(row("adult-hepb-1").minInterval).toContain("Two Heplisav-B doses: at least 4 weeks");
  expect(row("adult-hepb-1").minInterval).toContain("16 weeks from 1 to 3");
  expect(row("adult-pneumo-1").minInterval).toContain("8-week minimum may apply with immunocompromise, CSF leak or cochlear implant");
  expect(row("adult-mmr-1").catchupAge).toContain("birth before 1957 has exceptions");
  expect(row("catchup-hepb").notes).toContain("adult-formulation Recombivax HB at least 4 months apart");
});

it("preserves vaccine-specific limitations instead of turning summary rows into dosing rules", () => {
  for (const id of ["child-ipv-1", "child-ipv-2", "catchup-ipv"]) expect(row(id).notes).toContain("polio-endemic region or during an outbreak");
  expect(row("child-tdap-1").notes).toContain("each pregnancy");
  expect(row("child-tdap-1").minInterval).toContain("regardless of interval");
  expect(row("child-menacwy-1").minAge).toContain("Menveo liquid from 10 years");
  expect(row("child-var-2").minAge).toContain("retrospective acceptance");
  for (const id of ["child-covid-annual", "adult-covid-annual"]) {
    expect(row(id).contraindications[0]).toContain("same COVID-19 vaccine type");
    expect(row(id).contraindications[0]).toContain("alternative type");
  }
  expect(row("child-flu-annual").contraindications[0]).toContain("non-egg component");
  expect(row("child-flu-annual").contraindications[1]).toContain("asthma/wheezing");
  expect(row("child-flu-annual").minAge).toContain("RIV: 9 years");
});

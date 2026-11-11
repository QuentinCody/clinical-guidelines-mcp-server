import { expect, it } from "vitest";
import { createGuidelinesApiFetch } from "../api-adapter";
import { childSchedule, catchupSchedule } from "./cdc-immunization-schedule";
import { annotateRecords, sourceRegistry } from "./review-metadata";

function row(id: string) {
  const entry = [...childSchedule, ...catchupSchedule].find(item => item.id === id);
  if (!entry) throw new Error(`Missing schedule record: ${id}`);
  return entry;
}

// Provider expectations: CDC notes/catch-up table and disease pages in the October 2 ledger.
it("qualifies HepB dose timing without treating every series as exactly three doses", () => {
  expect(row("child-hepb-2").recommendedAge).toBe("1-2 months");
  expect(row("child-hepb-2").notes).toContain("Before age 6 weeks, use monovalent HepB");
  const final = row("child-hepb-3");
  expect(final.minAge).toBe("24 weeks");
  expect(final.notes).toContain("at least 8 weeks after dose 2 and 16 weeks after dose 1");
  expect(final.notes).toContain("apply these final-dose requirements to dose 4");
  expect(final.notes).toContain("HBsAg-positive or whose status remains unknown");
});

it.each(["child-rv-2", "child-rv-3"])("includes the maximum-age day for %s", id => {
  expect(row(id).catchupAge).toBe("By 8 months 0 days");
  expect(row(id).minInterval).toContain("4 weeks");
});

it("covers unknown and mixed rotavirus brands while retaining the two-dose alternative", () => {
  expect(row("child-rv-1").notes).toContain("14 weeks 6 days");
  expect(row("child-rv-1").notes).toContain("if any dose is RotaTeq (RV5) or its brand is unknown, use three doses");
  expect(row("child-rv-3").notes).toContain("completed two-dose Rotarix (RV1) series does not need dose 3");
});

it("does not use the DTaP retrospective exception as the planned minimum interval", () => {
  const fourth = row("child-dtap-4");
  expect(fourth.minInterval).toBe("6 months after dose 3");
  expect(fourth.notes).toContain("inadvertently early fourth dose may count retrospectively");
  expect(fourth.notes).toContain("age 12 months or later and at least 4 months after dose 3");
  expect(fourth.notes).toContain("does not shorten the planned interval");
});

it("replaces the unconditional mixed IPV/OPV fourth dose with age, interval and documentation rules", () => {
  const third = row("child-ipv-3");
  expect(third.minInterval).toContain("6 months as the final dose at age 4 or older");
  expect(third.notes).toContain("fourth dose is unnecessary when dose 3 is at age 4 or older and at least 6 months after dose 2");
  expect(third.notes).toContain("only trivalent OPV (tOPV) counts");
  expect(third.notes).toContain("written documentation specifying tOPV for OPV given after April 1, 2016");
  expect(third.notes).not.toContain("regardless");
});

it("distinguishes MMR and MMRV intervals and does not round four weeks to a calendar month", () => {
  expect(row("child-mmr-1").notes).toContain("ages 12-47 months");
  expect(row("child-mmr-1").notes).toContain("parents or caregivers prefer it");
  expect(row("child-mmr-2").minAge).toContain("4 weeks after a valid first MMR dose");
  expect(row("child-mmr-2").minAge).not.toBe("13 months");
  for (const id of ["child-mmr-2", "catchup-mmr"]) {
    expect(row(id).minInterval).toMatch(/MMR: 4 weeks.*MMRV: 3 months/);
    expect(row(id).notes).toContain("before age 12 months for travel does not replace");
    expect(row(id).notes).toContain("12 years");
  }
});

it("requires verified varicella history rather than treating any recorded history as immunity", () => {
  const notes = row("child-var-1").notes;
  expect(notes).toContain("epidemiologic link");
  expect(notes).toContain("laboratory confirmation at the time of illness");
  expect(notes).toContain("unverified history alone does not establish immunity");
  expect(notes).not.toContain("Do not administer to persons with documented varicella disease history");
});

it.each(["child-var-2", "catchup-var"])("keeps planned and retrospective varicella intervals separate for %s", id => {
  expect(row(id).minInterval).toContain("3 months");
  expect(row(id).notes).toContain("inadvertently early");
  expect(row(id).notes).toContain("at least 4 weeks");
  expect(row(id).notes).toContain("single-antigen");
  expect(row(id).notes).toContain("MMRV is not approved");
});

it("allows HepA completion after age 23 months and keeps infant travel doses separate", () => {
  expect(row("child-hepa-1").notes).toContain("travel dose at age 6-11 months does not replace");
  expect(row("child-hepa-2").recommendedAge).toBe("At least 6 months after dose 1");
  expect(row("child-hepa-2").notes).toContain("after age 23 months");
  expect(row("child-hepa-2").notes).toContain("does not need to be restarted");
});

it("does not apply the routine MenACWY booster exemption to ongoing risk or outbreaks", () => {
  const notes = row("child-menacwy-2").notes;
  expect(notes).toContain("age 13-15");
  expect(notes).toContain("at least 8 weeks later");
  expect(notes).toContain("otherwise healthy adolescents");
  expect(notes).toContain("Ongoing increased risk or an outbreak can require additional boosters");
});

it("returns the latest record review while retaining separate field dates and the older provider label", async () => {
  const result = await createGuidelinesApiFetch()({ method: "GET", path: "/cdc/schedule/child", params: { vaccine: "HepA" } });
  expect(result).toMatchObject({ status: 200, data: { total: 2, entries: expect.arrayContaining([
    expect.objectContaining({ id: "child-hepa-2", recommendedAge: "At least 6 months after dose 1", _source: expect.objectContaining({
      bundle_revision: "2026-10-04", reviewed_on: "2026-10-04", provider_publication_date: null,
      reviewed_fields: expect.arrayContaining(["recommendedAge", "notes", "contraindications"]), executable: false,
      field_reviews: expect.objectContaining({ notes: expect.objectContaining({ reviewed_on: "2026-10-02" }), contraindications: expect.objectContaining({ reviewed_on: "2026-10-01" }) }),
    }) }),
  ]) } });
  expect(annotateRecords(row("child-ipv-2"))).toMatchObject({ _source: { field_reviews: { contraindications: { reviewed_on: "2026-10-01" } } } });
  expect(sourceRegistry()).toMatchObject({ collection_review_status: "partial", complete_provider_dataset: false,
    sources: { cdc: { observed_schedule_label: "2025; addendum July 2, 2025" } },
  });
});

it("retains both disease-specific and schedule sources through catch-up and vaccine-detail reads", async () => {
  const api = createGuidelinesApiFetch();
  expect(await api({ method: "GET", path: "/cdc/schedule/catchup", params: { vaccine: "MMR" } })).toMatchObject({ data: { entries: [{ id: "catchup-mmr", _source: { reviewed_on: "2026-10-04", field_reviews: { notes: { reviewed_on: "2026-10-02" } } } }] } });
  expect(await api({ method: "GET", path: "/cdc/vaccines/ipv" })).toMatchObject({ data: { scheduleEntries: expect.arrayContaining([
    expect.objectContaining({ id: "child-ipv-3", _source: expect.objectContaining({ source_urls: expect.arrayContaining([
      "https://www.cdc.gov/polio/hcp/vaccine-considerations/index.html",
      "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-catch-up.html",
    ]) }) }),
  ]) } });
});

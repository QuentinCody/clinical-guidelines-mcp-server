import { expect, it } from "vitest";
import { createGuidelinesApiFetch } from "../api-adapter";
import { catchupSchedule, childSchedule } from "./cdc-immunization-schedule";
import { annotateRecords, sourceRegistry } from "./review-metadata";

function row(id: string) {
	const found = [...childSchedule, ...catchupSchedule].find(entry => entry.id === id);
	if (!found) throw new Error(`Missing schedule record: ${id}`);
	return found;
}

it("returns qualified HepB birth timing with a separate source-review date", async () => {
	const result = await createGuidelinesApiFetch()({ method: "GET", path: "/cdc/schedule/child", params: { vaccine: "HepB" } });
	expect(result).toMatchObject({ data: { entries: expect.arrayContaining([expect.objectContaining({
		id: "child-hepb-1", recommendedAge: expect.stringContaining("maternal HBsAg status"),
		_source: expect.objectContaining({ reviewed_on: "2026-10-04", provider_updated_on: "2025-07-02",
			reviewed_fields: expect.arrayContaining(["recommendedAge", "notes", "contraindications"]), executable: false,
			field_reviews: expect.objectContaining({ notes: expect.objectContaining({ reviewed_on: "2026-10-01" }) }),
		}),
	})]) } });
	const notes = row("child-hepb-1").notes;
	expect(notes).toContain("linked 2025 CDC schedule");
	expect(notes).toContain("whichever comes first");
	expect(notes).toContain("HBsAg-positive: vaccine plus HBIG in separate limbs within 12 hours");
	expect(notes).toContain("Status unknown: vaccine within 12 hours; add HBIG within 12 hours if below 2,000 g");
	expect(notes).toContain("by age 7 days");
	expect(notes).toContain("three additional vaccine doses");
	expect(notes).not.toContain("all newborns within 24 hours");
	expect(annotateRecords(row("child-ipv-2"))).toMatchObject({ _source: { field_reviews: { contraindications: { reviewed_on: "2026-10-01" } } } });
});

it("includes Hib primary and booster alternatives with distinct stable IDs", async () => {
	const result = await createGuidelinesApiFetch()({ method: "GET", path: "/cdc/schedule/child", params: { vaccine: "Hib" } });
	expect(result).toMatchObject({ status: 200, data: { total: 5, entries: [
		{ id: "child-hib-1", doseNumber: 1 },
		{ id: "child-hib-2", doseNumber: 2 },
		{ id: "child-hib-primary-3", doseNumber: 3, recommendedAge: "6 months" },
		{ id: "child-hib-3", doseNumber: 3, recommendedAge: "12-15 months" },
		{ id: "child-hib-4", doseNumber: 4, recommendedAge: "12-15 months" },
	] } });
	expect(row("child-hib-1").notes).toContain("alternative product schedules, not cumulative doses");
	expect(row("child-hib-primary-3").minAge).toContain("Vaxelis: 24 weeks");
	expect(row("child-hib-primary-3").notes).toContain("not needed after two PedvaxHIB");
	expect(row("child-hib-2").notes).toContain("Vaxelis requires three primary doses despite also containing PRP-OMP");
	expect(row("child-hib-3").minInterval).toBe("8 weeks after dose 2");
	expect(row("child-hib-4").minInterval).toBe("8 weeks after dose 3");
	expect(row("child-hib-4").notes).toContain("Vaxelis is not used for the booster");
});

it("makes both childhood PCV products discoverable by the existing vaccine filter", async () => {
	const result = await createGuidelinesApiFetch()({ method: "GET", path: "/cdc/schedule/child", params: { vaccine: "PCV20" } });
	expect(result).toMatchObject({ data: { total: 4, entries: [1, 2, 3, 4].map(dose => ({
		id: `child-pcv-${dose}`, abbreviation: "PCV15/PCV20", _source: { reviewed_fields: expect.arrayContaining(["abbreviation", "contraindications"]), reviewed_on: "2026-10-04", field_reviews: { abbreviation: { reviewed_on: "2026-10-04" } } },
	})) } });
});

it.each(["child-hpv-1", "catchup-hpv"])("keeps pregnancy deferral and immune-status dosing explicit for %s", id => {
	expect(row(id).notes).toContain("immunocompromise requires three doses");
	expect(row(id).notes).toContain("Defer vaccination until after pregnancy");
	expect(row(id).contraindications).toEqual(["Severe allergy to a prior HPV dose or component", "Immediate hypersensitivity to yeast"]);
});

it("distinguishes minimum from routine HPV intervals", () => {
	expect(row("catchup-hpv").minInterval).toBe("2-dose minimum: 5 months; 3-dose minimums: 4 weeks from 1 to 2, 12 weeks from 2 to 3, and 5 months from 1 to 3");
});

it("uses Tdap/Td for the existing adolescent catch-up ID and qualifies booster timing", () => {
	expect(row("catchup-dtap").abbreviation).toBe("Tdap/Td");
	expect(row("catchup-dtap").notes).toContain("ages 7-9 still requires the age 11-12 booster");
	expect(row("catchup-dtap").notes).toContain("a dose at age 10 does not");
	expect(row("catchup-dtap").contraindications[1]).toBe("Tdap only: unexplained encephalopathy within 7 days after DTP, DTaP or Tdap");
	expect(row("child-tdap-1").minAge).toBe("11 years routine; 7 years for catch-up");
});

it("qualifies the IPV fourth dose by both age and interval", () => {
	expect(row("catchup-ipv").notes).toContain("unnecessary if dose 3 was given at age 4+ and at least 6 months after dose 2");
	expect(row("catchup-ipv").minInterval).toContain("6 months as final dose at age 4+");
	expect(row("catchup-ipv").notes).not.toContain("Not routinely recommended for adults");
});

it("covers previous and unknown flu history, aging between doses and RIV age eligibility", () => {
	const flu = row("child-flu-annual");
	expect(flu.notes).toContain("at least two prior flu doses");
	expect(flu.notes).toContain("Unknown history also requires two doses");
	expect(flu.notes).toContain("even if the child turns 9");
	expect(flu.notes).toContain("RIV from 9 years");
	expect(flu.minInterval).toContain("at least 4 weeks");
});

it("retains the COVID ID while qualifying eligibility and variable seasonal dosing", () => {
	const covid = row("child-covid-annual");
	expect(covid.notes).toContain("shared clinical decision-making");
	expect(covid.notes).toContain("age 18 follows adult recommendations");
	expect(covid.notes).toContain("off-label");
	expect(covid.minInterval).not.toBe("Annual updated dose");
	expect(annotateRecords(covid)).toMatchObject({ _source: { provider_updated_on: "2026-09-23", reviewed_on: "2026-10-04", field_reviews: { notes: { reviewed_on: "2026-09-30" } } } });
});

it("does not transfer this review date to untouched fields or prior reviews", () => {
	expect(annotateRecords(row("child-ipv-2"))).toMatchObject({ _source: { field_reviews: { contraindications: { reviewed_on: "2026-10-01" } } } });
	expect(annotateRecords({ id: "adult-hpv-1", schedule: "adult" })).toMatchObject({ _source: { reviewed_on: null, reviewed_fields: [] } });
	expect(annotateRecords(row("child-hib-4"))).toMatchObject({ _source: {
		source_url: "https://www.cdc.gov/hi-disease/hcp/vaccine-recommendations/index.html", executable: false,
	} });
	expect(sourceRegistry()).toMatchObject({ collection_review_status: "partial", complete_provider_dataset: false, reviewed_record_ids: expect.arrayContaining(["child-hib-4", "child-flu-annual", "catchup-dtap"]) });
});

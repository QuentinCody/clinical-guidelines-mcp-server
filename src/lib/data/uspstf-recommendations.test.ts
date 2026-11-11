import { expect, it } from "vitest";
import { findUspstfRecommendation, uspstfRecommendations } from "./uspstf-recommendations";
import { annotateRecords } from "./review-metadata";

// Official final-statement headings observed September 29, 2026. These are
// provider publication dates, deliberately distinct from this review date.
const dates = [
	["cervical-cancer-screening", "2018-08-21"], ["lung-cancer-screening", "2021-03-09"],
	["skin-cancer-prevention-counseling", "2018-03-20"], ["hypertension-screening", "2021-04-27"],
	["statin-use-cvd-prevention", "2022-08-23"], ["abdominal-aortic-aneurysm-screening", "2019-12-10"],
	["aspirin-preeclampsia-prevention", "2021-09-28"], ["diabetes-screening", "2021-08-24"],
	["depression-screening-adults", "2023-06-20"], ["anxiety-screening", "2023-06-20"],
	["hepatitis-b-screening", "2020-12-15"], ["hepatitis-c-screening", "2020-03-02"],
	["hiv-screening", "2019-06-11"], ["sti-counseling", "2020-08-18"],
	["folic-acid-supplementation", "2023-08-01"], ["tobacco-cessation", "2021-01-19"],
	["obesity-weight-management", "2018-09-18"], ["vision-screening-children", "2017-09-05"],
	["gestational-diabetes-screening", "2021-08-10"], ["unhealthy-drug-use-screening", "2020-06-09"],
	["unhealthy-alcohol-use-screening", "2018-11-13"],
];

it.each(dates)("retains the observed final publication date for %s", (suffix, date) => {
	const record = findUspstfRecommendation(`uspstf-${suffix}`);
	expect(record?.datePublished).toBe(date);
	expect(annotateRecords(record)).toMatchObject({ _source: { recommendation_status: "final", provider_publication_date: date,
		field_reviews: { datePublished: { reviewed_on: "2026-09-29" }, riskFactors: { reviewed_on: "2026-10-04" } } } });
});

it("retains core and supplemental field reviews for every bundled recommendation", () => {
	expect(uspstfRecommendations).toHaveLength(27);
	for (const record of uspstfRecommendations) {
		expect(annotateRecords(record)).toMatchObject({ _source: { review_status: "selected_fields_reviewed", reviewed_fields: expect.arrayContaining(["title", "grade", "population", "ageRange", "clinicalSummary", "datePublished", "url", "sex", "topic", "riskFactors"]) } });
	}
});

it("represents pediatric skin counseling and adolescent STI/HBV populations without invented age 15 cutoffs", () => {
	expect(findUspstfRecommendation("uspstf-skin-cancer-prevention-counseling")?.ageRange).toBe("6 months-24 years");
	for (const suffix of ["sti-counseling", "hepatitis-b-screening"]) {
		expect(findUspstfRecommendation(`uspstf-${suffix}`)?.ageRange).toBe("adolescents and adults");
	}
});

it("keeps nonpregnant hepatitis B screening separate from prenatal advice", () => {
	const record = findUspstfRecommendation("uspstf-hepatitis-b-screening");
	expect(record?.population).toContain("nonpregnant");
	expect(record?.clinicalSummary).toContain("separate recommendation");
});

it("does not assign depression's grade B to suicide-risk screening", () => {
	const record = findUspstfRecommendation("uspstf-depression-screening-adults");
	expect(record?.title).toBe("Screening for Depression in Adults");
	expect(record?.clinicalSummary).toContain("suicide-risk screening statement is I");
});

it("limits the obesity recommendation to behavioral intervention", () => {
	const summary = findUspstfRecommendation("uspstf-obesity-weight-management")?.clinicalSummary;
	expect(summary).not.toContain("with or without pharmacotherapy");
	expect(summary).toContain("does not provide a recommendation to prescribe weight-loss medication");
});

it("includes lung screening stopping conditions and pregnancy-specific tobacco constraints", () => {
	expect(findUspstfRecommendation("uspstf-lung-cancer-screening")?.clinicalSummary).toContain("ability or willingness to undergo curative lung surgery");
	expect(findUspstfRecommendation("uspstf-tobacco-cessation")?.clinicalSummary).toContain("insufficient for cessation pharmacotherapy in pregnancy");
});

it("preserves question-based drug screening and pregnancy HIV coverage", () => {
	expect(findUspstfRecommendation("uspstf-unhealthy-drug-use-screening")?.clinicalSummary).toContain("not biological specimen testing");
	expect(findUspstfRecommendation("uspstf-hiv-screening")?.clinicalSummary).toContain("all pregnant persons");
});

import { expect, it } from "vitest";
import { annotateRecords, sourceRegistry, withSourceMetadata } from "./review-metadata";

it("distinguishes a source publication from the local bundle/review date", () => {
	const original = { id: "uspstf-breast-cancer-screening", datePublished: "2024-04-30", url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening", grade: "B" };
	expect(annotateRecords(original)).toMatchObject({ ...original, _source: {
		provider_publication_date: "2024-04-30", reviewed_on: "2026-09-29", review_status: "selected_fields_reviewed",
		reviewed_fields: ["grade", "datePublished", "url"],
	} });
	expect(original).not.toHaveProperty("_source");
});

it("does not label unreviewed or nested records as current", () => {
	const result = withSourceMetadata({ entries: [{ id: "child-ipv-2", schedule: "child", notes: "original" }], total: 1 });
	expect(result).toMatchObject({ total: 1, entries: [{ notes: "original", _source: {
		review_status: "not_reviewed", reviewed_on: null, provider_publication_date: null, reviewed_fields: [], executable: false,
	} }], _source_metadata: { complete_provider_dataset: false, automatic_refresh: false, collection_review_status: "partial" } });
});

it("distinguishes the provider shutdown date from review evidence and unverified successor APIs", () => {
	expect(sourceRegistry().sources.ahrq).toMatchObject({
		status: "provider_reported_offline", offline_since: "2025-04-28", reviewed_on: "2026-10-02",
		executable: false, retrieval_enabled: false,
		notice_url: "https://digital.ahrq.gov/ahrq-funded-projects/patient-centered-outcomes-research-clinical-decision-support-cds-connect",
		successor: { name: "CDS Connect Community Edition",
			url: "https://confluence.hl7.org/spaces/CDS/pages/358255205/CDS+Connect+Community+Edition",
			authoring_tools: { name: "CQL Studio", url: "https://cqlstudio.com/" },
			public_api_status: "unverified", retrieval_enabled: false, executable: false },
	});
});

it("retains the final publication while separately recording an upstream update in progress", () => {
	expect(annotateRecords({ id: "uspstf-cervical-cancer-screening", datePublished: "2018-08-21", url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening" })).toMatchObject({ _source: { recommendation_status: "final", provider_publication_date: "2018-08-21", update_notice: "update_in_progress" } });
});

it("does not transfer review evidence to a different publication or a newly added record", () => {
	for (const record of [{ id: "uspstf-cervical-cancer-screening", datePublished: "2026-01-01" }, { id: "uspstf-new-record", datePublished: "2026-09-29" }]) {
		expect(annotateRecords(record)).toMatchObject({ _source: { review_status: "not_reviewed", reviewed_on: null, reviewed_fields: [] } });
	}
});

it("cites disease-specific CDC updates separately from the older schedule label", () => {
	expect(annotateRecords({ id: "adult-covid-annual", schedule: "adult" })).toMatchObject({ _source: {
		source_url: "https://www.cdc.gov/covid/hcp/vaccine-considerations/routine-guidance.html",
		provider_updated_on: "2026-09-23", provider_publication_date: null,
		reviewed_fields: [],
	} });
	expect(sourceRegistry().sources.cdc).toMatchObject({
		contraindications_are_exhaustive: false,
		covid_guidance: { observed_season: "2026-2027", table_heading_date: "2025-11-04" },
	});
});

it("retains multiple sources for a correction without expanding its reviewed field scope", () => {
	expect(annotateRecords({ id: "adult-hepb-1", schedule: "adult" })).toMatchObject({ _source: {
		source_urls: ["https://www.cdc.gov/hepatitis-b/hcp/vaccine-administration/index.html", "https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-notes.html"],
		reviewed_fields: [],
	} });
	expect(annotateRecords({ id: "unknown-vaccine", name: "Unreviewed" })).toMatchObject({ _source: { review_status: "not_reviewed" } });
});

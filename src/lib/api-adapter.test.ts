import { afterEach, describe, expect, it, vi } from "vitest";
import { createGuidelinesApiFetch } from "./api-adapter";
import { filterUspstfRecommendations, findUspstfRecommendation } from "./data/uspstf-recommendations";
import { adultSchedule } from "./data/cdc-immunization-schedule";
import { BUNDLE_REVISION } from "./data/review-metadata";
import { guidelinesCatalog } from "../spec/catalog";

const api = createGuidelinesApiFetch();
afterEach(() => vi.unstubAllGlobals());

describe("source-grounded corrections", () => {
	// Provider recommendation tables reviewed September 29, 2026; URLs are on each record.
	it.each([["50-75", "A"], ["45-49", "B"], ["76-85", "C"]])("keeps colorectal %s population with its own grade %s", (age, grade) => {
		const rows = filterUspstfRecommendations({ grade, search: "colorectal" });
		expect(rows).toHaveLength(1);
		expect(rows[0]).toMatchObject({ ageRange: age, grade, datePublished: "2021-05-18" });
	});
	it("removes the superseded individual-start advice from the 2024 breast recommendation", () => {
		const row = findUspstfRecommendation("uspstf-breast-cancer-screening");
		expect(row).toMatchObject({ grade: "B", ageRange: "40-74", datePublished: "2024-04-30" });
		expect(row?.clinicalSummary).toContain("every two years");
		expect(row?.clinicalSummary).not.toContain("decision to start screening should be an individual one");
	});
	it("retains legacy IDs while updating superseded publication dates and scope", () => {
		expect(findUspstfRecommendation("uspstf-osteoporosis-screening")).toMatchObject({ datePublished: "2025-01-14" });
		expect(findUspstfRecommendation("uspstf-preeclampsia-screening")).toMatchObject({ datePublished: "2023-09-19", title: "Screening for Hypertensive Disorders of Pregnancy", url: expect.stringContaining("hypertensive-disorders-pregnancy-screening") });
	});
	it("represents CDC pneumococcal 50+ eligibility and the PCV21 option", () => {
		const row = adultSchedule.find(entry => entry.id === "adult-pneumo-1");
		expect(row?.recommendedAge).toContain("50 years and older");
		expect(row?.recommendedAge).toContain("19-49");
		expect(row?.abbreviation).toContain("PCV21");
		expect(row?.notes).toContain("Prior vaccine history changes the schedule");
	});
	it("distinguishes RSV age/risk eligibility from maternal timing and repeat-dose limits", () => {
		const row = adultSchedule.find(entry => entry.id === "adult-rsv-1");
		expect(row?.recommendedAge).toContain("75+");
		expect(row?.recommendedAge).toContain("50-74 at increased risk");
		expect(row?.notes).toContain("additional doses are not recommended");
		expect(row?.notes).toContain("32w0d-36w6d");
	});
});

describe("adapter provenance and capability", () => {
	it("keeps filtered shapes while exposing the reviewed final statement and update notice", async () => {
		const result = await api({ method: "GET", path: "/uspstf/recommendations", params: { grade: "A", search: "cervical" } });
		expect(result).toMatchObject({ status: 200, data: { total: 1, recommendations: [{ id: "uspstf-cervical-cancer-screening", _source: { review_status: "selected_fields_reviewed", reviewed_on: "2026-10-04", recommendation_status: "final", update_notice: "update_in_progress" } }], _source_metadata: { collection_review_status: "partial" } } });
	});
	it("preserves full schedule notes and contraindications in combined responses", async () => {
		expect(await api({ method: "GET", path: "/cdc/schedule/all" })).toMatchObject({ data: {
			adult: { entries: expect.arrayContaining([expect.objectContaining({ id: "adult-pneumo-1", notes: expect.any(String), contraindications: expect.any(Array), _source: expect.objectContaining({ source_url: expect.stringContaining("adult-notes"), bundle_revision: BUNDLE_REVISION, provider_publication_date: null, reviewed_on: "2026-10-04", field_reviews: expect.objectContaining({ notes: expect.objectContaining({ reviewed_on: "2026-09-29" }), contraindications: expect.objectContaining({ reviewed_on: "2026-10-01" }) }), reviewed_fields: expect.arrayContaining(["notes", "contraindications"]), review_status: "selected_fields_reviewed", executable: false }) })]) },
		} });
	});
	it.each(["/ahrq/artifacts", "/ahrq/artifacts/123"])("reports the provider shutdown for %s without contacting the old service or successors", async path => {
		const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
		expect(await api({ method: "GET", path })).toMatchObject({ status: 503, data: { error: "AHRQ_REPOSITORY_OFFLINE", retryable: false,
			availability: { status: "provider_reported_offline", offline_since: "2025-04-28", retrieval_enabled: false, executable: false } } });
		expect(fetcher).not.toHaveBeenCalled();
	});
	it("provides source and availability discovery without claiming live data", async () => {
		expect(await api({ method: "GET", path: "/sources" })).toMatchObject({ status: 200, data: { complete_provider_dataset: false, automatic_refresh: false } });
		const status = await api({ method: "GET", path: "/ahrq/status" });
		expect(status).toMatchObject({ status: 200, data: { status: "provider_reported_offline" } });
		expect(await api({ method: "GET", path: "/sources" })).toMatchObject({ data: { sources: { ahrq: status.data } } });
		expect(guidelinesCatalog.endpointCount).toBe(guidelinesCatalog.endpoints.length);
	});
	it("rejects unsupported methods and unknown local records", async () => {
		expect((await api({ method: "POST", path: "/cdc/schedule/all" })).status).toBe(405);
		expect((await api({ method: "GET", path: "/uspstf/recommendations/not-a-record" })).status).toBe(404);
	});
});

/**
 * Clinical Guidelines API catalog — multi-source: USPSTF + CDC + AHRQ.
 *
 * USPSTF: US Preventive Services Task Force recommendations (embedded static data)
 * CDC: Immunization schedules from ACIP recommendations (embedded static data)
 * AHRQ: provider-reported shutdown metadata and successor links
 *
 * All USPSTF and CDC endpoints serve from embedded data — no external API calls needed.
 */

import type { ApiCatalog } from "@bio-mcp/shared/codemode/catalog";
import { BUNDLE_REVISION } from "../lib/data/review-metadata";

export const guidelinesCatalog: ApiCatalog = {
	name: "Clinical Guidelines (USPSTF + CDC Immunizations + AHRQ CDS)",
	baseUrl: "embedded://clinical-guidelines",
	version: BUNDLE_REVISION,
	auth: "none",
	endpointCount: 14,
	notes:
		"- Multi-source adapter: /uspstf/* (USPSTF recommendations), /cdc/* (CDC immunization schedules), /ahrq/* (AHRQ CDS Connect)\n" +
		"- USPSTF and CDC data is embedded static data served locally — no external API calls\n" +
		"- USPSTF grades: A (strongly recommended), B (recommended), C (selective), D (discourage), I (insufficient)\n" +
		"- CDC schedules: child (birth-18), adult (19+), catchup (late starters)\n" +
		"- Filtering supported via query params (grade, topic, sex, search/q for USPSTF; vaccine for CDC)\n" +
		"- CDC vaccine filters prefer known exact names/abbreviations (including combined-product tokens) before substring discovery; HepA does not match HepB. Empty results mean no bundled row, not clinical ineligibility\n" +
		"- Vaccine details resolve exact family IDs/names and abbreviation components (PCV21, RIV). Ambiguous broad names return 409 with candidate IDs. scheduleEntries are family-level references, not eligibility for every product in that family\n" +
		"- /sources describes partial, field-scoped review and provider source links; this bundle is a curated subset, not the complete current provider dataset\n" +
		"- Bundle revision is not a guideline effective date. Check per-record _source.reviewed_fields and provider_publication_date; unreviewed records are explicitly marked\n" +
		"- No automatic refresh or executable clinical logic. AHRQ reports CDS Connect went offline on 2025-04-28. Artifact routes return AHRQ_REPOSITORY_OFFLINE (retryable: false); /ahrq/status links to the notice and HL7/CQL Studio successors, whose public APIs remain unverified\n" +
		"- Schedule timing fields have value-pinned evidence; _source.field_reviews keeps earlier reviews separate and _source.field_semantics explains row numbering, adult age scope and N/A values\n" +
		"- Combined schedules retain full notes/contraindications and may stage above 30 KiB. Staged SQL tables include immunizations, recommendations or vaccines, exact annotated native_json and source_path, plus response_context. payloads retains the full canonical result; do not interpret partial bundle coverage as clinical ineligibility",
	endpoints: [
		{ method: "GET", path: "/sources", summary: "Inspect source URLs, bundle revision and partial review scope; not live provider discovery", category: "provenance" },
		{ method: "GET", path: "/ahrq/status", summary: "Inspect the AHRQ CDS Connect shutdown notice and HL7 Community Edition / CQL Studio successor links", category: "ahrq",
			example: "return await api.get('/ahrq/status');",
			usageHint: "Reports the provider's 2025-04-28 shutdown date and this adapter's review date. Successor links are discovery resources; no replacement artifact API is enabled." },
		// ===================================================================
		// USPSTF — US Preventive Services Task Force Recommendations
		// ===================================================================
		{
			method: "GET",
			path: "/uspstf/recommendations",
			summary:
				"List the bundled USPSTF subset with grade, topic, sex or keyword filters and source-review metadata",
			category: "uspstf",
			queryParams: [
				{
					name: "grade",
					type: "string",
					required: false,
					description: "Filter by grade (A, B, C, D, or I)",
					enum: ["A", "B", "C", "D", "I"],
				},
				{
					name: "topic",
					type: "string",
					required: false,
					description:
						"Filter by topic category (e.g. Cancer, Heart and Vascular, Mental Health, Infectious Disease, Pregnancy, Healthy Living, Metabolic, Musculoskeletal, Children)",
				},
				{
					name: "sex",
					type: "string",
					required: false,
					description: "Filter local navigation labels, not clinical eligibility or gender identity. Anatomy/pregnancy-based records use all. Read population and the source statement.",
					enum: ["all", "female", "male"],
				},
				{
					name: "search",
					type: "string",
					required: false,
					description: "Free-text search across title, summary, population, and topic",
				},
				{ name: "q", type: "string", required: false, description: "Alias for search; a nonempty search parameter takes precedence when both are supplied" },
			],
		},
		{
			method: "GET",
			path: "/uspstf/recommendations/{topic}",
			summary: "Get a bundled recommendation by exact ID or unique keyword; ambiguous keywords return 409 with candidate IDs, grades and populations",
			category: "uspstf",
			pathParams: [
				{
					name: "topic",
					type: "string",
					required: true,
					description:
						"Recommendation ID (e.g. uspstf-breast-cancer-screening) or topic keyword",
				},
			],
		},
		{
			method: "GET",
			path: "/uspstf/grades",
			summary: "List all USPSTF grade categories with recommendation counts per grade",
			category: "uspstf",
		},
		{
			method: "GET",
			path: "/uspstf/topics",
			summary:
				"List all USPSTF topic categories with recommendation counts per topic",
			category: "uspstf",
		},

		// ===================================================================
		// CDC — Immunization Schedules (ACIP Recommendations)
		// ===================================================================
		{
			method: "GET",
			path: "/cdc/schedule/child",
			summary:
				"Get CDC child immunization schedule (birth through 18 years) with doses, timing, and contraindications",
			category: "cdc",
			queryParams: [
				{
					name: "vaccine",
					type: "string",
					required: false,
					description:
						"Filter by vaccine name or abbreviation (e.g. MMR, DTaP, HPV)",
				},
			],
		},
		{
			method: "GET",
			path: "/cdc/schedule/adult",
			summary:
				"Get CDC adult immunization schedule (19 years and older) with doses, timing, and contraindications",
			category: "cdc",
			queryParams: [
				{
					name: "vaccine",
					type: "string",
					required: false,
					description:
						"Filter by vaccine name or abbreviation (e.g. Tdap, Shingrix, PCV20)",
				},
			],
		},
		{
			method: "GET",
			path: "/cdc/schedule/catchup",
			summary:
				"Get CDC catch-up immunization schedule for persons who start late or are behind",
			category: "cdc",
			queryParams: [
				{
					name: "vaccine",
					type: "string",
					required: false,
					description: "Filter by vaccine name or abbreviation",
				},
			],
		},
		{
			method: "GET",
			path: "/cdc/schedule/all",
			summary: "Get all CDC immunization schedules combined (child, adult, catch-up)",
			category: "cdc",
		},
		{
			method: "GET",
			path: "/cdc/vaccines",
			summary:
				"List all vaccines with detailed info: name, abbreviation, diseases prevented, type, manufacturers, description",
			category: "cdc",
		},
		{
			method: "GET",
			path: "/cdc/vaccines/{id}",
				summary:
				"Get vaccine-family information by ID or abbreviation; ambiguous names return candidates, schedule references do not establish product eligibility",
			category: "cdc",
			pathParams: [
				{
					name: "id",
					type: "string",
					required: true,
					description:
						"Vaccine ID (e.g. mmr, hpv, dtap) or abbreviation (e.g. MMR, HPV, DTaP)",
				},
			],
		},

		// ===================================================================
		// AHRQ — CDS Connect (Clinical Decision Support)
		// ===================================================================
		{
			method: "GET",
			path: "/ahrq/artifacts",
			summary:
				"Unavailable legacy artifact search: returns AHRQ_REPOSITORY_OFFLINE; inspect /ahrq/status",
			category: "ahrq",
			deprecated: true,
			queryParams: [
				{
					name: "search",
					type: "string",
					required: false,
					description: "Search query for CDS artifacts",
				},
				{
					name: "status",
					type: "string",
					required: false,
					description: "Filter by artifact status",
					enum: ["active", "draft", "retired"],
				},
			],
		},
		{
			method: "GET",
			path: "/ahrq/artifacts/{id}",
			summary: "Unavailable legacy artifact retrieval: returns AHRQ_REPOSITORY_OFFLINE; inspect /ahrq/status",
			category: "ahrq",
			deprecated: true,
			pathParams: [
				{
					name: "id",
					type: "string",
					required: true,
					description: "CDS artifact identifier",
				},
			],
		},

	],
};

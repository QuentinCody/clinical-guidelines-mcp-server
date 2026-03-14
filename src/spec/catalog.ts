/**
 * Clinical Guidelines API catalog — multi-source: USPSTF + CDC + AHRQ.
 *
 * USPSTF: US Preventive Services Task Force recommendations (embedded static data)
 * CDC: Immunization schedules from ACIP recommendations (embedded static data)
 * AHRQ: CDS Connect clinical decision support artifacts (limited API)
 *
 * All USPSTF and CDC endpoints serve from embedded data — no external API calls needed.
 */

import type { ApiCatalog } from "@bio-mcp/shared/codemode/catalog";

export const guidelinesCatalog: ApiCatalog = {
	name: "Clinical Guidelines (USPSTF + CDC Immunizations + AHRQ CDS)",
	baseUrl: "embedded://clinical-guidelines",
	version: "2026.03",
	auth: "none",
	endpointCount: 12,
	notes:
		"- Multi-source adapter: /uspstf/* (USPSTF recommendations), /cdc/* (CDC immunization schedules), /ahrq/* (AHRQ CDS Connect)\n" +
		"- USPSTF and CDC data is embedded static data served locally — no external API calls\n" +
		"- USPSTF grades: A (strongly recommended), B (recommended), C (selective), D (discourage), I (insufficient)\n" +
		"- CDC schedules: child (birth-18), adult (19+), catchup (late starters)\n" +
		"- Filtering supported via query params (grade, topic, sex, search/q for USPSTF; vaccine for CDC)\n" +
		"- AHRQ CDS Connect has limited public API availability\n" +
		"- Data is refreshed with server updates (approximately monthly/annually)",
	endpoints: [
		// ===================================================================
		// USPSTF — US Preventive Services Task Force Recommendations
		// ===================================================================
		{
			method: "GET",
			path: "/uspstf/recommendations",
			summary:
				"List all USPSTF recommendations with optional filtering by grade, topic, sex, or keyword search",
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
					description: "Filter by applicable sex",
					enum: ["all", "female", "male"],
				},
				{
					name: "search",
					type: "string",
					required: false,
					description: "Free-text search across title, summary, population, and topic",
				},
			],
		},
		{
			method: "GET",
			path: "/uspstf/recommendations/{topic}",
			summary: "Get a specific USPSTF recommendation by ID or topic keyword",
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
				"Get detailed information about a specific vaccine by ID or abbreviation, including all related schedule entries",
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
				"Search AHRQ CDS Connect clinical decision support artifacts (limited public API)",
			category: "ahrq",
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
			summary: "Get a specific AHRQ CDS Connect artifact by identifier",
			category: "ahrq",
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

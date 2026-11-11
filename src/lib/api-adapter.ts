/**
 * Clinical Guidelines API adapter — routes requests by path prefix
 * to the appropriate data source.
 *
 * /uspstf/* — Served from embedded USPSTF static data
 * /cdc/*    — Served from embedded CDC immunization schedule data
 * /ahrq/*   — Provider-reported shutdown status and successor links
 *
 * This is a multi-API adapter similar to ontology-hub's dual-API pattern.
 */

import type { ApiFetchFn } from "@bio-mcp/shared/codemode/catalog";
import {
	filterUspstfRecommendations,
	matchingUspstfRecommendations,
	uspstfRecommendations,
} from "./data/uspstf-recommendations";
import {
	getAllVaccines,
	filterScheduleByVaccine,
	childSchedule,
	adultSchedule,
	catchupSchedule,
} from "./data/cdc-immunization-schedule";
import { matchingVaccines, vaccineSchedules } from "./data/vaccine-lookup";
import { ahrqAvailability, sourceRegistry, withSourceMetadata } from "./data/review-metadata";

/**
 * Build a synthetic JSON Response from data.
 */
function jsonResponse(data: unknown, status = 200): { status: number; data: unknown } {
	return { status, data: withSourceMetadata(data) };
}

/**
 * Build an error response.
 */
function errorResponse(message: string, status = 404): { status: number; data: unknown } {
	return { status, data: { error: message } };
}

/**
 * Handle USPSTF routes from static data.
 */
function handleUspstf(
	path: string,
	params?: Record<string, unknown>,
): { status: number; data: unknown } {
	// GET /uspstf/recommendations — list all (with optional filters)
	if (path === "/uspstf/recommendations") {
		const filters: { grade?: string; topic?: string; sex?: string; search?: string } = {};
		if (params?.grade) filters.grade = String(params.grade);
		if (params?.topic) filters.topic = String(params.topic);
		if (params?.sex) filters.sex = String(params.sex);
		if (params?.search || params?.q) filters.search = String(params?.search || params?.q);

		const results = filterUspstfRecommendations(
			Object.keys(filters).length > 0 ? filters : undefined,
		);
		return jsonResponse({
			total: results.length,
			recommendations: results,
		});
	}

	// GET /uspstf/recommendations/{topic} — find by topic/id
	const topicMatch = path.match(/^\/uspstf\/recommendations\/(.+)$/);
	if (topicMatch) {
		const matches = matchingUspstfRecommendations(decodeURIComponent(topicMatch[1]));
		if (matches.length > 1) return { status: 409, data: {
			error: "Ambiguous recommendation keyword; use an exact ID from /uspstf/recommendations",
			candidates: matches.map(({ id, title, grade, population, ageRange }) => ({ id, title, grade, population, ageRange })),
		} };
		const result = matches[0];
		if (result) {
			return jsonResponse(result);
		}
		return errorResponse(`Recommendation not found: ${topicMatch[1]}`);
	}

	// GET /uspstf/grades — list available grades with counts
	if (path === "/uspstf/grades") {
		const grades: Record<string, number> = {};
		for (const rec of uspstfRecommendations) {
			grades[rec.grade] = (grades[rec.grade] || 0) + 1;
		}
		return jsonResponse({ grades });
	}

	// GET /uspstf/topics — list unique topics with counts
	if (path === "/uspstf/topics") {
		const topics: Record<string, number> = {};
		for (const rec of uspstfRecommendations) {
			topics[rec.topic] = (topics[rec.topic] || 0) + 1;
		}
		return jsonResponse({ topics });
	}

	return errorResponse(`Unknown USPSTF path: ${path}`);
}

/**
 * Handle CDC routes from static data.
 */
function handleCdc(
	path: string,
	params?: Record<string, unknown>,
): { status: number; data: unknown } {
	// GET /cdc/schedule/child — child immunization schedule
	if (path === "/cdc/schedule/child") {
		let entries = childSchedule;
		if (params?.vaccine) {
			entries = filterScheduleByVaccine(entries, String(params.vaccine), [...childSchedule, ...adultSchedule, ...catchupSchedule]);
		}
		return jsonResponse({
			schedule: "child",
			ageRange: "Birth through 18 years",
			total: entries.length,
			entries,
		});
	}

	// GET /cdc/schedule/adult — adult immunization schedule
	if (path === "/cdc/schedule/adult") {
		let entries = adultSchedule;
		if (params?.vaccine) {
			entries = filterScheduleByVaccine(entries, String(params.vaccine), [...childSchedule, ...adultSchedule, ...catchupSchedule]);
		}
		return jsonResponse({
			schedule: "adult",
			ageRange: "19 years and older",
			total: entries.length,
			entries,
		});
	}

	// GET /cdc/schedule/catchup — catch-up schedule
	if (path === "/cdc/schedule/catchup") {
		let entries = catchupSchedule;
		if (params?.vaccine) {
			entries = filterScheduleByVaccine(entries, String(params.vaccine), [...childSchedule, ...adultSchedule, ...catchupSchedule]);
		}
		return jsonResponse({
			schedule: "catchup",
			description: "Selected catch-up summaries, primarily through age 18; the HPV family summary also includes catch-up through age 26. Use each row's age, product and history qualifications.",
			total: entries.length,
			entries,
		});
	}

	// Full rows preserve notes, contraindications and per-record source evidence.
	if (path === "/cdc/schedule/all") {
		return jsonResponse({
			child: { total: childSchedule.length, entries: childSchedule },
			adult: { total: adultSchedule.length, entries: adultSchedule },
			catchup: { total: catchupSchedule.length, entries: catchupSchedule },
		});
	}

	// GET /cdc/vaccines — list all vaccine info
	if (path === "/cdc/vaccines") {
		const allVaccines = getAllVaccines();
		return jsonResponse({
			total: allVaccines.length,
			vaccines: allVaccines,
		});
	}

	// GET /cdc/vaccines/{id} — specific vaccine info
	const vaccineMatch = path.match(/^\/cdc\/vaccines\/(.+)$/);
	if (vaccineMatch) {
		const matches = matchingVaccines(getAllVaccines(), decodeURIComponent(vaccineMatch[1]));
		if (matches.length > 1) return { status: 409, data: {
			error: "Ambiguous vaccine name; use an exact ID or abbreviation from /cdc/vaccines",
			candidates: matches.map(({ id, name, abbreviation }) => ({ id, name, abbreviation })),
		} };
		const vaccine = matches[0];
		if (vaccine) {
			const scheduleEntries = vaccineSchedules(vaccine, [...childSchedule, ...adultSchedule, ...catchupSchedule]);
			return jsonResponse({
				...vaccine,
				scheduleEntries,
				schedule_match_scope: "vaccine_family",
				schedule_coverage: "partial_bundle; matching rows do not establish product eligibility and missing rows do not establish ineligibility",
			});
		}
		return errorResponse(`Vaccine not found: ${vaccineMatch[1]}`);
	}

	return errorResponse(`Unknown CDC path: ${path}`);
}

/**
 * Preserve legacy routes with an explicit unavailable result, not placeholder HTML.
 */
function handleAhrq(): { status: number; data: unknown } {
	return { status: 503, data: { error: "AHRQ_REPOSITORY_OFFLINE", retryable: false, availability: ahrqAvailability() } };
}

/**
 * Create an ApiFetchFn that routes based on path prefix:
 * - /uspstf/* -> embedded static USPSTF data
 * - /cdc/*    -> embedded static CDC data
 * - /ahrq/*   -> explicit unavailable status; /ahrq/status describes why
 */
export function createGuidelinesApiFetch(): ApiFetchFn {
	return async (request) => {
		const { path, params } = request;
		if (request.method !== "GET") return errorResponse("Only GET is supported", 405);
		if (path === "/sources") return { status: 200, data: sourceRegistry() };
		if (path === "/ahrq/status") return { status: 200, data: ahrqAvailability() };

		if (path.startsWith("/uspstf/") || path === "/uspstf") {
			return handleUspstf(path, params);
		}

		if (path.startsWith("/cdc/") || path === "/cdc") {
			return handleCdc(path, params);
		}

		if (path.startsWith("/ahrq/") || path === "/ahrq") {
			return handleAhrq();
		}

		const error = new Error(`Unknown API path prefix: ${path}. Expected /uspstf/*, /cdc/*, or /ahrq/*`) as Error & {
			status: number;
			data: unknown;
		};
		error.status = 404;
		error.data = { error: error.message };
		throw error;
	};
}

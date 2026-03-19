/**
 * Clinical Guidelines API adapter — routes requests by path prefix
 * to the appropriate data source.
 *
 * /uspstf/* — Served from embedded USPSTF static data
 * /cdc/*    — Served from embedded CDC immunization schedule data
 * /ahrq/*   — Proxied to AHRQ CDS Connect API (limited)
 *
 * This is a multi-API adapter similar to ontology-hub's dual-API pattern.
 */

import type { ApiFetchFn } from "@bio-mcp/shared/codemode/catalog";
import {
	filterUspstfRecommendations,
	findUspstfRecommendation,
	uspstfRecommendations,
} from "./data/uspstf-recommendations";
import {
	getAllVaccines,
	findVaccine,
	filterScheduleByVaccine,
	childSchedule,
	adultSchedule,
	catchupSchedule,
} from "./data/cdc-immunization-schedule";
import { ahrqFetch } from "./http";

/**
 * Build a synthetic JSON Response from data.
 */
function jsonResponse(data: unknown, status = 200): { status: number; data: unknown } {
	return { status, data };
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
		const result = findUspstfRecommendation(decodeURIComponent(topicMatch[1]));
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
			entries = filterScheduleByVaccine(entries, String(params.vaccine));
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
			entries = filterScheduleByVaccine(entries, String(params.vaccine));
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
			entries = filterScheduleByVaccine(entries, String(params.vaccine));
		}
		return jsonResponse({
			schedule: "catchup",
			description: "Catch-up immunization schedule for persons aged 4 months through 18 years who start late or are more than 1 month behind",
			total: entries.length,
			entries,
		});
	}

	// GET /cdc/schedule/all — all schedules combined (compact to stay under 30KB staging threshold)
	if (path === "/cdc/schedule/all") {
		// Return summary counts + compact entries (without duplicating notes/contraindications)
		const compact = (entries: typeof childSchedule) =>
			entries.map(e => ({
				id: e.id,
				vaccine: e.vaccine,
				abbreviation: e.abbreviation,
				schedule: e.schedule,
				doseNumber: e.doseNumber,
				recommendedAge: e.recommendedAge,
			}));
		return jsonResponse({
			child: { total: childSchedule.length, entries: compact(childSchedule) },
			adult: { total: adultSchedule.length, entries: compact(adultSchedule) },
			catchup: { total: catchupSchedule.length, entries: compact(catchupSchedule) },
			_note: "Compact view — use /cdc/schedule/child, /adult, or /catchup for full details with notes and contraindications.",
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
		const vaccine = findVaccine(decodeURIComponent(vaccineMatch[1]));
		if (vaccine) {
			// Find schedule entries by both name and abbreviation to handle
			// cases where schedule uses "HPV" but vaccine.name is "Human Papillomavirus"
			const searchTerms = [vaccine.name, vaccine.abbreviation].filter(Boolean);
			const scheduleEntries = [
				...childSchedule,
				...adultSchedule,
				...catchupSchedule,
			].filter(e =>
				searchTerms.some(term =>
					e.vaccine.toLowerCase().includes(term.toLowerCase()) ||
					e.abbreviation.toLowerCase().includes(term.toLowerCase())
				)
			);
			return jsonResponse({
				...vaccine,
				scheduleEntries,
			});
		}
		return errorResponse(`Vaccine not found: ${vaccineMatch[1]}`);
	}

	return errorResponse(`Unknown CDC path: ${path}`);
}

/**
 * Handle AHRQ routes — proxied to live API.
 */
async function handleAhrq(
	path: string,
	params?: Record<string, unknown>,
): Promise<{ status: number; data: unknown }> {
	// Strip the /ahrq prefix to get the actual API path
	const apiPath = path.replace(/^\/ahrq/, "");

	try {
		const response = await ahrqFetch(apiPath, params);

		if (!response.ok) {
			let errorBody: string;
			try {
				errorBody = await response.text();
			} catch {
				errorBody = response.statusText;
			}
			return errorResponse(
				`AHRQ API error: HTTP ${response.status}: ${errorBody.slice(0, 200)}`,
				response.status,
			);
		}

		const contentType = response.headers.get("content-type") || "";
		if (!contentType.includes("json")) {
			const text = await response.text();
			return { status: response.status, data: text };
		}

		const data = await response.json();
		return { status: response.status, data };
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		return errorResponse(`AHRQ API request failed: ${msg}`, 502);
	}
}

/**
 * Create an ApiFetchFn that routes based on path prefix:
 * - /uspstf/* -> embedded static USPSTF data
 * - /cdc/*    -> embedded static CDC data
 * - /ahrq/*   -> proxied to AHRQ CDS Connect API
 */
export function createGuidelinesApiFetch(): ApiFetchFn {
	return async (request) => {
		const { path, params } = request;

		if (path.startsWith("/uspstf/") || path === "/uspstf") {
			return handleUspstf(path, params);
		}

		if (path.startsWith("/cdc/") || path === "/cdc") {
			return handleCdc(path, params);
		}

		if (path.startsWith("/ahrq/") || path === "/ahrq") {
			return handleAhrq(path, params);
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

/**
 * Clinical Guidelines HTTP client.
 *
 * For USPSTF and CDC data we serve from embedded static data.
 * This module provides a lightweight fetch wrapper for any future
 * live API endpoints (e.g., AHRQ CDS Connect).
 */

import { restFetch, type RestFetchOptions } from "@bio-mcp/shared/http/rest-fetch";

const AHRQ_BASE = "https://cds.ahrq.gov/cdsconnect/api";

export interface GuidelinesFetchOptions extends Omit<RestFetchOptions, "retryOn"> {
	baseUrl?: string;
}

/**
 * Fetch from the AHRQ CDS Connect API (for future use).
 * Currently a placeholder as the API has limited public access.
 */
export async function ahrqFetch(
	path: string,
	params?: Record<string, unknown>,
	opts?: GuidelinesFetchOptions,
): Promise<Response> {
	const baseUrl = opts?.baseUrl ?? AHRQ_BASE;
	const headers: Record<string, string> = {
		Accept: "application/json",
		...(opts?.headers ?? {}),
	};

	return restFetch(baseUrl, path, params, {
		...opts,
		headers,
		retryOn: [429, 500, 502, 503],
		retries: opts?.retries ?? 3,
		timeout: opts?.timeout ?? 30_000,
		userAgent:
			"clinical-guidelines-mcp-server/1.0 (bio-mcp; https://github.com/QuentinCody/clinical-guidelines-mcp-server)",
	});
}

/**
 * GuidelinesDataDO — Durable Object for staging large clinical guidelines responses.
 *
 * Extends RestStagingDO with schema hints for recommendations and immunization data.
 */

import { RestStagingDO } from "@bio-mcp/shared/staging/rest-staging-do";
import type { SchemaHints } from "@bio-mcp/shared/staging/schema-inference";

export class GuidelinesDataDO extends RestStagingDO {
	protected getSchemaHints(data: unknown): SchemaHints | undefined {
		if (!data || typeof data !== "object") return undefined;

		const obj = data as Record<string, unknown>;

		// USPSTF recommendations list
		if (Array.isArray(obj.recommendations)) {
			return {
				tableName: "recommendations",
				indexes: ["grade", "topic", "sex", "datePublished"],
			};
		}

		// CDC immunization schedule entries
		if (Array.isArray(obj.entries)) {
			const sample = obj.entries[0];
			if (sample && typeof sample === "object" && "vaccine" in sample) {
				return {
					tableName: "immunizations",
					indexes: ["vaccine", "abbreviation", "schedule", "doseNumber"],
				};
			}
		}

		// CDC vaccines list
		if (Array.isArray(obj.vaccines)) {
			return {
				tableName: "vaccines",
				indexes: ["abbreviation", "type"],
			};
		}

		// Combined schedules
		if (obj.child && obj.adult && obj.catchup) {
			return {
				tableName: "immunizations",
				indexes: ["vaccine", "schedule", "doseNumber"],
			};
		}

		// Single USPSTF recommendation (as object)
		if ("grade" in obj && "clinicalSummary" in obj) {
			return {
				tableName: "recommendations",
				indexes: ["grade", "topic"],
			};
		}

		// Array of entries at top level
		if (Array.isArray(data)) {
			const sample = data[0];
			if (sample && typeof sample === "object") {
				if ("grade" in sample && "clinicalSummary" in sample) {
					return {
						tableName: "recommendations",
						indexes: ["grade", "topic", "sex"],
					};
				}
				if ("vaccine" in sample && "doseNumber" in sample) {
					return {
						tableName: "immunizations",
						indexes: ["vaccine", "schedule", "doseNumber"],
					};
				}
			}
		}

		return undefined;
	}
}

export const VACCINE_NAMES_SOURCE = "https://www.cdc.gov/vaccines/hcp/vaccines-us/";
export const VACCINE_REVIEWED_ON = "2026-10-01";
const PNEUMO = "https://www.cdc.gov/pneumococcal/hcp/vaccine-recommendations/index.html";
const ZOSTER = "https://www.cdc.gov/shingles/hcp/vaccine-considerations/index.html";

interface VaccineReview {
  fields: string[];
  sources: string[];
  provider_updated_on: string;
}

// Reviewed family-level types and manufacturer examples, not complete product labels.
export const vaccineReviews: Record<string, VaccineReview> = Object.fromEntries(
  ["hepb", "rv", "dtap", "hib", "ipv", "pcv", "mmr", "var", "hepa", "tdap", "hpv", "menacwy", "menb", "flu", "covid", "rsv", "zoster", "ppsv", "menabcwy"]
    .map(id => [id, { fields: ["type", "manufacturer"], sources: [VACCINE_NAMES_SOURCE], provider_updated_on: "2026-07-21" }]),
);

function reviewed(id: string, fields: string[], sources: string[]) {
  vaccineReviews[id].fields.push(...fields);
  vaccineReviews[id].sources.push(...sources);
}
reviewed("pcv", ["abbreviation", "description"], [PNEUMO]);
reviewed("flu", ["abbreviation"], []);
reviewed("var", ["description"], ["https://www.cdc.gov/chickenpox/hcp/vaccine-considerations/index.html", ZOSTER]);
reviewed("zoster", ["description"], [ZOSTER]);
reviewed("ppsv", ["description"], [PNEUMO]);
reviewed("rsv", ["description"], [
  "https://www.cdc.gov/rsv/hcp/vaccine-clinical-guidance/adults.html",
  "https://www.cdc.gov/rsv/hcp/vaccine-clinical-guidance/pregnant-people.html",
]);
reviewed("menabcwy", ["name", "abbreviation", "diseasePrevented", "description"], [
  "https://www.cdc.gov/meningococcal/hcp/vaccine-recommendations/index.html",
]);

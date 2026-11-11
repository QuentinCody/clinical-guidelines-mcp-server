import { reviewedRecord, reviewedValueMatches } from "./reviewed-values";
import type { FieldReview } from "./schedule-review";
import { VACCINE_NAMES_SOURCE, vaccineReviews } from "./vaccine-review";

export const CONTENT_REVIEWED_ON = "2026-10-04";
const CHILD = "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-notes.html";
const CATCHUP = "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-catch-up.html";
const ADULT = "https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-notes.html";
const notes = new Set([
  "child-rv-2", "child-dtap-1", "child-dtap-2", "child-dtap-3", "child-dtap-5",
  "child-ipv-4", "child-pcv-1", "child-pcv-2", "child-pcv-3", "child-pcv-4",
]);
const vaccineSources: Record<string, string> = {
  hepb: "https://www.cdc.gov/hepatitis-b/about/index.html",
  rv: "https://www.cdc.gov/rotavirus/about/index.html",
  hib: "https://www.cdc.gov/hi-disease/about/index.html",
  ipv: "https://www.cdc.gov/polio/about/index.html",
  pcv: "https://www.cdc.gov/pneumococcal/about/index.html",
  hepa: "https://www.cdc.gov/hepatitis-a/about/index.html",
  tdap: ADULT,
  hpv: "https://www.cdc.gov/hpv/about/index.html",
  menacwy: "https://www.cdc.gov/meningococcal/vaccines/index.html",
  menb: "https://www.cdc.gov/meningococcal/vaccines/index.html",
  flu: "https://www.cdc.gov/flu/hcp/vax-summary/seasonal-influenza-vaccines.html",
  covid: "https://www.cdc.gov/covid/vaccines/benefits.html",
  rsv: "https://www.cdc.gov/rsv/hcp/vaccine-clinical-guidance/adults.html",
  zoster: "https://www.cdc.gov/shingles/vaccines/index.html",
  ppsv: "https://www.cdc.gov/pneumococcal/about/index.html",
};

/** Supplemental review only. Earlier scopes keep their original review dates. */
export function contentFieldReviews(record: Record<string, unknown>): Record<string, FieldReview> {
  const expected = reviewedRecord(record);
  if (!expected) return {};
  const id = String(record.id);
  const fields: Record<string, FieldReview> = {};
  const add = (names: string[], source_urls: string[], scope: string) => {
    for (const field of names) if (reviewedValueMatches(record, field)) fields[field] = {
      reviewed_on: CONTENT_REVIEWED_ON, source_urls, scope,
    };
  };
  if (typeof expected.url === "string") {
    add(["riskFactors"], [expected.url], "Selected examples and qualifications, not exhaustive risk assessment or executable eligibility logic; an empty list means no examples are enumerated.");
    add(["sex", "topic"], [expected.url], "Local navigation labels checked for consistency with the source population/topic; not provider taxonomy, patient eligibility or gender identity.");
    if (["uspstf-breast-cancer-screening", "uspstf-cervical-cancer-screening"].includes(id)) {
      add(["population", "clinicalSummary"], [expected.url], "Summary applicability and exclusions; read the complete final statement.");
    }
  } else if (expected.schedule) {
    if (notes.has(id)) add(["notes"], [CHILD, CATCHUP, VACCINE_NAMES_SOURCE], "Selected schedule note; combination-product licensure and routine dose recommendations are distinct.");
    if (id === "adult-rsv-1") add(["contraindications"], ["https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-appendix.html"], "Selected severe allergy summary; precautions and full product labeling remain separate.");
  } else {
    const existing = Object.prototype.hasOwnProperty.call(vaccineReviews, id) ? vaccineReviews[id].fields : [];
    const sources = [VACCINE_NAMES_SOURCE];
    if (Object.prototype.hasOwnProperty.call(vaccineSources, id)) sources.push(vaccineSources[id]);
    if (id === "covid") sources.push("https://www.cdc.gov/covid/hcp/vaccine-considerations/routine-guidance.html");
    add(["name", "abbreviation", "diseasePrevented", "description"].filter(field => !existing.includes(field)), sources,
      "Family-level inventory labels and selected disease/description examples; not exhaustive indications, product eligibility or a guarantee of protection.");
  }
  return fields;
}

export function contentFieldSemantics(record: Record<string, unknown>) {
  if (!reviewedRecord(record)) return undefined;
  if (typeof record.url === "string") return {
    sex: "Local navigation label. All includes anatomy-, assigned-sex-at-birth- and pregnancy-based populations across gender identities; it does not mean everyone is eligible. Use population and the source statement.",
    topic: "Local browsing category, not provider-authored taxonomy.",
    riskFactors: "Selected examples only. Empty means not enumerated, not absence of risk or eligibility conditions. Read conjunctions, population and source exclusions; this array is not Boolean clinical logic.",
  };
  if (!record.schedule) return {
    name: "Local vaccine-family label; products and combinations have separate indications.",
    abbreviation: "Family abbreviations grouped for navigation, not a product identifier or licensure claim.",
    diseasePrevented: "Selected disease examples; not exhaustive product indications or a guarantee of protection.",
    manufacturer: "Manufacturer/product examples; Multiple is a family placeholder, not a manufacturer name or complete inventory.",
  };
  return undefined;
}

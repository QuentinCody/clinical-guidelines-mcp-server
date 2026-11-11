import { reviewedFollowupValues, reviewedScheduleValues, SCHEDULE_REVIEW_FIELDS } from "./schedule-review-values";

export const SCHEDULE_REVIEWED_ON = "2026-10-04";
const CHILD = "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-notes.html";
const ADULT = "https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-notes.html";
const CATCHUP = "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-catch-up.html";
const AGE = "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-age.html";
const TIMING = "https://www.cdc.gov/vaccines/hcp/imz-best-practices/timing-spacing-immunobiologics.html";
const FLU = "https://www.cdc.gov/flu/hcp/vax-summary/seasonal-influenza-vaccines.html";
const COVID = "https://www.cdc.gov/covid/hcp/vaccine-considerations/routine-guidance.html";
const COVID_ALLERGY = "https://www.cdc.gov/covid/hcp/vaccine-considerations/contraindications-precautions.html";

export interface FieldReview {
  reviewed_on: string;
  source_urls: string[];
  provider_updated_on?: string;
  scope?: string;
}

function sourcesFor(id: string, field: string): FieldReview {
  const base = { reviewed_on: SCHEDULE_REVIEWED_ON,
    scope: "Selected summary fields only; not complete eligibility, product labeling or executable dosing logic." };
  if (id.includes("-covid-")) return { ...base, provider_updated_on: "2026-09-23", source_urls: [field === "contraindications" ? COVID_ALLERGY : COVID] };
  if (id.includes("-flu-")) return { ...base, provider_updated_on: "2026-09-01", source_urls: [FLU] };
  if (id === "adult-rsv-1") return { ...base, source_urls: [
    "https://www.cdc.gov/rsv/hcp/vaccine-clinical-guidance/adults.html",
    "https://www.cdc.gov/rsv/hcp/vaccine-clinical-guidance/pregnant-people.html",
  ] };
  return { ...base, source_urls: id.startsWith("adult-") ? [ADULT] : [CHILD, AGE, CATCHUP, TIMING] };
}

/** Superseded fields never fall back to older evidence after a value is edited or removed. */
export function scheduleFieldReviews(record: Record<string, unknown>) {
  const id = typeof record.id === "string" ? record.id : "";
  const values = Object.prototype.hasOwnProperty.call(reviewedScheduleValues, id) ? reviewedScheduleValues[id] : undefined;
  const followup = Object.prototype.hasOwnProperty.call(reviewedFollowupValues, id) ? reviewedFollowupValues[id] : undefined;
  const expected = { ...Object.fromEntries(values ? SCHEDULE_REVIEW_FIELDS.map((field, index) => [field, values[index]]) : []), ...followup };
  const validSchedule = record.schedule === id.split("-")[0];
  const field_reviews: Record<string, FieldReview> = {};
  for (const [field, value] of Object.entries(expected)) {
    if (validSchedule && JSON.stringify(record[field]) === JSON.stringify(value)) field_reviews[field] = sourcesFor(id, field);
  }
  return { superseded_fields: Object.keys(expected), field_reviews };
}

export function scheduleReviewRegistry() {
  return { reviewed_on: SCHEDULE_REVIEWED_ON, reviewed_record_ids: Object.keys(reviewedScheduleValues),
    fields: SCHEDULE_REVIEW_FIELDS, value_pinned: true,
    scope: "Timing, family labels and row semantics for existing summary rows; selected follow-up notes and contraindications are listed per record. Other fields retain their own review status.",
    source_urls: [CHILD, ADULT, CATCHUP, AGE, TIMING, FLU, COVID, COVID_ALLERGY,
      "https://www.cdc.gov/rsv/hcp/vaccine-clinical-guidance/adults.html",
      "https://www.cdc.gov/rsv/hcp/vaccine-clinical-guidance/pregnant-people.html"],
  };
}

export function scheduleFieldSemantics(record: Record<string, unknown>) {
  if (!["child", "adult", "catchup"].includes(String(record.schedule))) return undefined;
  return {
    doseNumber: "Routine dose ordinal or summary-row marker. Adult, catch-up and seasonal rows summarize regimens; 1 does not mean a one-dose course. Hib rows include alternative products, not cumulative doses.",
    minAge: "Read with the regimen and notes. Adult summary age bounds are not product licensure ages; maternal RSV timing is gestational age. Combination products must satisfy every component's requirements.",
    minInterval: "Read with age, product, history and notes. N/A means no preceding dose in this row, not that all intervals are unrestricted. Planned and retrospectively accepted intervals can differ.",
    catchupAge: "N/A means catch-up is not summarized in this row, not ineligibility. Some family summaries link beyond the child schedule's age range.",
  };
}

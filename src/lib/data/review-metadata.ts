import { contraindicationReview, reviewedContraindications, CONTRAINDICATION_REVIEWED_ON, CHILD_APPENDIX, ADULT_APPENDIX } from "./contraindication-review";
import { CHILD_REVIEWED_ON, childReviews } from "./child-review";
import { ADULT_REVIEWED_ON, adultReviews, CDC_FLU_GUIDANCE } from "./adult-review";
import { VACCINE_NAMES_SOURCE, VACCINE_REVIEWED_ON, vaccineReviews } from "./vaccine-review";
import { scheduleFieldReviews, scheduleFieldSemantics, scheduleReviewRegistry, type FieldReview } from "./schedule-review";
import { CONTENT_REVIEWED_ON, contentFieldReviews, contentFieldSemantics } from "./content-review";
import { reviewedRecord, reviewedValueMatches } from "./reviewed-values";

export const BUNDLE_REVISION = "2026-10-04";
const REVIEWED_ON = "2026-09-29";
const CDC_NOTES = "https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-notes.html";
const CDC_COVID = "https://www.cdc.gov/covid/hcp/vaccine-considerations/routine-guidance.html";
const USPSTF = "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation-topics";

// Observed final statements, not draft/research-plan publication dates.
const finalStatementDates: Record<string, string> = {
	"uspstf-breast-cancer-screening": "2024-04-30",
	"uspstf-cervical-cancer-screening": "2018-08-21",
	"uspstf-colorectal-cancer-screening": "2021-05-18",
	"uspstf-colorectal-cancer-screening-45-49": "2021-05-18",
	"uspstf-colorectal-cancer-screening-76-85": "2021-05-18",
	"uspstf-lung-cancer-screening": "2021-03-09",
	"uspstf-skin-cancer-prevention-counseling": "2018-03-20",
	"uspstf-hypertension-screening": "2021-04-27",
	"uspstf-statin-use-cvd-prevention": "2022-08-23",
	"uspstf-abdominal-aortic-aneurysm-screening": "2019-12-10",
	"uspstf-aspirin-preeclampsia-prevention": "2021-09-28",
	"uspstf-diabetes-screening": "2021-08-24",
	"uspstf-depression-screening-adults": "2023-06-20",
	"uspstf-anxiety-screening": "2023-06-20",
	"uspstf-hepatitis-b-screening": "2020-12-15",
	"uspstf-hepatitis-c-screening": "2020-03-02",
	"uspstf-hiv-screening": "2019-06-11",
	"uspstf-sti-counseling": "2020-08-18",
	"uspstf-folic-acid-supplementation": "2023-08-01",
	"uspstf-tobacco-cessation": "2021-01-19",
	"uspstf-obesity-weight-management": "2018-09-18",
	"uspstf-osteoporosis-screening": "2025-01-14",
	"uspstf-vision-screening-children": "2017-09-05",
	"uspstf-gestational-diabetes-screening": "2021-08-10",
	"uspstf-preeclampsia-screening": "2023-09-19",
	"uspstf-unhealthy-drug-use-screening": "2020-06-09",
	"uspstf-unhealthy-alcohol-use-screening": "2018-11-13",
};
const USPSTF_REVIEW_FIELDS = ["title", "grade", "population", "ageRange", "clinicalSummary", "datePublished", "url"];
const updateNotices = new Set([
	"uspstf-cervical-cancer-screening", "uspstf-hiv-screening", "uspstf-sti-counseling",
	"uspstf-tobacco-cessation", "uspstf-obesity-weight-management",
	"uspstf-vision-screening-children", "uspstf-unhealthy-alcohol-use-screening",
]);
const reviewedFields: Record<string, string[]> = {
	"adult-covid-annual": ["minInterval", "notes"],
	"adult-mmr-1": ["minInterval", "notes"],
	"adult-var-1": ["notes"],
	"adult-zoster-1": ["recommendedAge", "minInterval", "notes", "contraindications"],
	"adult-hpv-1": ["notes", "contraindications"],
	"adult-hepb-1": ["recommendedAge", "notes"],
	"adult-menacwy-1": ["catchupAge", "notes"],
	"adult-pneumo-1": ["abbreviation", "recommendedAge", "minAge", "minInterval", "notes"],
	"adult-rsv-1": ["recommendedAge", "minAge", "minInterval", "notes"],
};
const cdcRecordSources: Record<string, string[]> = {
	"adult-covid-annual": [CDC_COVID],
	"adult-zoster-1": [CDC_NOTES, "https://www.cdc.gov/shingles/hcp/vaccine-considerations/immunocompromised-adults.html"],
	"adult-hpv-1": ["https://www.cdc.gov/hpv/hcp/vaccination-considerations/index.html", CDC_NOTES],
	"adult-hepb-1": ["https://www.cdc.gov/hepatitis-b/hcp/vaccine-administration/index.html", CDC_NOTES],
};

export function sourceRegistry() {
	return {
		bundle_revision: BUNDLE_REVISION,
		content_kind: "curated_summary_subset",
		complete_provider_dataset: false,
		automatic_refresh: false,
		executable_clinical_logic: false,
		collection_review_status: "partial",
		field_review_policy: "Every field review requires an exact independently pinned value; schedule identity and USPSTF publication URL/date must also match. Missing or changed fields do not inherit earlier evidence.",
		supplemental_content_review: { reviewed_on: CONTENT_REVIEWED_ON,
			scope: "Remaining bundled schedule notes/allergy summary, vaccine-family labels/descriptions and USPSTF navigation/risk examples; per-record field_reviews define exact scope and dates.",
			local_labels_are_not_clinical_eligibility: true },
		reviewed_record_ids: [...new Set([...Object.keys(finalStatementDates), ...Object.keys(reviewedFields), ...Object.keys(childReviews), ...Object.keys(adultReviews), ...Object.keys(vaccineReviews), ...Object.keys(reviewedContraindications)])],
		sources: {
			uspstf: { url: USPSTF, publication_date: "per record; not the bundle revision",
				review_scope: USPSTF_REVIEW_FIELDS, reviewed_on: REVIEWED_ON,
				all_provider_recommendations_included: false },
			cdc: { url: "https://www.cdc.gov/vaccines/hcp/imz-schedules/", notes_url: CDC_NOTES,
				vaccine_inventory: { url: VACCINE_NAMES_SOURCE, provider_updated_on: "2026-07-21", observed_on: VACCINE_REVIEWED_ON,
					scope: "family-level types and manufacturer examples; selected descriptions; not complete product labels or eligibility rules" },
				observed_schedule_label: "2025; addendum July 2, 2025", observed_on: REVIEWED_ON,
				influenza_guidance: { url: CDC_FLU_GUIDANCE, observed_season: "2026-2027", observed_on: ADULT_REVIEWED_ON, provider_updated_on: "2026-09-01", status: "interim_clinical_considerations" },
				covid_guidance: { url: CDC_COVID, observed_season: "2026-2027", provider_updated_on: "2026-09-23",
					table_heading_date: "2025-11-04", date_discrepancy: "The table heading retains an older date than the page update and season label." },
				contraindications_are_exhaustive: false,
				schedule_field_review: scheduleReviewRegistry(),
				contraindication_review: { fields: ["contraindications"], reviewed_on: CONTRAINDICATION_REVIEWED_ON,
					source_urls: [CHILD_APPENDIX, ADULT_APPENDIX], provider_updated_on: "2025-07-02",
					reviewed_record_ids: Object.keys(reviewedContraindications), scope: "selected summaries; precautions and complete product labels remain separate" },
				label_is_not_full_bundle_validation: true },
			ahrq: ahrqAvailability(),
		},
	};
}

export function ahrqAvailability() {
	return {
		status: "provider_reported_offline", executable: false, retrieval_enabled: false,
		offline_since: "2025-04-28", reviewed_on: "2026-10-02",
		provider_url: "https://cds.ahrq.gov/",
		notice_url: "https://digital.ahrq.gov/ahrq-funded-projects/patient-centered-outcomes-research-clinical-decision-support-cds-connect",
		api_documentation: "https://github.com/AHRQ-CDS/AHRQ-CDS-Connect-API",
		api_documentation_scope: "historical Drupal source; not a current public service contract",
		successor: {
			name: "CDS Connect Community Edition",
			url: "https://confluence.hl7.org/spaces/CDS/pages/358255205/CDS+Connect+Community+Edition",
			authoring_tools: { name: "CQL Studio", url: "https://cqlstudio.com/" },
			public_api_status: "unverified", retrieval_enabled: false, executable: false,
		},
		detail: "AHRQ reports that the CDS Connect Repository and Authoring tool went offline on April 28, 2025. Its project page retains publications and implementation guides and links to further development through HL7. No public successor artifact API or execution service has been validated for this adapter.",
	};
}

interface ReviewEvidence {
	fields?: string[];
	sources?: string[];
	reviewed_on?: string;
	provider_updated_on?: string;
	recommendation_status?: "final";
	update_notice?: "update_in_progress";
}

function own<T>(values: Record<string, T>, id: string): T | undefined {
	return Object.prototype.hasOwnProperty.call(values, id) ? values[id] : undefined;
}

function recordReview(record: Record<string, unknown>, id: string): ReviewEvidence {
	const vaccine = own(vaccineReviews, id);
	const adult = own(adultReviews, id);
	const child = own(childReviews, id);
	if (vaccine) return { ...vaccine, reviewed_on: VACCINE_REVIEWED_ON };
	if (adult) return { ...adult, reviewed_on: ADULT_REVIEWED_ON };
	if (child) return { ...child, reviewed_on: child.reviewed_on ?? CHILD_REVIEWED_ON };
	const date = own(finalStatementDates, id);
	if (!date) return { fields: own(reviewedFields, id) };
	if (record.datePublished !== date || !reviewedRecord(record)) return {};
	return { fields: USPSTF_REVIEW_FIELDS, recommendation_status: "final",
		update_notice: updateNotices.has(id) ? "update_in_progress" : undefined };
}

/** Preserve existing shapes while attaching field-scoped review evidence to records. */
export function annotateRecords(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(annotateRecords);
	if (!value || typeof value !== "object") return value;
	const record = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, annotateRecords(item)]));
	if (typeof record.id !== "string") return record;
	const review = recordReview(record, record.id);
	const additional = contraindicationReview(record);
	const sources = review.sources ?? own(cdcRecordSources, record.id);
	const sourceUrl = typeof record.url === "string" ? record.url : sources?.[0]
		?? (!review.fields ? additional?.source_urls[0] : undefined)
		?? (record.schedule === "adult" || record.id === "rsv" ? CDC_NOTES
			: "https://www.cdc.gov/vaccines/hcp/imz-schedules/");
	const fieldReviews: Record<string, FieldReview> = Object.fromEntries((review.fields ?? []).filter(field => field.split("[")[0] in record).map(field => [field, {
		reviewed_on: review.reviewed_on ?? REVIEWED_ON, source_urls: sources ?? [sourceUrl],
	}]));
	if (additional) fieldReviews.contraindications = additional;
	return annotateReviewedFields(record, fieldReviews, sourceUrl, sources, review);
}

function annotateReviewedFields(record: { [k: string]: unknown; }, fieldReviews: Record<string, FieldReview>, sourceUrl: string, sources: string[] | undefined, review: ReviewEvidence) {
  const schedule = scheduleFieldReviews(record);
  for (const field of schedule.superseded_fields) delete fieldReviews[field];
  Object.assign(fieldReviews, schedule.field_reviews);
  Object.assign(fieldReviews, contentFieldReviews(record));
  for (const field of Object.keys(fieldReviews)) {
    if (!reviewedValueMatches(record, field)) delete fieldReviews[field];
  }
  const fields = Object.keys(fieldReviews);
  const latestReviewedOn = fields.length ? Object.values(fieldReviews).map(evidence => evidence.reviewed_on).sort().slice(-1)[0] : null;
  return {
    ...record, _source: {
      source_url: sourceUrl, bundle_revision: BUNDLE_REVISION,
      source_urls: [...new Set([...(sources ?? [sourceUrl]), ...Object.values(fieldReviews).flatMap(evidence => evidence.source_urls)])],
      provider_updated_on: review.provider_updated_on ?? (record.id === "adult-covid-annual" ? "2026-09-23" : undefined),
      provider_publication_date: record.datePublished ?? null,
      recommendation_status: review.recommendation_status,
      update_notice: review.update_notice,
      review_status: fields.length ? "selected_fields_reviewed" : "not_reviewed",
      reviewed_on: latestReviewedOn,
      field_reviews: fieldReviews,
      field_semantics: scheduleFieldSemantics(record) ?? contentFieldSemantics(record),
      reviewed_fields: fields,
      unreviewed_fields: Object.keys(record).filter(field => !["id", "schedule"].includes(field) && !field.startsWith("_") && !fields.includes(field)),
      executable: false,
    }
  };
}

export function withSourceMetadata(data: unknown) {
	const annotated = annotateRecords(data);
	return { ...(annotated as Record<string, unknown>), _source_metadata: sourceRegistry() };
}

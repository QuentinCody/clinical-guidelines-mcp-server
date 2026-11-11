const NOTES = "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-notes.html";
const CATCHUP = "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-catch-up.html";
const APPENDIX = "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-appendix.html";
const HIB = "https://www.cdc.gov/hi-disease/hcp/vaccine-recommendations/index.html";
const HPV = "https://www.cdc.gov/hpv/hcp/vaccination-considerations/index.html";
const HIB_FIELDS = ["doseNumber", "recommendedAge", "minAge", "minInterval", "catchupAge", "notes", "contraindications"];

interface ChildReview {
	fields: string[];
	sources: string[];
	provider_updated_on?: string;
	reviewed_on?: string;
}

export const CHILD_REVIEWED_ON = "2026-09-30";
export const childReviews: Record<string, ChildReview> = {
	"child-hepb-2": { fields: ["recommendedAge", "notes"], sources: [NOTES, CATCHUP], reviewed_on: "2026-10-02" },
	"child-hepb-3": { fields: ["notes"], sources: [NOTES, CATCHUP], reviewed_on: "2026-10-02" },
	"child-rv-1": { fields: ["notes"], sources: [NOTES, CATCHUP], reviewed_on: "2026-10-02" },
	"child-rv-2": { fields: ["catchupAge"], sources: [NOTES, CATCHUP], reviewed_on: "2026-10-02" },
	"child-rv-3": { fields: ["catchupAge", "notes"], sources: [NOTES, CATCHUP], reviewed_on: "2026-10-02" },
	"child-dtap-4": { fields: ["notes"], sources: [NOTES], reviewed_on: "2026-10-02" },
	"child-ipv-3": { fields: ["minInterval", "notes"], sources: [NOTES, CATCHUP, "https://www.cdc.gov/polio/hcp/vaccine-considerations/index.html"], reviewed_on: "2026-10-02" },
	"child-mmr-1": { fields: ["notes"], sources: [NOTES], reviewed_on: "2026-10-02" },
	"child-mmr-2": { fields: ["minAge", "minInterval", "notes"], sources: [NOTES, CATCHUP], reviewed_on: "2026-10-02" },
	"catchup-mmr": { fields: ["minInterval", "notes"], sources: [NOTES, CATCHUP], reviewed_on: "2026-10-02" },
	"child-var-1": { fields: ["notes"], sources: ["https://www.cdc.gov/chickenpox/hcp/vaccine-considerations/index.html"], reviewed_on: "2026-10-02" },
	"child-var-2": { fields: ["minInterval", "notes"], sources: [NOTES, CATCHUP], reviewed_on: "2026-10-02" },
	"catchup-var": { fields: ["notes"], sources: [NOTES, CATCHUP], reviewed_on: "2026-10-02" },
	"child-hepa-1": { fields: ["notes"], sources: [NOTES], reviewed_on: "2026-10-02" },
	"child-hepa-2": { fields: ["recommendedAge", "notes"], sources: [NOTES, CATCHUP], reviewed_on: "2026-10-02" },
	"child-menacwy-2": { fields: ["notes"], sources: [NOTES, "https://www.cdc.gov/meningococcal/hcp/vaccine-recommendations/index.html"], reviewed_on: "2026-10-02" },
	"child-hepb-1": { fields: ["recommendedAge", "notes"], sources: [NOTES, "https://www.cdc.gov/hepatitis-b/hcp/perinatal-provider-overview/vaccine-administration.html"], provider_updated_on: "2025-07-02", reviewed_on: "2026-10-01" },
	"child-hib-1": { fields: ["notes"], sources: [HIB] },
	"child-hib-2": { fields: ["notes"], sources: [HIB, "https://www.cdc.gov/mmwr/volumes/69/wr/mm6905a5.htm"] },
	"child-hib-3": { fields: ["notes"], sources: [HIB] },
	"child-hib-primary-3": { fields: HIB_FIELDS, sources: [HIB, CATCHUP, APPENDIX, "https://www.cdc.gov/mmwr/volumes/69/wr/mm6905a5.htm"] },
	"child-hib-4": { fields: HIB_FIELDS, sources: [HIB, CATCHUP, APPENDIX] },
	"child-pcv-1": { fields: ["abbreviation"], sources: [NOTES] },
	"child-pcv-2": { fields: ["abbreviation"], sources: [NOTES] },
	"child-pcv-3": { fields: ["abbreviation"], sources: [NOTES] },
	"child-pcv-4": { fields: ["abbreviation"], sources: [NOTES] },
	"child-tdap-1": { fields: ["minAge"], sources: [NOTES] },
	"child-hpv-1": { fields: ["notes", "contraindications"], sources: [HPV, NOTES] },
	"catchup-hpv": { fields: ["minInterval", "notes", "contraindications"], sources: [HPV, NOTES] },
	"catchup-dtap": { fields: ["vaccine", "abbreviation", "minInterval", "notes", "contraindications[1]"], sources: [NOTES, CATCHUP, APPENDIX] },
	"catchup-ipv": { fields: ["minInterval", "notes"], sources: [CATCHUP] },
	"child-flu-annual": { fields: ["abbreviation", "minInterval", "notes"], sources: ["https://www.cdc.gov/flu/hcp/vax-summary/seasonal-influenza-vaccines.html"], provider_updated_on: "2026-09-01" },
	"child-covid-annual": { fields: ["minInterval", "notes"], sources: ["https://www.cdc.gov/covid/hcp/vaccine-considerations/routine-guidance.html"], provider_updated_on: "2026-09-23" },
};

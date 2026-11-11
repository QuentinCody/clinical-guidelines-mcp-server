const NOTES = "https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-notes.html";
const APPENDIX = "https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-appendix.html";
export const CDC_FLU_GUIDANCE = "https://www.cdc.gov/flu/hcp/vax-summary/seasonal-influenza-vaccines.html";
export const ADULT_REVIEWED_ON = "2026-10-01";

interface AdultReview {
  fields: string[];
  sources: string[];
  provider_updated_on: string;
}

/** Field-scoped follow-up; this does not certify the full adult schedule. */
export const adultReviews: Record<string, AdultReview> = {
  "adult-flu-annual": {
    fields: ["recommendedAge", "minInterval", "notes", "contraindications"],
    sources: [CDC_FLU_GUIDANCE, "https://www.cdc.gov/flu/hcp/vax-summary/index.html"],
    provider_updated_on: "2026-09-01",
  },
  "adult-hepa-1": {
    fields: ["recommendedAge", "minInterval", "notes", "contraindications"],
    sources: [NOTES, "https://www.cdc.gov/hepatitis-a/hcp/vaccine-administration/index.html", APPENDIX],
    provider_updated_on: "2025-07-02",
  },
  "adult-tdap-1": {
    fields: ["minInterval", "catchupAge", "notes", "contraindications[1]"],
    sources: [NOTES, APPENDIX],
    provider_updated_on: "2025-07-02",
  },
};

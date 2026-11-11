export const CONTRAINDICATION_REVIEWED_ON = "2026-10-01";
export const CHILD_APPENDIX = "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-appendix.html";
export const ADULT_APPENDIX = "https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-appendix.html";

// Source-scoped summaries, not an exhaustive product label or clinical decision rule.
const groups: Array<{ ids: string[]; values: string[] }> = [
  { ids: ["child-hepb-1", "child-hepb-2", "child-hepb-3", "adult-hepb-1", "catchup-hepb"],
    values: ["Severe allergic reaction after a prior dose or to a component of the selected vaccine (including yeast)"] },
  { ids: ["child-rv-1", "child-rv-2", "child-rv-3"],
    values: ["Severe allergic reaction after a prior dose or to a component of the selected vaccine", "Severe combined immunodeficiency (SCID)", "Previous intussusception"] },
  { ids: ["child-dtap-1", "child-dtap-2", "child-dtap-3", "child-dtap-4", "child-dtap-5"],
    values: ["Severe allergic reaction after a prior dose or to a component of the selected vaccine", "Unexplained encephalopathy within 7 days after DTP or DTaP"] },
  { ids: ["child-tdap-1", "adult-tdap-1", "catchup-dtap"],
    values: ["Severe allergic reaction after a prior dose or to a component of the selected vaccine", "Tdap only: unexplained encephalopathy within 7 days after DTP, DTaP or Tdap"] },
  { ids: ["child-hib-1", "child-hib-2", "child-hib-primary-3", "child-hib-3", "child-hib-4"],
    values: ["Severe allergic reaction after a prior dose or to a component of the selected vaccine", "Age younger than 6 weeks"] },
  { ids: ["child-ipv-1", "child-ipv-2", "child-ipv-3", "child-ipv-4", "catchup-ipv"],
    values: ["Severe allergic reaction after a prior dose or to a component of the selected vaccine"] },
  { ids: ["child-pcv-1", "child-pcv-2", "child-pcv-3", "child-pcv-4"],
    values: ["Severe allergic reaction after a prior dose or to a component of the selected vaccine", "Severe allergic reaction to a diphtheria-toxoid vaccine or its ingredients"] },
  { ids: ["adult-pneumo-1"],
    values: ["Severe allergic reaction after a prior dose or to a component of the selected vaccine", "PCV only: severe allergic reaction to a diphtheria-toxoid vaccine or its ingredients"] },
  { ids: ["child-mmr-1", "child-mmr-2", "adult-mmr-1", "catchup-mmr", "child-var-1", "child-var-2", "adult-var-1", "catchup-var"],
    values: ["Severe allergic reaction after a prior dose or to a component of the selected vaccine", "Pregnancy", "Severe immunodeficiency", "Family history of impaired immunity unless the recipient is confirmed immunocompetent"] },
  { ids: ["child-hepa-1", "child-hepa-2"],
    values: ["Severe allergic reaction after a prior dose or to a component of the selected vaccine (including neomycin)"] },
  { ids: ["child-menacwy-1", "child-menacwy-2", "adult-menacwy-1"],
    values: ["Severe allergic reaction after a prior dose or to a component of the selected vaccine", "Menveo only: severe allergic reaction to a vaccine containing diphtheria toxoid or CRM197", "MenQuadfi only: severe allergic reaction to a tetanus-toxoid vaccine"] },
];

export const reviewedContraindications: Record<string, string[]> = Object.fromEntries(
  groups.flatMap(group => group.ids.map(id => [id, [...group.values]])),
);

/** Only the reviewed field value inherits evidence; new IDs or edited values do not. */
export function contraindicationReview(record: Record<string, unknown>) {
  const values = typeof record.id === "string" ? reviewedContraindications[record.id] : undefined;
  if (!Array.isArray(values) || JSON.stringify(values) !== JSON.stringify(record.contraindications)) return undefined;
  return {
    reviewed_on: CONTRAINDICATION_REVIEWED_ON, provider_updated_on: "2025-07-02",
    source_urls: [String(record.id).startsWith("adult-") ? ADULT_APPENDIX : CHILD_APPENDIX],
    scope: "Selected contraindication summaries only; precautions and product eligibility require separate review. Not exhaustive or executable clinical logic.",
  };
}

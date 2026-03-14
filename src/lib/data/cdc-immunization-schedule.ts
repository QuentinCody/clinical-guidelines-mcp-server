/**
 * CDC Immunization Schedules — embedded static data.
 *
 * Source: https://www.cdc.gov/vaccines/schedules/
 * Based on ACIP (Advisory Committee on Immunization Practices) recommendations.
 * Last updated: 2026-03.
 *
 * Covers child (birth-18), adult (19+), and catch-up schedules.
 */

export interface VaccineInfo {
	id: string;
	name: string;
	abbreviation: string;
	diseasePrevented: string[];
	type: string;
	manufacturer: string[];
	description: string;
}

export interface ImmunizationEntry {
	id: string;
	vaccine: string;
	abbreviation: string;
	schedule: "child" | "adult" | "catchup";
	doseNumber: number;
	recommendedAge: string;
	minAge: string;
	minInterval: string;
	catchupAge: string;
	notes: string;
	contraindications: string[];
}

export const vaccines: VaccineInfo[] = [
	{
		id: "hepb",
		name: "Hepatitis B",
		abbreviation: "HepB",
		diseasePrevented: ["Hepatitis B"],
		type: "Inactivated",
		manufacturer: ["Merck", "GSK", "Dynavax"],
		description:
			"Protects against hepatitis B virus infection that can cause chronic liver disease and liver cancer.",
	},
	{
		id: "rv",
		name: "Rotavirus",
		abbreviation: "RV",
		diseasePrevented: ["Rotavirus gastroenteritis"],
		type: "Live attenuated",
		manufacturer: ["Merck (RotaTeq)", "GSK (Rotarix)"],
		description:
			"Protects against rotavirus, the most common cause of severe diarrhea in infants and young children.",
	},
	{
		id: "dtap",
		name: "Diphtheria, Tetanus, Pertussis (DTaP)",
		abbreviation: "DTaP",
		diseasePrevented: ["Diphtheria", "Tetanus", "Pertussis"],
		type: "Inactivated/Toxoid",
		manufacturer: ["Sanofi Pasteur", "GSK"],
		description:
			"Protects against diphtheria, tetanus (lockjaw), and pertussis (whooping cough). Given to children under 7.",
	},
	{
		id: "hib",
		name: "Haemophilus influenzae type b",
		abbreviation: "Hib",
		diseasePrevented: ["Haemophilus influenzae type b disease (meningitis, pneumonia, epiglottitis)"],
		type: "Conjugate",
		manufacturer: ["Merck", "Sanofi Pasteur"],
		description:
			"Protects against Hib bacteria that can cause meningitis, pneumonia, and other invasive infections in children.",
	},
	{
		id: "ipv",
		name: "Inactivated Poliovirus",
		abbreviation: "IPV",
		diseasePrevented: ["Poliomyelitis"],
		type: "Inactivated",
		manufacturer: ["Sanofi Pasteur"],
		description: "Protects against poliovirus, which can cause paralysis and death.",
	},
	{
		id: "pcv",
		name: "Pneumococcal Conjugate",
		abbreviation: "PCV15/PCV20",
		diseasePrevented: ["Pneumococcal disease (pneumonia, meningitis, bacteremia)"],
		type: "Conjugate",
		manufacturer: ["Pfizer (Prevnar 20)", "Merck (Vaxneuvance)"],
		description:
			"Protects against Streptococcus pneumoniae bacteria that cause pneumonia, meningitis, and bloodstream infections.",
	},
	{
		id: "mmr",
		name: "Measles, Mumps, Rubella",
		abbreviation: "MMR",
		diseasePrevented: ["Measles", "Mumps", "Rubella"],
		type: "Live attenuated",
		manufacturer: ["Merck"],
		description:
			"Protects against measles, mumps, and rubella (German measles). Combination live vaccine.",
	},
	{
		id: "var",
		name: "Varicella",
		abbreviation: "VAR",
		diseasePrevented: ["Varicella (chickenpox)"],
		type: "Live attenuated",
		manufacturer: ["Merck"],
		description: "Protects against varicella-zoster virus that causes chickenpox and shingles.",
	},
	{
		id: "hepa",
		name: "Hepatitis A",
		abbreviation: "HepA",
		diseasePrevented: ["Hepatitis A"],
		type: "Inactivated",
		manufacturer: ["Merck", "GSK"],
		description: "Protects against hepatitis A virus infection that affects the liver.",
	},
	{
		id: "tdap",
		name: "Tetanus, Diphtheria, Pertussis (Tdap)",
		abbreviation: "Tdap",
		diseasePrevented: ["Tetanus", "Diphtheria", "Pertussis"],
		type: "Inactivated/Toxoid",
		manufacturer: ["Sanofi Pasteur (Adacel)", "GSK (Boostrix)"],
		description:
			"Booster vaccine for adolescents and adults against tetanus, diphtheria, and pertussis.",
	},
	{
		id: "hpv",
		name: "Human Papillomavirus",
		abbreviation: "HPV",
		diseasePrevented: ["HPV-related cancers (cervical, oropharyngeal, anal, penile)", "Genital warts"],
		type: "Recombinant",
		manufacturer: ["Merck (Gardasil 9)"],
		description:
			"Protects against human papillomavirus types that cause cancer and genital warts. 9-valent vaccine.",
	},
	{
		id: "menacwy",
		name: "Meningococcal ACWY",
		abbreviation: "MenACWY",
		diseasePrevented: ["Meningococcal disease (serogroups A, C, W, Y)"],
		type: "Conjugate",
		manufacturer: ["Sanofi Pasteur (MenQuadfi)", "Pfizer (Nimenrix)"],
		description:
			"Protects against meningococcal bacteria serogroups A, C, W, and Y that cause meningitis and sepsis.",
	},
	{
		id: "menb",
		name: "Meningococcal B",
		abbreviation: "MenB",
		diseasePrevented: ["Meningococcal disease (serogroup B)"],
		type: "Recombinant",
		manufacturer: ["Pfizer (Trumenba)", "GSK (Bexsero)"],
		description: "Protects against meningococcal bacteria serogroup B.",
	},
	{
		id: "flu",
		name: "Influenza",
		abbreviation: "IIV/LAIV",
		diseasePrevented: ["Influenza (flu)"],
		type: "Inactivated or Live attenuated",
		manufacturer: ["Multiple"],
		description:
			"Annual vaccination against seasonal influenza. Available as inactivated (IIV), recombinant (RIV), or live attenuated (LAIV) formulations.",
	},
	{
		id: "covid",
		name: "COVID-19",
		abbreviation: "COVID-19",
		diseasePrevented: ["COVID-19 (SARS-CoV-2)"],
		type: "mRNA or Protein subunit",
		manufacturer: ["Pfizer-BioNTech", "Moderna", "Novavax"],
		description:
			"Protects against SARS-CoV-2 virus. Updated formulations released annually to match circulating variants.",
	},
	{
		id: "rsv",
		name: "Respiratory Syncytial Virus",
		abbreviation: "RSV",
		diseasePrevented: ["RSV lower respiratory tract disease"],
		type: "Recombinant/Protein subunit",
		manufacturer: ["GSK (Arexvy)", "Pfizer (Abrysvo)"],
		description:
			"Protects against respiratory syncytial virus. Recommended for adults 60+ and pregnant persons (32-36 weeks gestation).",
	},
	{
		id: "zoster",
		name: "Zoster (Shingles)",
		abbreviation: "RZV",
		diseasePrevented: ["Herpes zoster (shingles)", "Postherpetic neuralgia"],
		type: "Recombinant adjuvanted",
		manufacturer: ["GSK (Shingrix)"],
		description:
			"Protects against shingles and postherpetic neuralgia. Two-dose series for adults 50 years and older.",
	},
	{
		id: "ppsv",
		name: "Pneumococcal Polysaccharide",
		abbreviation: "PPSV23",
		diseasePrevented: ["Pneumococcal disease"],
		type: "Polysaccharide",
		manufacturer: ["Merck (Pneumovax 23)"],
		description:
			"Protects against 23 types of pneumococcal bacteria. Used in adults in combination with PCV15 or as alternative to PCV20.",
	},
];

export const childSchedule: ImmunizationEntry[] = [
	{
		id: "child-hepb-1",
		vaccine: "Hepatitis B",
		abbreviation: "HepB",
		schedule: "child",
		doseNumber: 1,
		recommendedAge: "Birth",
		minAge: "Birth",
		minInterval: "N/A",
		catchupAge: "N/A",
		notes: "Administer monovalent HepB vaccine to all newborns within 24 hours of birth.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-hepb-2",
		vaccine: "Hepatitis B",
		abbreviation: "HepB",
		schedule: "child",
		doseNumber: 2,
		recommendedAge: "1 month",
		minAge: "4 weeks",
		minInterval: "4 weeks after dose 1",
		catchupAge: "N/A",
		notes: "Minimum interval: 4 weeks after dose 1.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-hepb-3",
		vaccine: "Hepatitis B",
		abbreviation: "HepB",
		schedule: "child",
		doseNumber: 3,
		recommendedAge: "6-18 months",
		minAge: "24 weeks",
		minInterval: "8 weeks after dose 2 and 16 weeks after dose 1",
		catchupAge: "N/A",
		notes:
			"Final dose should not be administered before age 24 weeks. Minimum interval from dose 2: 8 weeks; from dose 1: 16 weeks.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-rv-1",
		vaccine: "Rotavirus",
		abbreviation: "RV",
		schedule: "child",
		doseNumber: 1,
		recommendedAge: "2 months",
		minAge: "6 weeks",
		minInterval: "N/A",
		catchupAge: "Before 15 weeks 0 days",
		notes:
			"Maximum age for first dose is 14 weeks 6 days. RotaTeq (RV5) 3-dose series; Rotarix (RV1) 2-dose series.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"SCID",
			"History of intussusception",
		],
	},
	{
		id: "child-rv-2",
		vaccine: "Rotavirus",
		abbreviation: "RV",
		schedule: "child",
		doseNumber: 2,
		recommendedAge: "4 months",
		minAge: "10 weeks",
		minInterval: "4 weeks after dose 1",
		catchupAge: "Before 8 months 0 days",
		notes: "Maximum age for any dose is 8 months 0 days.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"SCID",
			"History of intussusception",
		],
	},
	{
		id: "child-rv-3",
		vaccine: "Rotavirus",
		abbreviation: "RV",
		schedule: "child",
		doseNumber: 3,
		recommendedAge: "6 months",
		minAge: "14 weeks",
		minInterval: "4 weeks after dose 2",
		catchupAge: "Before 8 months 0 days",
		notes: "Only needed for RotaTeq (RV5) 3-dose series; not needed for Rotarix (RV1) 2-dose series.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"SCID",
			"History of intussusception",
		],
	},
	{
		id: "child-dtap-1",
		vaccine: "DTaP",
		abbreviation: "DTaP",
		schedule: "child",
		doseNumber: 1,
		recommendedAge: "2 months",
		minAge: "6 weeks",
		minInterval: "N/A",
		catchupAge: "N/A",
		notes: "Five-dose series. Can be given as combination vaccine (e.g., Pediarix, Vaxelis).",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Encephalopathy within 7 days of previous dose",
		],
	},
	{
		id: "child-dtap-2",
		vaccine: "DTaP",
		abbreviation: "DTaP",
		schedule: "child",
		doseNumber: 2,
		recommendedAge: "4 months",
		minAge: "10 weeks",
		minInterval: "4 weeks after dose 1",
		catchupAge: "N/A",
		notes: "Minimum interval: 4 weeks.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Encephalopathy within 7 days of previous dose",
		],
	},
	{
		id: "child-dtap-3",
		vaccine: "DTaP",
		abbreviation: "DTaP",
		schedule: "child",
		doseNumber: 3,
		recommendedAge: "6 months",
		minAge: "14 weeks",
		minInterval: "4 weeks after dose 2",
		catchupAge: "N/A",
		notes: "Minimum interval: 4 weeks.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Encephalopathy within 7 days of previous dose",
		],
	},
	{
		id: "child-dtap-4",
		vaccine: "DTaP",
		abbreviation: "DTaP",
		schedule: "child",
		doseNumber: 4,
		recommendedAge: "15-18 months",
		minAge: "12 months",
		minInterval: "6 months after dose 3",
		catchupAge: "N/A",
		notes: "Fourth dose may be given as early as 12 months if 6 months since third dose.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Encephalopathy within 7 days of previous dose",
		],
	},
	{
		id: "child-dtap-5",
		vaccine: "DTaP",
		abbreviation: "DTaP",
		schedule: "child",
		doseNumber: 5,
		recommendedAge: "4-6 years",
		minAge: "4 years",
		minInterval: "6 months after dose 4",
		catchupAge: "N/A",
		notes: "Not needed if fourth dose was administered at age 4 years or older and at least 6 months after third dose.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Encephalopathy within 7 days of previous dose",
		],
	},
	{
		id: "child-hib-1",
		vaccine: "Hib",
		abbreviation: "Hib",
		schedule: "child",
		doseNumber: 1,
		recommendedAge: "2 months",
		minAge: "6 weeks",
		minInterval: "N/A",
		catchupAge: "N/A",
		notes: "3 or 4 dose series depending on product. PRP-OMP (PedvaxHIB): 2-dose primary series.",
		contraindications: ["Severe allergic reaction to a vaccine component", "Age younger than 6 weeks"],
	},
	{
		id: "child-hib-2",
		vaccine: "Hib",
		abbreviation: "Hib",
		schedule: "child",
		doseNumber: 2,
		recommendedAge: "4 months",
		minAge: "10 weeks",
		minInterval: "4 weeks after dose 1",
		catchupAge: "N/A",
		notes: "If PRP-OMP used at 2 and 4 months, dose at 6 months is not indicated.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-hib-3",
		vaccine: "Hib",
		abbreviation: "Hib",
		schedule: "child",
		doseNumber: 3,
		recommendedAge: "12-15 months",
		minAge: "12 months",
		minInterval: "8 weeks after dose 2",
		catchupAge: "N/A",
		notes: "Booster dose at 12-15 months regardless of Hib product used for primary series.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-ipv-1",
		vaccine: "Inactivated Poliovirus",
		abbreviation: "IPV",
		schedule: "child",
		doseNumber: 1,
		recommendedAge: "2 months",
		minAge: "6 weeks",
		minInterval: "N/A",
		catchupAge: "N/A",
		notes: "Four-dose series.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-ipv-2",
		vaccine: "Inactivated Poliovirus",
		abbreviation: "IPV",
		schedule: "child",
		doseNumber: 2,
		recommendedAge: "4 months",
		minAge: "10 weeks",
		minInterval: "4 weeks after dose 1",
		catchupAge: "N/A",
		notes: "Minimum interval: 4 weeks.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-ipv-3",
		vaccine: "Inactivated Poliovirus",
		abbreviation: "IPV",
		schedule: "child",
		doseNumber: 3,
		recommendedAge: "6-18 months",
		minAge: "14 weeks",
		minInterval: "4 weeks after dose 2",
		catchupAge: "N/A",
		notes: "Minimum interval: 4 weeks. If both OPV and IPV were given as part of series, total of 4 doses should be given regardless.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-ipv-4",
		vaccine: "Inactivated Poliovirus",
		abbreviation: "IPV",
		schedule: "child",
		doseNumber: 4,
		recommendedAge: "4-6 years",
		minAge: "4 years",
		minInterval: "6 months after dose 3",
		catchupAge: "N/A",
		notes: "Final dose on or after 4th birthday and at least 6 months after previous dose.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-pcv-1",
		vaccine: "Pneumococcal Conjugate",
		abbreviation: "PCV15",
		schedule: "child",
		doseNumber: 1,
		recommendedAge: "2 months",
		minAge: "6 weeks",
		minInterval: "N/A",
		catchupAge: "N/A",
		notes: "Four-dose series with PCV15 or PCV20.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-pcv-2",
		vaccine: "Pneumococcal Conjugate",
		abbreviation: "PCV15",
		schedule: "child",
		doseNumber: 2,
		recommendedAge: "4 months",
		minAge: "10 weeks",
		minInterval: "4 weeks after dose 1",
		catchupAge: "N/A",
		notes: "Minimum interval: 4 weeks.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-pcv-3",
		vaccine: "Pneumococcal Conjugate",
		abbreviation: "PCV15",
		schedule: "child",
		doseNumber: 3,
		recommendedAge: "6 months",
		minAge: "14 weeks",
		minInterval: "4 weeks after dose 2",
		catchupAge: "N/A",
		notes: "Minimum interval: 4 weeks.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-pcv-4",
		vaccine: "Pneumococcal Conjugate",
		abbreviation: "PCV15",
		schedule: "child",
		doseNumber: 4,
		recommendedAge: "12-15 months",
		minAge: "12 months",
		minInterval: "8 weeks after dose 3",
		catchupAge: "N/A",
		notes: "Booster dose at 12-15 months.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-mmr-1",
		vaccine: "MMR",
		abbreviation: "MMR",
		schedule: "child",
		doseNumber: 1,
		recommendedAge: "12-15 months",
		minAge: "12 months",
		minInterval: "N/A",
		catchupAge: "N/A",
		notes: "Two-dose series. Can be given as MMRV (ProQuad) which includes varicella.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Pregnancy",
			"Known severe immunodeficiency",
		],
	},
	{
		id: "child-mmr-2",
		vaccine: "MMR",
		abbreviation: "MMR",
		schedule: "child",
		doseNumber: 2,
		recommendedAge: "4-6 years",
		minAge: "13 months",
		minInterval: "4 weeks after dose 1",
		catchupAge: "N/A",
		notes: "Second dose can be given earlier if at least 4 weeks after first dose.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Pregnancy",
			"Known severe immunodeficiency",
		],
	},
	{
		id: "child-var-1",
		vaccine: "Varicella",
		abbreviation: "VAR",
		schedule: "child",
		doseNumber: 1,
		recommendedAge: "12-15 months",
		minAge: "12 months",
		minInterval: "N/A",
		catchupAge: "N/A",
		notes: "Two-dose series. Do not administer to persons with documented varicella disease history.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Pregnancy",
			"Known severe immunodeficiency",
		],
	},
	{
		id: "child-var-2",
		vaccine: "Varicella",
		abbreviation: "VAR",
		schedule: "child",
		doseNumber: 2,
		recommendedAge: "4-6 years",
		minAge: "15 months",
		minInterval: "3 months after dose 1",
		catchupAge: "N/A",
		notes: "If age 13 or older, minimum interval is 4 weeks.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Pregnancy",
			"Known severe immunodeficiency",
		],
	},
	{
		id: "child-hepa-1",
		vaccine: "Hepatitis A",
		abbreviation: "HepA",
		schedule: "child",
		doseNumber: 1,
		recommendedAge: "12-23 months",
		minAge: "12 months",
		minInterval: "N/A",
		catchupAge: "2-18 years if not vaccinated",
		notes: "Two-dose series, 6 months apart.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-hepa-2",
		vaccine: "Hepatitis A",
		abbreviation: "HepA",
		schedule: "child",
		doseNumber: 2,
		recommendedAge: "18-23 months",
		minAge: "18 months",
		minInterval: "6 months after dose 1",
		catchupAge: "2-18 years if not vaccinated",
		notes: "Minimum interval 6 months after dose 1.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-tdap-1",
		vaccine: "Tdap",
		abbreviation: "Tdap",
		schedule: "child",
		doseNumber: 1,
		recommendedAge: "11-12 years",
		minAge: "10 years",
		minInterval: "N/A",
		catchupAge: "13-18 years if not previously vaccinated",
		notes: "Single dose of Tdap. Then Td or Tdap booster every 10 years.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Encephalopathy within 7 days of previous dose of DTP/DTaP/Tdap",
		],
	},
	{
		id: "child-hpv-1",
		vaccine: "HPV",
		abbreviation: "HPV",
		schedule: "child",
		doseNumber: 1,
		recommendedAge: "11-12 years",
		minAge: "9 years",
		minInterval: "N/A",
		catchupAge: "Through age 26 years",
		notes:
			"If series started before 15th birthday: 2-dose series (0, 6-12 months). If started at 15 or older: 3-dose series (0, 1-2, 6 months).",
		contraindications: ["Severe allergic reaction to a vaccine component", "Pregnancy"],
	},
	{
		id: "child-menacwy-1",
		vaccine: "Meningococcal ACWY",
		abbreviation: "MenACWY",
		schedule: "child",
		doseNumber: 1,
		recommendedAge: "11-12 years",
		minAge: "2 months (for high risk); 11 years (routine)",
		minInterval: "N/A",
		catchupAge: "13-18 years if not previously vaccinated",
		notes: "Two-dose series for adolescents. First dose at 11-12 years, booster at 16 years.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-menacwy-2",
		vaccine: "Meningococcal ACWY",
		abbreviation: "MenACWY",
		schedule: "child",
		doseNumber: 2,
		recommendedAge: "16 years",
		minAge: "16 years",
		minInterval: "8 weeks after dose 1",
		catchupAge: "16-18 years",
		notes: "Booster dose at age 16 years. If first dose given at age 16 or older, booster not needed.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "child-flu-annual",
		vaccine: "Influenza",
		abbreviation: "IIV/LAIV",
		schedule: "child",
		doseNumber: 1,
		recommendedAge: "6 months and older, annually",
		minAge: "6 months",
		minInterval: "Annual",
		catchupAge: "N/A",
		notes:
			"Annual vaccination. Children 6 months through 8 years receiving flu vaccine for the first time need 2 doses at least 4 weeks apart.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"LAIV: age younger than 2 years, immunocompromised, pregnant, aspirin therapy",
		],
	},
	{
		id: "child-covid-annual",
		vaccine: "COVID-19",
		abbreviation: "COVID-19",
		schedule: "child",
		doseNumber: 1,
		recommendedAge: "6 months and older",
		minAge: "6 months",
		minInterval: "Annual updated dose",
		catchupAge: "N/A",
		notes: "Annual updated COVID-19 vaccine. Number of doses depends on age and vaccination history.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
];

export const adultSchedule: ImmunizationEntry[] = [
	{
		id: "adult-flu-annual",
		vaccine: "Influenza",
		abbreviation: "IIV/LAIV/RIV",
		schedule: "adult",
		doseNumber: 1,
		recommendedAge: "19 years and older, annually",
		minAge: "19 years",
		minInterval: "Annual",
		catchupAge: "N/A",
		notes:
			"Annual vaccination. Adults 65+ should preferentially receive high-dose, adjuvanted, or recombinant flu vaccine.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"LAIV contraindicated in immunocompromised, pregnant persons",
		],
	},
	{
		id: "adult-covid-annual",
		vaccine: "COVID-19",
		abbreviation: "COVID-19",
		schedule: "adult",
		doseNumber: 1,
		recommendedAge: "19 years and older",
		minAge: "19 years",
		minInterval: "Annual updated dose",
		catchupAge: "N/A",
		notes: "Annual updated COVID-19 vaccine recommended for all adults.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "adult-tdap-1",
		vaccine: "Tdap/Td",
		abbreviation: "Tdap",
		schedule: "adult",
		doseNumber: 1,
		recommendedAge: "19+ years",
		minAge: "19 years",
		minInterval: "1 dose Tdap then Td/Tdap every 10 years",
		catchupAge: "If not previously vaccinated with Tdap",
		notes:
			"1 dose Tdap if not previously received, then Td or Tdap booster every 10 years. Pregnant persons: 1 dose Tdap during each pregnancy (27-36 weeks gestation).",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Encephalopathy within 7 days of previous dose",
		],
	},
	{
		id: "adult-mmr-1",
		vaccine: "MMR",
		abbreviation: "MMR",
		schedule: "adult",
		doseNumber: 1,
		recommendedAge: "19+ years if no evidence of immunity",
		minAge: "19 years",
		minInterval: "N/A",
		catchupAge: "Born in 1957 or later without evidence of immunity",
		notes:
			"1 or 2 doses depending on indication. Health care personnel and students: 2 doses. International travel: 2 doses.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Pregnancy",
			"Known severe immunodeficiency",
		],
	},
	{
		id: "adult-var-1",
		vaccine: "Varicella",
		abbreviation: "VAR",
		schedule: "adult",
		doseNumber: 1,
		recommendedAge: "19+ years if no evidence of immunity",
		minAge: "19 years",
		minInterval: "4 weeks between doses",
		catchupAge: "If no evidence of immunity",
		notes:
			"2-dose series, 4-8 weeks apart, for adults without evidence of immunity (no documented history of varicella or vaccination).",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Pregnancy",
			"Known severe immunodeficiency",
		],
	},
	{
		id: "adult-zoster-1",
		vaccine: "Recombinant Zoster (Shingrix)",
		abbreviation: "RZV",
		schedule: "adult",
		doseNumber: 1,
		recommendedAge: "50 years and older",
		minAge: "50 years (19 years if immunocompromised)",
		minInterval: "2-6 months between dose 1 and dose 2",
		catchupAge: "N/A",
		notes:
			"2-dose series. Recommended regardless of past shingles episode or prior Zostavax vaccination. Also recommended for immunocompromised adults 19+.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Currently has shingles",
		],
	},
	{
		id: "adult-hpv-1",
		vaccine: "HPV",
		abbreviation: "HPV",
		schedule: "adult",
		doseNumber: 1,
		recommendedAge: "Through age 26 years",
		minAge: "19 years",
		minInterval: "See notes",
		catchupAge: "27-45 years based on shared clinical decision-making",
		notes:
			"2- or 3-dose series depending on age at initial vaccination. Ages 27-45: shared clinical decision-making. Not recommended for everyone older than 26.",
		contraindications: ["Severe allergic reaction to a vaccine component", "Pregnancy"],
	},
	{
		id: "adult-pneumo-1",
		vaccine: "Pneumococcal",
		abbreviation: "PCV20 or PCV15+PPSV23",
		schedule: "adult",
		doseNumber: 1,
		recommendedAge: "65 years and older, or 19-64 with risk conditions",
		minAge: "19 years (with risk conditions)",
		minInterval: "PCV15 followed by PPSV23 at least 1 year later",
		catchupAge: "N/A",
		notes:
			"Adults 65+: 1 dose PCV20, or 1 dose PCV15 followed by PPSV23. Adults 19-64 with certain medical conditions or risk factors also indicated.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "adult-hepa-1",
		vaccine: "Hepatitis A",
		abbreviation: "HepA",
		schedule: "adult",
		doseNumber: 1,
		recommendedAge: "19+ years with risk factors or on request",
		minAge: "19 years",
		minInterval: "6 months between doses",
		catchupAge: "N/A",
		notes:
			"2-dose series (HepA) or 3-dose series (HepA-HepB combo). Risk groups: travelers, persons with chronic liver disease, MSM, drug users, persons experiencing homelessness.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "adult-hepb-1",
		vaccine: "Hepatitis B",
		abbreviation: "HepB",
		schedule: "adult",
		doseNumber: 1,
		recommendedAge: "19-59 years (universal); 60+ with risk factors",
		minAge: "19 years",
		minInterval: "See notes",
		catchupAge: "N/A",
		notes:
			"Universal vaccination recommended for adults 19-59. Adults 60+ with risk factors or on request. 2-dose (Heplisav-B) or 3-dose (Engerix-B, PreHevbrio) series.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "adult-menacwy-1",
		vaccine: "Meningococcal ACWY",
		abbreviation: "MenACWY",
		schedule: "adult",
		doseNumber: 1,
		recommendedAge: "19+ years with risk factors",
		minAge: "19 years",
		minInterval: "Varies by indication",
		catchupAge: "First-year college students through 23 if not previously vaccinated",
		notes:
			"Indicated for: first-year college students living in residence halls (through age 23), asplenia, complement deficiency, HIV, travel to endemic areas.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "adult-rsv-1",
		vaccine: "Respiratory Syncytial Virus",
		abbreviation: "RSV",
		schedule: "adult",
		doseNumber: 1,
		recommendedAge: "60 years and older (shared clinical decision-making); 32-36 weeks gestation",
		minAge: "32 weeks gestation (maternal); 60 years",
		minInterval: "Single dose",
		catchupAge: "N/A",
		notes:
			"Adults 60+: single dose using shared clinical decision-making. Pregnant persons: single dose of Abrysvo at 32-36 weeks gestation (seasonal, Sep-Jan) to protect newborn.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
];

export const catchupSchedule: ImmunizationEntry[] = [
	{
		id: "catchup-hepb",
		vaccine: "Hepatitis B",
		abbreviation: "HepB",
		schedule: "catchup",
		doseNumber: 1,
		recommendedAge: "Birth through 18 years",
		minAge: "Birth",
		minInterval: "Dose 1 to 2: 4 weeks; Dose 2 to 3: 8 weeks and 16 weeks after dose 1",
		catchupAge: "Through 18 years",
		notes: "3-dose series. Minimum age for final dose: 24 weeks. Administer missing doses to complete series.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "catchup-dtap",
		vaccine: "DTaP",
		abbreviation: "DTaP",
		schedule: "catchup",
		doseNumber: 1,
		recommendedAge: "7 through 18 years",
		minAge: "7 years",
		minInterval: "Dose 1 to 2: 4 weeks; Dose 2 to 3: 4 weeks (if dose 1 before 12mo); 6 months (if dose 1 at 12mo+)",
		catchupAge: "7-18 years",
		notes:
			"Children 7-10 who are not fully vaccinated: Tdap as first dose in catch-up series. Adolescents 11-18: 1 dose Tdap then Td or Tdap for remaining doses.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Encephalopathy within 7 days of previous dose",
		],
	},
	{
		id: "catchup-ipv",
		vaccine: "Inactivated Poliovirus",
		abbreviation: "IPV",
		schedule: "catchup",
		doseNumber: 1,
		recommendedAge: "Through 18 years",
		minAge: "6 weeks",
		minInterval: "Dose 1 to 2: 4 weeks; Dose 2 to 3: 4 weeks; Dose 3 to 4: 6 months",
		catchupAge: "Through 18 years",
		notes:
			"4-dose series. Final dose on or after 4th birthday and at least 6 months after previous dose. Not routinely recommended for adults in the US.",
		contraindications: ["Severe allergic reaction to a vaccine component"],
	},
	{
		id: "catchup-mmr",
		vaccine: "MMR",
		abbreviation: "MMR",
		schedule: "catchup",
		doseNumber: 1,
		recommendedAge: "Through 18 years",
		minAge: "12 months",
		minInterval: "4 weeks between doses",
		catchupAge: "Through 18 years",
		notes: "2-dose series, minimum interval 4 weeks between doses.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Pregnancy",
			"Known severe immunodeficiency",
		],
	},
	{
		id: "catchup-var",
		vaccine: "Varicella",
		abbreviation: "VAR",
		schedule: "catchup",
		doseNumber: 1,
		recommendedAge: "Through 18 years",
		minAge: "12 months",
		minInterval: "Age 12mo-12yr: 3 months; Age 13+: 4 weeks",
		catchupAge: "Through 18 years",
		notes:
			"2-dose series. For children under 13: minimum interval 3 months. For persons 13+: minimum interval 4 weeks.",
		contraindications: [
			"Severe allergic reaction to a vaccine component",
			"Pregnancy",
			"Known severe immunodeficiency",
		],
	},
	{
		id: "catchup-hpv",
		vaccine: "HPV",
		abbreviation: "HPV",
		schedule: "catchup",
		doseNumber: 1,
		recommendedAge: "Through 26 years",
		minAge: "9 years",
		minInterval: "2-dose: 0, 6-12 months; 3-dose: 0, 1-2, 6 months",
		catchupAge: "Through 26 years",
		notes:
			"Started before age 15: 2-dose series (0, 6-12 months). Started at 15 or older: 3-dose series (0, 1-2 months, 6 months).",
		contraindications: ["Severe allergic reaction to a vaccine component", "Pregnancy"],
	},
];

/**
 * Get immunization schedule entries by schedule type.
 */
export function getScheduleByType(
	type: "child" | "adult" | "catchup",
): ImmunizationEntry[] {
	switch (type) {
		case "child":
			return childSchedule;
		case "adult":
			return adultSchedule;
		case "catchup":
			return catchupSchedule;
	}
}

/**
 * Get all vaccines info.
 */
export function getAllVaccines(): VaccineInfo[] {
	return vaccines;
}

/**
 * Find vaccine info by ID or abbreviation.
 */
export function findVaccine(idOrAbbrev: string): VaccineInfo | undefined {
	const lower = idOrAbbrev.toLowerCase();
	return (
		vaccines.find((v) => v.id === lower) ||
		vaccines.find((v) => v.abbreviation.toLowerCase() === lower) ||
		vaccines.find((v) => v.name.toLowerCase().includes(lower))
	);
}

/**
 * Filter schedule entries by vaccine name.
 */
export function filterScheduleByVaccine(
	entries: ImmunizationEntry[],
	vaccineSearch: string,
): ImmunizationEntry[] {
	const lower = vaccineSearch.toLowerCase();
	return entries.filter(
		(e) =>
			e.vaccine.toLowerCase().includes(lower) ||
			e.abbreviation.toLowerCase().includes(lower),
	);
}

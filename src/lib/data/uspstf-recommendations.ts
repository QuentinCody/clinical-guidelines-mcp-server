/**
 * USPSTF recommendation subset — embedded static summaries.
 *
 * Source: https://www.uspreventiveservicestaskforce.org/uspstf/recommendation-topics
 * Curated subset; see review-metadata.ts for per-record source review dates.
 * Provider statements define the applicable populations and exclusions.
 *
 * Grades:
 *   A — Strongly recommended; high certainty of substantial net benefit
 *   B — Recommended; high certainty of moderate net benefit or moderate certainty of substantial net benefit
 *   C — Selectively offer; at least moderate certainty of small net benefit
 *   D — Discourage; moderate or high certainty that service has no net benefit or harms outweigh benefits
 *   I — Insufficient evidence to assess the balance of benefits and harms
 */

export interface UspstfRecommendation {
	id: string;
	title: string;
	grade: "A" | "B" | "C" | "D" | "I";
	population: string;
	ageRange: string;
	sex: "all" | "female" | "male";
	riskFactors: string[];
	clinicalSummary: string;
	datePublished: string;
	url: string;
	topic: string;
}

export const uspstfRecommendations: UspstfRecommendation[] = [
	{
		id: "uspstf-breast-cancer-screening",
		title: "Screening for Breast Cancer",
		grade: "B",
		population: "Cisgender women and other persons assigned female at birth aged 40-74 within the statement's screening population",
		ageRange: "40-74",
		sex: "all",
		riskFactors: [],
		clinicalSummary:
			"Offer mammography every two years at ages 40-74 (grade B) to cisgender women and other persons assigned female at birth. This includes people with dense breasts or a family history, but excludes high-risk genetic syndromes, young-age high-dose chest radiation, prior breast cancer and high-risk breast lesions. Consult the source for the separate insufficient-evidence statements.",
		datePublished: "2024-04-30",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening",
		topic: "Cancer",
	},
	{
		id: "uspstf-cervical-cancer-screening",
		title: "Screening for Cervical Cancer",
		grade: "A",
		population: "Asymptomatic individuals with a cervix aged 21-65, excluding the statement's high-risk groups",
		ageRange: "21-65",
		sex: "all",
		riskFactors: [],
		clinicalSummary:
			"For asymptomatic individuals with a cervix, screen at ages 21-29 with cytology every 3 years; at ages 30-65 use cytology every 3 years, hrHPV testing every 5 years, or cotesting every 5 years. This statement excludes prior high-grade cervical precancer or cancer, in utero diethylstilbestrol exposure and immunocompromise. Consult the source for recommendations after cervix removal and outside these ages.",
		datePublished: "2018-08-21",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening",
		topic: "Cancer",
	},
	{
		id: "uspstf-colorectal-cancer-screening",
		title: "Screening for Colorectal Cancer",
		grade: "A",
		population: "Asymptomatic average-risk adults aged 50-75 years",
		ageRange: "50-75",
		sex: "all",
		riskFactors: [],
		clinicalSummary:
			"Screen average-risk adults aged 50 through 75 for colorectal cancer (grade A). Separate records describe grade B screening at ages 45-49 and selective grade C screening at ages 76-85. The source specifies test options, intervals and exclusions from this population.",
		datePublished: "2021-05-18",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening",
		topic: "Cancer",
	},
	{
		id: "uspstf-colorectal-cancer-screening-45-49",
		title: "Screening for Colorectal Cancer, Ages 45-49",
		grade: "B", population: "Asymptomatic average-risk adults aged 45-49 years",
		ageRange: "45-49", sex: "all", riskFactors: [],
		clinicalSummary: "Offer colorectal cancer screening to average-risk adults aged 45 through 49 (grade B). Consult the source for test options, intervals and population exclusions.",
		datePublished: "2021-05-18",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening",
		topic: "Cancer",
	},
	{
		id: "uspstf-colorectal-cancer-screening-76-85",
		title: "Selective Screening for Colorectal Cancer, Ages 76-85",
		grade: "C", population: "Asymptomatic average-risk adults aged 76-85 years",
		ageRange: "76-85", sex: "all", riskFactors: [],
		clinicalSummary: "Consider colorectal screening individually at ages 76 through 85 (grade C), accounting for health, earlier screening and preferences. Routine screening of everyone in this age group has a small net benefit.",
		datePublished: "2021-05-18",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening",
		topic: "Cancer",
	},
	{
		id: "uspstf-lung-cancer-screening",
		title: "Screening for Lung Cancer",
		grade: "B",
		population: "Adults aged 50-80 with at least 20 pack-years who currently smoke or quit within 15 years",
		ageRange: "50-80",
		sex: "all",
		riskFactors: ["20+ pack-year smoking history", "currently smoke or quit within past 15 years"],
		clinicalSummary:
			"Offer annual low-dose CT screening at ages 50-80 with at least 20 pack-years and current smoking or quitting within 15 years. Stop after 15 smoke-free years, or when health substantially limits life expectancy or the ability or willingness to undergo curative lung surgery.",
		datePublished: "2021-03-09",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening",
		topic: "Cancer",
	},
	{
		id: "uspstf-skin-cancer-prevention-counseling",
		title: "Behavioral Counseling to Prevent Skin Cancer",
		grade: "B",
		population: "Persons aged 6 months through 24 years with fair skin; counseling includes parents of young children",
		ageRange: "6 months-24 years",
		sex: "all",
		riskFactors: ["fair skin type"],
		clinicalSummary:
			"The USPSTF recommends counseling young adults, adolescents, and parents of young children about minimizing exposure to ultraviolet radiation for persons aged 6 months to 24 years with fair skin types to reduce their risk of skin cancer.",
		datePublished: "2018-03-20",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/skin-cancer-counseling",
		topic: "Cancer",
	},
	{
		id: "uspstf-hypertension-screening",
		title: "Screening for Hypertension in Adults",
		grade: "A",
		population: "Adults aged 18 years or older without known hypertension",
		ageRange: "18+",
		sex: "all",
		riskFactors: [],
		clinicalSummary:
			"The USPSTF recommends screening for hypertension in adults aged 18 years or older with office blood pressure measurement. The USPSTF recommends obtaining blood pressure measurements outside of the clinical setting for diagnostic confirmation before starting treatment.",
		datePublished: "2021-04-27",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hypertension-in-adults-screening",
		topic: "Heart and Vascular",
	},
	{
		id: "uspstf-statin-use-cvd-prevention",
		title: "Statin Use for Primary Prevention of CVD in Adults",
		grade: "B",
		population: "Adults aged 40-75 without known CVD, with at least one CVD risk factor and estimated 10-year risk >= 10%",
		ageRange: "40-75",
		sex: "all",
		riskFactors: [
			"At least one of dyslipidemia, diabetes, hypertension or smoking AND estimated 10-year CVD event risk >= 10%",
		],
		clinicalSummary:
			"The USPSTF recommends that clinicians prescribe a statin for the primary prevention of cardiovascular disease (CVD) for adults aged 40 to 75 years who have 1 or more CVD risk factors (dyslipidemia, diabetes, hypertension, or smoking) and an estimated 10-year CVD event risk of 10% or greater.",
		datePublished: "2022-08-23",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/statin-use-in-adults-preventive-medication",
		topic: "Heart and Vascular",
	},
	{
		id: "uspstf-abdominal-aortic-aneurysm-screening",
		title: "Screening for Abdominal Aortic Aneurysm",
		grade: "B",
		population: "Men aged 65-75 years who have ever smoked",
		ageRange: "65-75",
		sex: "male",
		riskFactors: ["history of smoking"],
		clinicalSummary:
			"The USPSTF recommends one-time screening for abdominal aortic aneurysm (AAA) with ultrasonography in men aged 65 to 75 years who have ever smoked.",
		datePublished: "2019-12-10",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/abdominal-aortic-aneurysm-screening",
		topic: "Heart and Vascular",
	},
	{
		id: "uspstf-aspirin-preeclampsia-prevention",
		title: "Aspirin Use to Prevent Preeclampsia and Related Morbidity and Mortality",
		grade: "B",
		population: "Asymptomatic pregnant persons at high risk for preeclampsia without prior adverse events with low-dose aspirin",
		ageRange: "all",
		sex: "all",
		riskFactors: [
			"previous preeclampsia",
			"multifetal gestation",
			"chronic hypertension",
			"type 1 or 2 diabetes",
			"renal disease",
			"autoimmune disease",
		],
		clinicalSummary:
			"The USPSTF recommends the use of low-dose aspirin (81 mg/day) as preventive medication after 12 weeks of gestation in persons who are at high risk for preeclampsia.",
		datePublished: "2021-09-28",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/low-dose-aspirin-use-for-the-prevention-of-morbidity-and-mortality-from-preeclampsia-preventive-medication",
		topic: "Pregnancy",
	},
	{
		id: "uspstf-diabetes-screening",
		title: "Screening for Prediabetes and Type 2 Diabetes",
		grade: "B",
		population: "Asymptomatic nonpregnant adults aged 35-70 years with overweight or obesity",
		ageRange: "35-70",
		sex: "all",
		riskFactors: ["Overweight or obesity; consider a lower BMI threshold (23) for Asian American persons", "Consider earlier screening with additional risk factors; see the source for populations and thresholds"],
		clinicalSummary:
			"The USPSTF recommends screening for prediabetes and type 2 diabetes in adults aged 35 to 70 years who have overweight or obesity. Clinicians should refer patients with prediabetes to effective preventive interventions.",
		datePublished: "2021-08-24",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-for-prediabetes-and-type-2-diabetes",
		topic: "Metabolic",
	},
	{
		id: "uspstf-depression-screening-adults",
		title: "Screening for Depression in Adults",
		grade: "B",
		population: "General adult population aged 19 years or older",
		ageRange: "19+",
		sex: "all",
		riskFactors: [],
		clinicalSummary:
			"Screen adults aged 19+ for depression, including pregnant, postpartum and older adults (grade B). Positive screens need diagnostic assessment and access to evidence-based care. The separate suicide-risk screening statement is I (insufficient evidence), not grade B.",
		datePublished: "2023-06-20",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults",
		topic: "Mental Health",
	},
	{
		id: "uspstf-anxiety-screening",
		title: "Screening for Anxiety Disorders in Adults",
		grade: "B",
		population: "Adults aged 19-64, including pregnant/postpartum persons, without diagnosed mental health disorders or recognized anxiety symptoms",
		ageRange: "19-64",
		sex: "all",
		riskFactors: [],
		clinicalSummary:
			"The USPSTF recommends screening for anxiety disorders in adults, including pregnant and postpartum persons. The evidence is insufficient for adults 65 years and older.",
		datePublished: "2023-06-20",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/anxiety-adults-screening",
		topic: "Mental Health",
	},
	{
		id: "uspstf-hepatitis-b-screening",
		title: "Screening for Hepatitis B Virus Infection in Adolescents and Adults",
		grade: "B",
		population: "Asymptomatic nonpregnant adolescents and adults at increased risk for HBV infection",
		ageRange: "adolescents and adults",
		sex: "all",
		riskFactors: [
			"Born in a country with HBV prevalence >= 2%",
			"US-born, not vaccinated in infancy, with parents born in regions with HBV prevalence >= 8%",
			"HIV positive",
			"injection drug use",
			"men who have sex with men",
			"household or sexual contact with HBV-infected person",
		],
		clinicalSummary:
			"Screen asymptomatic nonpregnant adolescents and adults at increased HBV risk, including previously vaccinated persons. This grade B statement does not cover prenatal screening, which has a separate recommendation. Consult the source for risk-group definitions and confirmatory testing.",
		datePublished: "2020-12-15",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-b-virus-infection-screening",
		topic: "Infectious Disease",
	},
	{
		id: "uspstf-hepatitis-c-screening",
		title: "Screening for Hepatitis C Virus Infection in Adolescents and Adults",
		grade: "B",
		population: "Asymptomatic adults aged 18-79, including pregnant persons, without known liver disease",
		ageRange: "18-79",
		sex: "all",
		riskFactors: [],
		clinicalSummary:
			"The USPSTF recommends screening for hepatitis C virus (HCV) infection in adults aged 18 to 79 years. Universal screening is recommended because of the high prevalence and availability of curative treatments.",
		datePublished: "2020-03-02",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening",
		topic: "Infectious Disease",
	},
	{
		id: "uspstf-hiv-screening",
		title: "Screening for HIV Infection",
		grade: "A",
		population: "Ages 15-65; younger/older persons at increased risk; all pregnant persons",
		ageRange: "15-65; risk-based outside range; pregnancy at any age",
		sex: "all",
		riskFactors: [],
		clinicalSummary:
			"Screen for HIV at ages 15-65 and outside that range when risk is increased. Also screen all pregnant persons, including those presenting in labor or at delivery with unknown HIV status. These are grade A recommendations; consult the source for rescreening intervals.",
		datePublished: "2019-06-11",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening",
		topic: "Infectious Disease",
	},
	{
		id: "uspstf-sti-counseling",
		title: "Behavioral Counseling Interventions to Prevent STIs",
		grade: "B",
		population: "All sexually active adolescents; adults at increased risk for STIs",
		ageRange: "adolescents and adults",
		sex: "all",
		riskFactors: ["All sexually active adolescents; adults with increased STI risk (separate population criteria)"],
		clinicalSummary:
			"The USPSTF recommends behavioral counseling for all sexually active adolescents and for adults who are at increased risk for sexually transmitted infections (STIs).",
		datePublished: "2020-08-18",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/sexually-transmitted-infections-behavioral-counseling",
		topic: "Infectious Disease",
	},
	{
		id: "uspstf-folic-acid-supplementation",
		title: "Folic Acid Supplementation to Prevent Neural Tube Defects",
		grade: "A",
		population: "All persons planning or capable of pregnancy",
		ageRange: "reproductive age",
		sex: "all",
		riskFactors: [],
		clinicalSummary:
			"Persons planning or able to become pregnant should take 0.4-0.8 mg (400-800 mcg) folic acid daily, starting at least one month before anticipated conception through the first 2-3 months of pregnancy. This general recommendation excludes prior neural-tube-defect pregnancies and other very-high-risk situations requiring separate advice.",
		datePublished: "2023-08-01",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/folic-acid-for-the-prevention-of-neural-tube-defects-preventive-medication",
		topic: "Pregnancy",
	},
	{
		id: "uspstf-tobacco-cessation",
		title: "Interventions for Tobacco Smoking Cessation in Adults",
		grade: "A",
		population: "Adults who use tobacco",
		ageRange: "18+",
		sex: "all",
		riskFactors: ["tobacco use"],
		clinicalSummary:
			"Ask adults about tobacco use and advise cessation. Offer behavioral support and FDA-approved cessation medication to nonpregnant adults who use tobacco; offer behavioral interventions during pregnancy. Evidence is insufficient for cessation pharmacotherapy in pregnancy and for e-cigarettes as cessation aids. The grade A population-specific advice does not imply approval of those options.",
		datePublished: "2021-01-19",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/tobacco-use-in-adults-and-pregnant-women-counseling-and-interventions",
		topic: "Healthy Living",
	},
	{
		id: "uspstf-obesity-weight-management",
		title: "Weight Loss to Prevent Obesity-Related Morbidity and Mortality in Adults",
		grade: "B",
		population: "Adults with BMI >= 30",
		ageRange: "18+",
		sex: "all",
		riskFactors: ["BMI >= 30"],
		clinicalSummary:
			"Offer or refer adults with BMI at least 30 to intensive, multicomponent behavioral weight-management interventions (grade B). This recommendation is for behavioral interventions; it does not provide a recommendation to prescribe weight-loss medication.",
		datePublished: "2018-09-18",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/obesity-in-adults-interventions",
		topic: "Healthy Living",
	},
	{
		id: "uspstf-osteoporosis-screening",
		title: "Screening for Osteoporosis to Prevent Fractures",
		grade: "B",
		population: "Postmenopausal women younger than 65 at increased risk and all women 65+",
		ageRange: "65+; postmenopausal under 65 when at increased risk",
		sex: "female",
		riskFactors: [
			"postmenopausal",
			"low body weight",
			"parental hip fracture history",
			"smoking",
			"excessive alcohol",
		],
		clinicalSummary:
			"Screen women aged 65+ for osteoporosis to prevent fractures. Also screen postmenopausal women under 65 when clinical risk assessment indicates increased fracture risk. The statement excludes known osteoporosis, fragility fractures and secondary osteoporosis; evidence for screening men remains insufficient.",
		datePublished: "2025-01-14",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening",
		topic: "Musculoskeletal",
	},
	{
		id: "uspstf-vision-screening-children",
		title: "Vision Screening in Children Aged 3 to 5 Years",
		grade: "B",
		population: "Children aged 3 to 5 years",
		ageRange: "3-5",
		sex: "all",
		riskFactors: [],
		clinicalSummary:
			"Screen children aged 3-5 at least once for amblyopia or its risk factors (grade B). For children younger than 3, the separate statement finds insufficient evidence (grade I).",
		datePublished: "2017-09-05",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/vision-in-children-ages-6-months-to-5-years-screening",
		topic: "Children",
	},
	{
		id: "uspstf-gestational-diabetes-screening",
		title: "Screening for Gestational Diabetes",
		grade: "B",
		population: "Asymptomatic pregnant persons at 24+ weeks without previously diagnosed type 1 or type 2 diabetes",
		ageRange: "all",
		sex: "all",
		riskFactors: ["pregnant"],
		clinicalSummary:
			"Screen asymptomatic pregnant persons at or after 24 weeks for gestational diabetes (grade B), excluding previously diagnosed type 1 or type 2 diabetes. Evidence for screening before 24 weeks is insufficient (grade I).",
		datePublished: "2021-08-10",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/gestational-diabetes-screening",
		topic: "Pregnancy",
	},
	{
		id: "uspstf-preeclampsia-screening",
		title: "Screening for Hypertensive Disorders of Pregnancy",
		grade: "B",
		population: "Asymptomatic pregnant persons without known hypertensive disorders or chronic hypertension",
		ageRange: "all",
		sex: "all",
		riskFactors: ["pregnant"],
		clinicalSummary:
			"Check blood pressure at prenatal visits throughout pregnancy to screen for hypertensive disorders (grade B). Repeat elevated measurements to confirm them and arrange evidence-based management when needed. This 2023 statement expands the previous preeclampsia screening scope.",
		datePublished: "2023-09-19",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hypertensive-disorders-pregnancy-screening",
		topic: "Pregnancy",
	},
	{
		id: "uspstf-unhealthy-drug-use-screening",
		title: "Screening for Unhealthy Drug Use",
		grade: "B",
		population: "Adults aged 18 years or older",
		ageRange: "18+",
		sex: "all",
		riskFactors: [],
		clinicalSummary:
			"Ask adults aged 18+ about unhealthy drug use when diagnostic assessment, effective treatment and appropriate care are available directly or by referral (grade B). This means question-based screening, not biological specimen testing. Evidence for screening adolescents is insufficient (grade I).",
		datePublished: "2020-06-09",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/drug-use-illicit-screening",
		topic: "Mental Health",
	},
	{
		id: "uspstf-unhealthy-alcohol-use-screening",
		title: "Screening and Behavioral Counseling for Unhealthy Alcohol Use in Adults",
		grade: "B",
		population: "Adults aged 18 years or older",
		ageRange: "18+",
		sex: "all",
		riskFactors: [],
		clinicalSummary:
			"The USPSTF recommends screening for unhealthy alcohol use in primary care settings in adults 18 years or older, including pregnant persons, and providing persons engaged in risky or hazardous drinking with brief behavioral counseling interventions to reduce unhealthy alcohol use.",
		datePublished: "2018-11-13",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/unhealthy-alcohol-use-in-adolescents-and-adults-screening-and-behavioral-counseling-interventions",
		topic: "Mental Health",
	},
];

/**
 * Filter USPSTF recommendations by optional criteria.
 */
export function filterUspstfRecommendations(filters?: {
	grade?: string;
	topic?: string;
	sex?: string;
	search?: string;
}): UspstfRecommendation[] {
	let results = uspstfRecommendations;

	if (filters?.grade) {
		const g = filters.grade.toUpperCase();
		results = results.filter((r) => r.grade === g);
	}
	if (filters?.topic) {
		const t = filters.topic.toLowerCase();
		results = results.filter((r) => r.topic.toLowerCase().includes(t));
	}
	if (filters?.sex && filters.sex !== "all") {
		const s = filters.sex.toLowerCase();
		results = results.filter((r) => r.sex === "all" || r.sex === s);
	}
	if (filters?.search) {
		const q = filters.search.toLowerCase();
		results = results.filter(
			(r) =>
				r.title.toLowerCase().includes(q) ||
				r.clinicalSummary.toLowerCase().includes(q) ||
				r.population.toLowerCase().includes(q) ||
				r.topic.toLowerCase().includes(q),
		);
	}

	return results;
}

/**
 * Find a specific USPSTF recommendation by ID or topic keyword.
 */
export function findUspstfRecommendation(idOrTopic: string): UspstfRecommendation | undefined {
	const matches = matchingUspstfRecommendations(idOrTopic);
	return matches.length === 1 ? matches[0] : undefined;
}

/** Exact IDs take precedence; keywords must not silently select a grade/population. */
export function matchingUspstfRecommendations(idOrTopic: string): UspstfRecommendation[] {
	const lower = idOrTopic.trim().toLowerCase();
	if (!lower) return [];
	const exact = uspstfRecommendations.find((r) => r.id.toLowerCase() === lower);
	return exact ? [exact] : uspstfRecommendations.filter((r) =>
		r.title.toLowerCase().includes(lower) || r.id.toLowerCase().includes(lower));
}

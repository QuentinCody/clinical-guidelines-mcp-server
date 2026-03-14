/**
 * USPSTF A/B Grade Recommendations — embedded static data.
 *
 * Source: https://www.uspreventiveservicestaskforce.org/uspstf/recommendation-topics
 * Last updated: 2026-03. These are the top A and B grade recommendations
 * for preventive services in the general population.
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
		population: "Women aged 40-74 years",
		ageRange: "40-74",
		sex: "female",
		riskFactors: [],
		clinicalSummary:
			"The USPSTF recommends biennial screening mammography for women aged 40 to 74 years. For women aged 40-49, the decision to start screening should be an individual one, taking into account patient context and values regarding specific benefits and harms.",
		datePublished: "2024-04-30",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening",
		topic: "Cancer",
	},
	{
		id: "uspstf-cervical-cancer-screening",
		title: "Screening for Cervical Cancer",
		grade: "A",
		population: "Women aged 21-65 years",
		ageRange: "21-65",
		sex: "female",
		riskFactors: [],
		clinicalSummary:
			"The USPSTF recommends screening for cervical cancer every 3 years with cervical cytology alone in women aged 21 to 29 years. For women aged 30 to 65, screening every 3 years with cytology alone, every 5 years with hrHPV testing alone, or every 5 years with hrHPV testing in combination with cytology (cotesting).",
		datePublished: "2018-08-21",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening",
		topic: "Cancer",
	},
	{
		id: "uspstf-colorectal-cancer-screening",
		title: "Screening for Colorectal Cancer",
		grade: "A",
		population: "Adults aged 45-75 years",
		ageRange: "45-75",
		sex: "all",
		riskFactors: [],
		clinicalSummary:
			"The USPSTF recommends screening for colorectal cancer in all adults aged 45 to 75 years. Several screening strategies are available including stool-based tests (FIT annually, FIT-DNA every 1-3 years), direct visualization (colonoscopy every 10 years, CT colonography every 5 years, flexible sigmoidoscopy every 5 years).",
		datePublished: "2021-05-18",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening",
		topic: "Cancer",
	},
	{
		id: "uspstf-lung-cancer-screening",
		title: "Screening for Lung Cancer",
		grade: "B",
		population: "Adults aged 50-80 years with 20+ pack-year smoking history",
		ageRange: "50-80",
		sex: "all",
		riskFactors: ["20+ pack-year smoking history", "currently smoke or quit within past 15 years"],
		clinicalSummary:
			"The USPSTF recommends annual screening for lung cancer with low-dose computed tomography (LDCT) in adults aged 50 to 80 years who have a 20 pack-year smoking history and currently smoke or have quit within the past 15 years. Screening should be discontinued once a person has not smoked for 15 years or develops a health problem that substantially limits life expectancy.",
		datePublished: "2021-03-09",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening",
		topic: "Cancer",
	},
	{
		id: "uspstf-skin-cancer-prevention-counseling",
		title: "Behavioral Counseling to Prevent Skin Cancer",
		grade: "B",
		population: "Young adults aged 18-24 years with fair skin",
		ageRange: "18-24",
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
		population: "Adults aged 18 years or older",
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
		population: "Adults aged 40-75 years with CVD risk factors and 10-year CVD risk >= 10%",
		ageRange: "40-75",
		sex: "all",
		riskFactors: [
			"dyslipidemia",
			"diabetes",
			"hypertension",
			"smoking",
			"10-year CVD event risk >= 10%",
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
		population: "Pregnant persons at high risk for preeclampsia",
		ageRange: "all",
		sex: "female",
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
		population: "Adults aged 35-70 years who are overweight or obese",
		ageRange: "35-70",
		sex: "all",
		riskFactors: ["overweight (BMI >= 25)", "obese"],
		clinicalSummary:
			"The USPSTF recommends screening for prediabetes and type 2 diabetes in adults aged 35 to 70 years who have overweight or obesity. Clinicians should refer patients with prediabetes to effective preventive interventions.",
		datePublished: "2021-08-24",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-for-prediabetes-and-type-2-diabetes",
		topic: "Metabolic",
	},
	{
		id: "uspstf-depression-screening-adults",
		title: "Screening for Depression and Suicide Risk in Adults",
		grade: "B",
		population: "General adult population aged 19 years or older",
		ageRange: "19+",
		sex: "all",
		riskFactors: [],
		clinicalSummary:
			"The USPSTF recommends screening for depression in the general adult population, including pregnant and postpartum persons. Screening should be implemented with adequate systems in place to ensure accurate diagnosis, effective treatment, and appropriate follow-up.",
		datePublished: "2023-06-20",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults",
		topic: "Mental Health",
	},
	{
		id: "uspstf-anxiety-screening",
		title: "Screening for Anxiety Disorders in Adults",
		grade: "B",
		population: "Adults aged 19-64 years",
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
		population: "Adolescents and adults at increased risk for infection",
		ageRange: "15+",
		sex: "all",
		riskFactors: [
			"born in high-prevalence country",
			"US-born not vaccinated as infant with parents from high-prevalence region",
			"HIV positive",
			"injection drug use",
			"household or sexual contact with HBV-infected person",
		],
		clinicalSummary:
			"The USPSTF recommends screening for hepatitis B virus (HBV) infection in adolescents and adults at increased risk for infection. The USPSTF also recommends screening in pregnant persons at their first prenatal visit.",
		datePublished: "2020-12-15",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-b-virus-infection-screening",
		topic: "Infectious Disease",
	},
	{
		id: "uspstf-hepatitis-c-screening",
		title: "Screening for Hepatitis C Virus Infection in Adolescents and Adults",
		grade: "B",
		population: "Adults aged 18-79 years",
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
		population: "Adolescents and adults aged 15-65 years",
		ageRange: "15-65",
		sex: "all",
		riskFactors: [],
		clinicalSummary:
			"The USPSTF recommends that clinicians screen for HIV infection in adolescents and adults aged 15 to 65 years. Younger adolescents and older adults who are at increased risk should also be screened.",
		datePublished: "2019-06-11",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening",
		topic: "Infectious Disease",
	},
	{
		id: "uspstf-sti-counseling",
		title: "Behavioral Counseling Interventions to Prevent STIs",
		grade: "B",
		population: "Sexually active adolescents and adults at increased risk for STIs",
		ageRange: "15+",
		sex: "all",
		riskFactors: ["sexually active", "increased risk for STIs"],
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
		sex: "female",
		riskFactors: [],
		clinicalSummary:
			"The USPSTF recommends that all persons planning or capable of pregnancy take a daily supplement containing 0.4 to 0.8 mg (400 to 800 mcg) of folic acid to prevent neural tube defects.",
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
			"The USPSTF recommends that clinicians ask all adults about tobacco use, advise them to stop using tobacco, and provide behavioral interventions and US Food and Drug Administration (FDA)-approved pharmacotherapy for cessation to nonpregnant adults who use tobacco.",
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
			"The USPSTF recommends that clinicians offer or refer adults with a body mass index (BMI) of 30 or higher to intensive, multicomponent behavioral interventions with or without pharmacotherapy to achieve and maintain weight loss.",
		datePublished: "2018-09-18",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/obesity-in-adults-interventions",
		topic: "Healthy Living",
	},
	{
		id: "uspstf-osteoporosis-screening",
		title: "Screening for Osteoporosis to Prevent Fractures",
		grade: "B",
		population: "Postmenopausal women younger than 65 at increased risk and all women 65+",
		ageRange: "50+",
		sex: "female",
		riskFactors: [
			"postmenopausal",
			"low body weight",
			"parental hip fracture history",
			"smoking",
			"excessive alcohol",
		],
		clinicalSummary:
			"The USPSTF recommends screening for osteoporosis with bone measurement testing to prevent osteoporotic fractures in women 65 years and older and in postmenopausal women younger than 65 years who are at increased risk of osteoporosis, as determined by a formal clinical risk assessment tool.",
		datePublished: "2018-06-26",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening",
		topic: "Musculoskeletal",
	},
	{
		id: "uspstf-vision-screening-children",
		title: "Vision Screening in Children Aged 6 Months to 5 Years",
		grade: "B",
		population: "Children aged 3 to 5 years",
		ageRange: "3-5",
		sex: "all",
		riskFactors: [],
		clinicalSummary:
			"The USPSTF recommends vision screening at least once in all children aged 3 to 5 years to detect amblyopia or its risk factors.",
		datePublished: "2017-09-05",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/vision-in-children-ages-6-months-to-5-years-screening",
		topic: "Children",
	},
	{
		id: "uspstf-gestational-diabetes-screening",
		title: "Screening for Gestational Diabetes",
		grade: "B",
		population: "Asymptomatic pregnant persons at 24 weeks of gestation or after",
		ageRange: "all",
		sex: "female",
		riskFactors: ["pregnant"],
		clinicalSummary:
			"The USPSTF recommends screening for gestational diabetes in asymptomatic pregnant persons at 24 weeks of gestation or after.",
		datePublished: "2021-08-10",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/gestational-diabetes-screening",
		topic: "Pregnancy",
	},
	{
		id: "uspstf-preeclampsia-screening",
		title: "Screening for Preeclampsia",
		grade: "B",
		population: "Pregnant persons",
		ageRange: "all",
		sex: "female",
		riskFactors: ["pregnant"],
		clinicalSummary:
			"The USPSTF recommends screening for preeclampsia in pregnant persons with blood pressure measurements throughout pregnancy.",
		datePublished: "2017-04-25",
		url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/preeclampsia-screening",
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
			"The USPSTF recommends screening by asking questions about unhealthy drug use in adults age 18 years or older. Screening should be implemented when services for accurate diagnosis, effective treatment, and appropriate care can be offered or referred.",
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
	const lower = idOrTopic.toLowerCase();
	return (
		uspstfRecommendations.find((r) => r.id === idOrTopic) ||
		uspstfRecommendations.find(
			(r) =>
				r.title.toLowerCase().includes(lower) || r.id.toLowerCase().includes(lower),
		)
	);
}

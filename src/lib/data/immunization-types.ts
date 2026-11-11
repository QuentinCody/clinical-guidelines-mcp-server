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

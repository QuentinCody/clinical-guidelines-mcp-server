import type { ImmunizationEntry, VaccineInfo } from "./immunization-types";
import { filterScheduleByVaccine } from "./immunization-filter";

/** Resolve exact identities first; an ambiguous broad name must not select a vaccine. */
export function matchingVaccines(vaccines: VaccineInfo[], query: string): VaccineInfo[] {
  const lower = query.trim().toLowerCase();
  if (!lower) return [];
  const exact = vaccines.filter(vaccine => [vaccine.id, vaccine.name, vaccine.abbreviation]
    .some(value => value.toLowerCase() === lower));
  if (exact.length) return exact;
  const abbreviation = vaccines.filter(vaccine => vaccine.abbreviation.toLowerCase().split("/").includes(lower));
  return abbreviation.length ? abbreviation : vaccines.filter(vaccine => vaccine.name.toLowerCase().includes(lower));
}

/** Family-level references only: matching a row does not establish product eligibility. */
export function vaccineSchedules(vaccine: VaccineInfo, entries: ImmunizationEntry[]): ImmunizationEntry[] {
  const terms = [vaccine.name, ...vaccine.abbreviation.split("/")];
  const ids = new Set(terms.flatMap(term => filterScheduleByVaccine(entries, term).map(entry => entry.id)));
  return entries.filter(entry => ids.has(entry.id));
}

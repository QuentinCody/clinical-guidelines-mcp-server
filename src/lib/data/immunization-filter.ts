import type { ImmunizationEntry } from "./immunization-types";

/** Prefer an exact vaccine identity before broad substring discovery. */
export function filterScheduleByVaccine(entries: ImmunizationEntry[], vaccineSearch: string, allEntries = entries): ImmunizationEntry[] {
  const lower = vaccineSearch.trim().toLowerCase();
  if (!lower) return [];
  const matchesIdentity = (entry: ImmunizationEntry) => entry.vaccine.toLowerCase().split("/").map(name => name.trim()).includes(lower) || entry.abbreviation.toLowerCase().split(/(?:\s+or\s+|[\s/+]+)/).includes(lower);
  if (allEntries.some(matchesIdentity)) return entries.filter(matchesIdentity);
  return entries.filter(entry => entry.vaccine.toLowerCase().includes(lower) || entry.abbreviation.toLowerCase().includes(lower));
}

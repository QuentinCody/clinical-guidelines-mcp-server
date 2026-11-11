import { expect, it } from "vitest";
import { adultSchedule } from "./cdc-immunization-schedule";

function adult(id: string) {
  const entry = adultSchedule.find((row) => row.id === id);
  if (!entry) throw new Error(`Missing adult schedule record: ${id}`);
  return entry;
}

// Expectations derive from the CDC sources listed in the September 29 adult review.
it("preserves the adult COVID record ID while distinguishing seasonal dosing and immune status", () => {
  const row = adult("adult-covid-annual");
  expect(row.notes).toContain("2026-2027");
  expect(row.notes).toContain("ages 65+ receive two");
  expect(row.notes).toContain("Immunocompromised people follow separate guidance");
  expect(row.notes).toContain("off-label");
  expect(row.minInterval).not.toBe("Annual updated dose");
});

it("distinguishes zoster minimum timing and temporary deferral from contraindications", () => {
  const row = adult("adult-zoster-1");
  expect(row.minInterval).toContain("4 weeks minimum");
  expect(row.recommendedAge).toContain("immunocompromised adults 19");
  expect(row.notes).toContain("1-2 month");
  expect(row.notes).toContain("Defer during an acute shingles episode");
  expect(row.contraindications.join(" ")).not.toMatch(/currently|pregnan|shingles/i);
  expect(row.contraindications.join(" ")).toContain("prior dose");
});

it("retains HPV pregnancy deferral without classifying it as a contraindication", () => {
  const row = adult("adult-hpv-1");
  expect(row.notes).toContain("Delay remaining doses until after pregnancy");
  expect(row.notes).toContain("immunocompromised people need three doses");
  expect(row.contraindications.join(" ")).not.toMatch(/pregnan/i);
  expect(row.contraindications.join(" ")).toContain("yeast");
});

it("removes recalled PreHevbrio from available HepB series and keeps older-adult requests", () => {
  const row = adult("adult-hepb-1");
  expect(row.recommendedAge).toContain("60+ with risk factors or on request");
  expect(row.notes).toContain("Recombivax HB");
  expect(row.notes).toContain("PreHevbrio was recalled in November 2024");
  expect(row.notes).toContain("must not be used");
});

it("uses MenACWY college dose history rather than the MenB age window", () => {
  const row = adult("adult-menacwy-1");
  expect(row.catchupAge).toContain("without a dose at age 16 or later");
  expect(`${row.catchupAge} ${row.notes}`).not.toContain("23");
  expect(row.notes).toContain("MenB has separate eligibility");
});

it("qualifies the Tdap neurologic contraindication by product, cause and timing", () => {
  const text = adult("adult-tdap-1").contraindications.join(" ");
  expect(text).toContain("Tdap only");
  expect(text).toContain("unexplained");
  expect(text).toContain("7 days after DTP, DTaP or Tdap");
});

it("keeps immunity-dependent MMR and varicella guidance qualified", () => {
  expect(adult("adult-mmr-1").minInterval).toContain("4 weeks");
  expect(adult("adult-mmr-1").notes).toContain("Prior doses and birth year");
  expect(adult("adult-var-1").notes).toContain("laboratory findings");
  expect(adult("adult-var-1").notes).toContain("Pregnancy, health care work and HIV");
});

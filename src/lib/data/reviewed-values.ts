import scheduleValues from "./reviewed-schedule-values.json";
import uspstfValues from "./reviewed-uspstf-values.json";
import vaccineValues from "./reviewed-vaccine-values.json";

// Independent snapshots of reviewed values. Do not regenerate these when editing
// the live data: changes require a new source review and field-specific date.
const reviewed: Record<string, Record<string, unknown>> = {
  ...scheduleValues, ...uspstfValues, ...vaccineValues,
};

export function reviewedRecord(record: Record<string, unknown>) {
  const id = typeof record.id === "string" ? record.id : "";
  if (!Object.prototype.hasOwnProperty.call(reviewed, id)) return undefined;
  const expected = reviewed[id];
  if (expected.schedule !== undefined && record.schedule !== expected.schedule) return undefined;
  if (expected.url !== undefined && (record.url !== expected.url || record.datePublished !== expected.datePublished)) return undefined;
  return expected;
}

export function reviewedValueMatches(record: Record<string, unknown>, field: string) {
  const expected = reviewedRecord(record);
  if (!expected) return false;
  const match = /^(\w+)(?:\[(\d+)\])?$/.exec(field);
  if (!match || !Object.prototype.hasOwnProperty.call(expected, match[1])) return false;
  const [key, index] = [match[1], match[2]];
  const actualValue = record[key];
  const expectedValue = expected[key];
  if (index !== undefined) return Array.isArray(actualValue) && Array.isArray(expectedValue)
    && Number(index) < expectedValue.length
    && JSON.stringify(actualValue[Number(index)]) === JSON.stringify(expectedValue[Number(index)]);
  return JSON.stringify(actualValue) === JSON.stringify(expectedValue);
}

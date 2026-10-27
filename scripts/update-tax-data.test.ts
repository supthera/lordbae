import assert from "node:assert/strict";
import test from "node:test";

import {
  JURISDICTIONS,
  computeRate,
  parseCensusNumber,
  parseCensusTable,
  rateChanges,
  validateRecords,
  type StateTaxRecord,
} from "./update-tax-data";

function fixture(rate: number, overrides: Partial<StateTaxRecord> = {}): StateTaxRecord[] {
  return JURISDICTIONS.map((state) => ({
    name: state.name,
    abbr: state.abbr,
    fips: state.fips,
    rate,
    medianTaxPaid: 1,
    medianHomeValue: 1,
    ...overrides,
  }));
}

test("parseCensusNumber rejects sentinels, zero, and null", () => {
  assert.equal(parseCensusNumber("-666666666"), null);
  assert.equal(parseCensusNumber("-999999999"), null);
  assert.equal(parseCensusNumber("0"), null);
  assert.equal(parseCensusNumber(null), null);
  assert.equal(parseCensusNumber(" 1500 "), 1500);
});

test("computeRate rounds to two decimals", () => {
  assert.equal(computeRate(2500, 200000), 1.25);
  assert.equal(computeRate(1, 3), 33.33);
});

test("validateRecords accepts one complete synthetic set", () => {
  assert.deepEqual(validateRecords(fixture(1.25)), []);
});

test("validateRecords rejects a short list, a duplicate, and an out-of-range rate", () => {
  const records = fixture(1.25);
  const short = validateRecords(records.slice(0, 50));
  assert.ok(short.some((error) => error.includes("Expected 51")));

  const duplicated = fixture(1.25);
  duplicated[1] = { ...duplicated[0] };
  const dupErrors = validateRecords(duplicated);
  assert.ok(dupErrors.some((error) => error.includes("Duplicate")));

  const high = fixture(1.25);
  high[0] = { ...high[0], rate: 3.01 };
  assert.ok(validateRecords(high).some((error) => error.includes("outside")));

  const low = fixture(1.25);
  low[0] = { ...low[0], rate: 0.09 };
  assert.ok(validateRecords(low).some((error) => error.includes("outside")));
});

test("parseCensusTable drops Puerto Rico and uses the static names", () => {
  const rows = [
    ["NAME", "B25103_001E", "B25077_001E", "state"],
    ...JURISDICTIONS.map((state) => [state.name, "2000", "200000", state.fips]),
    ["Puerto Rico", "2000", "200000", "72"],
  ];
  const records = parseCensusTable(rows);
  assert.equal(records.length, 51);
  assert.equal(records.some((state) => state.fips === "72"), false);
  assert.equal(records.find((state) => state.fips === "11")?.abbr, "DC");
  assert.equal(records[0]?.rate, 1);
});

test("rateChanges flags only moves larger than half a point", () => {
  const previous = fixture(1);
  const next = fixture(1);
  next[0] = { ...next[0], rate: 1.6 };
  next[1] = { ...next[1], rate: 1.5 };
  const changes = rateChanges(previous, next);
  assert.deepEqual(
    changes.map((change) => change.abbr),
    [next[0].abbr],
  );
});

import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Static reference only. Rates are never stored here. */
export const JURISDICTIONS = [
  { fips: "01", abbr: "AL", name: "Alabama" },
  { fips: "02", abbr: "AK", name: "Alaska" },
  { fips: "04", abbr: "AZ", name: "Arizona" },
  { fips: "05", abbr: "AR", name: "Arkansas" },
  { fips: "06", abbr: "CA", name: "California" },
  { fips: "08", abbr: "CO", name: "Colorado" },
  { fips: "09", abbr: "CT", name: "Connecticut" },
  { fips: "10", abbr: "DE", name: "Delaware" },
  { fips: "11", abbr: "DC", name: "District of Columbia" },
  { fips: "12", abbr: "FL", name: "Florida" },
  { fips: "13", abbr: "GA", name: "Georgia" },
  { fips: "15", abbr: "HI", name: "Hawaii" },
  { fips: "16", abbr: "ID", name: "Idaho" },
  { fips: "17", abbr: "IL", name: "Illinois" },
  { fips: "18", abbr: "IN", name: "Indiana" },
  { fips: "19", abbr: "IA", name: "Iowa" },
  { fips: "20", abbr: "KS", name: "Kansas" },
  { fips: "21", abbr: "KY", name: "Kentucky" },
  { fips: "22", abbr: "LA", name: "Louisiana" },
  { fips: "23", abbr: "ME", name: "Maine" },
  { fips: "24", abbr: "MD", name: "Maryland" },
  { fips: "25", abbr: "MA", name: "Massachusetts" },
  { fips: "26", abbr: "MI", name: "Michigan" },
  { fips: "27", abbr: "MN", name: "Minnesota" },
  { fips: "28", abbr: "MS", name: "Mississippi" },
  { fips: "29", abbr: "MO", name: "Missouri" },
  { fips: "30", abbr: "MT", name: "Montana" },
  { fips: "31", abbr: "NE", name: "Nebraska" },
  { fips: "32", abbr: "NV", name: "Nevada" },
  { fips: "33", abbr: "NH", name: "New Hampshire" },
  { fips: "34", abbr: "NJ", name: "New Jersey" },
  { fips: "35", abbr: "NM", name: "New Mexico" },
  { fips: "36", abbr: "NY", name: "New York" },
  { fips: "37", abbr: "NC", name: "North Carolina" },
  { fips: "38", abbr: "ND", name: "North Dakota" },
  { fips: "39", abbr: "OH", name: "Ohio" },
  { fips: "40", abbr: "OK", name: "Oklahoma" },
  { fips: "41", abbr: "OR", name: "Oregon" },
  { fips: "42", abbr: "PA", name: "Pennsylvania" },
  { fips: "44", abbr: "RI", name: "Rhode Island" },
  { fips: "45", abbr: "SC", name: "South Carolina" },
  { fips: "46", abbr: "SD", name: "South Dakota" },
  { fips: "47", abbr: "TN", name: "Tennessee" },
  { fips: "48", abbr: "TX", name: "Texas" },
  { fips: "49", abbr: "UT", name: "Utah" },
  { fips: "50", abbr: "VT", name: "Vermont" },
  { fips: "51", abbr: "VA", name: "Virginia" },
  { fips: "53", abbr: "WA", name: "Washington" },
  { fips: "54", abbr: "WV", name: "West Virginia" },
  { fips: "55", abbr: "WI", name: "Wisconsin" },
  { fips: "56", abbr: "WY", name: "Wyoming" },
] as const;

export const DATASET = "acs5" as const;
export const PUERTO_RICO_FIPS = "72";
export const MIN_RATE = 0.1;
export const MAX_RATE = 3;
export const RATE_CHANGE_WARNING = 0.5;

export type Jurisdiction = (typeof JURISDICTIONS)[number];

export type StateTaxRecord = {
  name: string;
  abbr: string;
  fips: string;
  rate: number;
  medianTaxPaid: number;
  medianHomeValue: number;
};

export type TaxDataFile = {
  meta: {
    year: number | null;
    dataset: "acs5" | "acs1";
    source: string;
    generatedAt: string | null;
  };
  states: StateTaxRecord[];
};

export type RateChange = {
  name: string;
  abbr: string;
  previous: number;
  next: number;
  delta: number;
};

const lookup = new Map<string, Jurisdiction>(JURISDICTIONS.map((state) => [state.fips, state]));

/** Census publishes estimates as strings and uses large negatives as sentinels. */
export function parseCensusNumber(raw: string | null | undefined): number | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.toLowerCase() === "null") return null;
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

/** Effective rate, in percent, from median tax paid and median home value. */
export function computeRate(medianTaxPaid: number, medianHomeValue: number): number {
  return Math.round((medianTaxPaid / medianHomeValue) * 100 * 100) / 100;
}

export function parseCensusTable(rows: unknown): StateTaxRecord[] {
  if (!Array.isArray(rows) || rows.length < 2) {
    throw new Error("Census response was not a data table.");
  }

  const header = rows[0];
  if (!Array.isArray(header)) throw new Error("Census response was missing a header row.");

  const nameIndex = header.indexOf("NAME");
  const taxIndex = header.indexOf("B25103_001E");
  const valueIndex = header.indexOf("B25077_001E");
  const fipsIndex = header.indexOf("state");
  if (nameIndex < 0 || taxIndex < 0 || valueIndex < 0 || fipsIndex < 0) {
    throw new Error("Census response was missing NAME, B25103_001E, B25077_001E, or state.");
  }

  const records: StateTaxRecord[] = [];
  for (const row of rows.slice(1)) {
    if (!Array.isArray(row)) continue;
    const fips = String(row[fipsIndex] ?? "").padStart(2, "0");
    if (fips === PUERTO_RICO_FIPS) continue;
    const known = lookup.get(fips);
    if (!known) continue;

    const medianTaxPaid = parseCensusNumber(row[taxIndex] == null ? null : String(row[taxIndex]));
    const medianHomeValue = parseCensusNumber(row[valueIndex] == null ? null : String(row[valueIndex]));
    if (medianTaxPaid == null || medianHomeValue == null) {
      throw new Error(`Missing a usable Census estimate for ${known.name} (${fips}).`);
    }

    records.push({
      name: known.name,
      abbr: known.abbr,
      fips,
      rate: computeRate(medianTaxPaid, medianHomeValue),
      medianTaxPaid,
      medianHomeValue,
    });
  }

  return records;
}

export function validateRecords(records: StateTaxRecord[]): string[] {
  const errors: string[] = [];
  if (records.length !== JURISDICTIONS.length) {
    errors.push(`Expected ${JURISDICTIONS.length} jurisdictions, received ${records.length}.`);
  }

  const fipsSeen = new Set<string>();
  const abbrSeen = new Set<string>();
  for (const record of records) {
    if (fipsSeen.has(record.fips)) errors.push(`Duplicate FIPS ${record.fips}.`);
    if (abbrSeen.has(record.abbr)) errors.push(`Duplicate abbreviation ${record.abbr}.`);
    fipsSeen.add(record.fips);
    abbrSeen.add(record.abbr);

    const known = lookup.get(record.fips);
    if (!known || known.abbr !== record.abbr || known.name !== record.name) {
      errors.push(`FIPS ${record.fips} does not match the static jurisdiction list.`);
    }
    if (!(record.rate >= MIN_RATE && record.rate <= MAX_RATE)) {
      errors.push(`${record.name} rate ${record.rate} is outside ${MIN_RATE}–${MAX_RATE}.`);
    }
  }

  for (const state of JURISDICTIONS) {
    if (!fipsSeen.has(state.fips)) errors.push(`Missing ${state.name} (${state.fips}).`);
  }

  return errors;
}

export function rateChanges(previous: StateTaxRecord[], next: StateTaxRecord[]): RateChange[] {
  const prior = new Map(previous.map((state) => [state.fips, state]));
  const changes: RateChange[] = [];
  for (const state of next) {
    const before = prior.get(state.fips);
    if (!before) continue;
    const delta = Math.round((state.rate - before.rate) * 100) / 100;
    if (Math.abs(delta) > RATE_CHANGE_WARNING) {
      changes.push({
        name: state.name,
        abbr: state.abbr,
        previous: before.rate,
        next: state.rate,
        delta,
      });
    }
  }
  return changes.sort((a, b) => a.name.localeCompare(b.name));
}

export function renderChangeReport(changes: RateChange[], year: number): string {
  const lines = [
    `# Property tax rate changes over ${RATE_CHANGE_WARNING} percentage points`,
    "",
    `ACS ${DATASET} vintage ${year}.`,
    "",
    "| State | Previous | Next | Change |",
    "| --- | ---: | ---: | ---: |",
    ...changes.map(
      (change) =>
        `| ${change.name} | ${change.previous.toFixed(2)} | ${change.next.toFixed(2)} | ${change.delta.toFixed(2)} |`,
    ),
    "",
  ];
  return lines.join("\n");
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(root, "data", "state-tax-rates.json");
const reportPath = path.join(root, "data", "changes-report.md");

async function readExisting(): Promise<TaxDataFile | null> {
  try {
    const raw = await readFile(dataPath, "utf8");
    return JSON.parse(raw) as TaxDataFile;
  } catch {
    return null;
  }
}

async function fetchVintage(year: number, key: string): Promise<unknown> {
  const url = new URL(`https://api.census.gov/data/${year}/acs/${DATASET}`);
  url.searchParams.set("get", "NAME,B25103_001E,B25077_001E");
  url.searchParams.set("for", "state:*");
  url.searchParams.set("key", key);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Census API returned HTTP ${response.status} for ${year}.`);
  }
  return response.json();
}

async function main() {
  const key = process.env.CENSUS_API_KEY?.trim();
  if (!key) {
    console.error("CENSUS_API_KEY is not set. Create a key at https://api.census.gov/data/key_signup.html and export it before running this script.");
    process.exit(1);
  }

  const startYear = new Date().getUTCFullYear() - 1;
  let table: unknown = null;
  let year = startYear;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    year = startYear - attempt;
    try {
      const payload = await fetchVintage(year, key);
      if (Array.isArray(payload)) {
        table = payload;
        break;
      }
      console.warn(`ACS ${DATASET} ${year} did not return a table. Trying an earlier vintage.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`${message} Trying an earlier vintage.`);
    }
  }

  if (!Array.isArray(table)) {
    console.error(`No ACS ${DATASET} state table was available for ${startYear}, ${startYear - 1}, or ${startYear - 2}.`);
    process.exit(1);
  }

  const records = parseCensusTable(table).sort((a, b) => a.name.localeCompare(b.name));
  const errors = validateRecords(records);
  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  const existing = await readExisting();
  const changes = rateChanges(existing?.states ?? [], records);
  await mkdir(path.dirname(dataPath), { recursive: true });
  if (changes.length > 0) {
    console.warn("Rates moved by more than 0.5 percentage points:");
    console.table(changes);
    await writeFile(reportPath, renderChangeReport(changes, year));
  } else {
    await rm(reportPath, { force: true });
  }

  const file: TaxDataFile = {
    meta: {
      year,
      dataset: DATASET,
      source: "U.S. Census Bureau ACS (B25103 ÷ B25077)",
      generatedAt: new Date().toISOString(),
    },
    states: records,
  };
  await writeFile(dataPath, `${JSON.stringify(file, null, 2)}\n`);
  console.log(`Wrote ${records.length} jurisdictions from ACS ${DATASET} ${year} to ${path.relative(root, dataPath)}.`);
}

const entry = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (entry === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}

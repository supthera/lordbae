"use client";

import { useId, useMemo, useState } from "react";

import bundled from "@/data/state-tax-rates.json";

/**
 * One jurisdiction, as written by scripts/update-tax-data.ts.
 * Rates are never hardcoded in this component; they arrive from the JSON file.
 */
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

/** Column and menu sorts. Rank is not a sort key; it stays tied to the rate. */
export type SortKey = "name-asc" | "name-desc" | "rate-desc" | "rate-asc";

type ViewMode = "table" | "list";
type Band = "highest" | "lowest" | null;

type RankedState = StateTaxRecord & {
  rank: number;
  band: Band;
};

type PropertyTaxByStateProps = {
  /** Overrides the bundled JSON. Useful in tests and previews. */
  data?: TaxDataFile;
  defaultSort?: SortKey;
  className?: string;
};

const bundledData = bundled as TaxDataFile;

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name-asc", label: "State A–Z" },
  { value: "name-desc", label: "State Z–A" },
  { value: "rate-desc", label: "Rate high→low" },
  { value: "rate-asc", label: "Rate low→high" },
];

function datasetLabel(dataset: TaxDataFile["meta"]["dataset"]) {
  return dataset === "acs1" ? "1-year" : "5-year";
}

function formatRate(rate: number) {
  return `${rate.toFixed(2)}%`;
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Competition rank on the full list: equal rates share a rank, and the next
 * rank skips. Alphabetical order only stabilizes the list; it does not split ties.
 */
function competitionRanks(states: StateTaxRecord[]) {
  const ordered = [...states].sort((a, b) => b.rate - a.rate || a.name.localeCompare(b.name));
  const ranks = new Map<string, number>();
  let rank = 0;
  let previousRate = Number.NaN;

  ordered.forEach((state, index) => {
    if (state.rate !== previousRate) {
      rank = index + 1;
      previousRate = state.rate;
    }
    ranks.set(state.fips, rank);
  });

  return ranks;
}

/**
 * Top and bottom five by rate. A tie that crosses the cutoff is included, so a
 * band can hold more than five states. Overlap (a very small or flat file) is
 * left for the caller to drop.
 */
function extremeBands(states: StateTaxRecord[]) {
  const highest = new Set<string>();
  const lowest = new Set<string>();
  if (states.length === 0) return { highest, lowest };

  const byRate = [...states].sort((a, b) => b.rate - a.rate || a.name.localeCompare(b.name));
  const edge = Math.min(4, byRate.length - 1);
  const highCutoff = byRate[edge]?.rate;
  const lowCutoff = byRate[byRate.length - 1 - edge]?.rate;
  if (highCutoff == null || lowCutoff == null) return { highest, lowest };

  for (const state of byRate) {
    if (state.rate >= highCutoff) highest.add(state.fips);
    if (state.rate <= lowCutoff) lowest.add(state.fips);
  }

  return { highest, lowest };
}

function rankStates(states: StateTaxRecord[]): RankedState[] {
  const ranks = competitionRanks(states);
  const { highest, lowest } = extremeBands(states);

  return states.map((state) => {
    const inHighest = highest.has(state.fips);
    const inLowest = lowest.has(state.fips);
    let band: Band = null;
    if (inHighest && !inLowest) band = "highest";
    else if (inLowest && !inHighest) band = "lowest";

    return {
      ...state,
      rank: ranks.get(state.fips) ?? 0,
      band,
    };
  });
}

function compareStates(sort: SortKey) {
  return (a: RankedState, b: RankedState) => {
    switch (sort) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "rate-asc":
        return a.rate - b.rate || a.name.localeCompare(b.name);
      case "rate-desc":
        return b.rate - a.rate || a.name.localeCompare(b.name);
    }
  };
}

function footerCopy(meta: TaxDataFile["meta"]) {
  const vintage = meta.year == null ? datasetLabel(meta.dataset) : `${datasetLabel(meta.dataset)} ${meta.year}`;
  return `Effective rates computed from U.S. Census ACS ${vintage} (median real estate taxes paid ÷ median home value). Data is approximate and varies significantly by county.`;
}

function BandBadge({ band }: { band: Exclude<Band, null> }) {
  const highest = band === "highest";
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center border px-1.5 py-0.5 text-[0.62rem] tracking-[0.16em] uppercase",
        highest
          ? "border-rose-200 bg-rose-50 text-rose-900 dark:border-[#c80e0e] dark:bg-[rgba(200,14,14,0.18)] dark:text-[#f4efe6]"
          : "border-amber-200 bg-amber-50 text-amber-950 dark:border-[#c6b49a] dark:bg-[rgba(198,180,154,0.14)] dark:text-[#c6b49a]",
      )}
    >
      {highest ? "Highest" : "Lowest"}
    </span>
  );
}

function rowTone(band: Band) {
  if (band === "highest") return "bg-rose-50 dark:bg-[rgba(200,14,14,0.12)]";
  if (band === "lowest") return "bg-amber-50 dark:bg-[rgba(198,180,154,0.1)]";
  return "even:bg-slate-50 dark:even:bg-white/[0.035]";
}

function SortGlyph({ active, direction }: { active: boolean; direction: "ascending" | "descending" }) {
  return (
    <span aria-hidden="true" className={cx("ml-1 inline-block w-3 text-[0.7rem]", active ? "opacity-100" : "opacity-35")}>
      {!active ? "↕" : direction === "ascending" ? "↑" : "↓"}
    </span>
  );
}

export default function PropertyTaxByState({
  data = bundledData,
  defaultSort = "rate-desc",
  className,
}: PropertyTaxByStateProps) {
  const searchId = useId();
  const sortId = useId();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>(defaultSort);
  const [view, setView] = useState<ViewMode>("table");

  const states = data.states ?? [];
  const ready = states.length > 0;

  // Rank and bands are derived from the full file so search and name sorts cannot move them.
  const ranked = useMemo(() => rankStates(data.states ?? []), [data]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matched = needle
      ? ranked.filter(
          (state) => state.name.toLowerCase().includes(needle) || state.abbr.toLowerCase().includes(needle),
        )
      : ranked;
    return [...matched].sort(compareStates(sort));
  }, [ranked, query, sort]);

  const announcement = !ready
    ? "Data not yet generated."
    : visible.length === 0
      ? "No states match your search."
      : `Showing ${visible.length} of ${states.length} states.`;

  function toggleSort(key: "name" | "rate") {
    setSort((current) => {
      if (key === "name") return current === "name-asc" ? "name-desc" : "name-asc";
      return current === "rate-desc" ? "rate-asc" : "rate-desc";
    });
  }

  const nameSort = sort === "name-asc" ? "ascending" : sort === "name-desc" ? "descending" : "none";
  const rateSort = sort === "rate-asc" ? "ascending" : sort === "rate-desc" ? "descending" : "none";

  return (
    <section className={cx("dark text-slate-900 dark:text-[#f4efe6]", className)}>
      {ready ? (
        <>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <label htmlFor={searchId} className="text-[0.68rem] tracking-[0.22em] text-slate-500 uppercase dark:text-[#c6b49a]">
                Search
              </label>
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="State or abbreviation"
                autoComplete="off"
                className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus-visible:border-slate-900 dark:border-[rgba(244,239,230,0.16)] dark:bg-[#0a0a0a] dark:text-[#f4efe6] dark:placeholder:text-[#6f6a63] dark:focus-visible:border-[#c6b49a]"
              />
            </div>
            <div
              role="group"
              aria-label="Layout"
              className="inline-flex w-full border border-slate-300 sm:w-auto dark:border-[rgba(244,239,230,0.16)]"
            >
              {(
                [
                  ["table", "Table view"],
                  ["list", "Compact list view"],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={view === mode}
                  onClick={() => setView(mode)}
                  className={cx(
                    "flex-1 px-3 py-2.5 text-[0.68rem] tracking-[0.16em] uppercase focus-visible:relative focus-visible:z-10 sm:flex-none sm:px-4",
                    view === mode
                      ? "bg-slate-900 text-white dark:bg-[#f4efe6] dark:text-[#0a0a0a]"
                      : "bg-white text-slate-600 dark:bg-transparent dark:text-[#a39c92]",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label htmlFor={sortId} className={cx("text-sm", view === "table" && "md:hidden")}>
              <span className="sr-only">Sort</span>
              <select
                id={sortId}
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 sm:w-auto dark:border-[rgba(244,239,230,0.16)] dark:bg-[#0a0a0a] dark:text-[#f4efe6]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <p aria-live="polite" className="text-sm text-slate-500 tabular-nums dark:text-[#a39c92]">
              {announcement}
            </p>
          </div>

          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-[#a39c92]">
            <li className="inline-flex items-center gap-2">
              <BandBadge band="highest" />
              Five highest rates
            </li>
            <li className="inline-flex items-center gap-2">
              <BandBadge band="lowest" />
              Five lowest rates
            </li>
          </ul>
        </>
      ) : (
        <p aria-live="polite" className="border-y border-slate-200 py-16 text-center text-sm text-slate-600 dark:border-[rgba(244,239,230,0.16)] dark:text-[#d9d2c6]">
          Data not yet generated. Run the update script.
        </p>
      )}

      {ready && visible.length === 0 ? (
        <p className="mt-8 border-y border-slate-200 py-16 text-center text-sm text-slate-600 dark:border-[rgba(244,239,230,0.16)] dark:text-[#d9d2c6]">
          No states match your search.
        </p>
      ) : null}

      {ready && visible.length > 0 && view === "table" ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <caption className="sr-only">Effective residential property tax rates by state</caption>
            <thead>
              <tr className="border-b border-slate-200 text-[0.68rem] tracking-[0.18em] text-slate-500 uppercase dark:border-[rgba(244,239,230,0.16)] dark:text-[#a39c92]">
                <th scope="col" className="w-16 py-3 pr-4 font-medium">
                  Rank
                </th>
                <th scope="col" aria-sort={nameSort} className="py-3 pr-4 font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort("name")}
                    className="inline-flex items-center focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-slate-900 dark:focus-visible:outline-[#c6b49a]"
                  >
                    State
                    <SortGlyph active={nameSort !== "none"} direction={nameSort === "ascending" ? "ascending" : "descending"} />
                  </button>
                </th>
                <th scope="col" className="w-36 py-3 pr-4 font-medium">
                  Abbreviation
                </th>
                <th scope="col" aria-sort={rateSort} className="py-3 text-right font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort("rate")}
                    className="inline-flex items-center focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-slate-900 dark:focus-visible:outline-[#c6b49a]"
                  >
                    Effective Tax Rate
                    <SortGlyph active={rateSort !== "none"} direction={rateSort === "ascending" ? "ascending" : "descending"} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((state) => (
                <tr key={state.fips} className={cx("border-b border-slate-200 dark:border-[rgba(244,239,230,0.16)]", rowTone(state.band))}>
                  <td className="py-3.5 pr-4 text-slate-500 tabular-nums dark:text-[#a39c92]">{state.rank}</td>
                  <td className="py-3.5 pr-4">{state.name}</td>
                  <td className="py-3.5 pr-4 tracking-[0.14em] text-slate-500 uppercase dark:text-[#a39c92]">{state.abbr}</td>
                  <td className="py-3.5 text-right">
                    <span className="inline-flex items-center justify-end gap-3">
                      {state.band ? <BandBadge band={state.band} /> : null}
                      <span className="text-base font-semibold tabular-nums">{formatRate(state.rate)}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {ready && visible.length > 0 && view === "list" ? (
        <ul className="mt-6 border-t border-slate-200 dark:border-[rgba(244,239,230,0.16)]">
          {visible.map((state) => (
            <li
              key={state.fips}
              className={cx(
                "flex items-baseline gap-4 border-b border-slate-200 px-2 py-3.5 dark:border-[rgba(244,239,230,0.16)]",
                rowTone(state.band),
              )}
            >
              <span className="w-8 shrink-0 text-sm text-slate-500 tabular-nums dark:text-[#a39c92]">{state.rank}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate">{state.name}</span>
                <span className="text-[0.68rem] tracking-[0.16em] text-slate-500 uppercase dark:text-[#a39c92]">{state.abbr}</span>
              </span>
              {state.band ? <BandBadge band={state.band} /> : null}
              <span className="text-base font-semibold tabular-nums">{formatRate(state.rate)}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-slate-500 dark:text-[#8f887f]">{footerCopy(data.meta)}</p>
    </section>
  );
}

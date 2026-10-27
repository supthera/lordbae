# Lord Bae

A private portfolio of residences. Dark, editorial, and deliberately small.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

This repository is the app. Import it on Vercel as its own project and set `NEXT_PUBLIC_SITE_URL` to the public origin so Open Graph URLs resolve.

Inquiry notes are validated and acknowledged. Wire the route in `app/api/inquiry/route.ts` to your private mail provider before relying on it for correspondence.

## Logo

The lockup is the knight engraving in `public/brand/knight.png` beside the gothic wordmark in `public/brand/lord-bae-wordmark.png`.

The tab icon is the crossed-swords emoji: `public/favicon.svg`, `public/favicon.ico`, and `public/apple-touch-icon.png`.

## Property tax rates

Effective residential rates for the 50 states and the District of Columbia are computed at runtime from the U.S. Census Bureau American Community Survey. The site never stores rates by hand. `data/state-tax-rates.json` ships empty until the update script writes it.

### Setup

```bash
npm install
```

`tsx` runs the script on Node 20+. The component reads the JSON file and needs no extra runtime dependencies.

### Census API key

Request a key at [api.census.gov/data/key_signup.html](https://api.census.gov/data/key_signup.html). Export it in the shell when running locally, and store the same value as the `CENSUS_API_KEY` repository secret so the monthly workflow can open a pull request.

```bash
export CENSUS_API_KEY=your_key_here
npm run update-tax-data
```

The script starts at last year and steps back up to three vintages until ACS returns a state table. It writes `data/state-tax-rates.json`. If any rate moves by more than 0.5 percentage points, it prints a warning and writes `data/changes-report.md`. The script exits non-zero when the key is missing, the vintage cannot be fetched, or the 51 jurisdictions fail validation.

### Change the ACS vintage

Open `scripts/update-tax-data.ts` and set `DATASET` to `"acs5"` (5-year, the default) or `"acs1"` (1-year). The workflow and the component both follow that value. Year selection stays automatic.

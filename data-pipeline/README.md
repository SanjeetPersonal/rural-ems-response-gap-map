# Data Pipeline

Offline, manually-run pipeline that produces the static data assets the app serves:
`output/zip-lookup.json` and `output/zcta.pmtiles`.

This is **not** run as part of `next build` or the Vercel build step. It hits
external APIs, downloads ~150MB of raw data, and does non-trivial spatial
computation -- run it locally, then copy `output/` into the app's `public/`
directory and commit the result.

## Usage

```
cd data-pipeline
npm install
npm run all          # runs every step, skipping ones whose output already exists
npm run all -- --force   # re-run every step from scratch
```

Individual steps (see `package.json` scripts) can also be run one at a time,
e.g. `npm run compute:estimate` after editing the response-time model in
`../shared/model-constants.ts`.

Requires [tippecanoe](https://github.com/felt/tippecanoe) on PATH (`brew install tippecanoe`)
for the tile-building step.

## Re-copying output into the app

```
cp output/zip-lookup.json ../public/data/zip-lookup.json
cp output/methodology-stats.json ../public/data/methodology-stats.json
cp output/zcta.pmtiles ../public/tiles/zcta.pmtiles
```

## Data sources (see `sources.ts` for exact URLs)

- HIFLD Emergency Medical Service (EMS) Stations
- HIFLD Fire Stations
- US Census Bureau 2024 ZCTA Gazetteer (centroids)
- US Census Bureau 2020 ZCTA Cartographic Boundaries, 500k (map polygons)
- USDA ERS 2020 Rural-Urban Commuting Area (RUCA) Codes, ZIP code version

## Known limitations (also surfaced on the app's `/methodology` page)

- Response-time estimates are a **model**, not measured data: haversine
  distance to the nearest known station, run through a rurality-bucketed
  average-speed + dispatch-turnout formula. They are not routing-engine
  drive times and do not account for staffing/volunteer availability.
- HIFLD station data can have gaps in rural areas served by small volunteer
  departments. Zips whose nearest station is >50mi away are flagged
  `lowConfidence: true` rather than presented as a confident number.

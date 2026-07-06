import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { resolveFromScript } from "./lib/paths.ts";
import type { ZipEstimate } from "./compute-estimate.ts";
import { RESPONSE_BUCKETS, MODEL_VERSION } from "../shared/model-constants.ts";

// Generation date is stamped once here (this pipeline is run manually and
// offline, not on every deploy) -- not a Date.now() call inside a hot path.
const GENERATED_AT = new Date().toISOString().slice(0, 10);

function main() {
  const intermediateDir = resolveFromScript(import.meta.url, "intermediate");
  const outputDir = resolveFromScript(import.meta.url, "output");
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const estimates: ZipEstimate[] = JSON.parse(
    readFileSync(path.join(intermediateDir, "estimates.json"), "utf-8")
  );

  const bucketLabelById = new Map(RESPONSE_BUCKETS.map((b) => [b.id, b.label]));

  const lookup: Record<string, unknown> = {};
  for (const e of estimates) {
    lookup[e.zip] = {
      zip: e.zip,
      lat: e.lat,
      lon: e.lon,
      rurality: e.rurality,
      estMinutes: e.estMinutes,
      bucketId: e.bucketId,
      bucketLabel: bucketLabelById.get(e.bucketId) ?? e.bucketId,
      lowConfidence: e.lowConfidence,
      nearestStation: e.nearestStation,
      modelVersion: MODEL_VERSION,
      generatedAt: GENERATED_AT,
    };
  }

  const outPath = path.join(outputDir, "zip-lookup.json");
  writeFileSync(outPath, JSON.stringify(lookup));
  console.log(`Wrote ${Object.keys(lookup).length} zip records -> ${outPath}`);

  const stats = {
    zipCount: Object.keys(lookup).length,
    generatedAt: GENERATED_AT,
    modelVersion: MODEL_VERSION,
    lowConfidenceCount: estimates.filter((e) => e.lowConfidence).length,
    dataSources: [
      "HIFLD Emergency Medical Service (EMS) Stations",
      "HIFLD Fire Stations",
      "US Census Bureau 2024 ZCTA Gazetteer",
      "US Census Bureau 2020 ZCTA Cartographic Boundaries (500k)",
      "USDA ERS 2020 Rural-Urban Commuting Area (RUCA) Codes, ZIP code version",
    ],
  };
  writeFileSync(
    path.join(outputDir, "methodology-stats.json"),
    JSON.stringify(stats, null, 2)
  );
  console.log("Wrote output/methodology-stats.json");
}

main();

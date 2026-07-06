import { existsSync } from "fs";
import path from "path";
import { execSync } from "child_process";
import { resolveFromScript } from "./lib/paths.ts";

interface Step {
  name: string;
  command: string;
  outputCheck: string; // file that must exist for this step to be considered done
}

const rawDir = resolveFromScript(import.meta.url, "raw");
const intermediateDir = resolveFromScript(import.meta.url, "intermediate");
const outputDir = resolveFromScript(import.meta.url, "output");

const steps: Step[] = [
  { name: "fetch:hifld", command: "npx tsx fetch-hifld.ts", outputCheck: path.join(rawDir, "ems_stations.geojson") },
  { name: "fetch:gazetteer", command: "npx tsx fetch-census-gazetteer.ts", outputCheck: path.join(rawDir, "zcta_centroids.txt") },
  { name: "fetch:boundaries", command: "npx tsx fetch-census-boundaries.ts", outputCheck: path.join(rawDir, "zcta_boundaries", "cb_2020_us_zcta520_500k.shp") },
  { name: "fetch:rurality", command: "npx tsx fetch-rurality.ts", outputCheck: path.join(rawDir, "ruca_zip.csv") },
  { name: "clean", command: "npx tsx clean.ts", outputCheck: path.join(intermediateDir, "zips.json") },
  { name: "compute:nearest", command: "npx tsx compute-nearest-station.ts", outputCheck: path.join(intermediateDir, "nearest-station.json") },
  { name: "compute:estimate", command: "npx tsx compute-estimate.ts", outputCheck: path.join(intermediateDir, "estimates.json") },
  { name: "build:lookup", command: "npx tsx build-zip-lookup.ts", outputCheck: path.join(outputDir, "zip-lookup.json") },
  { name: "build:tiles (join)", command: "npx tsx build-tiles.ts", outputCheck: path.join(intermediateDir, "zcta_joined.geojsonl") },
  { name: "build:tiles (tippecanoe)", command: "bash build-tiles.sh", outputCheck: path.join(outputDir, "zcta.pmtiles") },
  { name: "validate", command: "npx tsx validate.ts", outputCheck: "" }, // always re-run
];

const force = process.argv.includes("--force");

for (const step of steps) {
  if (!force && step.outputCheck && existsSync(step.outputCheck)) {
    console.log(`SKIP  ${step.name} (output already exists: ${step.outputCheck})`);
    continue;
  }
  console.log(`RUN   ${step.name}`);
  execSync(step.command, { stdio: "inherit", cwd: resolveFromScript(import.meta.url) });
}

console.log("\nPipeline complete.");

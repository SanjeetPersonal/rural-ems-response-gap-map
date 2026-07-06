import { readFileSync } from "fs";
import path from "path";
import { resolveFromScript } from "./lib/paths.ts";

interface ZipLookupEntry {
  zip: string;
  lat: number;
  lon: number;
  estMinutes: number;
  bucketId: string;
  lowConfidence: boolean;
  nearestStation: { distanceMiles: number };
}

function fail(message: string): never {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function main() {
  const outputDir = resolveFromScript(import.meta.url, "output");
  const lookup: Record<string, ZipLookupEntry> = JSON.parse(
    readFileSync(path.join(outputDir, "zip-lookup.json"), "utf-8")
  );
  const entries = Object.values(lookup);

  console.log(`Loaded ${entries.length} zip-lookup entries.`);

  if (entries.length < 30000) {
    fail(`Expected at least 30,000 zips, got ${entries.length}`);
  }

  let nanCount = 0;
  let badCoordCount = 0;
  for (const e of entries) {
    if (!Number.isFinite(e.estMinutes) || e.estMinutes <= 0) nanCount++;
    if (!Number.isFinite(e.lat) || !Number.isFinite(e.lon)) badCoordCount++;
  }
  if (nanCount > 0) fail(`${nanCount} entries have invalid estMinutes`);
  if (badCoordCount > 0) fail(`${badCoordCount} entries have invalid coordinates`);
  console.log("PASS: no null/NaN estimates or coordinates.");

  const byBucket: Record<string, number> = {};
  for (const e of entries) byBucket[e.bucketId] = (byBucket[e.bucketId] ?? 0) + 1;
  const maxShare = Math.max(...Object.values(byBucket)) / entries.length;
  console.log("Bucket distribution:", byBucket);
  if (maxShare > 0.98) {
    fail(`One bucket holds ${(maxShare * 100).toFixed(1)}% of all zips -- degenerate distribution`);
  }
  console.log("PASS: bucket distribution is not degenerate.");

  const lowConfidence = entries.filter((e) => e.lowConfidence);
  console.log(
    `Low-confidence zips (nearest station far away, likely a HIFLD data gap): ${lowConfidence.length} ` +
      `(${((lowConfidence.length / entries.length) * 100).toFixed(2)}%)`
  );
  if (lowConfidence.length / entries.length > 0.05) {
    fail(`Low-confidence rate is ${((lowConfidence.length / entries.length) * 100).toFixed(1)}% -- higher than expected, investigate station data coverage`);
  }
  console.log("PASS: low-confidence rate within expected range.");

  console.log("\nAll validation checks passed.");
}

main();

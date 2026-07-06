import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { resolveFromScript } from "./lib/paths.ts";
import {
  AVG_SPEED_MPH_BY_RURALITY,
  DISPATCH_TURNOUT_MINUTES,
  IMPLAUSIBLE_DISTANCE_MILES,
  MODEL_VERSION,
  bucketForMinutes,
  type Rurality,
} from "../shared/model-constants.ts";

interface ZipRecord {
  zip: string;
  lat: number;
  lon: number;
  alandSqMi: number;
  rurality: Rurality;
}

interface NearestStationResult {
  zip: string;
  nearestStation: {
    name: string;
    type: "EMS" | "FIRE";
    lat: number;
    lon: number;
    distanceMiles: number;
  };
}

export interface ZipEstimate {
  zip: string;
  lat: number;
  lon: number;
  rurality: Rurality;
  nearestStation: NearestStationResult["nearestStation"];
  estMinutes: number;
  bucketId: string;
  lowConfidence: boolean;
  modelVersion: string;
}

function main() {
  const intermediateDir = resolveFromScript(import.meta.url, "intermediate");

  const zips: ZipRecord[] = JSON.parse(
    readFileSync(path.join(intermediateDir, "zips.json"), "utf-8")
  );
  const nearest: NearestStationResult[] = JSON.parse(
    readFileSync(path.join(intermediateDir, "nearest-station.json"), "utf-8")
  );
  const nearestByZip = new Map(nearest.map((n) => [n.zip, n]));

  const estimates: ZipEstimate[] = [];
  let lowConfidenceCount = 0;

  for (const zip of zips) {
    const stationInfo = nearestByZip.get(zip.zip);
    if (!stationInfo) continue;

    const speed = AVG_SPEED_MPH_BY_RURALITY[zip.rurality];
    const distanceMiles = stationInfo.nearestStation.distanceMiles;
    const estMinutes =
      DISPATCH_TURNOUT_MINUTES + (distanceMiles / speed) * 60;
    const bucket = bucketForMinutes(estMinutes);
    const lowConfidence = distanceMiles > IMPLAUSIBLE_DISTANCE_MILES;
    if (lowConfidence) lowConfidenceCount++;

    estimates.push({
      zip: zip.zip,
      lat: zip.lat,
      lon: zip.lon,
      rurality: zip.rurality,
      nearestStation: stationInfo.nearestStation,
      estMinutes: Math.round(estMinutes * 10) / 10,
      bucketId: bucket.id,
      lowConfidence,
      modelVersion: MODEL_VERSION,
    });
  }

  console.log(`Computed estimates for ${estimates.length} zips`);
  console.log(`Low-confidence (nearest station >${IMPLAUSIBLE_DISTANCE_MILES}mi): ${lowConfidenceCount}`);

  const byBucket: Record<string, number> = {};
  for (const e of estimates) byBucket[e.bucketId] = (byBucket[e.bucketId] ?? 0) + 1;
  console.log("Bucket distribution:", byBucket);

  writeFileSync(
    path.join(intermediateDir, "estimates.json"),
    JSON.stringify(estimates)
  );
  console.log("Wrote intermediate/estimates.json");
}

main();

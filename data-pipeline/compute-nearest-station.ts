import { readFileSync, writeFileSync } from "fs";
import path from "path";
import KDBush from "kdbush";
import * as geokdbush from "geokdbush";
import { resolveFromScript } from "./lib/paths.ts";

interface Station {
  name: string;
  type: "EMS" | "FIRE";
  lat: number;
  lon: number;
}

interface ZipRecord {
  zip: string;
  lat: number;
  lon: number;
  alandSqMi: number;
  rurality: string;
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

const KM_TO_MILES = 0.621371;

function buildIndex(stations: Station[]): KDBush {
  const index = new KDBush(stations.length);
  for (const s of stations) index.add(s.lon, s.lat);
  index.finish();
  return index;
}

function nearestOfType(
  stations: Station[],
  index: KDBush,
  lon: number,
  lat: number
): { station: Station; distanceMiles: number } | null {
  const ids = geokdbush.around(index, lon, lat, 1);
  if (ids.length === 0) return null;
  const station = stations[ids[0]];
  const distanceKm = geokdbush.distance(lon, lat, station.lon, station.lat);
  return { station, distanceMiles: distanceKm * KM_TO_MILES };
}

function main() {
  const intermediateDir = resolveFromScript(import.meta.url, "intermediate");

  const allStations: Station[] = JSON.parse(
    readFileSync(path.join(intermediateDir, "stations.json"), "utf-8")
  );
  const zips: ZipRecord[] = JSON.parse(
    readFileSync(path.join(intermediateDir, "zips.json"), "utf-8")
  );

  const emsStations = allStations.filter((s) => s.type === "EMS");
  const fireStations = allStations.filter((s) => s.type === "FIRE");
  console.log(`Indexing ${emsStations.length} EMS and ${fireStations.length} Fire stations...`);

  const emsIndex = buildIndex(emsStations);
  const fireIndex = buildIndex(fireStations);

  const results: NearestStationResult[] = [];
  let preferredFire = 0;

  for (const zip of zips) {
    const nearestEms = nearestOfType(emsStations, emsIndex, zip.lon, zip.lat);
    const nearestFire = nearestOfType(fireStations, fireIndex, zip.lon, zip.lat);

    let chosen: { station: Station; distanceMiles: number } | null = nearestEms;
    if (
      nearestFire &&
      (!nearestEms || nearestFire.distanceMiles < nearestEms.distanceMiles)
    ) {
      chosen = nearestFire;
      preferredFire++;
    }

    if (!chosen) continue; // no station of either type found (shouldn't happen nationally)

    results.push({
      zip: zip.zip,
      nearestStation: {
        name: chosen.station.name,
        type: chosen.station.type,
        lat: chosen.station.lat,
        lon: chosen.station.lon,
        distanceMiles: Math.round(chosen.distanceMiles * 100) / 100,
      },
    });
  }

  console.log(
    `Resolved nearest station for ${results.length}/${zips.length} zips ` +
      `(fire preferred over EMS for ${preferredFire})`
  );

  writeFileSync(
    path.join(intermediateDir, "nearest-station.json"),
    JSON.stringify(results)
  );
  console.log("Wrote intermediate/nearest-station.json");
}

main();

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { parse as parseCsv } from "csv-parse/sync";
import { resolveFromScript } from "./lib/paths.ts";
import type { Rurality } from "../shared/model-constants.ts";

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
  rurality: Rurality;
}

function isValidCoord(lat: number, lon: number): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;
  if (lat === 0 && lon === 0) return false;
  // Covers CONUS, Alaska, Hawaii, and US territories (PR, VI, Guam, etc.)
  return lat >= -15 && lat <= 72 && lon >= -180 && lon <= -65;
}

function cleanStations(rawDir: string): Station[] {
  const stations: Station[] = [];
  let dropped = 0;

  for (const [file, type] of [
    ["ems_stations.geojson", "EMS"],
    ["fire_stations.geojson", "FIRE"],
  ] as const) {
    const geojson = JSON.parse(readFileSync(path.join(rawDir, file), "utf-8"));
    for (const feature of geojson.features) {
      const coords = feature.geometry?.coordinates;
      const name = feature.properties?.NAME ?? "Unnamed station";
      if (!coords || !isValidCoord(coords[1], coords[0])) {
        dropped++;
        continue;
      }
      stations.push({ name, type, lat: coords[1], lon: coords[0] });
    }
  }

  console.log(`Stations: kept ${stations.length}, dropped ${dropped} (invalid/missing coords)`);
  return stations;
}

function parseGazetteer(rawDir: string): Map<string, { lat: number; lon: number; alandSqMi: number }> {
  const text = readFileSync(path.join(rawDir, "zcta_centroids.txt"), "utf-8");
  const lines = text.trim().split("\n");
  const header = lines[0].split("\t").map((h) => h.trim());
  const idx = {
    geoid: header.indexOf("GEOID"),
    alandSqMi: header.indexOf("ALAND_SQMI"),
    lat: header.indexOf("INTPTLAT"),
    lon: header.indexOf("INTPTLONG"),
  };

  const out = new Map<string, { lat: number; lon: number; alandSqMi: number }>();
  let dropped = 0;
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split("\t");
    const zip = cols[idx.geoid]?.trim();
    const lat = parseFloat(cols[idx.lat]);
    const lon = parseFloat(cols[idx.lon]);
    const alandSqMi = parseFloat(cols[idx.alandSqMi]);
    if (!zip || !isValidCoord(lat, lon)) {
      dropped++;
      continue;
    }
    out.set(zip, { lat, lon, alandSqMi });
  }
  console.log(`Gazetteer: kept ${out.size} zips, dropped ${dropped} (invalid/missing coords)`);
  return out;
}

function rucaToRurality(primaryRuca: number): Rurality {
  if (primaryRuca <= 3) return "urban";
  if (primaryRuca <= 6) return "suburban";
  if (primaryRuca <= 9) return "rural";
  return "frontier";
}

function parseRurality(rawDir: string): Map<string, Rurality> {
  const csv = readFileSync(path.join(rawDir, "ruca_zip.csv"), "utf-8");
  const rows: Record<string, string>[] = parseCsv(csv, { columns: true, skip_empty_lines: true });

  const out = new Map<string, Rurality>();
  for (const row of rows) {
    const zip = row.ZIPCode?.trim();
    const ruca = parseInt(row.PrimaryRUCA, 10);
    if (!zip || Number.isNaN(ruca)) continue;
    out.set(zip, rucaToRurality(ruca));
  }
  console.log(`Rurality crosswalk: ${out.size} zips classified`);
  return out;
}

function main() {
  const rawDir = resolveFromScript(import.meta.url, "raw");
  const intermediateDir = resolveFromScript(import.meta.url, "intermediate");
  if (!existsSync(intermediateDir)) mkdirSync(intermediateDir, { recursive: true });

  const stations = cleanStations(rawDir);
  const centroids = parseGazetteer(rawDir);
  const rurality = parseRurality(rawDir);

  const zips: ZipRecord[] = [];
  let missingRurality = 0;
  for (const [zip, centroid] of centroids) {
    const bucket = rurality.get(zip);
    if (!bucket) missingRurality++;
    zips.push({
      zip,
      lat: centroid.lat,
      lon: centroid.lon,
      alandSqMi: centroid.alandSqMi,
      // RUCA crosswalk doesn't cover every ZCTA (e.g. some PO-box-only or
      // territory zips) -- default to "rural" as the conservative/safer
      // assumption for a response-time tool rather than assuming "urban".
      rurality: bucket ?? "rural",
    });
  }
  console.log(`Zips missing a rurality classification (defaulted to rural): ${missingRurality}`);

  writeFileSync(path.join(intermediateDir, "stations.json"), JSON.stringify(stations));
  writeFileSync(path.join(intermediateDir, "zips.json"), JSON.stringify(zips));
  console.log(`Wrote ${stations.length} stations and ${zips.length} zips to intermediate/`);
}

main();

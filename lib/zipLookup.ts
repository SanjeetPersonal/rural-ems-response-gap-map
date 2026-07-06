import type { Rurality } from "@/shared/model-constants";

export interface ZipLookupEntry {
  zip: string;
  lat: number;
  lon: number;
  rurality: Rurality;
  estMinutes: number;
  bucketId: string;
  bucketLabel: string;
  lowConfidence: boolean;
  nearestStation: {
    name: string;
    type: "EMS" | "FIRE";
    lat: number;
    lon: number;
    distanceMiles: number;
  };
  modelVersion: string;
  generatedAt: string;
}

export type ZipLookup = Record<string, ZipLookupEntry>;

let cached: Promise<ZipLookup> | null = null;

/** Client-side fetch of the static zip-lookup.json, cached for the page session. */
export function loadZipLookup(): Promise<ZipLookup> {
  if (!cached) {
    cached = fetch("/data/zip-lookup.json").then((res) => {
      if (!res.ok) throw new Error(`Failed to load zip lookup: ${res.status}`);
      return res.json();
    });
  }
  return cached;
}

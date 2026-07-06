/**
 * Single source of truth for the response-time estimation model.
 * Imported by both /data-pipeline (to compute estimates) and the Next.js
 * app (to render matching methodology copy) so the two can never drift.
 */

export type Rurality = "urban" | "suburban" | "rural" | "frontier";

export const AVG_SPEED_MPH_BY_RURALITY: Record<Rurality, number> = {
  urban: 25,
  suburban: 35,
  rural: 45,
  frontier: 50,
};

export const DISPATCH_TURNOUT_MINUTES = 3;

export interface ResponseBucket {
  id: string;
  label: string;
  maxMinutes: number | null; // null = no upper bound
  color: string; // hex, used by both the map style and the legend
}

export const RESPONSE_BUCKETS: ResponseBucket[] = [
  { id: "under10", label: "Under 10 min", maxMinutes: 10, color: "#2e7d32" },
  { id: "10to15", label: "10-15 min", maxMinutes: 15, color: "#9e9d24" },
  { id: "15to20", label: "15-20 min", maxMinutes: 20, color: "#f9a825" },
  { id: "20to30", label: "20-30 min", maxMinutes: 30, color: "#ef6c00" },
  { id: "30plus", label: "30+ min", maxMinutes: null, color: "#c62828" },
];

export function bucketForMinutes(minutes: number): ResponseBucket {
  for (const bucket of RESPONSE_BUCKETS) {
    if (bucket.maxMinutes === null || minutes < bucket.maxMinutes) {
      return bucket;
    }
  }
  return RESPONSE_BUCKETS[RESPONSE_BUCKETS.length - 1];
}

// Nearest-station distances beyond this are flagged as low-confidence —
// likely a gap in HIFLD's station data for that area rather than a truly
// isolated zip code.
export const IMPLAUSIBLE_DISTANCE_MILES = 50;

export const MODEL_VERSION = "v1";

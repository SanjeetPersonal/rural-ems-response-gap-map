import { readFile } from "fs/promises";
import path from "path";
import {
  AVG_SPEED_MPH_BY_RURALITY,
  DISPATCH_TURNOUT_MINUTES,
  RESPONSE_BUCKETS,
  IMPLAUSIBLE_DISTANCE_MILES,
  MODEL_VERSION,
} from "@/shared/model-constants";

export const metadata = {
  title: "Methodology | Rural EMS Response Gap Map",
};

interface MethodologyStats {
  zipCount: number;
  generatedAt: string;
  modelVersion: string;
  lowConfidenceCount: number;
  dataSources: string[];
}

async function getStats(): Promise<MethodologyStats> {
  const filePath = path.join(process.cwd(), "public", "data", "methodology-stats.json");
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

export default async function MethodologyPage() {
  const stats = await getStats();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <h1 className="text-2xl font-bold text-slate-900">Methodology</h1>

      <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4">
        <p className="text-sm font-semibold text-red-800">
          This tool shows a modeled estimate, not measured or official response-time data.
        </p>
        <p className="mt-1 text-sm text-red-900">
          It is not affiliated with any 911 dispatch center or EMS agency. Always call 911 in an
          emergency regardless of what this site shows for your area.
        </p>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">How the estimate is calculated</h2>
        <p className="mt-2 text-slate-700 leading-relaxed">
          For each zip code, we find the closest known EMS station or fire station (using
          straight-line distance from the zip's population-weighted centroid, not real road
          routing) and estimate response time as:
        </p>
        <pre className="mt-3 rounded-md bg-slate-100 p-3 text-sm overflow-x-auto">
{`estimated minutes = dispatch/turnout time + (distance in miles / typical area speed) × 60`}
        </pre>
        <ul className="mt-3 text-sm text-slate-700 space-y-1">
          <li>Dispatch/turnout time: {DISPATCH_TURNOUT_MINUTES} minutes (fixed, industry-typical average)</li>
          {Object.entries(AVG_SPEED_MPH_BY_RURALITY).map(([rurality, speed]) => (
            <li key={rurality}>
              Typical travel speed, <span className="capitalize">{rurality}</span> areas:{" "}
              {speed} mph
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-slate-600">
          Area type (urban/suburban/rural/frontier) comes from USDA ERS Rural-Urban Commuting Area
          (RUCA) codes. This is a simplified model, not a routing engine -- it does not know about
          actual road networks, traffic, weather, or whether a department is staffed and available
          at any given moment.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Response-time categories</h2>
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          {RESPONSE_BUCKETS.map((b) => (
            <li key={b.id} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: b.color }}
              />
              {b.label}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Data sources</h2>
        <ul className="mt-3 list-disc list-inside text-sm text-slate-700 space-y-1">
          {stats.dataSources.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Known limitations</h2>
        <ul className="mt-3 list-disc list-inside text-sm text-slate-700 space-y-2">
          <li>
            HIFLD station data can have gaps, especially for small volunteer fire/EMS departments
            in rural areas. A zip whose nearest known station is more than{" "}
            {IMPLAUSIBLE_DISTANCE_MILES} miles away is flagged as low-confidence rather than shown
            as a firm number -- {stats.lowConfidenceCount} of {stats.zipCount} zips ({" "}
            {((stats.lowConfidenceCount / stats.zipCount) * 100).toFixed(2)}%) fall into this
            category.
          </li>
          <li>
            The model does not account for whether a department is staffed/available at the time
            of an actual emergency -- volunteer departments in particular can have real response
            times far longer than distance alone would suggest.
          </li>
          <li>Distances are straight-line, not actual road-network drive times.</li>
        </ul>
      </section>

      <p className="mt-8 text-xs text-slate-500">
        Model version {MODEL_VERSION}. Data generated {stats.generatedAt}. Covers {stats.zipCount}{" "}
        US zip codes.
      </p>
    </div>
  );
}

import type { ZipLookupEntry } from "@/lib/zipLookup";

export function StationCard({ station }: { station: ZipLookupEntry["nearestStation"] }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Nearest known responder
      </div>
      <div className="mt-1 font-semibold text-slate-900">{station.name}</div>
      <div className="mt-1 text-sm text-slate-600">
        {station.type === "EMS" ? "EMS station" : "Fire station"} &middot;{" "}
        {station.distanceMiles} miles away (straight-line)
      </div>
    </div>
  );
}

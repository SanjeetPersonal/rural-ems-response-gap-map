import { RESPONSE_BUCKETS } from "@/shared/model-constants";

export function Legend() {
  return (
    <div className="absolute bottom-4 left-4 z-10 rounded-md bg-white/95 shadow-md border border-slate-200 px-3 py-2 text-xs">
      <div className="font-semibold text-slate-700 mb-1">Estimated response time</div>
      {RESPONSE_BUCKETS.map((b) => (
        <div key={b.id} className="flex items-center gap-2 py-0.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: b.color }} />
          <span className="text-slate-600">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

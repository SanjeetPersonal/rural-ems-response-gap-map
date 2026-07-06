import Link from "next/link";
import { RESPONSE_BUCKETS } from "@/shared/model-constants";

export function ResponseEstimateCard({
  estMinutes,
  bucketId,
  bucketLabel,
  lowConfidence,
}: {
  estMinutes: number;
  bucketId: string;
  bucketLabel: string;
  lowConfidence: boolean;
}) {
  const bucket = RESPONSE_BUCKETS.find((b) => b.id === bucketId);

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Estimated response time
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">
          Modeled estimate
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span
          className="inline-block w-3 h-3 rounded-sm"
          style={{ backgroundColor: bucket?.color ?? "#94a3b8" }}
        />
        <span className="text-2xl font-bold text-slate-900">~{estMinutes} min</span>
        <span className="text-sm text-slate-500">({bucketLabel})</span>
      </div>

      {lowConfidence && (
        <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
          The nearest known station for this area is unusually far away -- this may reflect a gap
          in the underlying station data rather than a fully confident estimate.
        </p>
      )}

      <p className="mt-2 text-xs text-slate-500">
        Not measured or official data.{" "}
        <Link href="/methodology" className="underline hover:text-slate-700">
          How this is calculated
        </Link>
        .
      </p>
    </div>
  );
}

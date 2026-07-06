import Link from "next/link";

export function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm">
      <div className="max-w-5xl mx-auto px-4 py-2 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-semibold">In an emergency, always call 911 first.</span>
        <span>
          Response-time figures on this site are a modeled estimate, not measured data.{" "}
          <Link href="/methodology" className="underline underline-offset-2 hover:text-amber-950">
            See methodology
          </Link>
          .
        </span>
      </div>
    </div>
  );
}

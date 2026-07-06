import { readFile } from "fs/promises";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StationCard } from "@/components/ZipDetail/StationCard";
import { ResponseEstimateCard } from "@/components/ZipDetail/ResponseEstimateCard";
import { AedNoticeCard } from "@/components/ZipDetail/AedNoticeCard";
import { FIRST_AID_CONDITIONS } from "@/content/first-aid";
import type { ZipLookup } from "@/lib/zipLookup";

async function getZipLookup(): Promise<ZipLookup> {
  const filePath = path.join(process.cwd(), "public", "data", "zip-lookup.json");
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

export async function generateMetadata({ params }: { params: Promise<{ zip: string }> }) {
  const { zip } = await params;
  return { title: `${zip} | Rural EMS Response Gap Map` };
}

export default async function ZipDetailPage({ params }: { params: Promise<{ zip: string }> }) {
  const { zip } = await params;
  const lookup = await getZipLookup();
  const entry = lookup[zip];

  if (!entry) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
        &larr; Back to map
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-slate-900">Zip code {entry.zip}</h1>
      <p className="mt-1 text-sm text-slate-600 capitalize">{entry.rurality} area</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <ResponseEstimateCard
          estMinutes={entry.estMinutes}
          bucketId={entry.bucketId}
          bucketLabel={entry.bucketLabel}
          lowConfidence={entry.lowConfidence}
        />
        <StationCard station={entry.nearestStation} />
        <AedNoticeCard />
      </div>

      <div className="mt-8 rounded-lg bg-slate-50 border border-slate-200 p-4">
        <h2 className="font-semibold text-slate-900">
          What to do while you wait for EMS to arrive
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          This guide is generic and the same for every location -- it is not tailored to this zip
          code specifically.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {FIRST_AID_CONDITIONS.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/guide/${c.slug}`}
                className="block rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:border-slate-400"
              >
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

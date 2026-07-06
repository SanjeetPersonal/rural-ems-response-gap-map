import Link from "next/link";
import { notFound } from "next/navigation";
import { FIRST_AID_CONDITIONS, getConditionBySlug } from "@/content/first-aid";

export function generateStaticParams() {
  return FIRST_AID_CONDITIONS.map((c) => ({ condition: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ condition: string }>;
}) {
  const { condition } = await params;
  const c = getConditionBySlug(condition);
  return { title: c ? `${c.title} | First-Aid Guide` : "First-Aid Guide" };
}

export default async function ConditionPage({
  params,
}: {
  params: Promise<{ condition: string }>;
}) {
  const { condition } = await params;
  const c = getConditionBySlug(condition);
  if (!c) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <Link href="/guide" className="text-sm text-slate-500 hover:text-slate-800">
        &larr; All conditions
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-slate-900">{c.title}</h1>
      <p className="mt-2 text-slate-600">{c.shortDescription}</p>

      <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4">
        <div className="text-sm font-semibold text-red-800">Call 911 when:</div>
        <p className="mt-1 text-sm text-red-900">{c.whenToCall911}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">What to do while you wait</h2>
        <ol className="mt-3 space-y-3 list-decimal list-inside text-slate-700">
          {c.steps.map((step, i) => (
            <li key={i} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </div>

      {c.warnings.length > 0 && (
        <div className="mt-8 rounded-lg bg-amber-50 border border-amber-200 p-4">
          <div className="text-sm font-semibold text-amber-900">Important</div>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-amber-900">
            {c.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-8 text-xs text-slate-500">
        This guide is generic and not tailored to your specific location. It is not a substitute
        for professional medical training or in-person care.
      </p>
    </div>
  );
}

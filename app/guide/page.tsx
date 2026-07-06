import Link from "next/link";
import { FIRST_AID_CONDITIONS } from "@/content/first-aid";

export const metadata = {
  title: "First-Aid Guide | Rural EMS Response Gap Map",
};

export default function GuideIndexPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <h1 className="text-2xl font-bold text-slate-900">First-Aid Guide</h1>
      <p className="mt-2 text-slate-600">
        General steps for common emergencies while waiting for EMS to arrive. This guide is the
        same for every location -- it is not tailored to your specific area. It is not a
        substitute for professional medical training, and it does not replace calling 911.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {FIRST_AID_CONDITIONS.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/guide/${c.slug}`}
              className="block h-full rounded-lg border border-slate-200 p-4 hover:border-slate-400 hover:shadow-sm transition"
            >
              <div className="font-semibold text-slate-900">{c.title}</div>
              <p className="mt-1 text-sm text-slate-600">{c.shortDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <section className="max-w-3xl mx-auto px-4 py-14 text-center w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          How long would EMS take to reach you?
        </h1>
        <p className="mt-4 text-slate-600 text-lg">
          Many rural areas rely on volunteer or understaffed EMS and fire departments, with real
          response times of 20-45+ minutes. Find your zip code to see the estimate for your area
          and what to do while you wait.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/guide"
            className="rounded-md bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800"
          >
            View the first-aid guide
          </Link>
          <Link
            href="/methodology"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            How this is calculated
          </Link>
        </div>
      </section>

      <section className="flex-1 flex items-center justify-center bg-slate-100 border-t border-slate-200">
        <p className="text-slate-500 text-sm">Map loading...</p>
      </section>
    </div>
  );
}

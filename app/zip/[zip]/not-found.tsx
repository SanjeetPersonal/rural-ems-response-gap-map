import Link from "next/link";

export default function ZipNotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 w-full text-center">
      <h1 className="text-xl font-semibold text-slate-900">Zip code not found</h1>
      <p className="mt-2 text-slate-600">
        We don&apos;t have data for that zip code. It may be new, invalid, or outside current
        Census zip code boundaries.
      </p>
      <Link href="/" className="mt-4 inline-block text-sm underline text-slate-700">
        Back to map
      </Link>
    </div>
  );
}

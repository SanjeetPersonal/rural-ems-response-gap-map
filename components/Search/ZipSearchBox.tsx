"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadZipLookup, type ZipLookup } from "@/lib/zipLookup";

export function ZipSearchBox() {
  const router = useRouter();
  const [lookup, setLookup] = useState<ZipLookup | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadZipLookup()
      .then(setLookup)
      .catch(() => setError("Couldn't load zip data. Try refreshing the page."));
  }, []);

  const suggestions = useMemo(() => {
    if (!lookup || query.length < 2) return [];
    const matches: string[] = [];
    for (const zip of Object.keys(lookup)) {
      if (zip.startsWith(query)) {
        matches.push(zip);
        if (matches.length >= 8) break;
      }
    }
    return matches.sort();
  }, [lookup, query]);

  function goToZip(zip: string) {
    if (lookup && lookup[zip]) {
      router.push(`/zip/${zip}`);
    } else {
      setError(`"${zip}" isn't a recognized US zip code.`);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = query.trim();
    if (!/^\d{5}$/.test(trimmed)) {
      setError("Enter a 5-digit zip code.");
      return;
    }
    goToZip(trimmed);
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          placeholder="Enter your zip code"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value.replace(/\D/g, ""));
            setError(null);
          }}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          aria-label="Zip code"
        />
        <button
          type="submit"
          className="rounded-md bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800"
        >
          Go
        </button>
      </form>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {suggestions.length > 0 && (
        <ul className="mt-2 rounded-md border border-slate-200 divide-y divide-slate-100 overflow-hidden bg-white shadow-sm">
          {suggestions.map((zip) => (
            <li key={zip}>
              <button
                type="button"
                onClick={() => goToZip(zip)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex justify-between"
              >
                <span>{zip}</span>
                <span className="text-slate-500">{lookup?.[zip].bucketLabel}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

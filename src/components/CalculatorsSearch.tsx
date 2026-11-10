"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { searchCalculators } from "@/lib/calculators/registry";

export function CalculatorsSearch() {
  const [q, setQ] = useState("");
  const results = useMemo(() => (q.trim() ? searchCalculators(q) : []), [q]);

  return (
    <div className="mt-6">
      <label className="sr-only" htmlFor="q">
        Search calculators
      </label>
      <input
        id="q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search calculators, tables, simulations…"
        className="w-full max-w-xl rounded-full border border-teal-900/15 bg-white px-5 py-3 text-sm outline-none ring-teal-700/30 focus:ring-2"
      />
      {q.trim() && (
        <ul className="mt-4 max-w-xl space-y-2">
          {results.slice(0, 12).map((c) => (
            <li key={`${c.category}/${c.slug}`}>
              <Link
                href={`/calculators/${c.category}/${c.slug}`}
                className="text-sm text-teal-800 underline-offset-2 hover:underline"
              >
                {c.title}
              </Link>
            </li>
          ))}
          {results.length === 0 && (
            <li className="text-sm text-teal-900/60">No matches.</li>
          )}
        </ul>
      )}
    </div>
  );
}

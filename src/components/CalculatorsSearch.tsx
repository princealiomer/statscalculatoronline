"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { searchCalculators } from "@/lib/calculators/registry";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export function CalculatorsSearch() {
  const [q, setQ] = useState("");
  const results = useMemo(() => (q.trim() ? searchCalculators(q) : []), [q]);

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="q" className="sr-only">
          Search calculators
        </FieldLabel>
        <Input
          id="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search calculators, tables, simulations…"
          className="min-h-11 rounded-full px-5"
        />
      </Field>
      {q.trim() && (
        <ul className="flex flex-col gap-2">
          {results.slice(0, 12).map((c) => (
            <li key={`${c.category}/${c.slug}`}>
              <Link
                href={`/calculators/${c.category}/${c.slug}`}
                className="text-sm text-primary underline-offset-2 hover:underline"
              >
                {c.title}
              </Link>
            </li>
          ))}
          {results.length === 0 && (
            <li>
              <Empty className="border border-dashed py-6">
                <EmptyHeader>
                  <EmptyTitle>No matches</EmptyTitle>
                  <EmptyDescription>
                    Try a different keyword or browse categories above.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

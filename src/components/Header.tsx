"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { categories } from "@/lib/calculators/registry";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-teal-900/10 bg-[#f4faf8]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex items-baseline gap-1 font-display text-xl tracking-tight text-teal-950">
          <span className="font-semibold">{siteConfig.name}</span>
          <span className="text-sm font-normal text-teal-700/70 transition group-hover:text-teal-800">
            calculators
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-teal-950/80 md:flex">
          <Link href="/calculators" className="hover:text-teal-700">
            Calculators
          </Link>
          <Link href="/resources" className="hover:text-teal-700">
            Resources
          </Link>
          <Link href="/about" className="hover:text-teal-700">
            About
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-teal-900/15 px-3 text-sm text-teal-950 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="max-h-[min(70vh,28rem)] overflow-y-auto border-t border-teal-900/10 bg-[#f4faf8] px-4 py-3 md:hidden"
        >
          <div className="flex flex-col">
            <Link
              href="/calculators"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center border-b border-teal-900/5 text-sm font-medium text-teal-950"
            >
              All calculators
            </Link>
            {categories.slice(0, 12).map((c) => (
              <Link
                key={c.id}
                href={`/calculators/${c.id}`}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center border-b border-teal-900/5 text-sm text-teal-900/75"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/resources"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center text-sm font-medium text-teal-950"
            >
              Resources
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { categoriesInGroup, countInCategory, navGroups } from "@/config/nav";
import { siteConfig } from "@/config/site";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>("statistics");
  const megaId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openMega() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  }

  function scheduleCloseMega() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 140);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--brand-ink)]/10 bg-[color-mix(in_srgb,var(--brand-paper)_92%,white)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
        <Link
          href="/"
          className="min-w-0 shrink"
          aria-label={`${siteConfig.name} home`}
          onClick={() => setMobileOpen(false)}
        >
          <span className="hidden sm:inline-flex">
            <BrandMark size="md" />
          </span>
          <span className="inline-flex sm:hidden">
            <BrandMark size="sm" />
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <div
            className="relative"
            onMouseEnter={openMega}
            onMouseLeave={scheduleCloseMega}
          >
            <button
              type="button"
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition ${
                megaOpen
                  ? "bg-[var(--brand-ink)] text-white"
                  : "text-[var(--brand-ink)]/85 hover:bg-[var(--brand-ink)]/5"
              }`}
              aria-expanded={megaOpen}
              aria-controls={megaId}
              onClick={() => setMegaOpen((v) => !v)}
            >
              Calculators
              <span aria-hidden className={`text-xs transition ${megaOpen ? "rotate-180" : ""}`}>
                ▾
              </span>
            </button>

            {megaOpen && (
              <div
                id={megaId}
                role="region"
                aria-label="Calculator categories mega menu"
                className="absolute left-1/2 top-full z-50 w-[min(92vw,52rem)] -translate-x-[42%] pt-3"
                onMouseEnter={openMega}
                onMouseLeave={scheduleCloseMega}
              >
                <div className="overflow-hidden rounded-2xl border border-[var(--brand-ink)]/10 bg-white shadow-[0_28px_60px_-28px_rgba(10,37,64,0.55)]">
                  <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
                    <div className="border-b border-[var(--brand-ink)]/8 bg-[var(--brand-ink)] px-5 py-5 text-white md:border-b-0 md:border-r md:border-white/10">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-amber)]">
                        Stats Calculator Online
                      </p>
                      <p className="mt-2 font-display text-xl leading-snug">
                        Browse every free calculator by topic
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/70">
                        Formulas, how-to steps, interpretation tips, and free APA / PDF exports on
                        each page.
                      </p>
                      <Link
                        href="/calculators"
                        className="mt-5 inline-flex min-h-10 items-center rounded-full bg-[var(--brand-amber)] px-4 text-sm font-semibold text-[var(--brand-ink)] hover:brightness-105"
                        onClick={() => setMegaOpen(false)}
                      >
                        View all calculators
                      </Link>
                    </div>
                    <div className="grid max-h-[min(70vh,28rem)] gap-5 overflow-y-auto p-5 sm:grid-cols-2">
                      {navGroups.map((group) => {
                        const cats = categoriesInGroup(group).slice(0, 6);
                        return (
                          <div key={group.id}>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-accent)]">
                              {group.title}
                            </p>
                            <p className="mt-1 text-xs text-[var(--brand-ink)]/55">{group.blurb}</p>
                            <ul className="mt-2.5 space-y-1">
                              {cats.map((c) => (
                                <li key={c.id}>
                                  <Link
                                    href={`/calculators/${c.id}`}
                                    className="flex items-baseline justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-[var(--brand-ink)]/85 hover:bg-[var(--brand-paper)] hover:text-[var(--brand-ink)]"
                                    onClick={() => setMegaOpen(false)}
                                  >
                                    <span className="min-w-0 truncate">{c.name}</span>
                                    <span className="shrink-0 text-[10px] font-semibold text-[var(--brand-ink)]/40">
                                      {countInCategory(c.id)}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--brand-ink)]/8 bg-[var(--brand-paper)]/80 px-5 py-3 text-xs">
                    <Link
                      href="/calculators/hypothesis-testing/statistical-test-flow-chart"
                      className="font-semibold text-[var(--brand-accent)] hover:underline"
                      onClick={() => setMegaOpen(false)}
                    >
                      Not sure which test? Use the selector →
                    </Link>
                    <Link
                      href="/resources/statistical-tables"
                      className="text-[var(--brand-ink)]/65 hover:text-[var(--brand-ink)]"
                      onClick={() => setMegaOpen(false)}
                    >
                      Critical value tables
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/sitemap"
            className="inline-flex min-h-10 items-center rounded-full px-3.5 text-sm font-semibold text-[var(--brand-ink)]/85 hover:bg-[var(--brand-ink)]/5"
          >
            Sitemap
          </Link>
          <Link
            href="/resources"
            className="inline-flex min-h-10 items-center rounded-full px-3.5 text-sm font-semibold text-[var(--brand-ink)]/85 hover:bg-[var(--brand-ink)]/5"
          >
            Resources
          </Link>
          <Link
            href="/about"
            className="inline-flex min-h-10 items-center rounded-full px-3.5 text-sm font-semibold text-[var(--brand-ink)]/85 hover:bg-[var(--brand-ink)]/5"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-10 items-center rounded-full bg-[var(--brand-accent)] px-4 text-sm font-semibold text-white hover:brightness-110"
          >
            Contact
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-[var(--brand-ink)]/15 bg-white px-3 text-sm font-semibold text-[var(--brand-ink)] lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {mobileOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 top-[3.6rem] z-50 overflow-y-auto border-t border-[var(--brand-ink)]/10 bg-[var(--brand-paper)] lg:hidden"
        >
          <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-accent)]">
              Stats Calculator Online
            </p>
            <Link
              href="/calculators"
              onClick={() => setMobileOpen(false)}
              className="mt-3 flex min-h-12 items-center rounded-xl bg-[var(--brand-ink)] px-4 text-sm font-semibold text-white"
            >
              Browse all calculators
            </Link>

            <div className="mt-4 space-y-2">
              {navGroups.map((group) => {
                const open = mobileGroup === group.id;
                const cats = categoriesInGroup(group);
                return (
                  <div
                    key={group.id}
                    className="overflow-hidden rounded-xl border border-[var(--brand-ink)]/10 bg-white"
                  >
                    <button
                      type="button"
                      className="flex min-h-12 w-full items-center justify-between px-4 text-left text-sm font-semibold text-[var(--brand-ink)]"
                      aria-expanded={open}
                      onClick={() => setMobileGroup(open ? null : group.id)}
                    >
                      <span>{group.title}</span>
                      <span aria-hidden>{open ? "−" : "+"}</span>
                    </button>
                    {open && (
                      <ul className="border-t border-[var(--brand-ink)]/8 px-2 py-2">
                        {cats.map((c) => (
                          <li key={c.id}>
                            <Link
                              href={`/calculators/${c.id}`}
                              onClick={() => setMobileOpen(false)}
                              className="flex min-h-11 items-center justify-between gap-2 rounded-lg px-2 text-sm text-[var(--brand-ink)]/80"
                            >
                              <span>{c.name}</span>
                              <span className="text-[10px] font-semibold text-[var(--brand-ink)]/40">
                                {countInCategory(c.id)}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 grid gap-2 pb-8">
              <Link
                href="/sitemap"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 items-center rounded-xl border border-[var(--brand-ink)]/10 bg-white px-4 text-sm font-medium text-[var(--brand-ink)]"
              >
                HTML Sitemap — all calculators
              </Link>
              <Link
                href="/resources"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 items-center rounded-xl border border-[var(--brand-ink)]/10 bg-white px-4 text-sm font-medium text-[var(--brand-ink)]"
              >
                Resources &amp; tables
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 items-center rounded-xl border border-[var(--brand-ink)]/10 bg-white px-4 text-sm font-medium text-[var(--brand-ink)]"
              >
                About Stats Calculator Online
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 items-center rounded-xl border border-[var(--brand-ink)]/10 bg-white px-4 text-sm font-medium text-[var(--brand-ink)]"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

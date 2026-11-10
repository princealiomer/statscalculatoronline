"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { categoriesInGroup, navGroups } from "@/config/nav";
import { siteConfig } from "@/config/site";

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3.5 w-5" aria-hidden>
      <span
        className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition duration-200 ${
          open ? "translate-y-[6px] rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-[6px] h-0.5 w-5 rounded-full bg-current transition duration-200 ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-[12px] h-0.5 w-5 rounded-full bg-current transition duration-200 ${
          open ? "-translate-y-[6px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const megaId = useId();
  const mobileNavId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  function closeMobile() {
    setMobileOpen(false);
    setMobileGroup(null);
  }

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
        if (mobileOpen) {
          closeMobile();
          menuButtonRef.current?.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus first focusable in drawer for accessibility
    const first = drawerRef.current?.querySelector<HTMLElement>(
      "a,button,[tabindex]:not([tabindex='-1'])",
    );
    first?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Close mobile drawer when resizing to desktop
  useEffect(() => {
    function onResize() {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setMobileOpen(false);
        setMobileGroup(null);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* Solid sticky bar — no backdrop-filter so overlays aren't trapped */}
      <header className="sticky top-0 z-50 border-b border-[var(--brand-border)] bg-[var(--brand-panel)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
          <Link
            href="/"
            className="min-w-0 shrink"
            aria-label={`${siteConfig.name} home`}
            onClick={closeMobile}
          >
            <span className="hidden min-[420px]:inline-flex">
              <BrandMark size="md" />
            </span>
            <span className="inline-flex min-[420px]:hidden">
              <BrandMark size="sm" showWordmark={false} />
              <span className="ml-2 self-center font-display text-sm font-semibold leading-tight text-[var(--brand-ink)]">
                Stats Calculator Online
              </span>
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
                className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3.5 text-sm font-semibold transition ${
                  megaOpen
                    ? "bg-[var(--brand-ink)] text-white"
                    : "text-[var(--brand-ink)]/85 hover:bg-[var(--brand-paper)]"
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
                  <div className="overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-white shadow-[var(--brand-shadow)]">
                    <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
                      <div className="border-b border-white/10 bg-[var(--brand-ink)] px-5 py-5 text-white md:border-b-0 md:border-r">
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
                          className="mt-5 inline-flex min-h-10 items-center rounded-xl bg-[var(--brand-amber)] px-4 text-sm font-semibold text-[var(--brand-ink)]"
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
                              <p className="mt-1 text-xs text-[var(--brand-ink-soft)]">{group.blurb}</p>
                              <ul className="mt-2.5 space-y-1">
                                {cats.map((c) => (
                                  <li key={c.id}>
                                    <Link
                                      href={`/calculators/${c.id}`}
                                      className="block truncate rounded-lg px-2 py-1.5 text-sm text-[var(--brand-ink)]/85 hover:bg-[var(--brand-paper)]"
                                      onClick={() => setMegaOpen(false)}
                                    >
                                      {c.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--brand-border)] bg-[var(--brand-paper)] px-5 py-3 text-xs">
                      <Link
                        href="/calculators/hypothesis-testing/statistical-test-flow-chart"
                        className="font-semibold text-[var(--brand-accent)] hover:underline"
                        onClick={() => setMegaOpen(false)}
                      >
                        Not sure which test? Use the selector →
                      </Link>
                      <Link
                        href="/resources/statistical-tables"
                        className="text-[var(--brand-ink-soft)] hover:text-[var(--brand-ink)]"
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
              className="inline-flex min-h-10 items-center rounded-xl px-3.5 text-sm font-semibold text-[var(--brand-ink)]/85 hover:bg-[var(--brand-paper)]"
            >
              Sitemap
            </Link>
            <Link
              href="/resources"
              className="inline-flex min-h-10 items-center rounded-xl px-3.5 text-sm font-semibold text-[var(--brand-ink)]/85 hover:bg-[var(--brand-paper)]"
            >
              Resources
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-10 items-center rounded-xl px-3.5 text-sm font-semibold text-[var(--brand-ink)]/85 hover:bg-[var(--brand-paper)]"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-10 items-center rounded-xl bg-[var(--brand-accent)] px-4 text-sm font-semibold text-white hover:bg-[var(--brand-accent-dark)]"
            >
              Contact
            </Link>
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--brand-border)] bg-[var(--brand-paper)] text-[var(--brand-ink)] lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls={mobileNavId}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => {
              setMegaOpen(false);
              setMobileOpen((v) => !v);
            }}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </header>

      {/* Mobile drawer rendered OUTSIDE sticky header so fixed positioning works */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--brand-ink)]/45"
            aria-label="Close menu overlay"
            onClick={closeMobile}
          />

          <div
            ref={drawerRef}
            id={mobileNavId}
            className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col bg-[var(--brand-panel)] shadow-[-12px_0_40px_-20px_rgba(26,31,44,0.45)]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--brand-border)] px-4 py-3">
              <p className="text-sm font-semibold text-[var(--brand-ink)]">Menu</p>
              <button
                type="button"
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-[var(--brand-border)] text-[var(--brand-ink)]"
                aria-label="Close menu"
                onClick={closeMobile}
              >
                <HamburgerIcon open />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 [-webkit-overflow-scrolling:touch]">
              <Link
                href="/calculators"
                onClick={closeMobile}
                className="flex min-h-12 items-center justify-center rounded-xl bg-[var(--brand-accent)] px-4 text-sm font-semibold text-white"
              >
                Browse all calculators
              </Link>

              <div className="mt-4 space-y-2">
                {navGroups.map((group) => {
                  const open = mobileGroup === group.id;
                  const panelId = `${mobileNavId}-${group.id}`;
                  const cats = categoriesInGroup(group);
                  return (
                    <div
                      key={group.id}
                      className="overflow-hidden rounded-xl border border-[var(--brand-border)] bg-[var(--brand-paper)]"
                    >
                      <button
                        type="button"
                        className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left text-sm font-semibold text-[var(--brand-ink)]"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setMobileGroup(open ? null : group.id)}
                      >
                        <span>{group.title}</span>
                        <span
                          aria-hidden
                          className={`text-lg leading-none text-[var(--brand-accent)] transition ${
                            open ? "rotate-45" : ""
                          }`}
                        >
                          +
                        </span>
                      </button>
                      {open && (
                        <ul id={panelId} className="border-t border-[var(--brand-border)] bg-white px-2 py-2">
                          {cats.map((c) => (
                            <li key={c.id}>
                              <Link
                                href={`/calculators/${c.id}`}
                                onClick={closeMobile}
                                className="flex min-h-11 items-center rounded-lg px-3 text-sm text-[var(--brand-ink)]/85 active:bg-[var(--brand-paper)]"
                              >
                                {c.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                {[
                  { href: "/sitemap", label: "HTML Sitemap" },
                  { href: "/resources", label: "Resources & tables" },
                  { href: "/about", label: "About" },
                  { href: "/contact", label: "Contact" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className="flex min-h-11 items-center rounded-xl border border-[var(--brand-border)] bg-white px-4 text-sm font-medium text-[var(--brand-ink)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

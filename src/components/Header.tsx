"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Cancel01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { BrandMark } from "@/components/BrandMark";
import { categoriesInGroup, navGroups } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
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
      if (e.key === "Escape") setMegaOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
        <Link
          href="/"
          className="min-w-0 shrink"
          aria-label={`${siteConfig.name} home`}
          onClick={() => setMobileOpen(false)}
        >
          <span className="hidden min-[420px]:inline-flex">
            <BrandMark size="md" />
          </span>
          <span className="inline-flex min-[420px]:hidden">
            <BrandMark size="sm" showWordmark={false} />
            <span className="ml-2 self-center font-display text-sm font-semibold leading-tight text-foreground">
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
            <Button
              type="button"
              variant={megaOpen ? "default" : "ghost"}
              size="lg"
              className="min-h-10"
              aria-expanded={megaOpen}
              aria-controls={megaId}
              onClick={() => setMegaOpen((v) => !v)}
            >
              Calculators
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                data-icon="inline-end"
                strokeWidth={2}
                className={cn("transition", megaOpen && "rotate-180")}
              />
            </Button>

            {megaOpen && (
              <div
                id={megaId}
                role="region"
                aria-label="Calculator categories mega menu"
                className="absolute top-full left-1/2 z-50 w-[min(92vw,52rem)] -translate-x-[42%] pt-3"
                onMouseEnter={openMega}
                onMouseLeave={scheduleCloseMega}
              >
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
                  <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
                    <div className="border-b border-white/10 bg-foreground px-5 py-5 text-background md:border-r md:border-b-0">
                      <Badge className="bg-[var(--brand-amber)] text-foreground hover:bg-[var(--brand-amber)]">
                        Stats Calculator Online
                      </Badge>
                      <p className="mt-3 font-display text-xl leading-snug">
                        Browse every free calculator by topic
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-background/70">
                        Formulas, how-to steps, interpretation tips, and free APA / PDF exports on
                        each page.
                      </p>
                      <Button
                        className="mt-5 min-h-10 bg-[var(--brand-amber)] text-foreground hover:bg-[var(--brand-amber)]/90"
                        render={<Link href="/calculators" />}
                        nativeButton={false}
                        onClick={() => setMegaOpen(false)}
                      >
                        View all calculators
                      </Button>
                    </div>
                    <div className="grid max-h-[min(70vh,28rem)] gap-5 overflow-y-auto p-5 sm:grid-cols-2">
                      {navGroups.map((group) => {
                        const cats = categoriesInGroup(group).slice(0, 6);
                        return (
                          <div key={group.id} className="flex flex-col gap-2">
                            <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
                              {group.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{group.blurb}</p>
                            <ul className="flex flex-col gap-1">
                              {cats.map((c) => (
                                <li key={c.id}>
                                  <Link
                                    href={`/calculators/${c.id}`}
                                    className="block truncate rounded-lg px-2 py-1.5 text-sm text-foreground/85 hover:bg-muted"
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
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted px-5 py-3 text-xs">
                    <Link
                      href="/calculators/hypothesis-testing/statistical-test-flow-chart"
                      className="font-semibold text-primary hover:underline"
                      onClick={() => setMegaOpen(false)}
                    >
                      Not sure which test? Use the selector →
                    </Link>
                    <Link
                      href="/resources/statistical-tables"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setMegaOpen(false)}
                    >
                      Critical value tables
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="lg"
            className="min-h-10"
            render={<Link href="/sitemap" />}
            nativeButton={false}
          >
            Sitemap
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="min-h-10"
            render={<Link href="/resources" />}
            nativeButton={false}
          >
            Resources
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="min-h-10"
            render={<Link href="/about" />}
            nativeButton={false}
          >
            About
          </Button>
          <Button
            size="lg"
            className="min-h-10"
            render={<Link href="/contact" />}
            nativeButton={false}
          >
            Contact
          </Button>
        </nav>

        <Sheet
          open={mobileOpen}
          onOpenChange={(open) => {
            setMobileOpen(open);
            if (!open) setMobileGroup(null);
          }}
        >
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon-lg"
                className="min-h-11 min-w-11 bg-muted lg:hidden"
                aria-label="Open menu"
              />
            }
          >
            <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(100%,22rem)] p-0" showCloseButton={false}>
            <SheetHeader className="border-b border-border px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <SheetTitle>Menu</SheetTitle>
                <SheetClose
                  render={
                    <Button variant="outline" size="icon" aria-label="Close menu" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </SheetClose>
              </div>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-3 py-4 [-webkit-overflow-scrolling:touch]">
              <Button
                size="lg"
                className="min-h-12 w-full"
                render={<Link href="/calculators" />}
                nativeButton={false}
                onClick={() => setMobileOpen(false)}
              >
                Browse all calculators
              </Button>

              <div className="flex flex-col gap-2">
                {navGroups.map((group) => {
                  const open = mobileGroup === group.id;
                  const panelId = `mobile-group-${group.id}`;
                  const cats = categoriesInGroup(group);
                  return (
                    <div
                      key={group.id}
                      className="overflow-hidden rounded-xl border border-border bg-muted"
                    >
                      <button
                        type="button"
                        className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left text-sm font-semibold text-foreground"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setMobileGroup(open ? null : group.id)}
                      >
                        <span>{group.title}</span>
                        <span
                          aria-hidden
                          className={cn(
                            "text-lg leading-none text-primary transition",
                            open && "rotate-45",
                          )}
                        >
                          +
                        </span>
                      </button>
                      {open && (
                        <ul
                          id={panelId}
                          className="flex flex-col gap-0.5 border-t border-border bg-card px-2 py-2"
                        >
                          {cats.map((c) => (
                            <li key={c.id}>
                              <Link
                                href={`/calculators/${c.id}`}
                                onClick={() => setMobileOpen(false)}
                                className="flex min-h-11 items-center rounded-lg px-3 text-sm text-foreground/85 active:bg-muted"
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

              <Separator />

              <div className="grid gap-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                {[
                  { href: "/sitemap", label: "HTML Sitemap" },
                  { href: "/resources", label: "Resources & tables" },
                  { href: "/about", label: "About" },
                  { href: "/contact", label: "Contact" },
                ].map((item) => (
                  <Button
                    key={item.href}
                    variant="outline"
                    size="lg"
                    className="min-h-11 justify-start bg-card"
                    render={<Link href={item.href} />}
                    nativeButton={false}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

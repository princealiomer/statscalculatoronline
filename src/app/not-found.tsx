import Link from "next/link";
import { StatsFadeLetters } from "@/components/not-found/StatsFadeLetters";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_oklab,var(--brand-accent)_18%,transparent),transparent_55%),radial-gradient(ellipse_50%_40%_at_80%_80%,color-mix(in_oklab,var(--brand-amber)_12%,transparent),transparent_50%)]"
      />
      <div
        aria-hidden
        className="not-found-grid pointer-events-none absolute inset-0 opacity-[0.35]"
      />

      <section className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center gap-10 px-3 py-16 text-center sm:px-4 sm:py-20 md:min-h-[74vh]">
        <p className="not-found-kicker text-[11px] font-semibold tracking-[0.22em] text-[var(--brand-accent)] uppercase">
          Page not found
        </p>

        <div className="flex flex-col items-center gap-3">
          <p
            className="not-found-code font-display text-[clamp(4.5rem,18vw,9rem)] font-semibold leading-none tracking-tight text-[var(--brand-ink)]"
            aria-hidden
          >
            <span className="text-[var(--brand-accent)]">4</span>
            <span className="not-found-zero inline-block text-[var(--brand-amber)]">0</span>
            <span className="text-[var(--brand-accent)]">4</span>
          </p>
          <div className="not-found-rule h-px w-24 bg-[color-mix(in_oklab,var(--brand-ink)_18%,transparent)] sm:w-32" />
        </div>

        <div className="flex w-full max-w-3xl flex-col items-center gap-4">
          <StatsFadeLetters />
          <h1 className="not-found-copy max-w-lg font-display text-2xl font-semibold tracking-tight text-[var(--brand-ink)] sm:text-3xl">
            This calculation went missing
          </h1>
          <p className="not-found-copy-delay max-w-md text-[15px] leading-relaxed text-[var(--brand-ink-soft)] sm:text-base">
            The page you asked for isn&apos;t on {siteConfig.name}. Head home or open the
            calculator catalog and pick a tool that exists.
          </p>
        </div>

        <div className="not-found-actions flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            className="min-h-11"
            render={<Link href="/" />}
            nativeButton={false}
          >
            Back to home
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-11 bg-[var(--brand-panel)]"
            render={<Link href="/calculators" />}
            nativeButton={false}
          >
            Browse calculators
          </Button>
        </div>

        <ul className="not-found-links flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[var(--brand-ink-soft)]">
          <li>
            <Link href="/calculators/general-math/prime-number-checker" className="hover:text-[var(--brand-accent)] hover:underline">
              Prime checker
            </Link>
          </li>
          <li>
            <Link href="/calculators/fractions/fraction-calculator" className="hover:text-[var(--brand-accent)] hover:underline">
              Fraction calculator
            </Link>
          </li>
          <li>
            <Link href="/calculators/descriptive-statistics/sample-standard-deviation-calculator" className="hover:text-[var(--brand-accent)] hover:underline">
              Standard deviation
            </Link>
          </li>
          <li>
            <Link href="/resources/statistical-tables" className="hover:text-[var(--brand-accent)] hover:underline">
              Statistical tables
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

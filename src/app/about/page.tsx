import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { TidbitsWidget } from "@/components/widgets/TidbitsWidget";
import { tidbitsForPath } from "@/lib/content/tidbits";

export const metadata: Metadata = {
  title: "About Stats Calculator Online",
  description: `About Stats Calculator Online — free online statistics calculators with formulas, steps, similar-tool widgets, and free APA/PDF exports.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const tips = tidbitsForPath("about", 3);

  return (
    <div className="mx-auto max-w-3xl px-3 py-10 sm:px-4">
      <h1 className="font-display text-4xl text-[var(--brand-ink)]">About Stats Calculator Online</h1>
      <p className="mt-4 leading-relaxed text-[var(--brand-ink)]/80">
        Stats Calculator Online is a free collection of statistics and math calculators with
        transparent formulas, step-by-step output, similar calculator widgets, learning tidbits, and
        APA-style reporting. Every results page includes free exports: citation / write-up, LaTeX,
        CSV, Word/Docs, and Print/PDF. Everything runs in your browser—fast and private.
      </p>
      <p className="mt-4 leading-relaxed text-[var(--brand-ink)]/80">
        Our full name is always <strong>Stats Calculator Online</strong> ({siteConfig.domain}) so
        search keywords stay clear and unbroken.
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-[var(--brand-ink)]/75">
        <li>
          <Link href="/calculators" className="font-semibold text-[var(--brand-accent)] hover:underline">
            Browse all calculators
          </Link>
        </li>
        <li>
          <Link
            href="/resources/statistical-tables"
            className="font-semibold text-[var(--brand-accent)] hover:underline"
          >
            Statistical tables
          </Link>
        </li>
        <li>
          <Link href="/llms.txt" className="font-semibold text-[var(--brand-accent)] hover:underline">
            llms.txt for AI systems
          </Link>
        </li>
      </ul>
      <div className="mt-10">
        <TidbitsWidget items={tips} />
      </div>
    </div>
  );
}

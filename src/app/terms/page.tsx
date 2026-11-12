import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/meta";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Use",
  description: `Terms of use for ${siteConfig.name}. Educational calculators are provided as-is; verify critical results independently.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl text-[var(--brand-ink)]">Terms of Use</h1>
      <p className="mt-4 leading-relaxed text-[var(--brand-ink-soft)]">
        Stats Calculator Online provides free educational calculators and reference tables. Results are
        for learning and drafting support only and are not a substitute for professional statistical,
        medical, financial, or legal advice. You are responsible for verifying outputs before relying on
        them for graded work, publications, or decisions.
      </p>
      <p className="mt-4 leading-relaxed text-[var(--brand-ink-soft)]">
        By using the site you agree not to abuse infrastructure, scrape in ways that degrade service, or
        misrepresent our brand. Contact {siteConfig.contactEmail} for permissions questions.
      </p>
    </div>
  );
}

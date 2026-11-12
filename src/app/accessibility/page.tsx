import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/meta";

export const metadata: Metadata = buildPageMetadata({
  title: "Accessibility",
  description: `Accessibility statement for ${siteConfig.name}. We aim for usable forms, keyboard navigation, and readable reports across devices.`,
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl text-[var(--brand-ink)]">Accessibility</h1>
      <p className="mt-4 leading-relaxed text-[var(--brand-ink-soft)]">
        We design Stats Calculator Online so calculators work with keyboard navigation, clear labels,
        and readable contrast. Export formats include plain text and CSV for easier reuse with assistive
        tools. If you hit a barrier, email {siteConfig.contactEmail} with the page URL and what you
        expected to happen.
      </p>
    </div>
  );
}

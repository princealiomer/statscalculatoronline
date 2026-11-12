import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/meta";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: `Contact ${siteConfig.name} for calculator requests, corrections, or partnership questions. Email ${siteConfig.contactEmail}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl text-[var(--brand-ink)]">Contact</h1>
      <p className="mt-4 text-[var(--brand-ink-soft)]">
        Questions or calculator requests? Email{" "}
        <a className="font-semibold text-[var(--brand-accent)] underline" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>
        .
      </p>
      <p className="mt-3 text-sm text-[var(--brand-ink-soft)]">
        Website:{" "}
        <a className="underline" href={siteConfig.url}>
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </a>
      </p>
    </div>
  );
}

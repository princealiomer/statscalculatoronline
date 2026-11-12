import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/meta";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}. Calculations run in your browser; we describe cookies, analytics, and advertising practices clearly.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl text-[var(--brand-ink)]">Privacy Policy</h1>
      <p className="mt-4 leading-relaxed text-[var(--brand-ink-soft)]">
        Stats Calculator Online runs calculations in your browser. We do not require an account to use
        calculators. Aggregated analytics (for example via Google Tag Manager) and advertising partners
        such as Google AdSense may use cookies or similar technologies as described in their policies.
        Do not paste confidential or regulated data into public tools.
      </p>
      <p className="mt-4 leading-relaxed text-[var(--brand-ink-soft)]">
        Contact{" "}
        <a className="underline" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>{" "}
        with privacy questions.
      </p>
    </div>
  );
}

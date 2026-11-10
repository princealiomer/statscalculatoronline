import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — free online statistics calculators.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl text-teal-950">About {siteConfig.name}</h1>
      <p className="mt-4 leading-relaxed text-teal-900/80">
        {siteConfig.name} is a free collection of statistics and math calculators with transparent
        formulas, step-by-step output, and APA-style reporting. Every results page includes free
        exports: copy citation / write-up, LaTeX, CSV, Word/Docs, and Print/PDF. Everything runs in
        your browser—fast, private, and deployable on Vercel.
      </p>
    </div>
  );
}

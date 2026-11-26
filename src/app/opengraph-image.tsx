import { siteConfig } from "@/config/site";
import { ogContentType, ogSize, renderOgCard } from "@/lib/seo/ogCard";

export const alt = `${siteConfig.name} — free statistics calculators`;
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgCard({
    title: "Free statistics calculators with formulas, steps, and branded PDF reports",
    subtitle: "Inputs · Formulas · Worked steps · Results · Exports",
    eyebrow: siteConfig.domain,
    footerLeft: "Hypothesis tests · Probability · Regression · Math",
  });
}

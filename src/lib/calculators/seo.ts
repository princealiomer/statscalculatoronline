import type { Metadata } from "next";
import type { CalculatorDef } from "@/lib/calculators/types";
import { getCategory } from "@/lib/calculators/registry";
import { getCalculatorGuide, getCalculatorOutline } from "@/lib/calculators/explain";
import { seoBySlug } from "@/lib/calculators/seoTargeting";
import { calculatorDisplayTitle } from "@/lib/calculators/displayTitle";
import { siteConfig } from "@/config/site";
import { buildPageMetadata, seoDescription } from "@/lib/seo/meta";

export { calculatorDisplayTitle } from "@/lib/calculators/displayTitle";

export function calculatorKeywords(calc: CalculatorDef): string[] {
  const cat = getCategory(calc.category);
  const display = calculatorDisplayTitle(calc);
  const targeted = seoBySlug[calc.slug]?.keywords ?? [];
  const base = [
    display,
    calc.title,
    `${calc.title} calculator`,
    `free ${display.toLowerCase()}`,
    "online calculator",
    "statistics calculator",
    "stats calculator",
    "free online calculator",
    "step by step",
    "formulas",
    siteConfig.name,
    siteConfig.domain,
  ];
  if (cat) base.push(cat.name, `${cat.name} calculator`);
  if (calc.keywords?.length) base.push(...calc.keywords);
  base.push(...targeted);
  return [...new Set(base.map((k) => k.trim()).filter(Boolean))];
}

export function calculatorMetaDescription(calc: CalculatorDef): string {
  const guide = getCalculatorGuide(calc);
  const display = calculatorDisplayTitle(calc);
  const blurb = seoBySlug[calc.slug]?.blurb;
  const raw = blurb
    ? `${blurb} ${calc.description}. Formulas, steps, and free PDF/CSV exports on ${siteConfig.name}.`
    : `Free ${display} — ${calc.description}. ${guide.overview} Instant results with formulas, steps, and PDF exports on ${siteConfig.name}.`;
  return seoDescription(raw);
}

export function buildCalculatorMetadata(calc: CalculatorDef): Metadata {
  const path = `/calculators/${calc.category}/${calc.slug}`;
  return buildPageMetadata({
    title: calculatorDisplayTitle(calc),
    description: calculatorMetaDescription(calc),
    path,
    keywords: calculatorKeywords(calc),
    type: "article",
  });
}

/** Self-contained 40–60 word lead answer for AI citation / featured snippets. */
export function calculatorAnswerBlock(calc: CalculatorDef): string {
  const outline = getCalculatorOutline(calc);
  const definition = outline.whatIs.definition.replace(/\s+/g, " ").trim();
  const display = calculatorDisplayTitle(calc);
  const lead = `The free ${display} on ${siteConfig.name} computes ${calc.description.toLowerCase()}. ${definition}`;
  if (lead.length <= 320) return lead;
  return `${lead.slice(0, 317).replace(/\s+\S*$/, "").trimEnd()}…`;
}

export function buildCalculatorJsonLd(calc: CalculatorDef) {
  const guide = getCalculatorGuide(calc);
  const outline = getCalculatorOutline(calc);
  const cat = getCategory(calc.category);
  const url = `${siteConfig.url}/calculators/${calc.category}/${calc.slug}`;
  const pageName = calculatorDisplayTitle(calc);
  const dateModified = siteConfig.contentUpdated;

  const faqEntities = [
    {
      "@type": "Question",
      name: `What is ${calc.title}?`,
      acceptedAnswer: { "@type": "Answer", text: outline.whatIs.definition },
    },
    {
      "@type": "Question",
      name: `Is the ${calc.title} calculator free?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `Yes. The ${pageName} on ${siteConfig.name} is free to use with no account required. It includes formulas, steps, and PDF / Word / CSV exports.`,
      },
    },
    {
      "@type": "Question",
      name: `Why does ${calc.title} matter?`,
      acceptedAnswer: { "@type": "Answer", text: outline.why.value },
    },
    {
      "@type": "Question",
      name: `What formulas does the ${calc.title} calculator use?`,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          outline.formula.formulas.length > 0
            ? outline.formula.formulas
                .map((f) => `${f.label}: ${f.latex}${f.note ? ` (${f.note})` : ""}`)
                .join("; ")
            : `See the formulas section on ${pageName}.`,
      },
    },
    ...outline.troubleshooting.map((item) => ({
      "@type": "Question" as const,
      name: item.q,
      acceptedAnswer: { "@type": "Answer" as const, text: item.a },
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Calculators",
            item: `${siteConfig.url}/calculators`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: cat?.name ?? calc.category,
            item: `${siteConfig.url}/calculators/${calc.category}`,
          },
          { "@type": "ListItem", position: 4, name: pageName, item: url },
        ],
      },
      {
        "@type": ["WebApplication", "SoftwareApplication"],
        name: pageName,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript. Core formulas and guides are in HTML.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        description: calculatorMetaDescription(calc),
        url,
        isAccessibleForFree: true,
        dateModified,
        featureList: [
          "Domain-specific how-to guide",
          "Formulas with notation",
          "Troubleshooting FAQ",
          "Worked examples",
          "Free report exports where available",
          "Similar calculator widgets",
        ],
        provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      },
      {
        "@type": "Article",
        headline: pageName,
        description: calculatorAnswerBlock(calc),
        dateModified,
        author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        mainEntityOfPage: url,
        about: calc.title,
      },
      {
        "@type": "HowTo",
        name: `How to use the ${pageName}`,
        description: outline.whatIs.definition,
        totalTime: "PT10M",
        step: [
          { "@type": "HowToStep", position: 1, name: "Audit", text: outline.workflow.audit },
          { "@type": "HowToStep", position: 2, name: "Diagnose", text: outline.workflow.diagnose },
          { "@type": "HowToStep", position: 3, name: "Execute", text: outline.workflow.execute },
          { "@type": "HowToStep", position: 4, name: "Measure", text: outline.workflow.measure },
          ...guide.howTo.map((text, i) => ({
            "@type": "HowToStep" as const,
            position: i + 5,
            name: `Calculator step ${i + 1}`,
            text,
          })),
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqEntities,
      },
    ],
  };
}

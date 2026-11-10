import type { Metadata } from "next";
import type { CalculatorDef } from "@/lib/calculators/types";
import { getCategory } from "@/lib/calculators/registry";
import { getCalculatorGuide } from "@/lib/calculators/explain";
import { siteConfig } from "@/config/site";

function truncate(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function calculatorKeywords(calc: CalculatorDef): string[] {
  const cat = getCategory(calc.category);
  const base = [
    calc.title,
    `${calc.title} calculator`,
    `free ${calc.title.toLowerCase()} calculator`,
    "online calculator",
    "statistics calculator",
    "step by step",
    "formulas",
    siteConfig.name,
  ];
  if (cat) base.push(cat.name, `${cat.name} calculator`);
  if (calc.keywords?.length) base.push(...calc.keywords);
  return [...new Set(base.map((k) => k.trim()).filter(Boolean))];
}

export function calculatorMetaDescription(calc: CalculatorDef): string {
  const guide = getCalculatorGuide(calc);
  const raw = `Free ${calc.title} calculator — ${calc.description}. ${guide.overview} Includes formulas, how-to steps, interpretation tips, and free APA/AMA/PDF exports.`;
  return truncate(raw, 158);
}

export function buildCalculatorMetadata(calc: CalculatorDef): Metadata {
  const path = `/calculators/${calc.category}/${calc.slug}`;
  const title = `${calc.title} Calculator — Free Online Formula & Steps`;
  const description = calculatorMetaDescription(calc);
  const keywords = calculatorKeywords(calc);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    category: getCategory(calc.category)?.name,
  };
}

export function buildCalculatorJsonLd(calc: CalculatorDef) {
  const guide = getCalculatorGuide(calc);
  const cat = getCategory(calc.category);
  const url = `${siteConfig.url}/calculators/${calc.category}/${calc.slug}`;
  const pageName = `${calc.title} Calculator`;

  const faqEntities = [
    {
      "@type": "Question",
      name: `What is the ${calc.title} calculator?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: guide.overview,
      },
    },
    {
      "@type": "Question",
      name: `When should I use the ${calc.title} calculator?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: guide.whenToUse ?? calc.description,
      },
    },
    {
      "@type": "Question",
      name: `How do I use the free ${calc.title} calculator?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: guide.howTo.join(" "),
      },
    },
    {
      "@type": "Question",
      name: `What formulas does the ${calc.title} calculator use?`,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          guide.formulas.length > 0
            ? guide.formulas.map((f) => `${f.label}: ${f.latex}${f.note ? ` (${f.note})` : ""}`).join("; ")
            : `See the formulas section on ${pageName}.`,
      },
    },
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
        "@type": "WebApplication",
        name: pageName,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: calculatorMetaDescription(calc),
        url,
        isAccessibleForFree: true,
        featureList: [
          "Step-by-step solutions",
          "Formulas with notation",
          "Free APA/AMA report exports",
          "PDF, Word, and CSV download",
          "Mobile-friendly calculator",
        ],
        provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      },
      {
        "@type": "HowTo",
        name: `How to use the ${calc.title} calculator`,
        description: guide.overview,
        totalTime: "PT2M",
        step: guide.howTo.map((text, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: `Step ${i + 1}`,
          text,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqEntities,
      },
    ],
  };
}

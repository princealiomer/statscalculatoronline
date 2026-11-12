import type { Metadata } from "next";
import type { CalculatorDef } from "@/lib/calculators/types";
import { getCategory } from "@/lib/calculators/registry";
import { getCalculatorGuide, getCalculatorOutline } from "@/lib/calculators/explain";
import { siteConfig } from "@/config/site";
import { buildPageMetadata, seoDescription } from "@/lib/seo/meta";

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
  const raw = `Free ${calc.title} calculator — ${calc.description}. ${guide.overview} Formulas, steps, and PDF exports on ${siteConfig.name}.`;
  return seoDescription(raw);
}

export function buildCalculatorMetadata(calc: CalculatorDef): Metadata {
  const path = `/calculators/${calc.category}/${calc.slug}`;
  return buildPageMetadata({
    title: `${calc.title} Calculator`,
    description: calculatorMetaDescription(calc),
    path,
    keywords: [...calculatorKeywords(calc), siteConfig.domain],
    type: "article",
  });
}

export function buildCalculatorJsonLd(calc: CalculatorDef) {
  const guide = getCalculatorGuide(calc);
  const outline = getCalculatorOutline(calc);
  const cat = getCategory(calc.category);
  const url = `${siteConfig.url}/calculators/${calc.category}/${calc.slug}`;
  const pageName = `${calc.title} Calculator`;

  const faqEntities = [
    {
      "@type": "Question",
      name: `What is ${calc.title}?`,
      acceptedAnswer: { "@type": "Answer", text: outline.whatIs.definition },
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
          "Understanding & Using outline",
          "Formulas with notation",
          "Troubleshooting FAQ",
          "Industry benchmark guidance",
          "Free APA/AMA report exports",
          "Similar calculator widgets",
        ],
        provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      },
      {
        "@type": "HowTo",
        name: `How to act on ${calc.title} results`,
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

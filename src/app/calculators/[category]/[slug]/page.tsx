import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { calculators, getCalculator } from "@/lib/calculators/registry";
import { buildCalculatorJsonLd, buildCalculatorMetadata } from "@/lib/calculators/seo";

export function generateStaticParams() {
  return calculators.map((c) => ({ category: c.category, slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const calc = getCalculator(category, slug);
  if (!calc) return {};
  return buildCalculatorMetadata(calc);
}

/**
 * Fully static tool pages (all slugs in generateStaticParams).
 * Avoid Suspense+params PPR shells that write duplicate ISR entries per deploy.
 */
export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const calc = getCalculator(category, slug);
  if (!calc) notFound();

  const jsonLd = buildCalculatorJsonLd(calc);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CalculatorShell calculator={calc} />
    </>
  );
}

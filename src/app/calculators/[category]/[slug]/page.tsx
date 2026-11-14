import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { calculators, getCalculator } from "@/lib/calculators/registry";
import { buildCalculatorJsonLd, buildCalculatorMetadata } from "@/lib/calculators/seo";
import { Skeleton } from "@/components/ui/skeleton";

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

function CalculatorPageFallback() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-3 py-6 sm:px-4 sm:py-8" aria-hidden>
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-10 w-3/4 max-w-xl" />
      <Skeleton className="h-20 w-full max-w-3xl" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

async function CalculatorPageContent({
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

/** Pass params into Suspense — do not await at the page root (Instant App Shell). */
export default function CalculatorPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  return (
    <Suspense fallback={<CalculatorPageFallback />}>
      <CalculatorPageContent params={params} />
    </Suspense>
  );
}

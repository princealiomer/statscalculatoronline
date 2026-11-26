import { getCalculator, calculators, getCategory } from "@/lib/calculators/registry";
import { calculatorDisplayTitle } from "@/lib/calculators/displayTitle";
import { siteConfig } from "@/config/site";
import { ogContentType, ogSize, renderOgCard } from "@/lib/seo/ogCard";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = `${siteConfig.name} — free online calculator`;

export function generateStaticParams() {
  return calculators.map((c) => ({ category: c.category, slug: c.slug }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const calc = getCalculator(category, slug);
  const cat = getCategory(category);

  const title = calc ? calculatorDisplayTitle(calc) : "Online Calculator";
  const subtitle = calc
    ? calc.description.replace(/\.*$/, ".")
    : `Free calculators on ${siteConfig.name}.`;
  const eyebrow = cat?.name ? `${cat.name} · Free calculator` : "Free online calculator";

  return renderOgCard({
    title,
    subtitle: subtitle.length > 140 ? `${subtitle.slice(0, 137).trimEnd()}…` : subtitle,
    eyebrow,
    footerLeft: "Formulas · Steps · Results · PDF / Word / CSV",
  });
}

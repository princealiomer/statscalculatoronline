import { connection } from "next/server";
import { getCalculator, getCategory } from "@/lib/calculators/registry";
import { siteConfig } from "@/config/site";
import { ogContentType, ogSize, renderOgCard } from "@/lib/seo/ogCard";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = `${siteConfig.name} — free online calculator`;

function displayTitle(title: string) {
  const t = title.trim();
  if (
    /(?:calculator|checker|converter|generator|counter|simplifier|finder|plot|table|tool)$/i.test(
      t,
    )
  ) {
    return t;
  }
  return `${t} Calculator`;
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  // Request-time only — avoids shipping ~370 static PNGs in every Vercel deployment.
  await connection();

  const { category, slug } = await params;
  const calc = getCalculator(category, slug);
  const cat = getCategory(category);

  const title = calc ? displayTitle(calc.title) : "Online Calculator";
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

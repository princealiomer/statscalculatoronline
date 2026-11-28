import { calculators } from "@/lib/calculators/registry";
import { seoBySlug } from "@/lib/calculators/seoTargeting";

export function searchCalculators(q: string) {
  const s = q.toLowerCase().trim();
  if (!s) return calculators;
  return calculators.filter((c) => {
    const targeted = seoBySlug[c.slug];
    const hay = [
      c.title,
      c.description,
      c.slug,
      c.category,
      targeted?.metaTitle ?? "",
      ...(targeted?.keywords ?? []),
      ...(c.keywords ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(s);
  });
}

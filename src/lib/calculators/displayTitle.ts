import type { CalculatorDef } from "@/lib/calculators/types";
import { seoBySlug } from "@/lib/calculators/seoTargeting";

/** H1 / SERP / link label without doubling “Calculator”. */
export function calculatorDisplayTitle(calc: CalculatorDef): string {
  const targeted = seoBySlug[calc.slug]?.metaTitle ?? calc.metaTitle;
  if (targeted) return targeted;
  const t = calc.title.trim();
  if (
    /(?:calculator|checker|converter|generator|counter|simplifier|finder|plot|table|tool)$/i.test(
      t,
    )
  ) {
    return t;
  }
  return `${t} Calculator`;
}

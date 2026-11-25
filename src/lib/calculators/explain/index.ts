import type { CalculatorDef } from "@/lib/calculators/types";
import { categoryGuides } from "./byCategory";
import { engineGuides } from "./byEngine";
import { domainFor } from "./domains";
import { buildOutline } from "./outline";
import type { CalculatorGuideContent, CalculatorOutline, FormulaBlock } from "./types";

export type { CalculatorGuideContent, CalculatorOutline, FormulaBlock } from "./types";

/** Map real registry engine ids → keys in engineGuides. */
const ENGINE_ALIASES: Record<string, string> = {
  // Descriptive
  average: "mean-median-mode",
  sum: "mean-median-mode",
  "mode-only": "mean-median-mode",
  midhinge: "five-number",
  "basic-stats": "descriptive",
  "descriptive-full": "descriptive",
  "mean-only": "mean-median-mode",
  "variance-only": "standard-deviation",
  "stddev-only": "standard-deviation",
  "range-var-sd": "standard-deviation",
  quartile: "five-number",
  "iqr-only": "five-number",
  cv: "standard-deviation",
  mad: "standard-deviation",
  medad: "standard-deviation",
  zscore: "z-score",
  geomean: "mean-median-mode",
  harmean: "mean-median-mode",
  skewness: "descriptive",
  kurtosis: "descriptive",
  covariance: "correlation",
  "partial-corr": "correlation",
  "freq-table": "descriptive",
  contingency: "chi-square",
  cronbach: "fleiss",
  irr: "fleiss",
  likert: "descriptive",
  "response-rate": "percentage",
  "process-cap": "descriptive",
  "percent-error": "percent-change",
  "odds-prob": "percentage",
  "vote-percent": "percentage",

  // Hypothesis / ANOVA
  "one-sample-z": "one-sample-t",
  "two-sample-z": "two-sample-t",
  "one-way-anova": "anova",
  "two-way-anova": "anova",
  "three-way-anova": "anova",
  "welch-anova": "anova",
  "rm-anova": "anova",
  ancova: "anova",
  manova: "anova",
  tukey: "anova",
  scheffe: "anova",
  dunnett: "anova",
  "games-howell": "anova",
  kruskal: "kruskal-wallis",
  friedman: "kruskal-wallis",
  dunn: "kruskal-wallis",
  wilcoxon: "wilcoxon-signed",
  "chi-gof": "chi-square",
  "chi-ind": "chi-square",
  "chi-homogeneity": "chi-homogeneity",
  fisher: "chi-square",
  "one-prop-z": "confidence-proportion",
  "two-prop-z": "confidence-proportion",
  "binomial-test": "binomial",
  mcnemar: "chi-square",
  levene: "bartlett",
  bartlett: "bartlett",
  fmax: "bartlett",
  normality: "normal-distribution",
  outliers: "z-score",
  permutation: "two-sample-t",
  pvalue: "one-sample-t",
  critical: "normal-distribution",
  "effect-size": "two-sample-t",
  "std-error": "standard-deviation",
  "flow-chart": "one-sample-t",
  bonferroni: "bonferroni",

  // Probability / distributions
  "basic-prob": "bayes",
  "dist-normal": "normal-distribution",
  "dist-t": "normal-distribution",
  "dist-chi": "chi-square",
  "dist-f": "anova",
  "dist-binom": "binomial",
  "dist-pois": "poisson",
  "dist-geom": "binomial",
  "dist-nbinom": "binomial",
  "dist-hyper": "binomial",
  "dist-expo": "poisson",
  "dist-unif": "normal-distribution",
  "dist-beta": "normal-distribution",
  "dist-gamma": "poisson",
  multinomial: "multinomial",
  bayes: "bayes",

  // CI / regression / correlation
  "ci-mean": "confidence-mean",
  "ci-prop": "confidence-proportion",
  "ci-diff-means": "confidence-mean",
  "ci-diff-props": "confidence-proportion",
  "ci-variance": "confidence-mean",
  "linear-reg": "linear-regression",
  "simple-regression": "linear-regression",
  "multiple-reg": "multiple-regression",
  "multi-regression": "multiple-regression",
  "logistic-reg": "logistic-regression",
  "poly-reg": "linear-regression",
  spearman: "spearman",
  kendall: "kendall",
  "point-biserial": "point-biserial",
  "partial-regression": "multiple-regression",

  // Advanced
  fleiss: "fleiss",
  "roc-auc": "roc-auc",
  kmeans: "kmeans",
  cluster: "kmeans",
  mediator: "mediator",
  moderator: "moderator",
  "gage-rr": "gage-rr",
  tost: "tost",
  "monte-carlo": "monte-carlo",
  vif: "vif",
  "matrix-ops": "matrix-ops",
  "sample-size-fpc": "sample-size",
  "stratified-n": "sample-size",

  // Math / finance / geometry aliases
  "compound-interest": "compound",
  "simple-interest": "compound",
  "loan-payment": "loan",
  amortization: "loan",
  mortgage: "loan",
  tip: "percentage",
  discount: "percent-change",
  markup: "percent-change",
  roi: "percent-change",
  "percent-of": "percentage",
  bmi: "bmi",
  pythagoras: "pythagorean",
  "right-triangle": "pythagorean",
  circle: "area-circle",
  sphere: "volume-sphere",
  convert: "unit-convert",
  "unit-conversion": "unit-convert",
};

function mergeGuide(
  base: Partial<CalculatorGuideContent>,
  extra: Partial<CalculatorGuideContent>,
): Partial<CalculatorGuideContent> {
  return {
    overview: extra.overview ?? base.overview,
    whenToUse: extra.whenToUse ?? base.whenToUse,
    example: extra.example ?? base.example,
    howTo: extra.howTo?.length ? extra.howTo : base.howTo,
    formulas: extra.formulas?.length ? extra.formulas : base.formulas,
    interpretation: extra.interpretation?.length ? extra.interpretation : base.interpretation,
    tips: [...(base.tips ?? []), ...(extra.tips ?? [])].filter(
      (t, i, arr) => arr.indexOf(t) === i,
    ),
    faq: extra.faq?.length ? extra.faq : base.faq,
  };
}

function formulasForEngine(engine: string, title: string): FormulaBlock[] {
  const e = engine.toLowerCase();
  const fromGuide = engineGuides[ENGINE_ALIASES[engine] ?? engine]?.formulas;
  if (fromGuide?.length) return fromGuide;
  if (engineGuides[engine]?.formulas?.length) return engineGuides[engine]!.formulas!;

  if (e.includes("t-test") || e.includes("sample-t") || e === "paired-t") {
    return engineGuides["one-sample-t"]?.formulas ?? [];
  }
  if (e.includes("anova")) return engineGuides.anova?.formulas ?? [];
  if (e.includes("chi")) return engineGuides["chi-square"]?.formulas ?? [];
  if (e.includes("binom")) return engineGuides.binomial?.formulas ?? [];
  if (e.includes("pois")) return engineGuides.poisson?.formulas ?? [];
  if (e.includes("normal") || e.includes("zscore") || e === "z-score") {
    return engineGuides["normal-distribution"]?.formulas ?? [];
  }
  if (e.includes("regress")) return engineGuides["linear-regression"]?.formulas ?? [];
  if (e.includes("correl") || e.includes("spearman") || e.includes("kendall")) {
    return engineGuides.correlation?.formulas ?? [];
  }
  if (e.includes("percent") || e.includes("interest") || e.includes("loan")) {
    return engineGuides.percentage?.formulas ?? [];
  }
  if (e.startsWith("geo-") && engineGuides[e]?.formulas?.length) {
    return engineGuides[e]!.formulas!;
  }
  if (title.toLowerCase().includes("quadratic")) {
    return engineGuides.quadratic?.formulas ?? [];
  }
  // Prefer no fake formula over repeating output=f(inputs)
  return [];
}

function howToForDomain(domain: ReturnType<typeof domainFor>, category: string): string[] {
  switch (domain) {
    case "health":
      return [
        "Fill each labeled field (use YYYY-MM-DD for dates).",
        "Click Calculate to see the estimate and step-by-step rule.",
        "Treat results as educational only—not medical advice.",
      ];
    case "time":
      return [
        "Enter dates or times in the format shown on each label.",
        "Click Calculate to see the duration or calendar result.",
        "Check whether day counting is inclusive if that matters for your task.",
      ];
    case "chart":
      return [
        "Enter numeric values (and labels/categories if the fields ask for them).",
        "Click Calculate to generate the chart.",
        "Check that the largest bar or slice matches your largest input.",
      ];
    case "stats":
      if (category === "descriptive-statistics") {
        return [
          "Paste numbers separated by commas, spaces, or new lines.",
          "Choose sample vs population when SD/variance options appear.",
          "Click Calculate to see summaries, steps, and optional exports.",
        ];
      }
      return [
        "Fill in each required field. Lists accept commas, spaces, or new lines.",
        "Adjust options (e.g. sample vs population, confidence level, alternative hypothesis) if shown.",
        "Click Calculate to see results, interpretation text, charts (when available), and free report downloads.",
      ];
    case "geometry":
      return [
        "Enter the labeled dimensions using one length unit throughout.",
        "Click Calculate to see area, length, or volume with steps.",
        "Confirm radius vs diameter and height type before trusting the number.",
      ];
    case "math":
    case "percent":
    case "grades":
      return [
        "Enter each required value exactly as labeled.",
        "Click Calculate to see the result and step-by-step working.",
        "Match the output form (fraction, decimal, percent) to your problem.",
      ];
    case "finance":
      return [
        "Enter principal, rate, term, and any other labeled money fields.",
        "Confirm whether the rate is annual percent before calculating.",
        "Click Calculate to see payments, interest, or balances with steps.",
      ];
    case "credit":
      return [
        "Enter cohort or vintage fields as labeled.",
        "Keep observation windows consistent when comparing cohorts.",
        "Click Calculate to see the educational portfolio summary.",
      ];
    case "conversion":
      return [
        "Enter a numeric value and choose the from/to units.",
        "Click Convert/Calculate to see the result.",
        "Label the output unit before using it in the next step.",
      ];
    case "physics":
    case "chemistry":
      return [
        "Enter every required quantity with consistent units.",
        "Click Calculate to see the result and formula steps.",
        "Check signs and units on each result row.",
      ];
    case "construction":
      return [
        "Enter dimensions in one unit system (feet with feet, or meters with meters).",
        "Click Calculate for the area or materials estimate.",
        "Add waste or extra coats if the page does not include them.",
      ];
    case "text":
      return [
        "Paste or type text into the input area.",
        "Click Calculate to see counts or the transformed output.",
        "Read whether spaces/newlines are included on the result labels.",
      ];
    case "random":
      return [
        "Set the labeled options (range, count, sides, etc.).",
        "Generate a result, then generate again for a new independent draw.",
        "Use game/demo draws only unless the tool is meant for passwords.",
      ];
    default:
      return [
        "Fill each required field with the values matching the labels.",
        "Click Calculate to see the result and any step-by-step working.",
        "Re-run when an input changes.",
      ];
  }
}

function interpretationForDomain(
  domain: ReturnType<typeof domainFor>,
  category: string,
  catInterpretation: string[] | undefined,
): string[] {
  const extra = catInterpretation ?? [];
  switch (domain) {
    case "health":
      return [
        "Read the primary estimate (date, index, or zone) first.",
        "Confirm the method in the steps matches what you intended.",
        "Outputs are educational only and do not replace clinical care.",
        ...extra,
      ];
    case "chart":
      return [
        "The chart should reflect the numbers you entered—largest category wins the tallest bar or biggest slice.",
        "Empty or flat charts usually mean missing or non-numeric data.",
        "Pick a chart type that matches your question (comparison, distribution, or trend).",
        ...extra,
      ];
    case "stats":
      if (category === "descriptive-statistics") {
        return [
          "Read the primary summary (mean, median, mode, etc.) first.",
          "Compare mean and median when outliers may be present.",
          "Report the sample size with every summary.",
          ...extra,
        ];
      }
      return [
        "Read the primary statistic first, then secondary outputs (p-values, intervals, tables).",
        "Match the result to your research question—statistical significance is not the same as practical importance.",
        ...extra,
      ];
    case "geometry":
      return [
        "Area is in square units and volume in cubic units of your length unit.",
        "If the number looks huge or tiny, check mixed units or radius vs diameter.",
        ...extra,
      ];
    case "finance":
      return [
        "Read the primary money result (payment, interest, or balance) first.",
        "Confirm rate period and compounding assumptions in the steps.",
        "Educational estimate only—not a lender quote.",
        ...extra,
      ];
    case "credit":
      return [
        "Read the cohort summary or curve first.",
        "Confirm vintage definitions match before comparing groups.",
        "Educational analysis only—not a credit decision.",
        ...extra,
      ];
    case "grades":
      return [
        "Read the projected grade or GPA first.",
        "Weights should match your syllabus; portals may drop scores differently.",
        "This is a planning estimate—not an official transcript.",
        ...extra,
      ];
    case "percent":
      return [
        "Confirm whether the result is percent-of or percent-change.",
        "State the base of the percent when you report it.",
        ...extra,
      ];
    case "conversion":
      return [
        "Check the output unit on the result row.",
        "Temperature conversions use an offset; most length/mass conversions do not.",
        ...extra,
      ];
    case "construction":
      return [
        "Area/volume should match your dimension math.",
        "Material counts depend on coverage or yield—confirm on the product label.",
        ...extra,
      ];
    case "random":
      return [
        "Each run is a new draw unless a seed is shown.",
        "Short runs can look streaky even when the generator is fine for games/demos.",
        ...extra,
      ];
    case "chemistry":
      return [
        "Read the primary quantity and its unit (for example g/mol) first.",
        "Large gaps vs a textbook table often mean a mistyped formula.",
        ...extra,
      ];
    case "time":
      return [
        "Read the span, age, or clock total on the labeled result row.",
        "Off-by-one usually means inclusive vs exclusive counting—check the steps.",
        ...extra,
      ];
    case "physics":
      return [
        "Check magnitude and units against the formula cards.",
        "Negative values often mean opposite direction under your coordinate system.",
        ...extra,
      ];
    case "math":
      return [
        "Confirm the operation and output form (exact vs decimal) match the problem.",
        "Blank or impossible results usually mean a domain error in the inputs.",
        ...extra,
      ];
    case "text":
      return [
        "Follow the result labels for whether spaces or newlines are counted.",
        "Empty input yields empty counts or empty transforms.",
        ...extra,
      ];
    default:
      return [
        "Read the primary result first, then any secondary outputs.",
        "Match units and assumptions to your problem before using the number.",
        ...extra,
      ];
  }
}

function buildFallback(calc: CalculatorDef): CalculatorGuideContent {
  const cat = categoryGuides[calc.category] ?? {};
  const domain = domainFor(calc.category);

  return {
    overview: `${calc.title} — ${calc.description}. Enter the required inputs below, then review the results and steps.`,
    whenToUse:
      cat.whenToUse ??
      `Use this calculator when you need a quick, transparent computation for “${calc.title.toLowerCase()}”.`,
    howTo: howToForDomain(domain, calc.category),
    formulas: formulasForEngine(calc.engine, calc.title),
    interpretation: interpretationForDomain(domain, calc.category, cat.interpretation),
    tips: [
      ...(cat.tips ?? []),
      "Related calculators in this category appear at the bottom of the page.",
    ],
  };
}

export function getCalculatorGuide(calc: CalculatorDef): CalculatorGuideContent {
  const aliasKey = ENGINE_ALIASES[calc.engine] ?? calc.engine;
  const fromEngine = engineGuides[aliasKey] ?? engineGuides[calc.engine] ?? {};
  const fromCategory = categoryGuides[calc.category] ?? {};
  const fallback = buildFallback(calc);

  const merged = mergeGuide(mergeGuide(fallback, fromCategory), fromEngine);

  return {
    overview: merged.overview ?? fallback.overview,
    whenToUse: merged.whenToUse,
    howTo: merged.howTo ?? fallback.howTo,
    formulas: merged.formulas ?? fallback.formulas,
    interpretation: merged.interpretation ?? fallback.interpretation,
    tips: merged.tips ?? fallback.tips,
    example: merged.example,
    faq: merged.faq,
  };
}

/** Full Understanding & Using outline for every calculator page */
export function getCalculatorOutline(calc: CalculatorDef): CalculatorOutline {
  return buildOutline(calc, getCalculatorGuide(calc));
}

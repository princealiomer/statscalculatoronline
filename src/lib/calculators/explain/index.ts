import type { CalculatorDef } from "@/lib/calculators/types";
import { categoryGuides } from "./byCategory";
import { engineGuides } from "./byEngine";
import type { CalculatorGuideContent, FormulaBlock } from "./types";

export type { CalculatorGuideContent, FormulaBlock } from "./types";

/** Map real registry engine ids → keys in engineGuides. */
const ENGINE_ALIASES: Record<string, string> = {
  // Descriptive
  average: "mean-median-mode",
  sum: "mean-median-mode",
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
  };
}

function formulasForEngine(engine: string, title: string): FormulaBlock[] {
  const e = engine.toLowerCase();
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
  if (title.toLowerCase().includes("quadratic")) {
    return engineGuides.quadratic?.formulas ?? [];
  }
  return [
    {
      label: "General relation",
      latex: "\\text{output}=f(\\text{inputs})",
      note: "Exact formula for this tool is shown in the steps after you calculate.",
    },
  ];
}

function buildFallback(calc: CalculatorDef): CalculatorGuideContent {
  const cat = categoryGuides[calc.category] ?? {};
  return {
    overview: `${calc.title} — ${calc.description}. Enter the required inputs below, then review the numeric results, written report, and exports.`,
    whenToUse:
      cat.whenToUse ??
      `Use this calculator when you need a quick, transparent computation for “${calc.title.toLowerCase()}”.`,
    howTo: [
      "Fill in each required field. Lists accept commas, spaces, or new lines.",
      "Adjust options (e.g. sample vs population, confidence level, alternative hypothesis) if shown.",
      "Click Calculate to see results, interpretation text, charts (when available), and free report downloads.",
    ],
    formulas: formulasForEngine(calc.engine, calc.title),
    interpretation: [
      "Read the primary statistic first, then secondary outputs (p-values, intervals, tables).",
      "Match the result to your research question—statistical significance is not the same as practical importance.",
      ...(cat.interpretation ?? []),
    ],
    tips: [
      ...(cat.tips ?? []),
      "Use the free APA/AMA/plain write-up and PDF/Word/CSV exports to document your work.",
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
  };
}

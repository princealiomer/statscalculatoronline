/** High-level assumptions to surface in free reports (educational checklist). */
export function assumptionsForEngine(engine: string): string[] {
  if (
    [
      "one-sample-t",
      "two-sample-t",
      "paired-t",
      "one-way-anova",
      "two-way-anova",
      "three-way-anova",
      "welch-anova",
      "rm-anova",
      "ancova",
      "slr",
      "mlr",
    ].includes(engine)
  ) {
    return [
      "Observations are independent (unless the design is paired / repeated measures).",
      "The outcome is approximately continuous and approximately normally distributed within groups (or residuals are approximately normal).",
      "For classic ANOVA / pooled t-tests: group variances are roughly similar (otherwise prefer Welch / robust alternatives).",
      "There are no extreme influential outliers driving the result.",
    ];
  }

  if (["one-sample-z", "two-sample-z", "one-prop-z", "two-prop-z", "ab-test"].includes(engine)) {
    return [
      "Sampling is random (or the sample is representative of the target population).",
      "Observations are independent.",
      "For means z-tests: population SD is known (or n is large enough for the normal approximation).",
      "For proportions: np and n(1−p) are large enough for the normal approximation (otherwise prefer an exact test).",
    ];
  }

  if (["chi-gof", "chi-ind", "fisher", "mcnemar", "binomial-test"].includes(engine)) {
    return [
      "Categories are mutually exclusive and exhaustive for the analysis.",
      "Observations are independent (McNemar is for paired binary outcomes).",
      "For chi-square: expected cell counts are generally ≥ 5 (otherwise prefer Fisher / exact methods).",
    ];
  }

  if (["mann-whitney", "wilcoxon", "kruskal", "friedman", "dunn"].includes(engine)) {
    return [
      "Observations are independent across units (or appropriately paired for Wilcoxon / Friedman).",
      "The response is at least ordinal.",
      "Groups share a similar shape if interpreting as a location shift.",
    ];
  }

  if (
    [
      "descriptive-full",
      "basic-stats",
      "average",
      "sum",
      "mean-median-mode",
      "five-number",
      "range-var-sd",
      "cv",
      "mad",
      "medad",
      "percentile",
      "zscore",
      "ci-mean",
      "ci-prop",
      "ci-sd",
      "ci-diff-means",
      "ci-diff-props",
      "ci-corr",
      "moe",
    ].includes(engine)
  ) {
    return [
      "The sample is representative of the population of interest (when generalizing).",
      "Observations are independent unless the design says otherwise.",
      "Choose Sample vs Population formulas to match how the data were collected.",
      "Interval / inference methods assume approximate normality or large-sample conditions when used.",
    ];
  }

  if (engine.startsWith("dist-") || engine === "basic-prob" || engine === "expected-value" || engine === "rng" || engine === "odds-prob") {
    return [
      "Distribution parameters are specified correctly for the intended model.",
      "Probability statements refer to the chosen distributional assumption.",
    ];
  }

  if (engine.startsWith("chart-")) {
    return [
      "Charts summarize the values you entered; they do not by themselves establish causal claims.",
      "Axis scales and binning choices can change visual interpretation.",
    ];
  }

  if (["km", "logrank", "cox"].includes(engine)) {
    return [
      "Censoring is independent of the event process (non-informative censoring).",
      "For Cox models: proportional hazards (approximately) hold.",
      "Event and censoring times are recorded accurately.",
    ];
  }

  return [
    "Results depend on the data and options you entered.",
    "Verify that the chosen procedure matches your study design and measurement level.",
    "Treat calculator output as a starting point for interpretation, not a substitute for domain expertise.",
  ];
}

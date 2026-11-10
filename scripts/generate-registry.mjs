import fs from "fs";

const cats = {
  "descriptive-statistics": {
    name: "Descriptive Statistics",
    desc: "Central tendency, variability, shape, and relationships.",
  },
  "hypothesis-testing": {
    name: "Hypothesis Testing",
    desc: "Parametric and non-parametric tests for means, proportions, and ranks.",
  },
  probability: {
    name: "Probability Distributions",
    desc: "PDF, CDF, and critical values for common distributions.",
  },
  "confidence-interval": {
    name: "Confidence Intervals",
    desc: "Estimate population parameters with confidence intervals.",
  },
  "regression-analysis": {
    name: "Regression Analysis",
    desc: "Model relationships and make predictions.",
  },
  "multivariate-analysis": {
    name: "Multivariate Analysis",
    desc: "PCA, factor analysis, discriminant analysis, and CCA.",
  },
  "survival-analysis": {
    name: "Survival Analysis",
    desc: "Time-to-event analysis with Kaplan-Meier, log-rank, and Cox models.",
  },
  chart: {
    name: "Chart Makers",
    desc: "Create clear statistical visualizations from your data.",
  },
  "causal-inference": {
    name: "Causal Inference",
    desc: "DiD, IV, RDD, and panel effects estimators.",
  },
  "experimental-design": {
    name: "Experimental Design",
    desc: "A/B tests, sample size, randomization, and factorial plans.",
  },
  "credit-analysis": {
    name: "Credit Analysis",
    desc: "Vintage and portfolio performance analysis.",
  },
};

const items = [
  ["descriptive-statistics", "mean-median-mode-calculator", "Mean, Median, Mode", "Calculate arithmetic mean, median, and mode", "mean-median-mode"],
  ["descriptive-statistics", "descriptive-statistics-calculator", "Descriptive Statistics", "Full summary: mean, SD, skewness, kurtosis, and more", "descriptive-full"],
  ["descriptive-statistics", "five-number-summary-calculator", "Five-Number Summary", "Min, Q1, median, Q3, and max", "five-number"],
  ["descriptive-statistics", "range-variance-stddev-calculator", "Range, Variance & SD", "Measure spread with range, variance, and standard deviation", "range-var-sd"],
  ["descriptive-statistics", "coefficient-of-variation-calculator", "Coefficient of Variation", "Relative variability as a percentage of the mean", "cv"],
  ["descriptive-statistics", "mean-absolute-deviation-calculator", "Mean Absolute Deviation", "Average absolute deviation from the mean", "mad"],
  ["descriptive-statistics", "median-absolute-deviation-calculator", "Median Absolute Deviation", "Robust dispersion using median absolute deviations", "medad"],
  ["descriptive-statistics", "percentile-quartile-iqr-calculator", "Percentiles, Quartiles & IQR", "Find percentiles, quartiles, and interquartile range", "percentile"],
  ["descriptive-statistics", "geometric-mean-calculator", "Geometric Mean", "Mean for multiplicative relationships and growth rates", "geomean"],
  ["descriptive-statistics", "harmonic-mean-calculator", "Harmonic Mean", "Mean for rates and speeds", "harmean"],
  ["descriptive-statistics", "skewness-calculator", "Skewness", "Measure asymmetry of a distribution", "skewness"],
  ["descriptive-statistics", "kurtosis-calculator", "Kurtosis", "Measure tailedness of a distribution", "kurtosis"],
  ["descriptive-statistics", "z-score-calculator", "Z-Score", "Standardize values relative to mean and SD", "zscore"],
  ["descriptive-statistics", "correlation-coefficient-calculator", "Correlation Coefficient", "Pearson correlation between two variables", "correlation"],
  ["descriptive-statistics", "covariance-calculator", "Covariance", "Joint variability of two variables", "covariance"],
  ["descriptive-statistics", "partial-correlation-calculator", "Partial Correlation", "Correlation controlling for a third variable", "partial-corr"],
  ["descriptive-statistics", "frequency-table-calculator", "Frequency Table", "Counts and relative frequencies", "freq-table"],
  ["descriptive-statistics", "contingency-table-calculator", "Contingency Table", "Cross-tabulation of categorical variables", "contingency"],
  ["descriptive-statistics", "cronbach-alpha-calculator", "Cronbach Alpha", "Internal consistency reliability", "cronbach"],
  ["descriptive-statistics", "interrater-reliability-calculator", "Interrater Reliability", "Agreement among raters (Cohen kappa approx)", "irr"],
  ["descriptive-statistics", "likert-scale-analysis-calculator", "Likert Scale Analysis", "Summarize Likert-scale responses", "likert"],
  ["descriptive-statistics", "survey-response-rate-calculator", "Survey Response Rate", "Compute response and completion rates", "response-rate"],
  ["descriptive-statistics", "process-capability-calculator", "Process Capability", "Cp, Cpk for process capability analysis", "process-cap"],
  ["hypothesis-testing", "one-sample-t-test-calculator", "One-Sample t-Test", "Test a sample mean against a hypothesized value", "one-sample-t"],
  ["hypothesis-testing", "one-sample-z-test-calculator", "One-Sample Z-Test", "Z-test when population SD is known", "one-sample-z"],
  ["hypothesis-testing", "two-sample-t-test-calculator", "Two-Sample t-Test", "Pooled or Welch t-test for two independent means", "two-sample-t"],
  ["hypothesis-testing", "two-sample-z-test-calculator", "Two-Sample Z-Test", "Compare two means with known population SDs", "two-sample-z"],
  ["hypothesis-testing", "two-sample-paired-t-test-calculator", "Paired t-Test", "Compare paired observations", "paired-t"],
  ["hypothesis-testing", "one-way-anova-calculator", "One-Way ANOVA", "Compare means across three or more groups", "one-way-anova"],
  ["hypothesis-testing", "two-way-anova-calculator", "Two-Way ANOVA", "Two-factor ANOVA with interaction", "two-way-anova"],
  ["hypothesis-testing", "three-way-anova-calculator", "Three-Way ANOVA", "Three-factor ANOVA overview calculator", "three-way-anova"],
  ["hypothesis-testing", "welch-anova-calculator", "Welch ANOVA", "ANOVA without equal-variance assumption", "welch-anova"],
  ["hypothesis-testing", "repeated-measures-anova-calculator", "Repeated Measures ANOVA", "Within-subjects ANOVA", "rm-anova"],
  ["hypothesis-testing", "ancova-calculator", "ANCOVA", "ANOVA with a continuous covariate", "ancova"],
  ["hypothesis-testing", "manova-calculator", "MANOVA", "Multivariate analysis of variance", "manova"],
  ["hypothesis-testing", "tukeys-hsd-test-calculator", "Tukey HSD", "Post-hoc pairwise comparisons after ANOVA", "tukey"],
  ["hypothesis-testing", "scheffe-test-calculator", "Scheffe Test", "Conservative post-hoc comparisons", "scheffe"],
  ["hypothesis-testing", "dunnetts-test-calculator", "Dunnett Test", "Compare treatments to a control", "dunnett"],
  ["hypothesis-testing", "games-howell-test-calculator", "Games-Howell Test", "Post-hoc for unequal variances", "games-howell"],
  ["hypothesis-testing", "kruskal-wallis-test-calculator", "Kruskal-Wallis Test", "Non-parametric one-way ANOVA", "kruskal"],
  ["hypothesis-testing", "friedman-test-calculator", "Friedman Test", "Non-parametric repeated measures", "friedman"],
  ["hypothesis-testing", "dunns-test-calculator", "Dunn Test", "Post-hoc for Kruskal-Wallis", "dunn"],
  ["hypothesis-testing", "mann-whitney-u-test-calculator", "Mann-Whitney U Test", "Non-parametric two-sample rank test", "mann-whitney"],
  ["hypothesis-testing", "wilcoxon-signed-rank-test-calculator", "Wilcoxon Signed-Rank", "Non-parametric paired test", "wilcoxon"],
  ["hypothesis-testing", "chi-square-goodness-of-fit-test-calculator", "Chi-Square Goodness of Fit", "Compare observed frequencies to expected", "chi-gof"],
  ["hypothesis-testing", "chi-square-test-of-independence-calculator", "Chi-Square Independence", "Test association in contingency tables", "chi-ind"],
  ["hypothesis-testing", "fishers-exact-test-calculator", "Fisher Exact Test", "Exact test for 2x2 tables", "fisher"],
  ["hypothesis-testing", "one-proportion-z-test-calculator", "One-Proportion Z-Test", "Test a single proportion", "one-prop-z"],
  ["hypothesis-testing", "two-proportion-z-test-calculator", "Two-Proportion Z-Test", "Compare two proportions", "two-prop-z"],
  ["hypothesis-testing", "binomial-test-calculator", "Binomial Test", "Exact test for a binary proportion", "binomial-test"],
  ["hypothesis-testing", "mcnemars-test-calculator", "McNemar Test", "Paired binary proportions", "mcnemar"],
  ["hypothesis-testing", "levenes-test-calculator", "Levene Test", "Test equality of variances", "levene"],
  ["hypothesis-testing", "normality-test-calculator", "Normality Test", "Jarque-Bera / normality diagnostics", "normality"],
  ["hypothesis-testing", "outlier-detection-calculator", "Outlier Detection", "Grubbs test for outliers", "outliers"],
  ["hypothesis-testing", "permutation-test-calculator", "Permutation Test", "Resampling-based mean comparison", "permutation"],
  ["hypothesis-testing", "p-value-calculator", "P-Value Calculator", "Convert test statistics to p-values", "pvalue"],
  ["hypothesis-testing", "critical-value-calculator", "Critical Value Calculator", "Find Z, t, F, or chi-square critical values", "critical"],
  ["hypothesis-testing", "effect-size-calculator", "Effect Size", "Cohen d, Hedges g, and related effect sizes", "effect-size"],
  ["hypothesis-testing", "standard-error-calculator", "Standard Error", "SE of the mean and related estimators", "std-error"],
  ["hypothesis-testing", "sample-size-and-power-analysis-calculator", "Sample Size & Power", "Plan sample size for desired power", "sample-size"],
  ["hypothesis-testing", "statistical-test-flow-chart", "Statistical Test Selector", "Interactive guide to choose the right test", "flow-chart"],
  ["probability", "basic-probability-calculator", "Basic Probability", "Union, intersection, and conditional probability", "basic-prob"],
  ["probability", "normal-distribution-calculator", "Normal Distribution", "PDF, CDF, and quantiles of the normal", "dist-normal"],
  ["probability", "students-t-distribution-calculator", "Student t Distribution", "PDF, CDF, and quantiles of t", "dist-t"],
  ["probability", "chi-square-distribution-calculator", "Chi-Square Distribution", "PDF, CDF, and quantiles of chi-square", "dist-chi"],
  ["probability", "f-distribution-calculator", "F Distribution", "PDF, CDF, and quantiles of F", "dist-f"],
  ["probability", "binomial-distribution-calculator", "Binomial Distribution", "PMF and CDF for binomial trials", "dist-binom"],
  ["probability", "poisson-distribution-calculator", "Poisson Distribution", "PMF and CDF for Poisson counts", "dist-pois"],
  ["probability", "geometric-distribution-calculator", "Geometric Distribution", "Trials until first success", "dist-geom"],
  ["probability", "negative-binomial-distribution-calculator", "Negative Binomial", "Trials until r successes", "dist-nbinom"],
  ["probability", "hypergeometric-distribution-calculator", "Hypergeometric", "Sampling without replacement", "dist-hyper"],
  ["probability", "exponential-distribution-calculator", "Exponential Distribution", "Waiting times with constant hazard", "dist-exp"],
  ["probability", "gamma-distribution-calculator", "Gamma Distribution", "Shape-scale continuous distribution", "dist-gamma"],
  ["probability", "beta-distribution-calculator", "Beta Distribution", "Bounded continuous probabilities", "dist-beta"],
  ["probability", "uniform-distribution-calculator", "Uniform Distribution", "Continuous uniform PDF/CDF", "dist-unif"],
  ["probability", "weibull-distribution-calculator", "Weibull Distribution", "Reliability and lifetime modeling", "dist-weibull"],
  ["probability", "log-normal-distribution-calculator", "Log-Normal Distribution", "Log-normal PDF/CDF", "dist-lognorm"],
  ["probability", "logistic-distribution-calculator", "Logistic Distribution", "Logistic PDF/CDF", "dist-logistic"],
  ["probability", "inverse-normal-distribution-calculator", "Inverse Normal", "Find x given cumulative probability", "dist-invnorm"],
  ["probability", "expected-value-calculator", "Expected Value", "E[X] for discrete or continuous setups", "expected-value"],
  ["probability", "random-number-generator", "Random Number Generator", "Generate random samples from distributions", "rng"],
  ["confidence-interval", "mean-calculator", "CI for a Mean", "Confidence interval for a population mean", "ci-mean"],
  ["confidence-interval", "proportion-calculator", "CI for a Proportion", "Confidence interval for a proportion", "ci-prop"],
  ["confidence-interval", "standard-deviation-calculator", "CI for SD", "Confidence interval for a standard deviation", "ci-sd"],
  ["confidence-interval", "difference-in-means-calculator", "CI for Difference in Means", "Interval for mu1 - mu2", "ci-diff-means"],
  ["confidence-interval", "difference-in-proportions-calculator", "CI for Difference in Proportions", "Interval for p1 - p2", "ci-diff-props"],
  ["confidence-interval", "correlation-coefficient-calculator", "CI for Correlation", "Fisher z interval for Pearson r", "ci-corr"],
  ["confidence-interval", "margin-of-error-calculator", "Margin of Error", "Compute margin of error for means or proportions", "moe"],
  ["regression-analysis", "simple-linear-regression-calculator", "Simple Linear Regression", "Fit y = a + bx with inference", "slr"],
  ["regression-analysis", "multiple-linear-regression-calculator", "Multiple Linear Regression", "Multiple predictors OLS", "mlr"],
  ["regression-analysis", "quadratic-regression-calculator", "Quadratic Regression", "Fit a + bx + cx^2", "quad-reg"],
  ["regression-analysis", "exponential-regression-calculator", "Exponential Regression", "Fit A e^{bx}", "exp-reg"],
  ["regression-analysis", "logistic-regression-calculator", "Logistic Regression", "Binary outcome logistic model", "log-reg"],
  ["regression-analysis", "polynomial-regression-calculator", "Polynomial Regression", "Higher-order polynomial fit", "poly-reg"],
  ["regression-analysis", "censored-regression-calculator", "Censored Regression (Tobit)", "Tobit-style censored outcome model", "tobit"],
  ["multivariate-analysis", "principal-component-analysis-calculator", "PCA", "Principal component analysis", "pca"],
  ["multivariate-analysis", "exploratory-factor-analysis-calculator", "Exploratory Factor Analysis", "Identify latent factors", "efa"],
  ["multivariate-analysis", "confirmatory-factor-analysis-calculator", "Confirmatory Factor Analysis", "Test a hypothesized factor structure", "cfa"],
  ["multivariate-analysis", "discriminant-analysis-calculator", "Discriminant Analysis", "LDA classification", "lda"],
  ["multivariate-analysis", "canonical-correlation-analysis-calculator", "Canonical Correlation", "Relate two variable sets", "cca"],
  ["survival-analysis", "kaplan-meier-calculator", "Kaplan-Meier", "Estimate survival curves with censoring", "km"],
  ["survival-analysis", "log-rank-test-calculator", "Log-Rank Test", "Compare survival curves across groups", "logrank"],
  ["survival-analysis", "cox-regression-calculator", "Cox Regression", "Proportional hazards with covariates", "cox"],
  ["chart", "bar-chart", "Bar Chart", "Compare categorical frequencies", "chart-bar"],
  ["chart", "pie-chart", "Pie Chart", "Part-to-whole proportions", "chart-pie"],
  ["chart", "histogram", "Histogram", "Distribution of continuous data", "chart-hist"],
  ["chart", "box-plot", "Box Plot", "Five-number summary visualization", "chart-box"],
  ["chart", "scatter-plot", "Scatter Plot", "Relationship between two variables", "chart-scatter"],
  ["chart", "line-chart", "Line Chart", "Trends over ordered categories", "chart-line"],
  ["chart", "qq-plot", "Q-Q Plot", "Assess normality visually", "chart-qq"],
  ["chart", "bell-curve-graph-generator", "Bell Curve Generator", "Normal curve with mean and SD", "chart-bell"],
  ["chart", "dot-plot", "Dot Plot", "Individual points and distribution", "chart-dot"],
  ["chart", "density-plot", "Density Plot", "Kernel-density style visualization", "chart-density"],
  ["chart", "violin-plot", "Violin Plot", "Density + box-style summary", "chart-violin"],
  ["chart", "stem-and-leaf-plot", "Stem-and-Leaf Plot", "Preserve values while showing shape", "chart-stem"],
  ["chart", "funnel-chart", "Funnel Chart", "Conversion stages", "chart-funnel"],
  ["chart", "tree-map", "Tree Map", "Nested proportional rectangles", "chart-treemap"],
  ["chart", "waterfall-chart", "Waterfall Chart", "Cumulative gains and losses", "chart-waterfall"],
  ["chart", "area-chart", "Area Chart", "Filled trend visualization", "chart-area"],
  ["chart", "bubble-chart", "Bubble Chart", "Three-variable scatter", "chart-bubble"],
  ["chart", "heat-map", "Heat Map", "Matrix intensity visualization", "chart-heatmap"],
  ["chart", "control-chart", "Control Chart", "Process monitoring limits", "chart-control"],
  ["chart", "pareto-chart", "Pareto Chart", "Bars plus cumulative line", "chart-pareto"],
  ["chart", "radar-chart", "Radar Chart", "Multivariate profile plot", "chart-radar"],
  ["chart", "roc-curve", "ROC Curve", "Classifier performance curve", "chart-roc"],
  ["chart", "forest-plot", "Forest Plot", "Effect sizes across studies", "chart-forest"],
  ["chart", "bland-altman", "Bland-Altman Plot", "Agreement between two methods", "chart-ba"],
  ["chart", "lollipop-chart", "Lollipop Chart", "Minimal bar alternative", "chart-lollipop"],
  ["chart", "slopegraph", "Slopegraph", "Change between two time points", "chart-slope"],
  ["chart", "sankey-diagram", "Sankey Diagram", "Flow quantities between nodes", "chart-sankey"],
  ["chart", "venn-diagram", "Venn Diagram", "Set overlaps", "chart-venn"],
  ["chart", "chart-builder", "Chart Builder", "Pick a chart and paste data", "chart-builder"],
  ["chart", "chart-maker-with-ai", "Chart Maker", "Guided chart creation from data", "chart-ai"],
  ["causal-inference", "difference-in-differences-calculator", "Difference-in-Differences", "Estimate causal effects with DiD", "did"],
  ["causal-inference", "instrumental-variables-calculator", "Instrumental Variables", "2SLS / IV estimation", "iv"],
  ["causal-inference", "regression-discontinuity-calculator", "Regression Discontinuity", "Local linear RDD estimate", "rdd"],
  ["causal-inference", "fixed-random-effects-calculator", "Fixed & Random Effects", "Panel data estimators", "panel"],
  ["experimental-design", "ab-testing-calculator", "A/B Testing", "Compare conversion rates and lift", "ab-test"],
  ["experimental-design", "survey-sample-size-calculator", "Survey Sample Size", "Sample size for survey proportions", "survey-n"],
  ["experimental-design", "randomization-calculator", "Randomization", "Randomly assign units to arms", "randomize"],
  ["experimental-design", "factorial-design-planner", "Factorial Design Planner", "Plan 2^k factorial experiments", "factorial"],
  ["experimental-design", "crossover-design-calculator", "Crossover Design", "Analyze 2x2 crossover trials", "crossover"],
  ["credit-analysis", "vintage-analysis-calculator", "Vintage Analysis", "Cohort delinquency / vintage curves", "vintage"],
];

const lines = [];
lines.push(`import type { CalculatorDef, CategoryDef } from "./types";`);
lines.push("");
lines.push("export const categories: CategoryDef[] = [");
for (const [id, c] of Object.entries(cats)) {
  lines.push(
    `  { id: ${JSON.stringify(id)}, name: ${JSON.stringify(c.name)}, description: ${JSON.stringify(c.desc)} },`,
  );
}
lines.push("];");
lines.push("");
lines.push("export const calculators: CalculatorDef[] = [");
for (const [category, slug, title, description, engine] of items) {
  lines.push(
    `  { category: ${JSON.stringify(category)}, slug: ${JSON.stringify(slug)}, title: ${JSON.stringify(title)}, description: ${JSON.stringify(description)}, engine: ${JSON.stringify(engine)} },`,
  );
}
lines.push("];");
lines.push(`
export const apHub = {
  category: "ap-statistics-calculators" as const,
  title: "AP Statistics Calculators",
  description: "Core calculators aligned with the AP Statistics curriculum.",
};

export function getCalculator(category: string, slug: string) {
  return calculators.find((c) => c.category === category && c.slug === slug);
}

export function getByCategory(category: string) {
  return calculators.filter((c) => c.category === category);
}

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

export function searchCalculators(q: string) {
  const s = q.toLowerCase().trim();
  if (!s) return calculators;
  return calculators.filter(
    (c) =>
      c.title.toLowerCase().includes(s) ||
      c.description.toLowerCase().includes(s) ||
      c.slug.includes(s) ||
      c.category.includes(s),
  );
}
`);

fs.mkdirSync("src/lib/calculators", { recursive: true });
fs.writeFileSync("src/lib/calculators/registry.ts", lines.join("\n"));
console.log("Wrote", items.length, "calculators");

import type { CalculatorDef } from "./types";
import { categories } from "./categories";

export { categories } from "./categories";
export type { CategoryDef } from "./types";

export const calculators: CalculatorDef[] = [
  { category: "descriptive-statistics", slug: "mean-median-mode-calculator", title: "Mean, Median, Mode", description: "Calculate arithmetic mean, median, and mode", engine: "mean-median-mode" },
  { category: "descriptive-statistics", slug: "average-calculator", title: "Average Calculator", description: "Compute the arithmetic average (mean) of a data set", engine: "average" },
  { category: "descriptive-statistics", slug: "sum-calculator", title: "Sum Calculator", description: "Add a list of numbers and show the total", engine: "sum" },
  { category: "descriptive-statistics", slug: "basic-statistics-calculator", title: "Basic Statistics", description: "Min, max, sum, count, mean, median, mode, SD, and variance", engine: "basic-stats" },
  { category: "descriptive-statistics", slug: "descriptive-statistics-calculator", title: "Descriptive Statistics", description: "Full summary: mean, SD, skewness, kurtosis, outliers, and more", engine: "descriptive-full" },
  { category: "descriptive-statistics", slug: "five-number-summary-calculator", title: "Five-Number Summary", description: "Min, Q1, median, Q3, and max", engine: "five-number" },
  { category: "descriptive-statistics", slug: "range-variance-stddev-calculator", title: "Range, Variance & SD", description: "Measure spread with range, variance, and standard deviation", engine: "range-var-sd" },
  { category: "descriptive-statistics", slug: "percent-error-calculator", title: "Percent Error", description: "Percent error of experimental vs theoretical value", engine: "percent-error" },
  { category: "descriptive-statistics", slug: "odds-probability-calculator", title: "Odds to Probability", description: "Convert odds of winning into probability and percent chance", engine: "odds-prob" },
  { category: "descriptive-statistics", slug: "vote-percentage-calculator", title: "Vote Percentage", description: "Share of each count as a percent of the total", engine: "vote-percent" },
  { category: "descriptive-statistics", slug: "mean-calculator", title: "Mean Calculator", description: "Compute the arithmetic mean of a data set", engine: "mean-only" },
  { category: "descriptive-statistics", slug: "variance-calculator", title: "Variance Calculator", description: "Sample or population variance with SD", engine: "variance-only" },
  { category: "descriptive-statistics", slug: "sample-standard-deviation-calculator", title: "Standard Deviation", description: "Sample or population standard deviation with variance", engine: "stddev-only" },
  { category: "descriptive-statistics", slug: "quartile-calculator", title: "Quartile Calculator", description: "Q1, Q2, Q3, IQR, min, and max", engine: "quartile" },
  { category: "descriptive-statistics", slug: "interquartile-range-calculator", title: "Interquartile Range", description: "IQR = Q3 − Q1 with quartile context", engine: "iqr-only" },
  { category: "descriptive-statistics", slug: "coefficient-of-variation-calculator", title: "Coefficient of Variation", description: "Relative variability as a percentage of the mean", engine: "cv" },
  { category: "descriptive-statistics", slug: "mean-absolute-deviation-calculator", title: "Mean Absolute Deviation", description: "Average absolute deviation from the mean", engine: "mad" },
  { category: "descriptive-statistics", slug: "median-absolute-deviation-calculator", title: "Median Absolute Deviation", description: "Robust dispersion using median absolute deviations", engine: "medad" },
  { category: "descriptive-statistics", slug: "percentile-quartile-iqr-calculator", title: "Percentiles, Quartiles & IQR", description: "Find percentiles, quartiles, and interquartile range", engine: "percentile" },
  { category: "descriptive-statistics", slug: "geometric-mean-calculator", title: "Geometric Mean", description: "Mean for multiplicative relationships and growth rates", engine: "geomean" },
  { category: "descriptive-statistics", slug: "harmonic-mean-calculator", title: "Harmonic Mean", description: "Mean for rates and speeds", engine: "harmean" },
  { category: "descriptive-statistics", slug: "skewness-calculator", title: "Skewness", description: "Measure asymmetry of a distribution", engine: "skewness" },
  { category: "descriptive-statistics", slug: "kurtosis-calculator", title: "Kurtosis", description: "Measure tailedness of a distribution", engine: "kurtosis" },
  { category: "descriptive-statistics", slug: "z-score-calculator", title: "Z-Score", description: "Standardize values relative to mean and SD", engine: "zscore" },
  { category: "descriptive-statistics", slug: "correlation-coefficient-calculator", title: "Correlation Coefficient", description: "Pearson correlation between two variables", engine: "correlation" },
  { category: "descriptive-statistics", slug: "covariance-calculator", title: "Covariance", description: "Joint variability of two variables", engine: "covariance" },
  { category: "descriptive-statistics", slug: "partial-correlation-calculator", title: "Partial Correlation", description: "Correlation controlling for a third variable", engine: "partial-corr" },
  { category: "descriptive-statistics", slug: "frequency-table-calculator", title: "Frequency Table", description: "Counts and relative frequencies", engine: "freq-table" },
  { category: "descriptive-statistics", slug: "contingency-table-calculator", title: "Contingency Table", description: "Cross-tabulation of categorical variables", engine: "contingency" },
  { category: "descriptive-statistics", slug: "cronbach-alpha-calculator", title: "Cronbach Alpha", description: "Internal consistency reliability", engine: "cronbach" },
  { category: "descriptive-statistics", slug: "interrater-reliability-calculator", title: "Interrater Reliability", description: "Agreement among raters (Cohen kappa approx)", engine: "irr" },
  { category: "descriptive-statistics", slug: "likert-scale-analysis-calculator", title: "Likert Scale Analysis", description: "Summarize Likert-scale responses", engine: "likert" },
  { category: "descriptive-statistics", slug: "survey-response-rate-calculator", title: "Survey Response Rate", description: "Compute response and completion rates", engine: "response-rate" },
  { category: "descriptive-statistics", slug: "process-capability-calculator", title: "Process Capability", description: "Cp, Cpk for process capability analysis", engine: "process-cap" },
  { category: "hypothesis-testing", slug: "one-sample-t-test-calculator", title: "One-Sample t-Test", description: "Test a sample mean against a hypothesized value", engine: "one-sample-t" },
  { category: "hypothesis-testing", slug: "one-sample-z-test-calculator", title: "One-Sample Z-Test", description: "Z-test when population SD is known", engine: "one-sample-z" },
  { category: "hypothesis-testing", slug: "two-sample-t-test-calculator", title: "Two-Sample t-Test", description: "Pooled or Welch t-test for two independent means", engine: "two-sample-t" },
  { category: "hypothesis-testing", slug: "two-sample-z-test-calculator", title: "Two-Sample Z-Test", description: "Compare two means with known population SDs", engine: "two-sample-z" },
  { category: "hypothesis-testing", slug: "two-sample-paired-t-test-calculator", title: "Paired t-Test", description: "Compare paired observations", engine: "paired-t" },
  { category: "hypothesis-testing", slug: "one-way-anova-calculator", title: "One-Way ANOVA", description: "Compare means across three or more groups", engine: "one-way-anova" },
  { category: "hypothesis-testing", slug: "two-way-anova-calculator", title: "Two-Way ANOVA", description: "Two-factor ANOVA with interaction", engine: "two-way-anova" },
  { category: "hypothesis-testing", slug: "three-way-anova-calculator", title: "Three-Way ANOVA", description: "Three-factor ANOVA overview calculator", engine: "three-way-anova" },
  { category: "hypothesis-testing", slug: "welch-anova-calculator", title: "Welch ANOVA", description: "ANOVA without equal-variance assumption", engine: "welch-anova" },
  { category: "hypothesis-testing", slug: "repeated-measures-anova-calculator", title: "Repeated Measures ANOVA", description: "Within-subjects ANOVA", engine: "rm-anova" },
  { category: "hypothesis-testing", slug: "ancova-calculator", title: "ANCOVA", description: "ANOVA with a continuous covariate", engine: "ancova" },
  { category: "hypothesis-testing", slug: "manova-calculator", title: "MANOVA", description: "Multivariate analysis of variance", engine: "manova" },
  { category: "hypothesis-testing", slug: "tukeys-hsd-test-calculator", title: "Tukey HSD", description: "Post-hoc pairwise comparisons after ANOVA", engine: "tukey" },
  { category: "hypothesis-testing", slug: "scheffe-test-calculator", title: "Scheffe Test", description: "Conservative post-hoc comparisons", engine: "scheffe" },
  { category: "hypothesis-testing", slug: "dunnetts-test-calculator", title: "Dunnett Test", description: "Compare treatments to a control", engine: "dunnett" },
  { category: "hypothesis-testing", slug: "games-howell-test-calculator", title: "Games-Howell Test", description: "Post-hoc for unequal variances", engine: "games-howell" },
  { category: "hypothesis-testing", slug: "kruskal-wallis-test-calculator", title: "Kruskal-Wallis Test", description: "Non-parametric one-way ANOVA", engine: "kruskal" },
  { category: "hypothesis-testing", slug: "friedman-test-calculator", title: "Friedman Test", description: "Non-parametric repeated measures", engine: "friedman" },
  { category: "hypothesis-testing", slug: "dunns-test-calculator", title: "Dunn Test", description: "Post-hoc for Kruskal-Wallis", engine: "dunn" },
  { category: "hypothesis-testing", slug: "mann-whitney-u-test-calculator", title: "Mann-Whitney U Test", description: "Non-parametric two-sample rank test", engine: "mann-whitney" },
  { category: "hypothesis-testing", slug: "wilcoxon-signed-rank-test-calculator", title: "Wilcoxon Signed-Rank", description: "Non-parametric paired test", engine: "wilcoxon" },
  { category: "hypothesis-testing", slug: "chi-square-goodness-of-fit-test-calculator", title: "Chi-Square Goodness of Fit", description: "Compare observed frequencies to expected", engine: "chi-gof" },
  { category: "hypothesis-testing", slug: "chi-square-test-of-independence-calculator", title: "Chi-Square Independence", description: "Test association in contingency tables", engine: "chi-ind" },
  { category: "hypothesis-testing", slug: "fishers-exact-test-calculator", title: "Fisher Exact Test", description: "Exact test for 2x2 tables", engine: "fisher" },
  { category: "hypothesis-testing", slug: "one-proportion-z-test-calculator", title: "One-Proportion Z-Test", description: "Test a single proportion", engine: "one-prop-z" },
  { category: "hypothesis-testing", slug: "two-proportion-z-test-calculator", title: "Two-Proportion Z-Test", description: "Compare two proportions", engine: "two-prop-z" },
  { category: "hypothesis-testing", slug: "binomial-test-calculator", title: "Binomial Test", description: "Exact test for a binary proportion", engine: "binomial-test" },
  { category: "hypothesis-testing", slug: "mcnemars-test-calculator", title: "McNemar Test", description: "Paired binary proportions", engine: "mcnemar" },
  { category: "hypothesis-testing", slug: "levenes-test-calculator", title: "Levene Test", description: "Test equality of variances", engine: "levene" },
  { category: "hypothesis-testing", slug: "normality-test-calculator", title: "Normality Test", description: "Jarque-Bera / normality diagnostics", engine: "normality" },
  { category: "hypothesis-testing", slug: "outlier-detection-calculator", title: "Outlier Detection", description: "Grubbs test for outliers", engine: "outliers" },
  { category: "hypothesis-testing", slug: "permutation-test-calculator", title: "Permutation Test", description: "Resampling-based mean comparison", engine: "permutation" },
  { category: "hypothesis-testing", slug: "p-value-calculator", title: "P-Value Calculator", description: "Convert test statistics to p-values", engine: "pvalue" },
  { category: "hypothesis-testing", slug: "critical-value-calculator", title: "Critical Value Calculator", description: "Find Z, t, F, or chi-square critical values", engine: "critical" },
  { category: "hypothesis-testing", slug: "effect-size-calculator", title: "Effect Size", description: "Cohen d, Hedges g, and related effect sizes", engine: "effect-size" },
  { category: "hypothesis-testing", slug: "standard-error-calculator", title: "Standard Error", description: "SE of the mean and related estimators", engine: "std-error" },
  { category: "hypothesis-testing", slug: "sample-size-and-power-analysis-calculator", title: "Sample Size & Power", description: "Plan sample size for desired power", engine: "sample-size" },
  { category: "hypothesis-testing", slug: "statistical-test-flow-chart", title: "Statistical Test Selector", description: "Interactive guide to choose the right test", engine: "flow-chart" },
  { category: "probability", slug: "basic-probability-calculator", title: "Basic Probability", description: "Union, intersection, and conditional probability", engine: "basic-prob" },
  { category: "probability", slug: "normal-distribution-calculator", title: "Normal Distribution", description: "PDF, CDF, and quantiles of the normal", engine: "dist-normal" },
  { category: "probability", slug: "students-t-distribution-calculator", title: "Student t Distribution", description: "PDF, CDF, and quantiles of t", engine: "dist-t" },
  { category: "probability", slug: "chi-square-distribution-calculator", title: "Chi-Square Distribution", description: "PDF, CDF, and quantiles of chi-square", engine: "dist-chi" },
  { category: "probability", slug: "f-distribution-calculator", title: "F Distribution", description: "PDF, CDF, and quantiles of F", engine: "dist-f" },
  { category: "probability", slug: "binomial-distribution-calculator", title: "Binomial Distribution", description: "PMF and CDF for binomial trials", engine: "dist-binom" },
  { category: "probability", slug: "poisson-distribution-calculator", title: "Poisson Distribution", description: "PMF and CDF for Poisson counts", engine: "dist-pois" },
  { category: "probability", slug: "geometric-distribution-calculator", title: "Geometric Distribution", description: "Trials until first success", engine: "dist-geom" },
  { category: "probability", slug: "negative-binomial-distribution-calculator", title: "Negative Binomial", description: "Trials until r successes", engine: "dist-nbinom" },
  { category: "probability", slug: "hypergeometric-distribution-calculator", title: "Hypergeometric", description: "Sampling without replacement", engine: "dist-hyper" },
  { category: "probability", slug: "exponential-distribution-calculator", title: "Exponential Distribution", description: "Waiting times with constant hazard", engine: "dist-exp" },
  { category: "probability", slug: "gamma-distribution-calculator", title: "Gamma Distribution", description: "Shape-scale continuous distribution", engine: "dist-gamma" },
  { category: "probability", slug: "beta-distribution-calculator", title: "Beta Distribution", description: "Bounded continuous probabilities", engine: "dist-beta" },
  { category: "probability", slug: "uniform-distribution-calculator", title: "Uniform Distribution", description: "Continuous uniform PDF/CDF", engine: "dist-unif" },
  { category: "probability", slug: "weibull-distribution-calculator", title: "Weibull Distribution", description: "Reliability and lifetime modeling", engine: "dist-weibull" },
  { category: "probability", slug: "log-normal-distribution-calculator", title: "Log-Normal Distribution", description: "Log-normal PDF/CDF", engine: "dist-lognorm" },
  { category: "probability", slug: "logistic-distribution-calculator", title: "Logistic Distribution", description: "Logistic PDF/CDF", engine: "dist-logistic" },
  { category: "probability", slug: "inverse-normal-distribution-calculator", title: "Inverse Normal", description: "Find x given cumulative probability", engine: "dist-invnorm" },
  { category: "probability", slug: "expected-value-calculator", title: "Expected Value", description: "E[X] for discrete or continuous setups", engine: "expected-value" },
  { category: "probability", slug: "random-number-generator", title: "Random Number Generator", description: "Generate random samples from distributions", engine: "rng" },
  { category: "confidence-interval", slug: "mean-calculator", title: "CI for a Mean", description: "Confidence interval for a population mean", engine: "ci-mean" },
  { category: "confidence-interval", slug: "proportion-calculator", title: "CI for a Proportion", description: "Confidence interval for a proportion", engine: "ci-prop" },
  { category: "confidence-interval", slug: "standard-deviation-calculator", title: "CI for SD", description: "Confidence interval for a standard deviation", engine: "ci-sd" },
  { category: "confidence-interval", slug: "difference-in-means-calculator", title: "CI for Difference in Means", description: "Interval for mu1 - mu2", engine: "ci-diff-means" },
  { category: "confidence-interval", slug: "difference-in-proportions-calculator", title: "CI for Difference in Proportions", description: "Interval for p1 - p2", engine: "ci-diff-props" },
  { category: "confidence-interval", slug: "correlation-coefficient-calculator", title: "CI for Correlation", description: "Fisher z interval for Pearson r", engine: "ci-corr" },
  { category: "confidence-interval", slug: "margin-of-error-calculator", title: "Margin of Error", description: "Compute margin of error for means or proportions", engine: "moe" },
  { category: "regression-analysis", slug: "simple-linear-regression-calculator", title: "Simple Linear Regression", description: "Fit y = a + bx with inference", engine: "slr" },
  { category: "regression-analysis", slug: "multiple-linear-regression-calculator", title: "Multiple Linear Regression", description: "Multiple predictors OLS", engine: "mlr" },
  { category: "regression-analysis", slug: "quadratic-regression-calculator", title: "Quadratic Regression", description: "Fit a + bx + cx^2", engine: "quad-reg" },
  { category: "regression-analysis", slug: "exponential-regression-calculator", title: "Exponential Regression", description: "Fit A e^{bx}", engine: "exp-reg" },
  { category: "regression-analysis", slug: "logistic-regression-calculator", title: "Logistic Regression", description: "Binary outcome logistic model", engine: "log-reg" },
  { category: "regression-analysis", slug: "polynomial-regression-calculator", title: "Polynomial Regression", description: "Higher-order polynomial fit", engine: "poly-reg" },
  { category: "regression-analysis", slug: "censored-regression-calculator", title: "Censored Regression (Tobit)", description: "Tobit-style censored outcome model", engine: "tobit" },
  { category: "multivariate-analysis", slug: "principal-component-analysis-calculator", title: "PCA", description: "Principal component analysis", engine: "pca" },
  { category: "multivariate-analysis", slug: "exploratory-factor-analysis-calculator", title: "Exploratory Factor Analysis", description: "Identify latent factors", engine: "efa" },
  { category: "multivariate-analysis", slug: "confirmatory-factor-analysis-calculator", title: "Confirmatory Factor Analysis", description: "Test a hypothesized factor structure", engine: "cfa" },
  { category: "multivariate-analysis", slug: "discriminant-analysis-calculator", title: "Discriminant Analysis", description: "LDA classification", engine: "lda" },
  { category: "multivariate-analysis", slug: "canonical-correlation-analysis-calculator", title: "Canonical Correlation", description: "Relate two variable sets", engine: "cca" },
  { category: "survival-analysis", slug: "kaplan-meier-calculator", title: "Kaplan-Meier", description: "Estimate survival curves with censoring", engine: "km" },
  { category: "survival-analysis", slug: "log-rank-test-calculator", title: "Log-Rank Test", description: "Compare survival curves across groups", engine: "logrank" },
  { category: "survival-analysis", slug: "cox-regression-calculator", title: "Cox Regression", description: "Proportional hazards with covariates", engine: "cox" },
  { category: "chart", slug: "bar-chart", title: "Bar Chart", description: "Compare categorical frequencies", engine: "chart-bar" },
  { category: "chart", slug: "pie-chart", title: "Pie Chart", description: "Part-to-whole proportions", engine: "chart-pie" },
  { category: "chart", slug: "histogram", title: "Histogram", description: "Distribution of continuous data", engine: "chart-hist" },
  { category: "chart", slug: "box-plot", title: "Box Plot", description: "Five-number summary visualization", engine: "chart-box" },
  { category: "chart", slug: "scatter-plot", title: "Scatter Plot", description: "Relationship between two variables", engine: "chart-scatter" },
  { category: "chart", slug: "line-chart", title: "Line Chart", description: "Trends over ordered categories", engine: "chart-line" },
  { category: "chart", slug: "qq-plot", title: "Q-Q Plot", description: "Assess normality visually", engine: "chart-qq" },
  { category: "chart", slug: "bell-curve-graph-generator", title: "Bell Curve Generator", description: "Normal curve with mean and SD", engine: "chart-bell" },
  { category: "chart", slug: "dot-plot", title: "Dot Plot", description: "Individual points and distribution", engine: "chart-dot" },
  { category: "chart", slug: "density-plot", title: "Density Plot", description: "Kernel-density style visualization", engine: "chart-density" },
  { category: "chart", slug: "violin-plot", title: "Violin Plot", description: "Density + box-style summary", engine: "chart-violin" },
  { category: "chart", slug: "stem-and-leaf-plot", title: "Stem-and-Leaf Plot", description: "Preserve values while showing shape", engine: "chart-stem" },
  { category: "chart", slug: "funnel-chart", title: "Funnel Chart", description: "Conversion stages", engine: "chart-funnel" },
  { category: "chart", slug: "tree-map", title: "Tree Map", description: "Nested proportional rectangles", engine: "chart-treemap" },
  { category: "chart", slug: "waterfall-chart", title: "Waterfall Chart", description: "Cumulative gains and losses", engine: "chart-waterfall" },
  { category: "chart", slug: "area-chart", title: "Area Chart", description: "Filled trend visualization", engine: "chart-area" },
  { category: "chart", slug: "bubble-chart", title: "Bubble Chart", description: "Three-variable scatter", engine: "chart-bubble" },
  { category: "chart", slug: "heat-map", title: "Heat Map", description: "Matrix intensity visualization", engine: "chart-heatmap" },
  { category: "chart", slug: "control-chart", title: "Control Chart", description: "Process monitoring limits", engine: "chart-control" },
  { category: "chart", slug: "pareto-chart", title: "Pareto Chart", description: "Bars plus cumulative line", engine: "chart-pareto" },
  { category: "chart", slug: "radar-chart", title: "Radar Chart", description: "Multivariate profile plot", engine: "chart-radar" },
  { category: "chart", slug: "roc-curve", title: "ROC Curve", description: "Classifier performance curve", engine: "chart-roc" },
  { category: "chart", slug: "forest-plot", title: "Forest Plot", description: "Effect sizes across studies", engine: "chart-forest" },
  { category: "chart", slug: "bland-altman", title: "Bland-Altman Plot", description: "Agreement between two methods", engine: "chart-ba" },
  { category: "chart", slug: "lollipop-chart", title: "Lollipop Chart", description: "Minimal bar alternative", engine: "chart-lollipop" },
  { category: "chart", slug: "slopegraph", title: "Slopegraph", description: "Change between two time points", engine: "chart-slope" },
  { category: "chart", slug: "sankey-diagram", title: "Sankey Diagram", description: "Flow quantities between nodes", engine: "chart-sankey" },
  { category: "chart", slug: "venn-diagram", title: "Venn Diagram", description: "Set overlaps", engine: "chart-venn" },
  { category: "chart", slug: "chart-builder", title: "Chart Builder", description: "Pick a chart and paste data", engine: "chart-builder" },
  { category: "chart", slug: "chart-maker-with-ai", title: "Chart Maker", description: "Guided chart creation from data", engine: "chart-ai" },
  { category: "causal-inference", slug: "difference-in-differences-calculator", title: "Difference-in-Differences", description: "Estimate causal effects with DiD", engine: "did" },
  { category: "causal-inference", slug: "instrumental-variables-calculator", title: "Instrumental Variables", description: "2SLS / IV estimation", engine: "iv" },
  { category: "causal-inference", slug: "regression-discontinuity-calculator", title: "Regression Discontinuity", description: "Local linear RDD estimate", engine: "rdd" },
  { category: "causal-inference", slug: "fixed-random-effects-calculator", title: "Fixed & Random Effects", description: "Panel data estimators", engine: "panel" },
  { category: "experimental-design", slug: "ab-testing-calculator", title: "A/B Testing", description: "Compare conversion rates and lift", engine: "ab-test" },
  { category: "experimental-design", slug: "survey-sample-size-calculator", title: "Survey Sample Size", description: "Sample size for survey proportions", engine: "survey-n" },
  { category: "experimental-design", slug: "randomization-calculator", title: "Randomization", description: "Randomly assign units to arms", engine: "randomize" },
  { category: "experimental-design", slug: "factorial-design-planner", title: "Factorial Design Planner", description: "Plan 2^k factorial experiments", engine: "factorial" },
  { category: "experimental-design", slug: "crossover-design-calculator", title: "Crossover Design", description: "Analyze 2x2 crossover trials", engine: "crossover" },
  { category: "credit-analysis", slug: "vintage-analysis-calculator", title: "Vintage Analysis", description: "Cohort delinquency / vintage curves", engine: "vintage" },

  // Academic grades (CalculatorSoup stats parity)
  { category: "academic-grades", slug: "grade-calculator", title: "Grade Calculator", description: "Weighted course grade from scores and weights", engine: "grade-weighted" },
  { category: "academic-grades", slug: "final-exam-grade-calculator", title: "Final Exam Grade", description: "Score needed on the final to hit a target course grade", engine: "final-grade" },
  { category: "academic-grades", slug: "gpa-calculator", title: "GPA Calculator", description: "Grade point average from letter grades and credits", engine: "gpa" },

  // Random tools
  { category: "random-tools", slug: "coin-flipper", title: "Coin Flipper", description: "Simulate fair coin tosses and tally heads/tails", engine: "coin-flip" },
  { category: "random-tools", slug: "pin-generator", title: "PIN Generator", description: "Generate numeric PINs with or without repeated digits", engine: "pin-gen" },
  { category: "random-tools", slug: "random-number-generator-1-10", title: "Random Number 1–10", description: "Pick random integers from 1 to 10", engine: "rng-1-10" },
  { category: "random-tools", slug: "random-number-generator-1-100", title: "Random Number 1–100", description: "Pick random integers from 1 to 100", engine: "rng-1-100" },
  { category: "random-tools", slug: "random-number-range-generator", title: "Random Number Range", description: "Custom-range random integers with optional uniqueness", engine: "rng-range" },
  { category: "random-tools", slug: "random-name-picker", title: "Random Name Picker", description: "Randomly select names from a list", engine: "random-names" },
  { category: "random-tools", slug: "random-card-generator", title: "Random Card Generator", description: "Draw cards from a shuffled 52-card deck", engine: "random-cards" },
  { category: "random-tools", slug: "random-letter-set-generator", title: "Random Letter Sets", description: "Generate random letter strings", engine: "random-letters" },

  // Text tools
  { category: "text-tools", slug: "character-counter", title: "Character Counter", description: "Count characters, words, lines, and character frequency", engine: "char-count" },
  { category: "text-tools", slug: "word-counter", title: "Word Counter", description: "Count words and show top word densities", engine: "word-count" },

  // Percentages (Math core)
  { category: "percentages", slug: "percentage-calculator", title: "Percentage Calculator", description: "Compute p% of x, or what percent one value is of another", engine: "percentage" },
  { category: "percentages", slug: "percent-change-calculator", title: "Percent Change", description: "Percent increase or decrease from one value to another", engine: "percent-change" },
  { category: "percentages", slug: "percent-difference-calculator", title: "Percent Difference", description: "Relative difference between two values", engine: "percent-difference" },
  { category: "percentages", slug: "percentage-increase-calculator", title: "Percentage Increase", description: "Increase a value by a given percent", engine: "percent-increase" },
  { category: "percentages", slug: "percentage-decrease-calculator", title: "Percentage Decrease", description: "Decrease a value by a given percent", engine: "percent-decrease" },
  { category: "percentages", slug: "percent-tolerance-calculator", title: "Percent Tolerance", description: "Check whether a measurement is within tolerance", engine: "percent-tolerance" },
  { category: "percentages", slug: "decimal-to-percent-calculator", title: "Decimal to Percent", description: "Convert a decimal to a percentage", engine: "decimal-to-percent" },
  { category: "percentages", slug: "percent-to-decimal-calculator", title: "Percent to Decimal", description: "Convert a percentage to a decimal", engine: "percent-to-decimal" },
  { category: "percentages", slug: "percent-to-fraction-calculator", title: "Percent to Fraction", description: "Convert a percentage to a simplified fraction", engine: "percent-to-fraction" },
  { category: "percentages", slug: "fraction-to-percent-calculator", title: "Fraction to Percent", description: "Convert a fraction to a percentage", engine: "fraction-to-percent" },

  // Discrete mathematics
  { category: "discrete-mathematics", slug: "factorial-calculator", title: "Factorial", description: "Compute n!", engine: "factorial" },
  { category: "discrete-mathematics", slug: "combinations-calculator", title: "Combinations", description: "C(n, r) without replacement", engine: "combinations" },
  { category: "discrete-mathematics", slug: "combinations-with-replacement-calculator", title: "Combinations with Replacement", description: "C(n+r−1, r)", engine: "combinations-rep" },
  { category: "discrete-mathematics", slug: "permutations-calculator", title: "Permutations", description: "P(n, r) without replacement", engine: "permutations" },
  { category: "discrete-mathematics", slug: "permutations-with-replacement-calculator", title: "Permutations with Replacement", description: "n^r ordered selections", engine: "permutations-rep" },
  { category: "discrete-mathematics", slug: "circular-permutations-calculator", title: "Circular Permutations", description: "(n−1)! arrangements in a circle", engine: "permutations-circular" },
  { category: "discrete-mathematics", slug: "fibonacci-calculator", title: "Fibonacci Calculator", description: "Generate Fibonacci sequence terms", engine: "fibonacci" },
  { category: "discrete-mathematics", slug: "pascals-triangle-calculator", title: "Pascal’s Triangle", description: "Build rows of binomial coefficients", engine: "pascal-triangle" },

  // Algebra
  { category: "algebra", slug: "absolute-value-calculator", title: "Absolute Value", description: "Compute |x|", engine: "abs-value" },
  { category: "algebra", slug: "absolute-difference-calculator", title: "Absolute Difference", description: "Compute |A − B|", engine: "abs-diff" },
  { category: "algebra", slug: "square-calculator", title: "Square Calculator", description: "Compute x²", engine: "square" },
  { category: "algebra", slug: "cube-calculator", title: "Cube Calculator", description: "Compute x³", engine: "cube" },
  { category: "algebra", slug: "square-root-calculator", title: "Square Root", description: "Compute √x", engine: "square-root" },
  { category: "algebra", slug: "cube-root-calculator", title: "Cube Root", description: "Compute ∛x", engine: "cube-root" },
  { category: "algebra", slug: "nth-root-calculator", title: "Nth Root", description: "Compute the n-th root of x", engine: "nth-root" },
  { category: "algebra", slug: "exponent-calculator", title: "Exponent Calculator", description: "Compute base^exponent", engine: "exponent" },
  { category: "algebra", slug: "quadratic-formula-calculator", title: "Quadratic Formula", description: "Solve ax² + bx + c = 0", engine: "quadratic" },

  // Finance
  { category: "finance", slug: "loan-payment-calculator", title: "Loan Payment", description: "Monthly payment, total interest, and payoff totals", engine: "loan-payment" },
  { category: "finance", slug: "mortgage-payment-calculator", title: "Mortgage Payment", description: "Home loan payment from price, down payment, and rate", engine: "mortgage-payment" },
  { category: "finance", slug: "emi-loan-calculator", title: "EMI Calculator", description: "Equated monthly installment for a loan", engine: "emi" },
  { category: "finance", slug: "simple-interest-calculator", title: "Simple Interest", description: "Interest = principal × rate × time", engine: "simple-interest" },
  { category: "finance", slug: "compound-interest-calculator", title: "Compound Interest", description: "Future value with periodic compounding", engine: "compound-interest" },
  { category: "finance", slug: "cagr-calculator", title: "CAGR Calculator", description: "Compound annual growth rate", engine: "cagr" },
  { category: "finance", slug: "roi-calculator", title: "ROI Calculator", description: "Return on investment percentage", engine: "roi" },
  { category: "finance", slug: "tip-calculator", title: "Tip Calculator", description: "Tip amount and per-person split", engine: "tip" },
  { category: "finance", slug: "discount-calculator", title: "Discount Calculator", description: "Sale price after a percent off", engine: "discount" },
  { category: "finance", slug: "markup-calculator", title: "Markup Calculator", description: "Selling price from cost and markup %", engine: "markup" },
  { category: "finance", slug: "profit-margin-calculator", title: "Profit Margin", description: "Margin from cost and selling price", engine: "margin" },
  { category: "finance", slug: "sales-tax-calculator", title: "Sales Tax", description: "Tax amount and total with tax", engine: "sales-tax" },
  { category: "finance", slug: "reverse-sales-tax-calculator", title: "Reverse Sales Tax", description: "Back out pre-tax amount from a total", engine: "reverse-sales-tax" },
  { category: "finance", slug: "rule-of-72-calculator", title: "Rule of 72", description: "Years to double an investment", engine: "rule-of-72" },
  { category: "finance", slug: "future-value-calculator", title: "Future Value", description: "FV of principal plus optional deposits", engine: "future-value" },
  { category: "finance", slug: "present-value-calculator", title: "Present Value", description: "Discount a future amount to today", engine: "present-value" },
  { category: "finance", slug: "net-present-value-calculator", title: "Net Present Value", description: "NPV of a cash-flow series", engine: "npv" },
  { category: "finance", slug: "salary-to-hourly-calculator", title: "Salary to Hourly", description: "Convert annual salary to hourly wage", engine: "salary-hourly" },
  { category: "finance", slug: "hourly-to-salary-calculator", title: "Hourly to Salary", description: "Convert hourly wage to annual salary", engine: "hourly-salary" },
  { category: "finance", slug: "inflation-calculator", title: "Inflation Calculator", description: "Future cost under constant inflation", engine: "inflation" },
  { category: "finance", slug: "effective-annual-rate-calculator", title: "Effective Annual Rate", description: "Convert nominal APR to EAR", engine: "apr-ear" },

  // Plane geometry
  { category: "geometry-plane", slug: "circle-calculator", title: "Circle", description: "Circumference, area, and diameter", engine: "geo-circle" },
  { category: "geometry-plane", slug: "rectangle-calculator", title: "Rectangle", description: "Area, perimeter, and diagonal", engine: "geo-rectangle" },
  { category: "geometry-plane", slug: "square-geometry-calculator", title: "Square", description: "Area, perimeter, and diagonal", engine: "geo-square" },
  { category: "geometry-plane", slug: "triangle-calculator", title: "Triangle (Heron)", description: "Area and perimeter from three sides", engine: "geo-triangle" },
  { category: "geometry-plane", slug: "right-triangle-calculator", title: "Right Triangle", description: "Hypotenuse, area, and perimeter", engine: "geo-right-triangle" },
  { category: "geometry-plane", slug: "pythagorean-theorem-calculator", title: "Pythagorean Theorem", description: "Solve for hypotenuse or a leg", engine: "geo-pythagorean" },
  { category: "geometry-plane", slug: "trapezoid-calculator", title: "Trapezoid", description: "Area from bases and height", engine: "geo-trapezoid" },
  { category: "geometry-plane", slug: "parallelogram-calculator", title: "Parallelogram", description: "Area from base and height", engine: "geo-parallelogram" },
  { category: "geometry-plane", slug: "rhombus-calculator", title: "Rhombus", description: "Area and side from diagonals", engine: "geo-rhombus" },
  { category: "geometry-plane", slug: "distance-two-points-calculator", title: "Distance Between Points", description: "2D Euclidean distance", engine: "geo-distance-2d" },
  { category: "geometry-plane", slug: "midpoint-calculator", title: "Midpoint", description: "Midpoint of a line segment", engine: "geo-midpoint" },
  { category: "geometry-plane", slug: "slope-calculator", title: "Slope", description: "Slope and angle between two points", engine: "geo-slope" },
  { category: "geometry-plane", slug: "annulus-calculator", title: "Annulus", description: "Area of a ring between two radii", engine: "geo-annulus" },

  // Solid geometry
  { category: "geometry-solids", slug: "sphere-calculator", title: "Sphere", description: "Volume and surface area", engine: "geo-sphere" },
  { category: "geometry-solids", slug: "cylinder-calculator", title: "Cylinder", description: "Volume and surface areas", engine: "geo-cylinder" },
  { category: "geometry-solids", slug: "cone-calculator", title: "Cone", description: "Volume, slant height, and surfaces", engine: "geo-cone" },
  { category: "geometry-solids", slug: "cube-solid-calculator", title: "Cube", description: "Volume, surface, and space diagonal", engine: "geo-cube" },
  { category: "geometry-solids", slug: "rectangular-prism-calculator", title: "Rectangular Prism", description: "Box volume, surface, and diagonal", engine: "geo-box" },
  { category: "geometry-solids", slug: "pyramid-calculator", title: "Pyramid", description: "Volume of a square-base pyramid", engine: "geo-pyramid" },
  { category: "geometry-solids", slug: "hemisphere-calculator", title: "Hemisphere", description: "Volume and surface areas", engine: "geo-hemisphere" },

  // Conversions
  { category: "conversions", slug: "temperature-converter", title: "Temperature Converter", description: "Celsius, Fahrenheit, Kelvin, Rankine", engine: "temp-convert" },
  { category: "conversions", slug: "length-converter", title: "Length Converter", description: "m, km, cm, mm, mi, yd, ft, in", engine: "length-convert" },
  { category: "conversions", slug: "weight-converter", title: "Weight Converter", description: "kg, g, mg, lb, oz, ton", engine: "weight-convert" },
  { category: "conversions", slug: "area-converter", title: "Area Converter", description: "m², ft², acres, hectares, and more", engine: "area-convert" },
  { category: "conversions", slug: "volume-converter", title: "Volume Converter", description: "Liters, gallons, cups, cubic feet, and more", engine: "volume-convert" },
  { category: "conversions", slug: "speed-converter", title: "Speed Converter", description: "mph, km/h, m/s, knots, ft/s", engine: "speed-convert" },
  { category: "conversions", slug: "time-unit-converter", title: "Time Unit Converter", description: "Seconds, minutes, hours, days, weeks", engine: "time-unit-convert" },
  { category: "conversions", slug: "computer-storage-converter", title: "Computer Storage", description: "B, KB, MB, GB, TB, PB (binary)", engine: "storage-convert" },
  { category: "conversions", slug: "cm-to-inches-converter", title: "cm to Inches", description: "Centimeters to inches and feet", engine: "cm-in" },
  { category: "conversions", slug: "inches-to-cm-converter", title: "Inches to cm", description: "Inches to centimeters and millimeters", engine: "in-cm" },
  { category: "conversions", slug: "feet-to-meters-converter", title: "Feet to Meters", description: "Feet to meters and centimeters", engine: "ft-m" },
  { category: "conversions", slug: "pounds-to-kilograms-converter", title: "Pounds to Kilograms", description: "lb → kg", engine: "lb-kg" },
  { category: "conversions", slug: "kilograms-to-pounds-converter", title: "Kilograms to Pounds", description: "kg → lb", engine: "kg-lb" },
  { category: "conversions", slug: "square-feet-to-acres-converter", title: "Square Feet to Acres", description: "ft² → acres and m²", engine: "sqft-acre" },
  { category: "conversions", slug: "acres-to-square-feet-converter", title: "Acres to Square Feet", description: "acres → ft²", engine: "acre-sqft" },
  { category: "conversions", slug: "angle-converter", title: "Angle Converter", description: "Degrees ↔ radians", engine: "angle-convert" },
  { category: "conversions", slug: "roman-numeral-converter", title: "Roman Numeral Converter", description: "Convert between integers and Roman numerals", engine: "roman-numeral" },

  // Physics
  { category: "physics", slug: "force-calculator", title: "Force Calculator", description: "F = m·a", engine: "phys-force" },
  { category: "physics", slug: "density-calculator", title: "Density Calculator", description: "ρ = m / V", engine: "phys-density" },
  { category: "physics", slug: "work-calculator", title: "Work Calculator", description: "W = F·d", engine: "phys-work" },
  { category: "physics", slug: "kinetic-energy-calculator", title: "Kinetic Energy", description: "KE = ½mv²", engine: "phys-kinetic" },
  { category: "physics", slug: "momentum-calculator", title: "Momentum", description: "p = m·v", engine: "phys-momentum" },
  { category: "physics", slug: "pressure-calculator", title: "Pressure", description: "P = F / A", engine: "phys-pressure" },
  { category: "physics", slug: "average-velocity-calculator", title: "Average Velocity", description: "v = Δx / Δt", engine: "phys-velocity-avg" },
  { category: "physics", slug: "uniform-acceleration-calculator", title: "Uniform Acceleration", description: "v and s from u, a, t", engine: "phys-accel-motion" },
  { category: "physics", slug: "ideal-gas-law-calculator", title: "Ideal Gas Law", description: "Solve PV = nRT", engine: "phys-ideal-gas" },
  { category: "physics", slug: "emc2-calculator", title: "E = mc²", description: "Mass–energy equivalence", engine: "phys-emc2" },
  { category: "physics", slug: "wavelength-calculator", title: "Wavelength", description: "λ = v / f", engine: "phys-wavelength" },
  { category: "physics", slug: "weight-force-calculator", title: "Weight", description: "W = m·g", engine: "phys-weight" },
  { category: "physics", slug: "hookes-law-calculator", title: "Hooke’s Law", description: "Spring force and elastic PE", engine: "phys-hooke" },

  // Health
  { category: "health", slug: "bmi-calculator", title: "BMI Calculator", description: "Body mass index and category", engine: "bmi" },
  { category: "health", slug: "pace-calculator", title: "Pace Calculator", description: "Running pace and speed", engine: "pace" },
  { category: "health", slug: "target-heart-rate-calculator", title: "Target Heart Rate Zones", description: "Karvonen training zones from age", engine: "heart-rate-zone" },

  // Time
  { category: "time", slug: "age-calculator", title: "Age Calculator", description: "Exact age in years, months, and days", engine: "age-calc" },
  { category: "time", slug: "date-difference-calculator", title: "Date Difference", description: "Days between two dates", engine: "date-diff" },
  { category: "time", slug: "hours-minutes-calculator", title: "Hours & Minutes", description: "Add or subtract durations", engine: "hours-minutes" },
  { category: "time", slug: "decimal-to-time-calculator", title: "Decimal to Time", description: "Convert decimal hours to H:MM", engine: "decimal-time" },
  { category: "time", slug: "time-to-decimal-calculator", title: "Time to Decimal", description: "Convert H:MM to decimal hours", engine: "time-to-decimal" },
  { category: "time", slug: "military-time-converter", title: "Military Time", description: "Convert between 12-hour and 24-hour time", engine: "military-time" },

  // Trig
  { category: "trigonometry", slug: "trigonometric-functions-calculator", title: "Trigonometric Functions", description: "sin, cos, tan, and reciprocals", engine: "trig-functions" },
  { category: "trigonometry", slug: "inverse-trig-calculator", title: "Inverse Trig Functions", description: "arcsin, arccos, arctan in deg/rad", engine: "trig-inverse" },

  // Construction
  { category: "construction", slug: "square-footage-calculator", title: "Square Footage", description: "Area from length and width", engine: "sqft-calc" },
  { category: "construction", slug: "concrete-calculator", title: "Concrete Calculator", description: "Volume for a rectangular slab", engine: "concrete-volume" },
  { category: "construction", slug: "paint-calculator", title: "Paint Calculator", description: "Gallons needed from area and coats", engine: "paint-calc" },

  // Technology
  { category: "technology", slug: "aspect-ratio-calculator", title: "Aspect Ratio", description: "Simplify width:height", engine: "aspect-ratio" },
  { category: "technology", slug: "ppi-calculator", title: "PPI Calculator", description: "Pixels per inch from resolution and diagonal", engine: "ppi-calc" },
  { category: "technology", slug: "image-resize-calculator", title: "Image Resize", description: "Scale dimensions while keeping aspect ratio", engine: "resize-image" },

  // Fractions
  { category: "fractions", slug: "adding-fractions-calculator", title: "Add Fractions", description: "Add two fractions and simplify", engine: "frac-add" },
  { category: "fractions", slug: "subtracting-fractions-calculator", title: "Subtract Fractions", description: "Subtract two fractions and simplify", engine: "frac-sub" },
  { category: "fractions", slug: "multiplying-fractions-calculator", title: "Multiply Fractions", description: "Multiply two fractions and simplify", engine: "frac-mul" },
  { category: "fractions", slug: "dividing-fractions-calculator", title: "Divide Fractions", description: "Divide two fractions and simplify", engine: "frac-div" },
  { category: "fractions", slug: "simplify-fractions-calculator", title: "Simplify Fractions", description: "Reduce a fraction to lowest terms", engine: "frac-simplify" },
  { category: "fractions", slug: "compare-fractions-calculator", title: "Compare Fractions", description: "Compare two fractions", engine: "frac-compare" },
  { category: "fractions", slug: "fraction-to-decimal-calculator", title: "Fraction to Decimal", description: "Convert a fraction to decimal and percent", engine: "frac-to-dec" },
  { category: "fractions", slug: "decimal-to-fraction-calculator", title: "Decimal to Fraction", description: "Approximate a decimal as a fraction", engine: "dec-to-frac" },
  { category: "fractions", slug: "mixed-to-improper-calculator", title: "Mixed to Improper", description: "Convert a mixed number to an improper fraction", engine: "mixed-to-improper" },
  { category: "fractions", slug: "improper-to-mixed-calculator", title: "Improper to Mixed", description: "Convert an improper fraction to a mixed number", engine: "improper-to-mixed" },

  // General math
  { category: "general-math", slug: "gcf-calculator", title: "GCF / GCD", description: "Greatest common factor of integers", engine: "gcf" },
  { category: "general-math", slug: "lcm-calculator", title: "LCM Calculator", description: "Least common multiple of integers", engine: "lcm-calc" },
  { category: "general-math", slug: "factors-calculator", title: "Factors Calculator", description: "List all positive factors of n", engine: "factors" },
  { category: "general-math", slug: "prime-factors-calculator", title: "Prime Factors", description: "Prime factorization of n", engine: "prime-factors" },
  { category: "general-math", slug: "prime-number-checker", title: "Prime Number Checker", description: "Test whether n is prime", engine: "prime-check" },
  { category: "general-math", slug: "prime-numbers-list", title: "Prime Numbers List", description: "List primes up to a limit", engine: "primes-list" },
  { category: "general-math", slug: "ratio-simplifier", title: "Ratio Simplifier", description: "Simplify a:b using GCD", engine: "ratio-simplify" },
  { category: "general-math", slug: "unit-rate-calculator", title: "Unit Rate", description: "Compute a per-1 unit rate", engine: "unit-rate" },
  { category: "general-math", slug: "scientific-notation-converter", title: "Scientific Notation", description: "Convert a number to scientific notation", engine: "sci-notation" },
  { category: "general-math", slug: "significant-figures-counter", title: "Significant Figures", description: "Count significant figures in a number", engine: "sig-figs" },
  { category: "general-math", slug: "modulo-calculator", title: "Modulo Calculator", description: "a mod b with quotient and remainder", engine: "modulo" },
  { category: "general-math", slug: "rounding-calculator", title: "Rounding Calculator", description: "Round, floor, ceil, and truncate", engine: "rounding" },
  { category: "general-math", slug: "place-value-calculator", title: "Place Value", description: "Break a number into place values", engine: "place-value" },
  { category: "general-math", slug: "expanded-form-calculator", title: "Expanded Form", description: "Write a number in expanded form", engine: "expanded-form" },
  { category: "general-math", slug: "speed-distance-time-calculator", title: "Speed Distance Time", description: "Solve for speed, distance, or time", engine: "speed-distance-time" },

  // More algebra
  { category: "algebra", slug: "logarithm-calculator", title: "Logarithm", description: "log base b of a, plus ln and log10", engine: "log-eq" },
  { category: "algebra", slug: "simplify-radicals-calculator", title: "Simplify Radicals", description: "Pull perfect squares out of √n", engine: "radical-simplify" },
  { category: "algebra", slug: "foil-calculator", title: "FOIL Calculator", description: "Expand (ax+b)(cx+d)", engine: "foil" },
  { category: "algebra", slug: "difference-of-squares-calculator", title: "Difference of Squares", description: "a² − b² and factored form", engine: "diff-squares" },
  { category: "algebra", slug: "completing-the-square-calculator", title: "Completing the Square", description: "Rewrite ax²+bx+c in vertex form", engine: "complete-square" },
  { category: "algebra", slug: "cubic-equation-calculator", title: "Cubic Equation", description: "Approximate roots of ax³+bx²+cx+d=0", engine: "cubic-eq" },
  { category: "algebra", slug: "dot-product-calculator", title: "Dot Product", description: "Dot product of two vectors", engine: "dot-product" },

  // Discrete extras
  { category: "discrete-mathematics", slug: "multifactorial-calculator", title: "Multifactorial", description: "n!!, n!!!, and higher multifactorials", engine: "multifactorial" },

  // Chemistry
  { category: "chemistry", slug: "molecular-weight-calculator", title: "Molecular Weight", description: "Molar mass from a chemical formula", engine: "molar-mass" },

  // More construction
  { category: "construction", slug: "cubic-yards-calculator", title: "Cubic Yards", description: "Convert L×W×D into cubic yards", engine: "cubic-yards" },
  { category: "construction", slug: "cubic-feet-calculator", title: "Cubic Feet", description: "Box volume in ft³ and yd³", engine: "cubic-feet" },
  { category: "construction", slug: "feet-and-inches-calculator", title: "Feet and Inches", description: "Convert between ft+in and total inches", engine: "feet-inches" },
  { category: "construction", slug: "gravel-calculator", title: "Gravel Calculator", description: "Cubic yards of gravel for an area", engine: "gravel" },
  { category: "construction", slug: "mulch-calculator", title: "Mulch Calculator", description: "Cubic yards of mulch for an area", engine: "mulch" },
  { category: "construction", slug: "topsoil-calculator", title: "Topsoil Calculator", description: "Cubic yards of topsoil for an area", engine: "topsoil" },
  { category: "construction", slug: "tank-volume-calculator", title: "Tank Volume", description: "Rectangular or cylindrical tank volume/gallons", engine: "tank-volume" },

  // Games
  { category: "games", slug: "dice-roller", title: "Dice Roller", description: "Roll NdS dice and sum the results", engine: "dice-roll" },
  { category: "games", slug: "lottery-number-generator", title: "Lottery Number Generator", description: "Pick unique lottery numbers", engine: "lottery" },
  { category: "games", slug: "password-generator", title: "Password Generator", description: "Generate a random password", engine: "password-gen" },
  { category: "games", slug: "betting-odds-calculator", title: "Betting Odds", description: "Convert odds to implied probability", engine: "odds-convert" },
  { category: "games", slug: "batting-average-calculator", title: "Batting Average", description: "Hits divided by at-bats", engine: "batting-avg" },
  { category: "games", slug: "era-calculator", title: "ERA Calculator", description: "Earned run average", engine: "era-calc" },

  // More health / time / finance
  { category: "health", slug: "pregnancy-due-date-calculator", title: "Pregnancy Due Date", description: "Estimate due date from LMP (+280 days)", engine: "pregnancy-due" },
  { category: "health", slug: "period-calculator", title: "Period Calculator", description: "Estimate next period and ovulation", engine: "period-estimate" },
  { category: "time", slug: "day-of-the-week-calculator", title: "Day of the Week", description: "Find weekday for a calendar date", engine: "day-of-week" },
  { category: "time", slug: "work-hours-calculator", title: "Work Hours", description: "Hours worked from start, end, and break", engine: "work-hours" },
  { category: "finance", slug: "amortization-schedule-calculator", title: "Amortization Schedule", description: "Payment breakdown and loan schedule preview", engine: "amortization-schedule" },
  { category: "finance", slug: "straight-line-depreciation-calculator", title: "Straight-Line Depreciation", description: "Annual depreciation expense", engine: "straight-line-depr" },
  { category: "finance", slug: "declining-balance-depreciation-calculator", title: "Declining Balance Depreciation", description: "Year-by-year declining-balance schedule", engine: "declining-balance" },
  { category: "finance", slug: "how-much-car-can-i-afford", title: "Car Affordability", description: "Loan amount from a target monthly payment", engine: "car-afford" },
  { category: "finance", slug: "how-much-house-can-i-afford", title: "House Affordability", description: "Home price estimate from income and debts", engine: "house-afford" },
  { category: "finance", slug: "gas-mileage-calculator", title: "Gas Mileage", description: "MPG and cost per mile", engine: "gas-mileage" },

  // Correlation (Numiqo / Stat Trek parity)
  { category: "correlation", slug: "pearson-correlation-calculator", title: "Pearson Correlation", description: "Linear correlation coefficient r", engine: "correlation" },
  { category: "correlation", slug: "spearman-correlation-calculator", title: "Spearman Correlation", description: "Rank-based Spearman ρ", engine: "spearman" },
  { category: "correlation", slug: "kendall-tau-calculator", title: "Kendall’s Tau", description: "Kendall τ-b concordance measure", engine: "kendall" },
  { category: "correlation", slug: "point-biserial-correlation-calculator", title: "Point-Biserial Correlation", description: "Correlation of a binary and continuous variable", engine: "point-biserial" },

  // Hypothesis extras (Stat Trek)
  { category: "hypothesis-testing", slug: "bartletts-test-calculator", title: "Bartlett’s Test", description: "Homogeneity of variances across groups", engine: "bartlett" },
  { category: "hypothesis-testing", slug: "hartleys-fmax-test-calculator", title: "Hartley’s Fmax", description: "Ratio of largest to smallest group variance", engine: "hartley-fmax" },
  { category: "hypothesis-testing", slug: "bonferroni-correction-calculator", title: "Bonferroni Correction", description: "Adjust p-values for multiple comparisons", engine: "bonferroni" },
  { category: "hypothesis-testing", slug: "chi-square-homogeneity-calculator", title: "Chi-Square Homogeneity", description: "Compare categorical distributions across populations", engine: "chi-homogeneity" },
  { category: "hypothesis-testing", slug: "equivalence-tost-calculator", title: "Equivalence TOST", description: "Two one-sided tests for mean equivalence", engine: "tost" },

  // Probability extras
  { category: "probability", slug: "bayes-rule-calculator", title: "Bayes’ Rule", description: "Posterior probability from prior, sensitivity, specificity", engine: "bayes-rule" },
  { category: "probability", slug: "multinomial-distribution-calculator", title: "Multinomial Distribution", description: "Multinomial PMF for count vectors", engine: "multinomial" },
  { category: "probability", slug: "monte-carlo-simulation-calculator", title: "Monte Carlo Simulation", description: "Simulate draws and optional exceedance probability", engine: "monte-carlo" },

  // Reliability
  { category: "reliability-analysis", slug: "cronbachs-alpha-reliability", title: "Cronbach’s Alpha", description: "Internal consistency reliability", engine: "cronbach" },
  { category: "reliability-analysis", slug: "cohens-kappa-calculator", title: "Cohen’s Kappa", description: "Two-rater agreement beyond chance", engine: "irr" },
  { category: "reliability-analysis", slug: "fleiss-kappa-calculator", title: "Fleiss’ Kappa", description: "Multi-rater categorical agreement", engine: "fleiss-kappa" },

  // Cluster
  { category: "cluster-analysis", slug: "hierarchical-cluster-analysis-calculator", title: "Hierarchical Cluster Analysis", description: "Agglomerative single-linkage clustering", engine: "hierarchical-cluster" },
  { category: "cluster-analysis", slug: "k-means-cluster-calculator", title: "k-Means Clustering", description: "Partition observations into k clusters", engine: "kmeans" },

  // Mediator / moderator
  { category: "causal-inference", slug: "mediator-analysis-calculator", title: "Mediator Analysis", description: "Baron–Kenny path estimates a, b, c, c′", engine: "mediator" },
  { category: "causal-inference", slug: "moderator-analysis-calculator", title: "Moderator Analysis", description: "Interaction model y ~ x + w + x·w", engine: "moderator" },

  // MSA / process
  { category: "measurement-systems", slug: "gage-rr-calculator", title: "Gage R&R", description: "ANOVA-style repeatability & reproducibility", engine: "gage-rr" },
  { category: "descriptive-statistics", slug: "non-normal-process-capability-calculator", title: "Non-Normal Process Capability", description: "Percentile Pp / Ppk capability", engine: "process-cap-nonnormal" },

  // ROC
  { category: "hypothesis-testing", slug: "roc-auc-calculator", title: "ROC / AUC Calculator", description: "AUC, sensitivity, and specificity from scores", engine: "roc-auc" },

  // DOE
  { category: "experimental-design", slug: "fractional-factorial-design-calculator", title: "Fractional Factorial Design", description: "Plan 2^(k−p) run sizes", engine: "fractional-factorial" },
  { category: "experimental-design", slug: "plackett-burman-design-calculator", title: "Plackett–Burman Design", description: "Screening design run-size planner", engine: "plackett-burman" },
  { category: "experimental-design", slug: "box-behnken-design-calculator", title: "Box–Behnken Design", description: "Response-surface design size planner", engine: "box-behnken" },
  { category: "experimental-design", slug: "central-composite-design-calculator", title: "Central Composite Design", description: "CCD run counts for k factors", engine: "central-composite" },

  // Regression extras
  { category: "regression-analysis", slug: "variance-inflation-factor-calculator", title: "Variance Inflation Factor", description: "VIF multicollinearity diagnostics", engine: "vif" },
  { category: "regression-analysis", slug: "regression-slope-test-calculator", title: "Regression Slope Test", description: "t-test and CI for the slope", engine: "slope-test" },

  // Matrix
  { category: "matrix-algebra", slug: "matrix-calculator", title: "Matrix Calculator", description: "Determinant, transpose, add, multiply", engine: "matrix-ops" },

  // Sampling
  { category: "experimental-design", slug: "sample-size-with-fpc-calculator", title: "Sample Size with FPC", description: "Survey n with finite population correction", engine: "stratified-n" },
];

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

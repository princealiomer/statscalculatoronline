import type { CalculatorGuideContent } from "./types";

export const categoryGuides: Record<string, Partial<CalculatorGuideContent>> = {
  "descriptive-statistics": {
    whenToUse: "Use descriptive tools to summarize a single sample before formal inference.",
    tips: [
      "Paste numbers separated by commas, spaces, or new lines (spreadsheet paste works).",
      "Choose Sample vs Population when SD/variance are shown so the denominator matches your design.",
      "Outliers can pull the mean and SD; check the five-number summary or a box plot.",
    ],
  },
  "hypothesis-testing": {
    whenToUse: "Use a hypothesis test when you want to assess evidence against a null claim at a chosen α.",
    tips: [
      "State H₀ and H₁ before looking at the p-value.",
      "Report the test statistic, df (if any), p-value, effect size, and CI when available.",
      "Check assumptions (independence, normality/large n, equal variances) for the chosen test.",
    ],
  },
  probability: {
    whenToUse: "Use distribution calculators to get PDF/PMF, CDF, or quantiles under a named model.",
    tips: [
      "Confirm whether you need P(X = x), P(X ≤ x), or a critical value.",
      "Parameterize carefully (e.g., σ vs σ², rate vs scale).",
    ],
  },
  "confidence-interval": {
    whenToUse: "Use a confidence interval to estimate a parameter with a stated long-run coverage rate.",
    tips: [
      "A 95% CI does not mean the parameter has a 95% probability of lying inside this realized interval.",
      "Narrower intervals need more data, less variability, or lower confidence.",
    ],
  },
  "regression-analysis": {
    whenToUse: "Use regression to model how predictors relate to an outcome and to make predictions.",
    tips: [
      "Plot residuals vs fitted values to check linearity and constant variance.",
      "Do not extrapolate far outside the observed predictor range.",
      "For logistic models, the outcome should be binary (0/1).",
    ],
  },
  correlation: {
    whenToUse: "Use correlation to measure association strength/direction—not causation.",
    tips: [
      "Pearson assumes roughly linear association and interval/ratio scales.",
      "Spearman/Kendall are better for monotonic or ordinal relationships.",
      "Always scatterplot the data.",
    ],
  },
  "experimental-design": {
    whenToUse: "Use design tools to plan sample size, randomization, or factorial/response-surface runs.",
    tips: [
      "Fix your primary endpoint and smallest meaningful effect before computing n.",
      "Screening designs estimate main effects; follow up with refinement experiments.",
    ],
  },
  finance: {
    whenToUse: "Use finance calculators for loans, interest, valuation, and affordability estimates.",
    tips: [
      "Rates are typically annual percentages; compounding frequency matters.",
      "Results are educational estimates, not personalized financial advice.",
    ],
  },
  percentages: {
    whenToUse: "Use percentage tools for parts-of-whole, change, markup/discount, and conversions.",
    tips: ["Percent change uses the starting value in the denominator.", "Percent difference uses the average magnitude."],
  },
  algebra: {
    whenToUse: "Use algebra tools to evaluate expressions, roots, exponents, and equation solutions.",
    tips: ["Check domain restrictions (even roots of negatives, logs of non-positives)."],
  },
  "geometry-plane": {
    whenToUse: "Use plane geometry calculators for 2D lengths, areas, and coordinate geometry.",
    tips: ["Keep units consistent across all inputs."],
  },
  "geometry-solids": {
    whenToUse: "Use solid geometry calculators for volumes and surface areas of 3D shapes.",
    tips: ["Distinguish lateral area from total surface area."],
  },
  conversions: {
    whenToUse: "Use converters to move between unit systems without manual lookup tables.",
    tips: ["Confirm whether temperature needs an offset (C↔F) versus a pure scale factor."],
  },
  physics: {
    whenToUse: "Use physics calculators for textbook relations among force, energy, motion, and waves.",
    tips: ["SI units are assumed unless noted.", "Signs depend on your chosen coordinate system."],
  },
  health: {
    whenToUse: "Use health calculators for screening indexes and training estimates.",
    tips: ["Outputs are educational only and not medical advice."],
  },
  time: {
    whenToUse: "Use time tools for ages, durations, and clock conversions.",
    tips: ["Prefer ISO dates YYYY-MM-DD to avoid day/month ambiguity."],
  },
  "matrix-algebra": {
    whenToUse: "Use matrix tools for linear algebra operations that appear in multivariate statistics.",
    tips: ["Determinant is defined only for square matrices.", "Inner dimensions must agree for multiplication."],
  },
  "cluster-analysis": {
    whenToUse: "Use clustering to group similar observations without predefined labels.",
    tips: ["Standardize variables on different scales before clustering.", "Try several k and inspect silhouette/elbow qualitatively."],
  },
  "reliability-analysis": {
    whenToUse: "Use reliability tools for internal consistency and interrater agreement.",
    tips: ["Cronbach’s α rises with more items; high α ≠ unidimensionality.", "Kappa accounts for chance agreement."],
  },
  "multivariate-analysis": {
    whenToUse: "Use multivariate tools when several outcomes or latent dimensions matter together.",
    tips: ["Standardize variables before PCA/FA.", "Interpret loadings with subject-matter context."],
  },
  "survival-analysis": {
    whenToUse: "Use survival methods for time-to-event data with possible censoring.",
    tips: ["Do not treat censored times as events.", "Check proportional-hazards assumptions for Cox models."],
  },
  chart: {
    whenToUse: "Use chart makers to visualize distributions, comparisons, and relationships.",
    tips: ["Label axes and units.", "Choose a chart type that matches the question (distribution vs comparison vs trend)."],
  },
  "causal-inference": {
    whenToUse: "Use causal estimators when an identification strategy (DiD, IV, RDD) is already justified.",
    tips: ["Estimators do not create identification—design assumptions do.", "Report robustness checks."],
  },
  "credit-analysis": {
    whenToUse: "Use credit tools for portfolio/vintage performance summaries.",
    tips: ["Align cohort definitions before comparing vintages."],
  },
  "academic-grades": {
    whenToUse: "Use grade calculators to weight categories or find needed final-exam scores.",
    tips: ["Confirm your syllabus weights before trusting the target score."],
  },
  "random-tools": {
    whenToUse: "Use random generators for sampling, games, and PIN/password drafts.",
    tips: ["Browser randomness is fine for casual use; cryptographic needs require dedicated CSPRNG tools."],
  },
  "text-tools": {
    whenToUse: "Use text counters for character/word stats and simple frequency tables.",
    tips: ["Counting rules (spaces, punctuation) vary—check the result definition."],
  },
  "discrete-mathematics": {
    whenToUse: "Use discrete math tools for counting, sequences, and combinatorial identities.",
    tips: ["nPr and nCr require 0 ≤ r ≤ n for standard definitions."],
  },
  trigonometry: {
    whenToUse: "Use trig calculators for right-triangle and unit-circle evaluations.",
    tips: ["Confirm degrees vs radians before interpreting results."],
  },
  construction: {
    whenToUse: "Use construction estimators for area, volume, and material takeoffs.",
    tips: ["Add waste factors from your local practice.", "Keep length units consistent."],
  },
  technology: {
    whenToUse: "Use technology calculators for display ratios, PPI, and related pixel math.",
    tips: ["Diagonal size and resolution both affect PPI."],
  },
  fractions: {
    whenToUse: "Use fraction tools to add, subtract, multiply, divide, simplify, or convert.",
    tips: ["Results are reduced to lowest terms when possible."],
  },
  "general-math": {
    whenToUse: "Use general math helpers for factors, primes, ratios, and place value.",
    tips: ["GCF/LCM of many numbers reduce pairwise."],
  },
  chemistry: {
    whenToUse: "Use chemistry helpers for molar mass and stoichiometry-style arithmetic.",
    tips: ["Check chemical formulas for element symbols and subscripts."],
  },
  games: {
    whenToUse: "Use games/sports calculators for odds, dice, and score helpers.",
    tips: ["Gambling odds are educational estimates, not betting advice."],
  },
  "measurement-systems": {
    whenToUse: "Use MSA/Gage tools to quantify measurement system variation.",
    tips: ["Include enough parts and operators for stable variance components."],
  },
};

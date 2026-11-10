import type { CalculatorGuideContent } from "./types";

/** Rich per-engine guides. Engines without an entry still get category + generic fallbacks. */
export const engineGuides: Record<string, Partial<CalculatorGuideContent>> = {
  descriptive: {
    overview:
      "Descriptive statistics summarize a numeric sample: center (mean, median, mode), spread (range, IQR, variance, SD), and shape (skewness, kurtosis).",
    howTo: [
      "Paste or type your data as numbers separated by commas, spaces, or new lines.",
      "Choose Sample if the data are a subset of a larger population; choose Population if they are the entire population.",
      "Review the summary table and optional plots (histogram / box plot).",
    ],
    formulas: [
      { label: "Sample mean", latex: "\\bar{x}=\\dfrac{1}{n}\\sum_{i=1}^{n}x_i" },
      {
        label: "Sample variance (unbiased)",
        latex: "s^{2}=\\dfrac{1}{n-1}\\sum_{i=1}^{n}(x_i-\\bar{x})^{2}",
        note: "Population variance uses n in the denominator.",
      },
      { label: "Standard deviation", latex: "s=\\sqrt{s^{2}}" },
      { label: "Median (odd n)", latex: "x_{(k)}\\text{ with }k=\\tfrac{n+1}{2}" },
      { label: "IQR", latex: "\\mathrm{IQR}=Q_{3}-Q_{1}" },
    ],
    interpretation: [
      "Mean ≈ median suggests approximate symmetry; large gaps suggest skew or outliers.",
      "About half the sorted values lie below the median.",
      "IQR is resistant to extreme outliers compared with the range.",
    ],
    tips: ["Remove non-numeric tokens before pasting.", "Report units with every summary statistic."],
    example: "Data 2, 4, 4, 4, 5, 5, 7, 9 → mean 5, median 4.5, mode 4.",
  },

  "mean-median-mode": {
    overview: "Computes the three classic measures of central tendency for a numeric list.",
    howTo: ["Enter the data list.", "Read mean (arithmetic average), median (middle value), and mode (most frequent)."],
    formulas: [
      { label: "Mean", latex: "\\bar{x}=\\dfrac{\\sum x_i}{n}" },
      { label: "Median", latex: "\\tilde{x}=\\text{middle of sorted }x_{(1)}\\le\\cdots\\le x_{(n)}" },
      { label: "Mode", latex: "\\mathrm{mode}=\\arg\\max_{v}\\#\\{i:x_i=v\\}" },
    ],
    interpretation: [
      "Use the mean for roughly symmetric data without extreme outliers.",
      "Prefer the median for skewed income-like distributions.",
      "Mode is useful for categorical or multimodal data.",
    ],
    tips: ["A set can be multimodal or have no unique mode."],
  },

  "standard-deviation": {
    overview: "Standard deviation measures typical distance of observations from the mean.",
    howTo: ["Enter data.", "Select Sample (n−1) or Population (n).", "Read variance and SD."],
    formulas: [
      { label: "Sample SD", latex: "s=\\sqrt{\\dfrac{1}{n-1}\\sum(x_i-\\bar{x})^{2}}" },
      { label: "Population SD", latex: "\\sigma=\\sqrt{\\dfrac{1}{N}\\sum(x_i-\\mu)^{2}}" },
      { label: "Coefficient of variation", latex: "\\mathrm{CV}=\\dfrac{s}{|\\bar{x}|}" },
    ],
    interpretation: [
      "Larger SD means more spread around the mean.",
      "For roughly normal data, ~68% of values lie within 1 SD of the mean.",
    ],
    tips: ["SD has the same units as the data; variance has squared units."],
  },

  "five-number": {
    overview: "The five-number summary is min, Q1, median, Q3, and max—the skeleton of a box plot.",
    howTo: ["Enter numeric data.", "Read the five percentiles and IQR."],
    formulas: [
      { label: "Quartiles", latex: "Q_{1}=P_{25},\\quad Q_{2}=P_{50},\\quad Q_{3}=P_{75}" },
      { label: "IQR", latex: "\\mathrm{IQR}=Q_{3}-Q_{1}" },
    ],
    interpretation: [
      "The box spans the middle 50% of the data.",
      "Whiskers extend to the extremes (or to fences if outlier rules are applied).",
    ],
    tips: ["Different software may use slightly different quartile algorithms."],
  },

  percentiles: {
    overview: "A percentile is a value below which a given percentage of the sorted data falls.",
    howTo: ["Enter data and the desired percentile p (0–100).", "Read the estimated quantile."],
    formulas: [
      { label: "Empirical quantile (linear)", latex: "x_{(p)}=x_{(k)}+(d)\\bigl(x_{(k+1)}-x_{(k)}\\bigr)" },
    ],
    interpretation: ["The 90th percentile is exceeded by only about 10% of observations."],
    tips: ["State the quantile method when publishing."],
  },

  "z-score": {
    overview: "A z-score standardizes a value relative to a mean and SD on the standard normal scale.",
    howTo: ["Enter x, mean μ (or x̄), and SD.", "Read z and optional percentile under normality."],
    formulas: [
      { label: "z-score", latex: "z=\\dfrac{x-\\mu}{\\sigma}" },
      { label: "Back-transform", latex: "x=\\mu+z\\sigma" },
    ],
    interpretation: [
      "z = 0 is exactly at the mean.",
      "|z| > 2 is often flagged as unusual under a normal model.",
    ],
    tips: ["Use sample mean/SD when parameters are unknown."],
  },

  "one-sample-t": {
    overview: "One-sample t-test compares a sample mean to a hypothesized value μ₀ when σ is unknown.",
    howTo: [
      "Enter data (or summary n, mean, SD) and hypothesized mean μ₀.",
      "Choose two-sided or one-sided alternative and α.",
      "Compare p-value to α; optionally report a CI for μ.",
    ],
    formulas: [
      { label: "Test statistic", latex: "t=\\dfrac{\\bar{x}-\\mu_{0}}{s/\\sqrt{n}},\\quad \\mathrm{df}=n-1" },
      { label: "Two-sided p-value", latex: "p=2\\,P(T_{n-1}\\ge |t|)" },
      { label: "CI for mean", latex: "\\bar{x}\\pm t_{1-\\alpha/2,n-1}\\,\\dfrac{s}{\\sqrt{n}}" },
    ],
    interpretation: [
      "Reject H₀ if p ≤ α.",
      "A significant result does not measure practical importance—report effect size and CI.",
    ],
    tips: ["Assumes approximately normal data or large n (CLT).", "Independence of observations is critical."],
    example: "H₀: μ = 100 vs H₁: μ ≠ 100 with n=25, x̄=104, s=10 → t=2.0, df=24.",
  },

  "two-sample-t": {
    overview: "Two-sample (independent) t-test compares means of two groups.",
    howTo: [
      "Enter group A and group B data (or summaries).",
      "Choose equal-variance (pooled) or Welch (unequal variances).",
      "Set alternative and α; read t, df, p, and CI for μ₁−μ₂.",
    ],
    formulas: [
      {
        label: "Welch statistic",
        latex: "t=\\dfrac{\\bar{x}_{1}-\\bar{x}_{2}}{\\sqrt{s_{1}^{2}/n_{1}+s_{2}^{2}/n_{2}}}",
      },
      {
        label: "Welch df (approx.)",
        latex:
          "\\nu\\approx\\dfrac{(s_{1}^{2}/n_{1}+s_{2}^{2}/n_{2})^{2}}{(s_{1}^{2}/n_{1})^{2}/(n_{1}-1)+(s_{2}^{2}/n_{2})^{2}/(n_{2}-1)}",
      },
      {
        label: "Pooled SD",
        latex: "s_{p}=\\sqrt{\\dfrac{(n_{1}-1)s_{1}^{2}+(n_{2}-1)s_{2}^{2}}{n_{1}+n_{2}-2}}",
      },
    ],
    interpretation: [
      "Welch is safer when variances differ or sizes are unequal.",
      "Report which mean is larger and by how much (CI).",
    ],
    tips: ["Use paired t if observations are matched.", "Check normality / outliers in each group."],
  },

  "paired-t": {
    overview: "Paired t-test analyzes mean difference of matched pairs (before/after, twins, etc.).",
    howTo: ["Enter paired values or the difference list.", "Test H₀: μ_d = 0 (or another δ₀)."],
    formulas: [
      { label: "Differences", latex: "d_i=x_i-y_i" },
      { label: "Paired t", latex: "t=\\dfrac{\\bar{d}-\\delta_{0}}{s_d/\\sqrt{n}},\\quad \\mathrm{df}=n-1" },
    ],
    interpretation: ["A positive mean difference means the first measure tends to be larger."],
    tips: ["Pairing must be meaningful; do not pair independent samples."],
  },

  anova: {
    overview: "One-way ANOVA tests whether several group means are equal under a common variance model.",
    howTo: [
      "Enter one column (or list) per group.",
      "Read F, df, p-value, and optional post-hoc contrasts if provided.",
    ],
    formulas: [
      { label: "Between SS", latex: "\\mathrm{SSB}=\\sum_{j}n_j(\\bar{x}_j-\\bar{x}_{\\cdot\\cdot})^{2}" },
      { label: "Within SS", latex: "\\mathrm{SSW}=\\sum_{j}\\sum_{i}(x_{ij}-\\bar{x}_j)^{2}" },
      { label: "F statistic", latex: "F=\\dfrac{\\mathrm{MSB}}{\\mathrm{MSW}}=\\dfrac{\\mathrm{SSB}/(k-1)}{\\mathrm{SSW}/(N-k)}" },
    ],
    interpretation: [
      "A significant F means at least one mean differs; it does not say which pairs.",
      "Follow with Tukey/Bonferroni or planned contrasts.",
    ],
    tips: ["Assumes independent groups, normality, and roughly equal variances.", "Use Welch ANOVA if variances differ."],
  },

  "chi-square": {
    overview: "Pearson’s χ² goodness-of-fit or independence test for categorical counts.",
    howTo: [
      "Enter observed counts (and expected proportions for GOF, or a contingency table).",
      "Read χ², df, p-value, and residuals if shown.",
    ],
    formulas: [
      { label: "Pearson statistic", latex: "\\chi^{2}=\\sum\\dfrac{(O-E)^{2}}{E}" },
      { label: "Independence df", latex: "\\mathrm{df}=(r-1)(c-1)" },
      { label: "Expected cell", latex: "E_{ij}=\\dfrac{R_i C_j}{N}" },
    ],
    interpretation: [
      "Large χ² relative to df suggests lack of fit / association.",
      "Inspect standardized residuals to see which cells drive the result.",
    ],
    tips: ["Prefer exact or Fisher tests when expected counts are very small.", "Do not use percentages as if they were counts."],
  },

  "chi-homogeneity": {
    overview: "χ² test of homogeneity compares category distributions across populations/groups.",
    howTo: ["Enter a groups × categories count table.", "Test equal multinomial distributions across rows."],
    formulas: [
      { label: "Same as independence χ²", latex: "\\chi^{2}=\\sum\\dfrac{(O-E)^{2}}{E},\\; E_{ij}=R_i C_j/N" },
    ],
    interpretation: ["Rejecting H₀ means at least one group has a different category profile."],
    tips: ["Homogeneity and independence use the same arithmetic; the sampling story differs."],
  },

  correlation: {
    overview: "Pearson correlation measures linear association between two numeric variables.",
    howTo: ["Enter paired x and y values.", "Read r, optional t-test of H₀: ρ=0, and scatter context."],
    formulas: [
      {
        label: "Pearson r",
        latex: "r=\\dfrac{\\sum(x_i-\\bar{x})(y_i-\\bar{y})}{\\sqrt{\\sum(x_i-\\bar{x})^{2}\\sum(y_i-\\bar{y})^{2}}}",
      },
      { label: "t-test for r", latex: "t=r\\sqrt{\\dfrac{n-2}{1-r^{2}}},\\quad \\mathrm{df}=n-2" },
    ],
    interpretation: [
      "r near ±1: strong linear association; r near 0: little linear association.",
      "Correlation ≠ causation.",
    ],
    tips: ["Outliers can dominate r.", "Use Spearman for monotonic/ordinal association."],
  },

  spearman: {
    overview: "Spearman’s ρ is Pearson correlation of ranks—robust to monotonic nonlinearity and outliers.",
    howTo: ["Enter paired data.", "Ranks are assigned (ties averaged); then Pearson is applied to ranks."],
    formulas: [
      {
        label: "No-ties shortcut",
        latex: "\\rho=1-\\dfrac{6\\sum d_i^{2}}{n(n^{2}-1)},\\quad d_i=\\mathrm{rank}(x_i)-\\mathrm{rank}(y_i)",
      },
    ],
    interpretation: ["ρ = 1 means a perfect increasing monotonic relationship."],
    tips: ["Prefer Spearman when scales are ordinal or residuals are non-normal."],
  },

  kendall: {
    overview: "Kendall’s τ counts concordant vs discordant pairs among observations.",
    howTo: ["Enter paired data.", "Read τ and optional p-value."],
    formulas: [
      {
        label: "Kendall τ",
        latex: "\\tau=\\dfrac{C-D}{\\binom{n}{2}}\\quad\\text{(no ties)}",
      },
    ],
    interpretation: ["τ is often smaller in magnitude than Spearman ρ for the same data."],
    tips: ["Use τ-b or τ-c adjustments when ties are present."],
  },

  "point-biserial": {
    overview: "Point-biserial correlation is Pearson r between a continuous variable and a binary (0/1) variable.",
    howTo: ["Enter continuous scores and binary group codes.", "Read r_pb and significance."],
    formulas: [
      {
        label: "Point-biserial",
        latex: "r_{pb}=\\dfrac{\\bar{x}_{1}-\\bar{x}_{0}}{s_x}\\sqrt{\\dfrac{n_{1}n_{0}}{n(n-1)}}",
      },
    ],
    interpretation: ["Equivalent to a rescaled two-sample t on the continuous outcome."],
    tips: ["Coding 0/1 (not 1/2) keeps the sign interpretable."],
  },

  "linear-regression": {
    overview: "Simple linear regression fits y = β₀ + β₁x + ε by least squares.",
    howTo: [
      "Enter paired x,y.",
      "Read slope, intercept, R², residual SE, and optional inference for β₁.",
    ],
    formulas: [
      {
        label: "Slope",
        latex: "\\hat{\\beta}_{1}=\\dfrac{\\sum(x_i-\\bar{x})(y_i-\\bar{y})}{\\sum(x_i-\\bar{x})^{2}}",
      },
      { label: "Intercept", latex: "\\hat{\\beta}_{0}=\\bar{y}-\\hat{\\beta}_{1}\\bar{x}" },
      { label: "R-squared", latex: "R^{2}=1-\\dfrac{\\mathrm{SS}_{\\mathrm{res}}}{\\mathrm{SS}_{\\mathrm{tot}}}" },
      { label: "Fitted line", latex: "\\hat{y}=\\hat{\\beta}_{0}+\\hat{\\beta}_{1}x" },
    ],
    interpretation: [
      "β₁ is the expected change in y per one-unit increase in x.",
      "R² is the fraction of variance in y explained by the linear model.",
    ],
    tips: ["Check residual plots.", "Do not extrapolate far beyond the x-range."],
  },

  "multiple-regression": {
    overview: "Multiple linear regression models y with several predictors simultaneously.",
    howTo: ["Enter y and each predictor column.", "Read coefficients, R² / adjusted R², and overall F."],
    formulas: [
      { label: "Model", latex: "y=\\beta_{0}+\\beta_{1}x_{1}+\\cdots+\\beta_{p}x_{p}+\\varepsilon" },
      { label: "OLS", latex: "\\hat{\\boldsymbol{\\beta}}=(X^{\\top}X)^{-1}X^{\\top}y" },
      { label: "Adjusted R²", latex: "R^{2}_{\\mathrm{adj}}=1-\\dfrac{(1-R^{2})(n-1)}{n-p-1}" },
    ],
    interpretation: [
      "Each coefficient is a partial effect holding other predictors fixed.",
      "High VIF suggests multicollinearity among predictors.",
    ],
    tips: ["Standardize predictors to compare coefficient magnitudes.", "Watch overfitting when p is large vs n."],
  },

  "logistic-regression": {
    overview: "Binary logistic regression models log-odds of an event as a linear function of predictors.",
    howTo: ["Enter binary y (0/1) and predictors.", "Read coefficients as log-odds; exponentiate for odds ratios."],
    formulas: [
      {
        label: "Logit model",
        latex: "\\log\\dfrac{p}{1-p}=\\beta_{0}+\\beta_{1}x_{1}+\\cdots",
      },
      { label: "Probability", latex: "p=\\dfrac{1}{1+e^{-(\\beta_{0}+\\beta^{\\top}x)}}" },
      { label: "Odds ratio", latex: "\\mathrm{OR}=e^{\\beta_j}" },
    ],
    interpretation: [
      "OR > 1 means higher odds of the event as xⱼ increases by one unit.",
      "Predicted probabilities must lie in (0,1).",
    ],
    tips: ["Need enough events per predictor.", "Check separation and calibration."],
  },

  "normal-distribution": {
    overview: "Normal (Gaussian) calculator for PDF, CDF, and quantiles of N(μ, σ²).",
    howTo: ["Enter μ and σ > 0.", "Choose x for CDF/PDF or a probability for the quantile."],
    formulas: [
      {
        label: "PDF",
        latex: "f(x)=\\dfrac{1}{\\sigma\\sqrt{2\\pi}}\\exp\\!\\left(-\\dfrac{(x-\\mu)^{2}}{2\\sigma^{2}}\\right)",
      },
      { label: "Standardization", latex: "Z=\\dfrac{X-\\mu}{\\sigma}\\sim N(0,1)" },
      { label: "68–95–99.7 rule", latex: "P(|X-\\mu|<k\\sigma)\\approx 0.68,0.95,0.997\\;(k=1,2,3)" },
    ],
    interpretation: ["The CDF Φ((x−μ)/σ) is P(X ≤ x)."],
    tips: ["σ must be positive.", "Many z-tables are for the standard normal only."],
  },

  binomial: {
    overview: "Binomial distribution: number of successes in n independent Bernoulli trials with success probability p.",
    howTo: ["Enter n, p, and k (or a range).", "Read PMF and CDF."],
    formulas: [
      { label: "PMF", latex: "P(X=k)=\\binom{n}{k}p^{k}(1-p)^{n-k}" },
      { label: "Mean / variance", latex: "E[X]=np,\\quad \\mathrm{Var}(X)=np(1-p)" },
    ],
    interpretation: ["Use for dichotomous outcomes with fixed n and constant p."],
    tips: ["Normal approx needs np and n(1−p) reasonably large."],
  },

  poisson: {
    overview: "Poisson distribution models counts of rare events in a fixed interval with mean rate λ.",
    howTo: ["Enter λ > 0 and k.", "Read P(X=k) and CDF."],
    formulas: [
      { label: "PMF", latex: "P(X=k)=e^{-\\lambda}\\dfrac{\\lambda^{k}}{k!}" },
      { label: "Mean = variance", latex: "E[X]=\\mathrm{Var}(X)=\\lambda" },
    ],
    interpretation: ["Approximates Binomial(n,p) when n is large and p is small with λ=np."],
    tips: ["Overdispersion (variance ≫ mean) suggests a negative binomial instead."],
  },

  "sample-size": {
    overview: "Sample-size planning for means or proportions under a target margin of error or power.",
    howTo: [
      "Choose the endpoint (mean or proportion).",
      "Enter confidence/power, effect size or MOE, and variance/p assumptions.",
      "Read the recommended n (round up).",
    ],
    formulas: [
      {
        label: "Mean (MOE)",
        latex: "n=\\left(\\dfrac{z_{1-\\alpha/2}\\,\\sigma}{E}\\right)^{2}",
      },
      {
        label: "Proportion (MOE)",
        latex: "n=\\dfrac{z_{1-\\alpha/2}^{2}\\,\\hat{p}(1-\\hat{p})}{E^{2}}",
      },
      {
        label: "Two-mean power (approx.)",
        latex: "n\\approx\\dfrac{2\\sigma^{2}(z_{1-\\alpha/2}+z_{1-\\beta})^{2}}{\\Delta^{2}}",
      },
    ],
    interpretation: ["Larger effects and higher allowed error shrink required n."],
    tips: ["Inflate n for dropout.", "Use finite-population correction when sampling a large fraction of N."],
  },

  "confidence-mean": {
    overview: "Confidence interval for a population mean using z (σ known) or t (σ unknown).",
    howTo: ["Enter n, mean, SD (or σ), and confidence level.", "Read the interval endpoints."],
    formulas: [
      { label: "t interval", latex: "\\bar{x}\\pm t_{1-\\alpha/2,n-1}\\dfrac{s}{\\sqrt{n}}" },
      { label: "z interval", latex: "\\bar{x}\\pm z_{1-\\alpha/2}\\dfrac{\\sigma}{\\sqrt{n}}" },
    ],
    interpretation: [
      "In repeated sampling, about (1−α)·100% of such intervals cover the true mean.",
    ],
    tips: ["Prefer t when σ is estimated from the same sample."],
  },

  "confidence-proportion": {
    overview: "Wald or better intervals for a binomial proportion.",
    howTo: ["Enter successes x and trials n (or p̂ and n).", "Choose confidence level."],
    formulas: [
      {
        label: "Wald (approx.)",
        latex: "\\hat{p}\\pm z_{1-\\alpha/2}\\sqrt{\\dfrac{\\hat{p}(1-\\hat{p})}{n}}",
      },
      {
        label: "Wilson (preferred)",
        latex:
          "\\dfrac{\\hat{p}+\\frac{z^{2}}{2n}\\pm z\\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}+\\frac{z^{2}}{4n^{2}}}}{1+z^{2}/n}",
      },
    ],
    interpretation: ["Near 0 or 1, Wald intervals can be misleading—prefer Wilson/Agresti–Coull."],
    tips: ["Report the method used."],
  },

  "mann-whitney": {
    overview: "Mann–Whitney U (Wilcoxon rank-sum) is a nonparametric comparison of two independent samples.",
    howTo: ["Enter two groups.", "Ranks are pooled; U is derived from rank sums."],
    formulas: [
      { label: "U statistic", latex: "U_{1}=n_{1}n_{2}+\\dfrac{n_{1}(n_{1}+1)}{2}-R_{1}" },
    ],
    interpretation: ["Often interpreted as evidence of a stochastic dominance / median shift under similar shapes."],
    tips: ["Less sensitive to outliers than the t-test.", "Requires independent observations."],
  },

  "wilcoxon-signed": {
    overview: "Wilcoxon signed-rank test is the nonparametric paired alternative to the paired t-test.",
    howTo: ["Enter paired differences (exclude zeros if required by the method).", "Read W and p."],
    formulas: [
      { label: "Signed ranks", latex: "W^{+}=\\sum_{d_i>0}\\mathrm{rank}|d_i|" },
    ],
    interpretation: ["Assumes symmetric differences around the hypothesized median difference."],
    tips: ["For ordinal paired data, this is often more appropriate than paired t."],
  },

  "kruskal-wallis": {
    overview: "Kruskal–Wallis is a nonparametric ANOVA on ranks for k ≥ 2 groups.",
    howTo: ["Enter k groups.", "Read H and p; follow with Dunn-type post-hoc if needed."],
    formulas: [
      {
        label: "H statistic",
        latex: "H=\\dfrac{12}{N(N+1)}\\sum_{j}\\dfrac{R_j^{2}}{n_j}-3(N+1)",
      },
    ],
    interpretation: ["Significant H means at least one group’s distribution differs in stochastic ranking."],
    tips: ["Use when ANOVA normality fails and shapes are comparable."],
  },

  bartlett: {
    overview: "Bartlett’s test checks equality of variances across k normal groups.",
    howTo: ["Enter each group’s data.", "Read χ² (or F) statistic and p-value."],
    formulas: [
      {
        label: "Bartlett M",
        latex:
          "M=(N-k)\\ln s_p^{2}-\\sum(n_j-1)\\ln s_j^{2}\\quad(\\text{with correction factor})",
      },
    ],
    interpretation: ["Sensitive to non-normality—consider Levene/Brown–Forsythe as robust alternatives."],
    tips: ["Rejecting equal variances may push you toward Welch methods."],
  },

  "bonferroni": {
    overview: "Bonferroni adjustment controls family-wise error by tightening the per-test α.",
    howTo: ["Enter raw p-values and the number of comparisons m.", "Compare each p to α/m or report adjusted p = min(1, m·p)."],
    formulas: [
      { label: "Adjusted α", latex: "\\alpha'=\\dfrac{\\alpha}{m}" },
      { label: "Adjusted p", latex: "p'_{i}=\\min(1, m\\,p_i)" },
    ],
    interpretation: ["Conservative when m is large; power drops as m grows."],
    tips: ["For correlated tests, Holm or FDR (BH) can be less severe."],
  },

  bayes: {
    overview: "Bayes’ theorem updates prior beliefs with likelihood to obtain a posterior.",
    howTo: ["Enter prior P(H), likelihood P(D|H), and P(D|¬H) or full partition.", "Read posterior odds/probability."],
    formulas: [
      {
        label: "Bayes",
        latex: "P(H\\mid D)=\\dfrac{P(D\\mid H)P(H)}{P(D)}",
      },
      {
        label: "Odds form",
        latex: "\\dfrac{P(H\\mid D)}{P(\\neg H\\mid D)}=\\dfrac{P(D\\mid H)}{P(D\\mid \\neg H)}\\cdot\\dfrac{P(H)}{P(\\neg H)}",
      },
    ],
    interpretation: ["A high likelihood ratio can overcome a small prior—or fail to if the prior is tiny."],
    tips: ["Be explicit about the prior; sensitivity-check alternative priors."],
  },

  multinomial: {
    overview: "Multinomial probabilities for counts across k categories with probabilities p₁…pₖ.",
    howTo: ["Enter n, category probabilities, and observed counts summing to n.", "Read the PMF."],
    formulas: [
      {
        label: "PMF",
        latex: "P(X=\\mathbf{x})=\\dfrac{n!}{x_1!\\cdots x_k!}p_1^{x_1}\\cdots p_k^{x_k}",
      },
    ],
    interpretation: ["Generalizes the binomial to more than two outcomes."],
    tips: ["Probabilities must sum to 1."],
  },

  fleiss: {
    overview: "Fleiss’ κ measures agreement among multiple raters on categorical items.",
    howTo: ["Enter a subjects × categories count matrix of rater votes.", "Read κ and interpretation bands."],
    formulas: [
      {
        label: "Fleiss κ",
        latex: "\\kappa=\\dfrac{\\bar{P}-\\bar{P}_e}{1-\\bar{P}_e}",
      },
    ],
    interpretation: [
      "κ≈0: agreement no better than chance; higher values indicate stronger agreement.",
      "Landis–Koch bands are common but somewhat arbitrary.",
    ],
    tips: ["Report the category set and number of raters with κ."],
  },

  "roc-auc": {
    overview: "ROC curves plot TPR vs FPR across thresholds; AUC summarizes discrimination.",
    howTo: ["Enter scores and binary labels.", "Read AUC and optional operating points."],
    formulas: [
      {
        label: "AUC (Mann–Whitney form)",
        latex: "\\mathrm{AUC}=\\dfrac{\\#\\{(i\\in +),(j\\in -):s_i>s_j\\}+0.5\\,\\#\\{=\\}}{n_{+}n_{-}}",
      },
      { label: "TPR / FPR", latex: "\\mathrm{TPR}=\\dfrac{\\mathrm{TP}}{\\mathrm{TP+FN}},\\;\\mathrm{FPR}=\\dfrac{\\mathrm{FP}}{\\mathrm{FP+TN}}" },
    ],
    interpretation: ["AUC = 0.5 is chance; 1.0 is perfect ranking of positives above negatives."],
    tips: ["AUC ignores calibration—pair with Brier/reliability plots for probability models."],
  },

  kmeans: {
    overview: "k-means partitions observations into k clusters minimizing within-cluster sum of squares.",
    howTo: ["Enter multivariate rows and choose k.", "Read centroids and assignment counts."],
    formulas: [
      {
        label: "Objective",
        latex: "\\min_{C}\\sum_{j=1}^{k}\\sum_{x\\in C_j}\\|x-\\mu_j\\|^{2}",
      },
    ],
    interpretation: ["Assumes spherical clusters of similar size in Euclidean space."],
    tips: ["Standardize features.", "Re-run with different seeds; try several k."],
  },

  mediator: {
    overview: "Mediation asks whether X affects Y partly through a mediator M (paths a, b, c′).",
    howTo: ["Enter X, M, Y.", "Estimate a (X→M), b (M→Y|X), direct c′, and indirect a·b."],
    formulas: [
      { label: "Paths", latex: "M=i_{M}+aX+e_{M},\\quad Y=i_Y+c'X+bM+e_Y" },
      { label: "Indirect effect", latex: "ab\\quad(\\text{total }c\\approx c'+ab\\text{ in linear case})" },
    ],
    interpretation: ["A nonzero ab suggests an indirect pathway; causal claims need design assumptions."],
    tips: ["Bootstrap CIs are preferred for ab.", "Temporal order X→M→Y should be plausible."],
  },

  moderator: {
    overview: "Moderation (interaction) tests whether the X→Y effect depends on W.",
    howTo: ["Enter X, W, Y.", "Fit Y ~ X + W + X·W and inspect the interaction term."],
    formulas: [
      { label: "Interaction model", latex: "Y=\\beta_{0}+\\beta_{1}X+\\beta_{2}W+\\beta_{3}(XW)+\\varepsilon" },
      { label: "Simple slope", latex: "\\dfrac{\\partial Y}{\\partial X}=\\beta_{1}+\\beta_{3}W" },
    ],
    interpretation: ["Significant β₃ means the X effect changes with W."],
    tips: ["Center X and W to ease intercept interpretation.", "Probe at meaningful W values (mean ± SD)."],
  },

  "gage-rr": {
    overview: "Gage R&R (ANOVA MSA) separates part, operator, and error variation in a measurement system.",
    howTo: ["Enter repeated measurements by operator and part.", "Read %GRR, ndc, and variance components."],
    formulas: [
      {
        label: "%GRR (study var)",
        latex: "\\%\\mathrm{GRR}=100\\cdot\\dfrac{\\sigma_{\\mathrm{GRR}}}{\\sigma_{\\mathrm{Total}}}",
      },
    ],
    interpretation: [
      "AIAG rules of thumb: %GRR < 10% good, 10–30% marginal, >30% unacceptable (context matters).",
    ],
    tips: ["Use enough parts spanning the process range.", "Distinguish repeatability vs reproducibility."],
  },

  tost: {
    overview: "TOST (two one-sided tests) assesses equivalence within pre-specified bounds ±Δ.",
    howTo: ["Enter data and equivalence margins.", "Reject both one-sided nulls to claim equivalence."],
    formulas: [
      {
        label: "TOST",
        latex: "H_{01}:\\mu\\le -\\Delta\\;\\text{vs}\\;>\\!-\\Delta,\\quad H_{02}:\\mu\\ge \\Delta\\;\\text{vs}\\;<\\!\\Delta",
      },
    ],
    interpretation: ["Equivalence ≠ 'not significantly different'—you need power inside the margins."],
    tips: ["Choose Δ from regulatory or clinical relevance before seeing the data."],
  },

  "monte-carlo": {
    overview: "Monte Carlo simulation draws many random scenarios to approximate expectations or risk metrics.",
    howTo: ["Specify distributions/parameters and the output function.", "Simulate N runs; summarize mean, SD, percentiles."],
    formulas: [
      {
        label: "MC average",
        latex: "\\hat{\\mu}_N=\\dfrac{1}{N}\\sum_{i=1}^{N}f(X^{(i)}),\\quad X^{(i)}\\sim F",
      },
    ],
    interpretation: ["Error typically shrinks like 1/√N for independent draws."],
    tips: ["Fix seeds for reproducibility.", "Validate marginal distributions of inputs."],
  },

  vif: {
    overview: "Variance inflation factors diagnose multicollinearity among regression predictors.",
    howTo: ["Enter the predictor matrix.", "Read VIFⱼ for each column."],
    formulas: [
      { label: "VIF", latex: "\\mathrm{VIF}_j=\\dfrac{1}{1-R_j^{2}}" },
    ],
    interpretation: ["VIF > 5–10 often flags concerning collinearity (rules of thumb)."],
    tips: ["Consider dropping/combining predictors or using PCR/ridge when VIFs are large."],
  },

  "matrix-ops": {
    overview: "Matrix operations used throughout multivariate statistics: multiply, inverse, determinant, transpose.",
    howTo: ["Enter matrices in the requested format.", "Choose the operation and read the result."],
    formulas: [
      { label: "Multiply", latex: "(AB)_{ij}=\\sum_k a_{ik}b_{kj}" },
      { label: "Inverse", latex: "A A^{-1}=I\\quad(\\det A\\ne 0)" },
      { label: "Determinant (2×2)", latex: "\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=ad-bc" },
    ],
    interpretation: ["Singular matrices (det = 0) are not invertible—common in perfect collinearity."],
    tips: ["Check dimensions before multiplying."],
  },

  // —— Math / finance / geometry (high-traffic) ——
  percentage: {
    overview: "Percentage calculators convert between parts, wholes, and percent values.",
    howTo: ["Enter the known quantities.", "Solve for the missing piece (part, whole, or %)."],
    formulas: [
      { label: "Percent", latex: "\\%=\\dfrac{\\mathrm{part}}{\\mathrm{whole}}\\times 100" },
      { label: "Part", latex: "\\mathrm{part}=\\dfrac{\\%}{100}\\times\\mathrm{whole}" },
    ],
    interpretation: ["Always state what the whole is."],
    tips: ["Percent of vs percent change are different operations."],
  },

  "percent-change": {
    overview: "Percent change measures relative increase or decrease from a starting value.",
    howTo: ["Enter old and new values.", "Read percent change and absolute difference."],
    formulas: [
      {
        label: "Percent change",
        latex: "\\dfrac{\\mathrm{new}-\\mathrm{old}}{|\\mathrm{old}|}\\times 100\\%",
      },
    ],
    interpretation: ["+50% followed by −50% does not return to the start."],
    tips: ["Use percent difference when neither value is a natural baseline."],
  },

  compound: {
    overview: "Compound interest grows principal with interest earned on prior interest.",
    howTo: ["Enter principal, rate, compounding frequency, and time.", "Read future value and interest earned."],
    formulas: [
      {
        label: "Compound amount",
        latex: "A=P\\left(1+\\dfrac{r}{n}\\right)^{nt}",
      },
      { label: "Continuous", latex: "A=Pe^{rt}" },
    ],
    interpretation: ["More frequent compounding increases A for a fixed nominal r."],
    tips: ["Distinguish nominal APR from APY/EAR."],
  },

  loan: {
    overview: "Amortizing loan payment calculators solve the standard fixed-payment annuity formula.",
    howTo: ["Enter principal, annual rate, term, and payment frequency.", "Read payment, total interest, and schedule if available."],
    formulas: [
      {
        label: "Payment",
        latex: "PMT=P\\dfrac{i(1+i)^{n}}{(1+i)^{n}-1},\\quad i=\\dfrac{r}{m}",
      },
    ],
    interpretation: ["Early payments are mostly interest; principal share rises over time."],
    tips: ["Confirm whether rate is compounded monthly.", "Educational estimate only."],
  },

  bmi: {
    overview: "Body Mass Index relates mass and height as a simple screening index.",
    howTo: ["Enter weight and height in consistent units.", "Read BMI and category labels."],
    formulas: [
      { label: "Metric BMI", latex: "\\mathrm{BMI}=\\dfrac{\\mathrm{kg}}{\\mathrm{m}^{2}}" },
      { label: "US customary", latex: "\\mathrm{BMI}=703\\dfrac{\\mathrm{lb}}{\\mathrm{in}^{2}}" },
    ],
    interpretation: ["BMI is a population screening tool—not a complete health diagnosis."],
    tips: ["Athletes may have high BMI from muscle mass.", "Not medical advice."],
  },

  pythagorean: {
    overview: "Pythagorean theorem relates side lengths of a right triangle.",
    howTo: ["Enter any two of a, b, c (hypotenuse).", "Solve for the missing side."],
    formulas: [
      { label: "Pythagoras", latex: "a^{2}+b^{2}=c^{2}" },
      { label: "Hypotenuse", latex: "c=\\sqrt{a^{2}+b^{2}}" },
    ],
    interpretation: ["Only valid for right triangles."],
    tips: ["Keep units consistent."],
  },

  quadratic: {
    overview: "Solves ax² + bx + c = 0 for real (and complex) roots.",
    howTo: ["Enter a, b, c with a ≠ 0.", "Read discriminant and roots."],
    formulas: [
      { label: "Quadratic formula", latex: "x=\\dfrac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}" },
      { label: "Discriminant", latex: "\\Delta=b^{2}-4ac" },
    ],
    interpretation: ["Δ>0 two real roots; Δ=0 repeated root; Δ<0 complex conjugate roots."],
    tips: ["If a=0 the equation is linear, not quadratic."],
  },

  "area-circle": {
    overview: "Area and circumference of a circle from radius or diameter.",
    howTo: ["Enter radius (or diameter).", "Read area and circumference."],
    formulas: [
      { label: "Area", latex: "A=\\pi r^{2}" },
      { label: "Circumference", latex: "C=2\\pi r" },
    ],
    interpretation: ["Area scales with the square of the radius."],
    tips: ["Diameter d = 2r."],
  },

  "volume-sphere": {
    overview: "Volume and surface area of a sphere.",
    howTo: ["Enter radius.", "Read V and A."],
    formulas: [
      { label: "Volume", latex: "V=\\dfrac{4}{3}\\pi r^{3}" },
      { label: "Surface area", latex: "A=4\\pi r^{2}" },
    ],
    interpretation: ["Volume grows with the cube of radius."],
    tips: ["Confirm you need a full sphere vs hemisphere."],
  },

  "unit-convert": {
    overview: "Unit conversion applies a scale factor (and sometimes an offset) between measurement systems.",
    howTo: ["Enter the value and choose from/to units.", "Read the converted result."],
    formulas: [
      { label: "Linear units", latex: "y = x\\cdot k" },
      { label: "Temperature (C→F)", latex: "F=\\dfrac{9}{5}C+32" },
    ],
    interpretation: ["Temperature conversions are affine, not pure proportions."],
    tips: ["Double-check prefixes (m vs km, mL vs L)."],
  },
};

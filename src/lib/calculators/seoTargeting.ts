/**
 * GSC query targeting for calculator pages (impressions with weak CTR).
 * Merged into meta titles, keywords, and descriptions at build time.
 */
export type SeoTarget = {
  /** SERP / H1 title — do not append "Calculator" again */
  metaTitle?: string;
  keywords?: string[];
  /** Extra phrase injected into the meta description lead */
  blurb?: string;
};

export const seoBySlug: Record<string, SeoTarget> = {
  "prime-number-checker": {
    metaTitle: "Prime Number Checker",
    keywords: [
      "prime number checker",
      "prime number calculator",
      "prime number calculator online",
      "prime number finder",
      "prime numbers calculator",
      "is prime calculator",
    ],
    blurb: "Instantly check whether any integer is prime—free, no signup.",
  },
  "sample-standard-deviation-calculator": {
    metaTitle: "Standard Deviation Calculator",
    keywords: [
      "standard deviation calculator",
      "sd calculator",
      "sd online calculator",
      "stdev calculator",
      "std calculator",
      "standard dev calculator",
      "online standard deviation calculator",
      "sample standard deviation calculator",
      "compute standard deviation calculator",
      "mean standard deviation calculator",
      "average and standard deviation calculator",
      "s d calculator",
      "sd calc",
      "sd formula calculator",
    ],
    blurb: "Free sample or population SD calculator with variance and clear formulas.",
  },
  "range-variance-stddev-calculator": {
    keywords: [
      "standard deviation calculator",
      "variance and standard deviation calculator",
      "range variance sd calculator",
    ],
  },
  "variance-calculator": {
    metaTitle: "Variance Calculator",
    keywords: [
      "variance calculator",
      "variance between 2 numbers",
      "variance between two numbers",
      "sample variance calculator",
    ],
    blurb: "Compute sample or population variance with matching standard deviation.",
  },
  "percentage-increase-calculator": {
    metaTitle: "Percentage Increase Calculator",
    keywords: [
      "percentage increase calculator",
      "percent increase calculator",
      "determine percentage increase",
      "calculate percentage increase",
      "increase percentage calculator",
      "percentage calculator increase",
      "figure percent increase",
      "find increase percentage",
      "omni percentage increase calculator",
      "online percentage increase calculator",
      "price increase percentage calculator",
      "calculate a percentage increase",
      "percent increase",
      "percentage increase",
    ],
    blurb: "Increase any number by a percent and see the new value instantly.",
  },
  "percent-difference-calculator": {
    metaTitle: "Percent Difference Calculator",
    keywords: [
      "percentage difference calculator",
      "percent difference calculator",
      "relative percent difference",
      "rpd calculator",
      "rpd calculation",
      "calculate percentage difference",
      "calculate percent difference",
      "calculator for percentage difference",
      "calculator difference percentage",
      "difference as a percentage",
      "difference percent",
      "percentage variance",
      "calculate percentage variance",
      "percent variation calculator",
      "absolute difference calculator",
      "percentage difference between two numbers calculator",
      "figure out percentage difference",
    ],
    blurb: "Find relative percent difference (RPD) between two values—free online.",
  },
  "percent-change-calculator": {
    metaTitle: "Percent Change Calculator",
    keywords: [
      "percent change calculator",
      "percentage change calculator",
      "percentage variance",
      "percent variance",
    ],
  },
  "percentage-calculator": {
    metaTitle: "Percentage Calculator",
    keywords: [
      "percentage calculator",
      "calculator adding percentage",
      "percentage and fraction calculator",
      "percent and fraction calculator",
    ],
  },
  "distance-two-points-calculator": {
    metaTitle: "Distance Between Two Points Calculator",
    keywords: [
      "distance between two points",
      "distance between 2 points",
      "distance calculator 2d",
      "graph distance calculator",
      "2d distance calculator",
    ],
    blurb: "Free 2D Euclidean distance calculator for any two (x,y) points.",
  },
  "mean-median-mode-calculator": {
    metaTitle: "Mean Median Mode Calculator",
    keywords: [
      "mean median mode calculator",
      "mode calculator",
      "mode calculation",
      "mean median mode online calculator",
      "what is the average calculator",
    ],
    blurb: "Get mean, median, and mode for your data set in one free tool.",
  },
  "average-calculator": {
    metaTitle: "Average Calculator",
    keywords: [
      "average calculator",
      "sample average calculator",
      "avg generator",
      "what is the average calculator",
      "fractions average calculator",
      "average fractions calculator",
    ],
  },
  "average-fractions-calculator": {
    metaTitle: "Fractions Average Calculator",
    keywords: [
      "fractions average calculator",
      "average fractions calculator",
      "average of fractions calculator",
      "fraction calculator",
    ],
    blurb: "Average two fractions and simplify the result automatically.",
  },
  "descriptive-statistics-calculator": {
    metaTitle: "Descriptive Statistics Calculator",
    keywords: [
      "descriptive statistics calculator",
      "statistics calculator",
      "stats calculator",
      "statistical calculator",
      "calculator soup descriptive statistics",
      "biostatistics calculator",
    ],
    blurb: "Full descriptive stats: mean, SD, skewness, kurtosis, outliers, and more.",
  },
  "basic-statistics-calculator": {
    keywords: [
      "statistics calculator",
      "stats calculator",
      "basic statistics calculator",
      "stat calculator",
      "statistic calculator",
    ],
  },
  "one-sample-t-test-calculator": {
    metaTitle: "t-Test Calculator",
    keywords: [
      "t test calculator",
      "t-test calculator",
      "t test student calculator",
      "student t test calculator",
      "student's t test calculator",
      "student's t-test calculator",
      "students t test calculator",
      "student test calculator",
      "test t calculator",
      "t test tool",
      "calculate t test",
      "t student test calculator",
    ],
    blurb: "Free Student’s t-test calculator with formulas, p-value, and PDF export.",
  },
  "two-sample-t-test-calculator": {
    metaTitle: "Two Sample t-Test Calculator",
    keywords: [
      "2 sample t test calculator",
      "t test calculator for two samples",
      "t test calculator two sample",
      "comparison of two means calculator",
      "difference between two means calculator",
      "t-test calculator",
      "student t-test calculator",
    ],
    blurb: "Compare two means with pooled or Welch t-test—free online.",
  },
  "two-sample-paired-t-test-calculator": {
    keywords: ["paired t test calculator", "t test calculator", "student t test calculator"],
  },
  "students-t-distribution-calculator": {
    metaTitle: "t Distribution Calculator",
    keywords: [
      "t distribution calculator",
      "t-distribution calculator",
      "student t distribution calculator",
      "student's t distribution calculator",
      "t student distribution calculator",
      "student distribution calculator",
      "t dist calculator",
      "t distribution on calculator",
      "calculator for t statistic",
      "t statistic calculator",
      "t score calculator",
    ],
  },
  "critical-value-calculator": {
    metaTitle: "Critical Value Calculator",
    keywords: [
      "critical value calculator",
      "critical values calculator",
      "t critical value calculator",
      "t score critical value calculator",
      "critical value equation",
      "how to calculate critical value",
    ],
    blurb: "Find Z, t, F, or chi-square critical values for your alpha level.",
  },
  "odds-probability-calculator": {
    metaTitle: "Odds Calculator",
    keywords: [
      "odds calculator",
      "odds calculator math",
      "odds probability calculator",
      "odds to probability",
      "odds percentage calculator",
      "percent odds calculator",
      "what are the odds calculator",
      "calculate the odds",
      "log odds to probability calculator",
      "odds risk calculator",
      "percent to probability",
      "odds simulation",
    ],
    blurb: "Convert odds to probability and percent chance—free math odds calculator.",
  },
  "betting-odds-calculator": {
    keywords: ["odds calculator", "odds to probability", "betting odds calculator"],
  },
  "roman-numeral-converter": {
    metaTitle: "Roman Numeral Calculator",
    keywords: [
      "roman numeral calculator",
      "roman numeral converter",
      "roman numerals calculator",
    ],
    blurb: "Convert between integers and Roman numerals instantly.",
  },
  "straight-line-depreciation-calculator": {
    metaTitle: "Depreciation Calculator",
    keywords: [
      "depreciation calculator",
      "straight line depreciation calculator",
      "percent depreciation calculator",
      "fixed asset depreciation calculator",
      "depreciation calculator computer",
    ],
    blurb: "Straight-line depreciation schedule with annual expense—free online.",
  },
  "declining-balance-depreciation-calculator": {
    metaTitle: "Declining Balance Depreciation Calculator",
    keywords: [
      "double declining balance depreciation calculator",
      "double declining depreciation calculator",
      "fixed declining balance depreciation calculator",
      "alternative depreciation system calculator",
      "depreciation calculator",
      "currency appreciation and depreciation calculator",
    ],
  },
  "three-way-anova-calculator": {
    metaTitle: "3 Factor ANOVA Calculator",
    keywords: ["3 factor anova", "three way anova", "three-factor anova calculator"],
  },
  "cube-calculator": {
    metaTitle: "Cube Calculator (x³)",
    keywords: ["cube calculator x3", "cubic calculator", "cubing calculator", "x cubed calculator"],
  },
  "square-calculator": {
    metaTitle: "Square Calculator (x²)",
    keywords: [
      "square calculator for x2",
      "square calculator",
      "calculator squared",
      "square of a number calculator",
      "1.8 squared",
    ],
  },
  "cubic-equation-calculator": {
    metaTitle: "Cubic Equation Calculator",
    keywords: [
      "cubic equation calculator",
      "cubic equation calculator - 3rd order polynomial",
      "cubic expression calculator",
      "cubic formula program",
    ],
  },
  "ratio-simplifier": {
    metaTitle: "Ratio Simplifier Calculator",
    keywords: ["ratio simplifier calculator", "ratio simplifier", "simplify ratio calculator"],
  },
  "simplify-fractions-calculator": {
    metaTitle: "Simplify Fractions Calculator",
    keywords: [
      "simplify fractions calculator",
      "reduce fraction calculator",
      "reducing fractions calculator",
      "simplify fraction calculator",
      "calculator to simplify fractions",
      "fraction calculator",
    ],
  },
  "adding-fractions-calculator": {
    metaTitle: "Adding Fractions Calculator",
    keywords: [
      "adding fractions calculator",
      "fraction addition calculator",
      "fraction adder online",
      "addition of fractions calculator",
      "adding and subtracting fractions calculator",
      "adding and subtracting fractions with different denominators calculator",
      "fraction calculator",
      "calculator fractions",
      "how to add fractions on a calculator",
    ],
  },
  "subtracting-fractions-calculator": {
    keywords: [
      "adding and subtracting fractions calculator",
      "fraction calculator",
      "estimating sums and differences of fractions calculator",
    ],
  },
  "percent-to-fraction-calculator": {
    keywords: [
      "percent to fraction converter",
      "convert percent to fraction calculator",
      "percent as a fraction calculator",
      "percentage as fraction calculator",
      "percent into a fraction calculator",
      "percent fraction calculator",
      "fraction and percent calculator",
      "42.67 percent in fraction",
    ],
  },
  "stem-and-leaf-plot": {
    metaTitle: "Stem and Leaf Plot Generator",
    keywords: [
      "stem and leaf plot generator",
      "stem and leaf plot maker",
      "stem and leaf plot creator",
      "stem leaf calculator",
      "stemplot maker",
    ],
  },
  "interquartile-range-calculator": {
    metaTitle: "Interquartile Range Calculator",
    keywords: [
      "interquartile range calculator",
      "interquartile calculator",
      "calculate interquartile range",
      "compute the interquartile range",
      "iqr on calculator",
      "range and interquartile range calculator",
      "interquartile range on calculator",
    ],
  },
  "quartile-calculator": {
    keywords: ["quartile calculator online", "quartile calculator", "interquartile range calculator"],
  },
  "outlier-detection-calculator": {
    metaTitle: "Outlier Calculator",
    keywords: ["outlier calculator", "outlier finder", "calculate outlier", "outlier detection calculator"],
  },
  "simple-linear-regression-calculator": {
    metaTitle: "Linear Regression Calculator",
    keywords: [
      "linear regression calculator",
      "linear regression formula calculator",
      "regression calculator",
      "regression analysis calculator",
      "regression analysis online calculator",
      "regression linear calculator",
      "calculator regression",
    ],
  },
  "normal-distribution-calculator": {
    metaTitle: "Normal Distribution Calculator",
    keywords: [
      "normal distribution calculator",
      "normal cdf calculator",
      "normalcdf calculator",
      "norm cdf calculator",
      "norm dist calculator",
      "normal dist calculator",
      "normally distributed calculator",
      "normal distributions calculator",
      "calculator normal cdf",
    ],
  },
  "expected-value-calculator": {
    metaTitle: "Expected Value Calculator",
    keywords: [
      "expected value calculator",
      "finding expected value calculator",
      "calculate expected value calculator",
      "calculator expected value",
      "expected number calculator",
    ],
  },
  "basic-probability-calculator": {
    metaTitle: "Probability Calculator",
    keywords: [
      "probability calculator",
      "basic probability calculator",
      "calculate probability calculator",
      "experimental probability calculator",
    ],
  },
  "combinations-with-replacement-calculator": {
    keywords: ["combination with replacement calculator", "combinations with replacement"],
  },
  "factorial-calculator": {
    keywords: ["factor calculator", "factorial calculator", "factors calculator"],
  },
  "factors-calculator": {
    metaTitle: "Factors Calculator",
    keywords: [
      "factors calculator",
      "factor calculator",
      "calculator that factors",
      "common factors calculator",
      "factors website",
    ],
  },
  "pin-generator": {
    metaTitle: "PIN Generator",
    keywords: ["pin generator", "generate pin", "random pin generator"],
  },
  "character-counter": {
    metaTitle: "Character Calculator",
    keywords: [
      "character calculator",
      "charactercalculator",
      "charactercalculator.com",
      "character counter",
    ],
  },
  "kinetic-energy-calculator": {
    metaTitle: "Kinetic Energy Calculator",
    keywords: ["kinetic energy calculator", "kinetic calculator", "figuring kinetic energy"],
  },
  "pressure-calculator": {
    metaTitle: "Pressure Calculator",
    keywords: [
      "pressure calculator",
      "calculate pressure",
      "pressure force area calculator",
      "force pressure area calculator",
    ],
  },
  "cone-calculator": {
    metaTitle: "Cone Calculator",
    keywords: [
      "cone calculator",
      "cone calc",
      "cone surface area calculator",
      "surface area of cone calculator",
      "radius of a cone calculator",
    ],
  },
  "hemisphere-calculator": {
    metaTitle: "Hemisphere Calculator",
    keywords: ["hemisphere calculator", "volume of hemisphere calculator", "hemisphere surface area calculator"],
  },
  "trapezoid-calculator": {
    metaTitle: "Trapezoid Calculator",
    keywords: ["calculate trapezoid", "trapezium calculator", "trapezoid calculator"],
  },
  "length-converter": {
    metaTitle: "Length Calculator",
    keywords: ["length calculator", "length calculation", "length calculate", "length check", "feet meters calculator", "ft to m calculator"],
  },
  "feet-to-meters-converter": {
    keywords: ["feet meters calculator", "ft to m calculator", "feet to meters"],
  },
  "work-hours-calculator": {
    metaTitle: "Work Hours Calculator",
    keywords: ["work hours calculator", "calculator ore lucrate", "hr calculators"],
  },
  "time-to-decimal-calculator": {
    metaTitle: "Time to Decimal Calculator",
    keywords: ["time to decimal calculator"],
  },
  "frequency-table-calculator": {
    metaTitle: "Frequency Table Calculator",
    keywords: [
      "frequency table calculator",
      "frequency table maker",
      "frequency distribution table creator",
      "frequency calculator statistics",
    ],
  },
  "five-number-summary-calculator": {
    keywords: ["5 number summary calculator", "five number summary calculator"],
  },
  "coefficient-of-variation-calculator": {
    keywords: ["coefficient of variation calculator", "calculate rsd online", "rsd calculator"],
  },
  "effect-size-calculator": {
    metaTitle: "Effect Size Calculator",
    keywords: ["effect size calculator", "efficacy calculator"],
  },
  "sample-size-and-power-analysis-calculator": {
    keywords: [
      "sample size calculator standard deviation",
      "reliability sample size calculator",
      "sample size calculator",
    ],
  },
  "survey-sample-size-calculator": {
    keywords: ["reliability sample size calculator", "sample size calculator"],
  },
  "cronbach-alpha-calculator": {
    keywords: ["confidence reliability calculator", "reliability calculator", "cronbach alpha"],
  },
  "cronbachs-alpha-reliability": {
    keywords: ["confidence reliability calculator", "reliability calculator"],
  },
  "absolute-difference-calculator": {
    metaTitle: "Absolute Difference Calculator",
    keywords: ["absolute difference calculator", "absolute difference", "difference calculator", "absolute number calculator"],
  },
  "nth-root-calculator": {
    keywords: ["nth root calculator", "radical calculator"],
  },
  "simplify-radicals-calculator": {
    metaTitle: "Radical Calculator",
    keywords: ["radical calculator", "simplified radical form calculator", "decimal to radical calculator"],
  },
  "exponent-calculator": {
    keywords: ["exponent calculator with variable", "exponent calculator"],
  },
  "spearman-correlation-calculator": {
    metaTitle: "Spearman Calculator",
    keywords: ["spearman calculator", "spearman correlation calculator"],
  },
  "chi-square-test-of-independence-calculator": {
    keywords: ["chi square table calculator", "chi-square table calculator"],
  },
  "z-score-calculator": {
    keywords: ["z table calculator", "z-score calculator", "z score calculator"],
  },
};

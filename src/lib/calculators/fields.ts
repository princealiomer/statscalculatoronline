import { fieldsExtra } from "./fieldsExtra";
import { fieldsExtra2 } from "./fieldsExtra2";
import { fieldsAdv } from "./fieldsAdv";

export type FieldDef = {
  name: string;
  label: string;
  type?: "textarea" | "text" | "number" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string;
};

const dataField: FieldDef = {
  name: "data",
  label: "Data",
  type: "textarea",
  placeholder: "Paste numbers separated by commas, spaces, or new lines (spreadsheet paste OK)",
};

const sampleField: FieldDef = {
  name: "sampleType",
  label: "Data type",
  type: "select",
  options: [
    { value: "sample", label: "Sample" },
    { value: "population", label: "Population" },
  ],
  defaultValue: "sample",
};

const pairedField: FieldDef = {
  name: "data",
  label: "Paired / bivariate data",
  type: "textarea",
  placeholder: "One pair per line: x,y",
};

const groupsField: FieldDef = {
  name: "data",
  label: "Groups",
  type: "textarea",
  placeholder: "Group A: 1,2,3\nGroup B: 4,5,6\n\nor blank-line separated groups",
};

const altField: FieldDef = {
  name: "alternative",
  label: "Alternative",
  type: "select",
  options: [
    { value: "two-sided", label: "Two-sided" },
    { value: "less", label: "Less than" },
    { value: "greater", label: "Greater than" },
  ],
  defaultValue: "two-sided",
};

const alphaField: FieldDef = {
  name: "alpha",
  label: "Significance level α",
  type: "number",
  defaultValue: "0.05",
};

const levelField: FieldDef = {
  name: "level",
  label: "Confidence level",
  type: "number",
  defaultValue: "0.95",
};

export function fieldsForEngine(engine: string): FieldDef[] {
  if (
    [
      "descriptive-full",
      "basic-stats",
      "range-var-sd",
      "cv",
      "std-error",
      "skewness",
      "kurtosis",
      "zscore",
    ].includes(engine)
  ) {
    if (engine === "zscore") {
      return [
        dataField,
        sampleField,
        { name: "mean", label: "Mean (optional for single x)", type: "number" },
        { name: "sd", label: "SD (optional for single x)", type: "number" },
      ];
    }
    return [dataField, sampleField];
  }

  if (
    [
      "mean-median-mode",
      "average",
      "sum",
      "five-number",
      "mad",
      "medad",
      "geomean",
      "harmean",
      "freq-table",
      "likert",
      "normality",
      "outliers",
      "ci-mean",
      "ci-sd",
      "chart-bar",
      "chart-pie",
      "chart-hist",
      "chart-box",
      "chart-dot",
      "chart-density",
      "chart-violin",
      "chart-stem",
      "chart-line",
      "chart-area",
      "chart-pareto",
      "chart-lollipop",
      "chart-control",
      "chart-builder",
      "chart-ai",
      "chart-qq",
    ].includes(engine)
  ) {
    return [dataField];
  }

  if (engine === "percent-error") {
    return [
      { name: "experimental", label: "Experimental (measured) value", type: "number" },
      { name: "theoretical", label: "Theoretical (actual) value", type: "number" },
    ];
  }

  if (engine === "odds-prob") {
    return [
      { name: "oddsFor", label: "Odds for (wins)", type: "number", defaultValue: "1" },
      { name: "oddsAgainst", label: "Odds against (losses)", type: "number", defaultValue: "1" },
    ];
  }

  if (engine === "vote-percent") {
    return [
      {
        name: "data",
        label: "Vote counts (2–3 values)",
        type: "textarea",
        placeholder: "e.g. 120, 95, 40",
      },
    ];
  }

  if (engine === "percentile") {
    return [dataField, { name: "percentile", label: "Percentile (0-100)", type: "number", defaultValue: "50" }];
  }
  if (["correlation", "covariance", "ci-corr", "slr", "quad-reg", "exp-reg", "poly-reg", "chart-scatter", "chart-ba", "chart-slope", "chart-bubble"].includes(engine)) {
    return [pairedField];
  }
  if (engine === "partial-corr") {
    return [{ name: "data", label: "x,y,z rows", type: "textarea", placeholder: "x,y,z per line" }];
  }
  if (["contingency", "chi-ind", "chi-gof", "fisher", "mcnemar", "cronbach", "friedman", "pca", "efa", "cfa", "lda", "cca", "mlr", "log-reg", "tobit", "chart-heatmap", "chart-radar"].includes(engine)) {
    const extra =
      engine === "chi-gof"
        ? [{ name: "expected", label: "Expected (optional)", type: "textarea" as const }]
        : [];
    return [
      {
        name: "data",
        label: "Matrix / table",
        type: "textarea",
        placeholder: "Rows of numbers (comma or space separated)",
      },
      ...extra,
    ];
  }
  if (engine === "one-sample-t") {
    return [dataField, { name: "mu0", label: "Hypothesized mean μ₀", type: "number", defaultValue: "0" }, alphaField, altField];
  }
  if (engine === "one-sample-z") {
    return [
      dataField,
      { name: "mu0", label: "Hypothesized mean μ₀", type: "number", defaultValue: "0" },
      { name: "sigma", label: "Population σ", type: "number" },
      alphaField,
      altField,
    ];
  }
  if (["two-sample-t", "mann-whitney", "permutation", "ci-diff-means", "levene", "kruskal", "one-way-anova", "welch-anova", "tukey", "scheffe", "dunnett", "games-howell", "dunn", "two-way-anova", "three-way-anova", "rm-anova", "ancova", "manova"].includes(engine)) {
    return [
      groupsField,
      ...(engine === "two-sample-t" || engine === "ci-diff-means"
        ? [
            {
              name: "equalVar",
              label: "Equal variances",
              type: "select" as const,
              options: [
                { value: "true", label: "Yes (pooled)" },
                { value: "false", label: "No (Welch)" },
              ],
              defaultValue: "true",
            },
          ]
        : []),
      alphaField,
      altField,
    ];
  }
  if (engine === "two-sample-z") {
    return [
      { name: "dataA", label: "Sample A", type: "textarea" },
      { name: "dataB", label: "Sample B", type: "textarea" },
      { name: "sigma1", label: "σ₁", type: "number" },
      { name: "sigma2", label: "σ₂", type: "number" },
      alphaField,
      altField,
    ];
  }
  if (["paired-t", "wilcoxon"].includes(engine)) {
    return [pairedField, alphaField, altField];
  }
  if (["one-prop-z", "binomial-test"].includes(engine)) {
    return [
      { name: "successes", label: "Successes", type: "number" },
      { name: "n", label: "n", type: "number" },
      { name: "p0", label: "Null proportion p₀", type: "number", defaultValue: "0.5" },
      alphaField,
      altField,
    ];
  }
  if (["two-prop-z", "ab-test", "ci-diff-props"].includes(engine)) {
    return [
      { name: "x1", label: "Successes group 1", type: "number" },
      { name: "n1", label: "n₁", type: "number" },
      { name: "x2", label: "Successes group 2", type: "number" },
      { name: "n2", label: "n₂", type: "number" },
      alphaField,
      altField,
      ...(engine === "ci-diff-props" ? [levelField] : []),
    ];
  }
  if (engine === "ci-prop") {
    return [
      { name: "successes", label: "Successes", type: "number" },
      { name: "n", label: "n", type: "number" },
      levelField,
    ];
  }
  if (engine === "response-rate") {
    return [
      { name: "responses", label: "Responses", type: "number" },
      { name: "invited", label: "Invited", type: "number" },
    ];
  }
  if (engine === "process-cap") {
    return [
      dataField,
      { name: "lsl", label: "LSL", type: "number" },
      { name: "usl", label: "USL", type: "number" },
    ];
  }
  if (engine === "irr") return [pairedField];
  if (engine === "pvalue") {
    return [
      { name: "statistic", label: "Test statistic", type: "number" },
      {
        name: "distribution",
        label: "Distribution",
        type: "select",
        options: [
          { value: "z", label: "Z" },
          { value: "t", label: "t" },
          { value: "chi", label: "Chi-square" },
          { value: "f", label: "F" },
        ],
        defaultValue: "z",
      },
      { name: "df", label: "df", type: "number" },
      { name: "df1", label: "df1 (F)", type: "number" },
      { name: "df2", label: "df2 (F)", type: "number" },
      altField,
    ];
  }
  if (engine === "critical") {
    return [
      {
        name: "distribution",
        label: "Distribution",
        type: "select",
        options: [
          { value: "z", label: "Z" },
          { value: "t", label: "t" },
          { value: "chi", label: "Chi-square" },
          { value: "f", label: "F" },
        ],
        defaultValue: "z",
      },
      alphaField,
      altField,
      { name: "df", label: "df", type: "number" },
      { name: "df1", label: "df1", type: "number" },
      { name: "df2", label: "df2", type: "number" },
    ];
  }
  if (engine === "effect-size") {
    return [
      { name: "dataA", label: "Group A (or one sample in Data)", type: "textarea" },
      { name: "dataB", label: "Group B", type: "textarea" },
      dataField,
      { name: "mu0", label: "μ₀ (one-sample)", type: "number", defaultValue: "0" },
    ];
  }
  if (["sample-size", "survey-n"].includes(engine)) {
    return [
      {
        name: "kind",
        label: "Type",
        type: "select",
        options: [
          { value: "mean", label: "Mean" },
          { value: "proportion", label: "Proportion" },
        ],
        defaultValue: engine === "survey-n" ? "proportion" : "mean",
      },
      { name: "sd", label: "SD", type: "number", defaultValue: "1" },
      { name: "delta", label: "Detectable difference", type: "number", defaultValue: "0.5" },
      { name: "p", label: "Proportion p", type: "number", defaultValue: "0.5" },
      { name: "moe", label: "Margin of error", type: "number", defaultValue: "0.05" },
      { name: "power", label: "Power", type: "number", defaultValue: "0.8" },
      alphaField,
    ];
  }
  if (engine === "moe") {
    return [
      {
        name: "kind",
        label: "Type",
        type: "select",
        options: [
          { value: "mean", label: "Mean" },
          { value: "proportion", label: "Proportion" },
        ],
        defaultValue: "proportion",
      },
      { name: "n", label: "n", type: "number" },
      { name: "sd", label: "SD", type: "number", defaultValue: "1" },
      { name: "p", label: "p", type: "number", defaultValue: "0.5" },
      levelField,
    ];
  }
  if (engine === "basic-prob") {
    return [
      { name: "pA", label: "P(A)", type: "number" },
      { name: "pB", label: "P(B)", type: "number" },
      { name: "pAandB", label: "P(A∩B) optional", type: "number" },
    ];
  }
  if (engine === "chart-bell" || engine === "dist-normal" || engine === "dist-invnorm") {
    return [
      { name: "x", label: "x", type: "number", defaultValue: "0" },
      { name: "mean", label: "Mean", type: "number", defaultValue: "0" },
      { name: "sd", label: "SD", type: "number", defaultValue: "1" },
      ...(engine === "dist-invnorm" ? [{ name: "p", label: "Probability p", type: "number", defaultValue: "0.975" } as FieldDef] : []),
    ];
  }
  if (engine === "dist-t") return [{ name: "x", label: "x", type: "number" }, { name: "df", label: "df", type: "number", defaultValue: "10" }];
  if (engine === "dist-chi") return [{ name: "x", label: "x", type: "number" }, { name: "df", label: "df", type: "number", defaultValue: "5" }];
  if (engine === "dist-f") {
    return [
      { name: "x", label: "x", type: "number" },
      { name: "df1", label: "df1", type: "number", defaultValue: "3" },
      { name: "df2", label: "df2", type: "number", defaultValue: "20" },
    ];
  }
  if (engine === "dist-binom") {
    return [
      { name: "k", label: "k", type: "number" },
      { name: "n", label: "n", type: "number" },
      { name: "p", label: "p", type: "number", defaultValue: "0.5" },
    ];
  }
  if (engine === "dist-pois") {
    return [
      { name: "k", label: "k", type: "number" },
      { name: "lambda", label: "λ", type: "number", defaultValue: "3" },
    ];
  }
  if (engine === "dist-geom") {
    return [
      { name: "k", label: "k (trial of first success)", type: "number" },
      { name: "p", label: "p", type: "number", defaultValue: "0.5" },
    ];
  }
  if (engine === "dist-nbinom") {
    return [
      { name: "k", label: "k", type: "number" },
      { name: "r", label: "r successes", type: "number", defaultValue: "2" },
      { name: "p", label: "p", type: "number", defaultValue: "0.5" },
    ];
  }
  if (engine === "dist-hyper") {
    return [
      { name: "k", label: "k", type: "number" },
      { name: "N", label: "N", type: "number" },
      { name: "K", label: "K", type: "number" },
      { name: "n", label: "n", type: "number" },
    ];
  }
  if (engine === "dist-exp") {
    return [
      { name: "x", label: "x", type: "number" },
      { name: "rate", label: "Rate λ", type: "number", defaultValue: "1" },
    ];
  }
  if (engine === "dist-gamma") {
    return [
      { name: "x", label: "x", type: "number" },
      { name: "shape", label: "Shape", type: "number", defaultValue: "2" },
      { name: "scale", label: "Scale", type: "number", defaultValue: "1" },
    ];
  }
  if (engine === "dist-beta") {
    return [
      { name: "x", label: "x (0-1)", type: "number" },
      { name: "alpha", label: "α", type: "number", defaultValue: "2" },
      { name: "beta", label: "β", type: "number", defaultValue: "2" },
    ];
  }
  if (engine === "dist-unif") {
    return [
      { name: "x", label: "x", type: "number" },
      { name: "a", label: "a", type: "number", defaultValue: "0" },
      { name: "b", label: "b", type: "number", defaultValue: "1" },
    ];
  }
  if (engine === "dist-weibull") {
    return [
      { name: "x", label: "x", type: "number" },
      { name: "scale", label: "Scale", type: "number", defaultValue: "1" },
      { name: "shape", label: "Shape", type: "number", defaultValue: "1.5" },
    ];
  }
  if (engine === "dist-lognorm") {
    return [
      { name: "x", label: "x", type: "number" },
      { name: "mean", label: "μ (log)", type: "number", defaultValue: "0" },
      { name: "sd", label: "σ (log)", type: "number", defaultValue: "1" },
    ];
  }
  if (engine === "dist-logistic") {
    return [
      { name: "x", label: "x", type: "number" },
      { name: "mean", label: "Mean", type: "number", defaultValue: "0" },
      { name: "scale", label: "Scale", type: "number", defaultValue: "1" },
    ];
  }
  if (engine === "expected-value") {
    return [
      { name: "values", label: "Values", type: "textarea", placeholder: "1,2,3,4" },
      { name: "probs", label: "Probabilities", type: "textarea", placeholder: "0.1,0.2,0.3,0.4" },
    ];
  }
  if (engine === "rng") {
    return [
      { name: "n", label: "Count", type: "number", defaultValue: "10" },
      {
        name: "distribution",
        label: "Distribution",
        type: "select",
        options: [
          { value: "uniform", label: "Uniform" },
          { value: "normal", label: "Normal" },
        ],
        defaultValue: "uniform",
      },
      { name: "a", label: "Min a", type: "number", defaultValue: "0" },
      { name: "b", label: "Max b", type: "number", defaultValue: "1" },
      { name: "mean", label: "Mean", type: "number", defaultValue: "0" },
      { name: "sd", label: "SD", type: "number", defaultValue: "1" },
    ];
  }
  if (["km", "logrank", "cox"].includes(engine)) {
    return [
      {
        name: "data",
        label: "time,event[,group]",
        type: "textarea",
        placeholder: "12,1\n18,0\n25,1",
      },
    ];
  }
  if (engine === "did") {
    return [
      { name: "treatPre", label: "Treat pre", type: "number" },
      { name: "treatPost", label: "Treat post", type: "number" },
      { name: "ctrlPre", label: "Control pre", type: "number" },
      { name: "ctrlPost", label: "Control post", type: "number" },
    ];
  }
  if (engine === "randomize") {
    return [
      { name: "n", label: "Units", type: "number", defaultValue: "20" },
      { name: "arms", label: "Arms", type: "number", defaultValue: "2" },
    ];
  }
  if (engine === "flow-chart") return [];

  // CalculatorSoup stats extras
  if (["variance-only", "stddev-only"].includes(engine)) return [dataField, sampleField];
  if (["quartile", "iqr-only", "mean-only"].includes(engine)) return [dataField];
  if (engine === "coin-flip") {
    return [{ name: "n", label: "Number of flips", type: "number", defaultValue: "10" }];
  }
  if (engine === "pin-gen") {
    return [
      { name: "digits", label: "Digits", type: "number", defaultValue: "4" },
      { name: "count", label: "How many PINs", type: "number", defaultValue: "1" },
      {
        name: "repeats",
        label: "Allow repeated digits",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
        defaultValue: "yes",
      },
    ];
  }
  if (["rng-range", "rng-1-10", "rng-1-100"].includes(engine)) {
    const fixed =
      engine === "rng-1-10"
        ? [
            { name: "min", label: "Minimum", type: "number" as const, defaultValue: "1" },
            { name: "max", label: "Maximum", type: "number" as const, defaultValue: "10" },
          ]
        : engine === "rng-1-100"
          ? [
              { name: "min", label: "Minimum", type: "number" as const, defaultValue: "1" },
              { name: "max", label: "Maximum", type: "number" as const, defaultValue: "100" },
            ]
          : [
              { name: "min", label: "Minimum", type: "number" as const, defaultValue: "1" },
              { name: "max", label: "Maximum", type: "number" as const, defaultValue: "100" },
            ];
    return [
      ...fixed,
      { name: "n", label: "How many numbers", type: "number", defaultValue: "1" },
      {
        name: "unique",
        label: "Unique values",
        type: "select",
        options: [
          { value: "no", label: "Allow repeats" },
          { value: "yes", label: "Unique only" },
        ],
        defaultValue: "no",
      },
      {
        name: "sort",
        label: "Sort output",
        type: "select",
        options: [
          { value: "no", label: "No" },
          { value: "yes", label: "Yes" },
        ],
        defaultValue: "no",
      },
    ];
  }
  if (engine === "random-names") {
    return [
      { name: "names", label: "Names (one per line or comma-separated)", type: "textarea", placeholder: "Ada\nGrace\nAlan" },
      { name: "picks", label: "How many to pick", type: "number", defaultValue: "1" },
      {
        name: "repeats",
        label: "Allow repeats",
        type: "select",
        options: [
          { value: "no", label: "No" },
          { value: "yes", label: "Yes" },
        ],
        defaultValue: "no",
      },
    ];
  }
  if (engine === "random-cards") {
    return [{ name: "n", label: "Cards to draw", type: "number", defaultValue: "5" }];
  }
  if (engine === "random-letters") {
    return [
      { name: "n", label: "How many sets", type: "number", defaultValue: "5" },
      { name: "length", label: "Letters per set", type: "number", defaultValue: "3" },
      {
        name: "case",
        label: "Case",
        type: "select",
        options: [
          { value: "upper", label: "Uppercase" },
          { value: "lower", label: "Lowercase" },
        ],
        defaultValue: "upper",
      },
    ];
  }
  if (["char-count", "word-count"].includes(engine)) {
    return [{ name: "text", label: "Text", type: "textarea", placeholder: "Paste text here" }];
  }
  if (engine === "grade-weighted") {
    return [
      {
        name: "data",
        label: "score, weight% (one per line)",
        type: "textarea",
        placeholder: "92, 20\n85, 30\n88, 50",
      },
    ];
  }
  if (engine === "final-grade") {
    return [
      { name: "current", label: "Current grade", type: "number", defaultValue: "85" },
      { name: "desired", label: "Desired course grade", type: "number", defaultValue: "90" },
      { name: "finalWeight", label: "Final exam weight %", type: "number", defaultValue: "20" },
    ];
  }
  if (engine === "gpa") {
    return [
      {
        name: "data",
        label: "letter, credits (one per line)",
        type: "textarea",
        placeholder: "A, 3\nB+, 4\nA-, 3",
      },
    ];
  }

  // Math core
  if (engine === "percentage") {
    return [
      {
        name: "mode",
        label: "Mode",
        type: "select",
        options: [
          { value: "of", label: "What is p% of x?" },
          { value: "is", label: "x is what % of y?" },
        ],
        defaultValue: "of",
      },
      { name: "percent", label: "Percent p", type: "number", defaultValue: "20" },
      { name: "of", label: "Base value x", type: "number", defaultValue: "50" },
      { name: "part", label: "Part (for is-mode)", type: "number", defaultValue: "10" },
      { name: "whole", label: "Whole (for is-mode)", type: "number", defaultValue: "50" },
    ];
  }
  if (engine === "percent-change") {
    return [
      { name: "from", label: "From", type: "number", defaultValue: "100" },
      { name: "to", label: "To", type: "number", defaultValue: "125" },
    ];
  }
  if (engine === "percent-difference") {
    return [
      { name: "a", label: "Value A", type: "number", defaultValue: "40" },
      { name: "b", label: "Value B", type: "number", defaultValue: "50" },
    ];
  }
  if (["percent-increase", "percent-decrease"].includes(engine)) {
    return [
      { name: "value", label: "Original value", type: "number", defaultValue: "100" },
      { name: "percent", label: "Percent", type: "number", defaultValue: "10" },
    ];
  }
  if (engine === "percent-tolerance") {
    return [
      { name: "nominal", label: "Nominal value", type: "number", defaultValue: "100" },
      { name: "measured", label: "Measured value", type: "number", defaultValue: "102" },
      { name: "tolerance", label: "Tolerance %", type: "number", defaultValue: "5" },
    ];
  }
  if (["decimal-to-percent", "percent-to-decimal", "percent-to-fraction"].includes(engine)) {
    return [{ name: "value", label: "Value", type: "number", defaultValue: engine === "decimal-to-percent" ? "0.25" : "25" }];
  }
  if (engine === "fraction-to-percent") {
    return [
      { name: "num", label: "Numerator", type: "number", defaultValue: "1" },
      { name: "den", label: "Denominator", type: "number", defaultValue: "4" },
    ];
  }
  if (engine === "factorial") {
    return [{ name: "n", label: "n", type: "number", defaultValue: "5" }];
  }
  if (["combinations", "combinations-rep", "permutations", "permutations-rep"].includes(engine)) {
    return [
      { name: "n", label: "n", type: "number", defaultValue: "10" },
      { name: "r", label: "r", type: "number", defaultValue: "3" },
    ];
  }
  if (engine === "permutations-circular") {
    return [{ name: "n", label: "n", type: "number", defaultValue: "5" }];
  }
  if (engine === "fibonacci") {
    return [{ name: "n", label: "Number of terms", type: "number", defaultValue: "10" }];
  }
  if (engine === "pascal-triangle") {
    return [{ name: "rows", label: "Rows", type: "number", defaultValue: "6" }];
  }
  if (["abs-value", "square", "cube", "square-root", "cube-root"].includes(engine)) {
    return [{ name: "x", label: "x", type: "number", defaultValue: "9" }];
  }
  if (engine === "abs-diff") {
    return [
      { name: "a", label: "A", type: "number", defaultValue: "12" },
      { name: "b", label: "B", type: "number", defaultValue: "5" },
    ];
  }
  if (engine === "nth-root") {
    return [
      { name: "x", label: "x", type: "number", defaultValue: "81" },
      { name: "n", label: "Root n", type: "number", defaultValue: "4" },
    ];
  }
  if (engine === "exponent") {
    return [
      { name: "base", label: "Base", type: "number", defaultValue: "2" },
      { name: "exp", label: "Exponent", type: "number", defaultValue: "8" },
    ];
  }
  if (engine === "quadratic") {
    return [
      { name: "a", label: "a", type: "number", defaultValue: "1" },
      { name: "b", label: "b", type: "number", defaultValue: "-3" },
      { name: "c", label: "c", type: "number", defaultValue: "2" },
    ];
  }

  const extra = fieldsExtra(engine);
  if (extra) return extra;
  const extra2 = fieldsExtra2(engine);
  if (extra2) return extra2;
  const adv = fieldsAdv(engine);
  if (adv) return adv;

  // fallback
  return [dataField];
}

/**
 * Smoke-test every calculator engine with representative inputs.
 * Run: node --experimental-strip-types scripts/test-engines.mjs
 */
import { calculators } from "../src/lib/calculators/registry.ts";
import { runEngine } from "../src/lib/calculators/runEngine.ts";

const samples = {
  data: "2, 4, 6, 8, 10, 12, 14",
  dataA: "10, 12, 14, 15, 16",
  dataB: "8, 9, 11, 12, 13",
  paired: "10,8\n12,9\n14,11\n15,12\n16,13",
  groups: "A: 10,12,14,15,16\nB: 8,9,11,12,13\nC: 7,8,9,10,11",
  matrix2x2: "10,5\n3,12",
  matrixGof: "10,20,30",
  expected: "15,20,25",
  contingency: "10,5,3\n4,8,6\n2,3,9",
  xy: "1,2\n2,3\n3,5\n4,7\n5,8",
  xyz: "1,2,3\n2,3,4\n3,5,5\n4,7,6\n5,8,7",
  mlr: "5,1,2\n7,2,3\n8,3,3\n10,4,5\n12,5,6",
  survival: "12,1\n18,0\n25,1\n30,1\n40,0",
  likert: "1,2,3,4,5,4,3,2,1,5",
  cronbach: "4,5,4\n3,4,3\n5,5,4\n2,3,2\n4,4,5",
  pca: "1,2,3\n2,3,4\n3,4,5\n4,5,6\n5,6,7\n2,1,3\n3,2,4",
  friedman: "1,2,3\n2,3,4\n3,1,2\n4,3,5\n2,2,3",
};

function inputFor(engine) {
  const base = {};
  const set = (obj) => Object.assign(base, obj);

  // descriptive / chart paste
  if (
    [
      "mean-median-mode",
      "descriptive-full",
      "five-number",
      "range-var-sd",
      "cv",
      "mad",
      "medad",
      "geomean",
      "harmean",
      "skewness",
      "kurtosis",
      "freq-table",
      "likert",
      "std-error",
      "normality",
      "outliers",
      "ci-mean",
      "ci-sd",
      "percentile",
      "zscore",
    ].includes(engine) ||
    engine.startsWith("chart-")
  ) {
    set({ data: samples.data, percentile: "75", mean: "0", sd: "1" });
    if (engine === "chart-bell") set({ mean: "100", sd: "15" });
    if (["chart-scatter", "chart-ba", "chart-slope", "chart-bubble"].includes(engine)) {
      set({ data: samples.xy });
    }
    return base;
  }

  if (["correlation", "covariance", "ci-corr", "slr", "quad-reg", "exp-reg", "poly-reg"].includes(engine)) {
    // exp-reg needs positive y
    return { data: engine === "exp-reg" ? "1,2\n2,4\n3,8\n4,16\n5,32" : samples.xy };
  }
  if (engine === "partial-corr") return { data: samples.xyz };
  if (["contingency", "chi-ind", "fisher", "mcnemar"].includes(engine)) return { data: samples.matrix2x2 };
  if (engine === "chi-gof") return { data: samples.matrixGof, expected: samples.expected };
  if (["cronbach", "pca", "efa", "cfa", "lda", "cca", "friedman", "mlr", "log-reg", "tobit"].includes(engine)) {
    if (engine === "cronbach") return { data: samples.cronbach };
    if (engine === "friedman") return { data: samples.friedman };
    if (["mlr", "log-reg", "tobit"].includes(engine)) return { data: samples.mlr };
    return { data: samples.pca };
  }
  if (engine === "one-sample-t") return { data: samples.data, mu0: "8", alpha: "0.05", alternative: "two-sided" };
  if (engine === "one-sample-z") return { data: samples.data, mu0: "8", sigma: "3", alpha: "0.05", alternative: "two-sided" };
  if (
    [
      "two-sample-t",
      "mann-whitney",
      "permutation",
      "ci-diff-means",
      "levene",
      "kruskal",
      "one-way-anova",
      "welch-anova",
      "tukey",
      "scheffe",
      "dunnett",
      "games-howell",
      "dunn",
      "two-way-anova",
      "three-way-anova",
      "rm-anova",
      "ancova",
      "manova",
    ].includes(engine)
  ) {
    return { data: samples.groups, equalVar: "true", alpha: "0.05", alternative: "two-sided" };
  }
  if (engine === "two-sample-z") {
    return { dataA: samples.dataA, dataB: samples.dataB, sigma1: "2", sigma2: "2", alpha: "0.05", alternative: "two-sided" };
  }
  if (["paired-t", "wilcoxon", "irr"].includes(engine)) return { data: samples.paired, alpha: "0.05", alternative: "two-sided" };
  if (["one-prop-z", "binomial-test"].includes(engine)) {
    return { successes: "45", n: "100", p0: "0.5", alpha: "0.05", alternative: "two-sided" };
  }
  if (["two-prop-z", "ab-test", "ci-diff-props"].includes(engine)) {
    return { x1: "45", n1: "100", x2: "30", n2: "100", alpha: "0.05", alternative: "two-sided", level: "0.95" };
  }
  if (engine === "ci-prop") return { successes: "45", n: "100", level: "0.95" };
  if (engine === "response-rate") return { responses: "80", invited: "200" };
  if (engine === "process-cap") return { data: samples.data, lsl: "0", usl: "20" };
  if (engine === "pvalue") return { statistic: "1.96", distribution: "z", alternative: "two-sided" };
  if (engine === "critical") return { distribution: "z", alpha: "0.05", alternative: "two-sided" };
  if (engine === "effect-size") return { dataA: samples.dataA, dataB: samples.dataB };
  if (["sample-size", "survey-n"].includes(engine)) {
    return { kind: "proportion", p: "0.5", moe: "0.05", alpha: "0.05", power: "0.8", sd: "1", delta: "0.5" };
  }
  if (engine === "moe") return { kind: "proportion", n: "400", p: "0.5", level: "0.95" };
  if (engine === "basic-prob") return { pA: "0.3", pB: "0.4", pAandB: "0.1" };
  if (["dist-normal", "dist-invnorm"].includes(engine)) return { x: "1.96", mean: "0", sd: "1", p: "0.975" };
  if (engine === "dist-t") return { x: "2", df: "10" };
  if (engine === "dist-chi") return { x: "5", df: "3" };
  if (engine === "dist-f") return { x: "3", df1: "3", df2: "20" };
  if (engine === "dist-binom") return { k: "3", n: "10", p: "0.5" };
  if (engine === "dist-pois") return { k: "2", lambda: "3" };
  if (engine === "dist-geom") return { k: "3", p: "0.4" };
  if (engine === "dist-nbinom") return { k: "5", r: "2", p: "0.4" };
  if (engine === "dist-hyper") return { k: "2", N: "50", K: "10", n: "5" };
  if (engine === "dist-exp") return { x: "1", rate: "1" };
  if (engine === "dist-gamma") return { x: "2", shape: "2", scale: "1" };
  if (engine === "dist-beta") return { x: "0.4", alpha: "2", beta: "2" };
  if (engine === "dist-unif") return { x: "0.5", a: "0", b: "1" };
  if (engine === "dist-weibull") return { x: "1", scale: "1", shape: "1.5" };
  if (engine === "dist-lognorm") return { x: "1", mean: "0", sd: "1" };
  if (engine === "dist-logistic") return { x: "0", mean: "0", scale: "1" };
  if (engine === "expected-value") return { values: "1,2,3,4", probs: "0.1,0.2,0.3,0.4" };
  if (engine === "rng") return { n: "5", distribution: "uniform", a: "0", b: "1" };
  if (["km", "logrank", "cox"].includes(engine)) return { data: samples.survival };
  if (engine === "did") return { treatPre: "10", treatPost: "15", ctrlPre: "9", ctrlPost: "11" };
  if (["iv", "rdd", "panel", "crossover", "factorial", "vintage"].includes(engine)) {
    return { data: samples.mlr };
  }
  if (engine === "randomize") return { n: "10", arms: "2" };
  if (engine === "flow-chart") return {};
  return { data: samples.data };
}

const byEngine = new Map();
for (const c of calculators) {
  if (!byEngine.has(c.engine)) byEngine.set(c.engine, []);
  byEngine.get(c.engine).push(c);
}

const failures = [];
const successes = [];

for (const [engine, calcs] of byEngine) {
  const input = inputFor(engine);
  let result;
  try {
    result = runEngine(engine, input);
  } catch (e) {
    failures.push({
      engine,
      pages: calcs.map((c) => `${c.category}/${c.slug}`),
      error: e instanceof Error ? e.message : String(e),
    });
    continue;
  }
  if (result.error) {
    failures.push({
      engine,
      pages: calcs.map((c) => `${c.category}/${c.slug}`),
      error: result.error,
    });
  } else if (!result.fields?.length) {
    failures.push({
      engine,
      pages: calcs.map((c) => `${c.category}/${c.slug}`),
      error: "No result fields returned",
    });
  } else {
    successes.push({
      engine,
      pages: calcs.length,
      sampleField: `${result.fields[0].label}=${result.fields[0].value}`,
    });
  }
}

console.log(
  JSON.stringify(
    {
      engines: byEngine.size,
      calculators: calculators.length,
      passed: successes.length,
      failed: failures.length,
      failures,
    },
    null,
    2,
  ),
);

process.exit(failures.length ? 1 : 0);

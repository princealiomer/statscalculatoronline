import jStat from "jstat";
import { mean, stdev, variance } from "./descriptive";

export type Alternative = "two-sided" | "less" | "greater";

export function pFromT(t: number, df: number, alt: Alternative): number {
  if (alt === "two-sided") {
    return 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));
  }
  if (alt === "greater") return 1 - jStat.studentt.cdf(t, df);
  return jStat.studentt.cdf(t, df);
}

export function pFromZ(z: number, alt: Alternative): number {
  if (alt === "two-sided") return 2 * (1 - jStat.normal.cdf(Math.abs(z), 0, 1));
  if (alt === "greater") return 1 - jStat.normal.cdf(z, 0, 1);
  return jStat.normal.cdf(z, 0, 1);
}

export function oneSampleT(
  data: number[],
  mu0: number,
  alt: Alternative = "two-sided",
  alpha = 0.05,
) {
  const n = data.length;
  const m = mean(data);
  const s = stdev(data, true);
  const se = s / Math.sqrt(n);
  const t = (m - mu0) / se;
  const df = n - 1;
  const p = pFromT(t, df, alt);
  const crit =
    alt === "two-sided"
      ? jStat.studentt.inv(1 - alpha / 2, df)
      : jStat.studentt.inv(1 - alpha, df);
  const moe = crit * se;
  const ci =
    alt === "two-sided"
      ? ([m - moe, m + moe] as const)
      : alt === "greater"
        ? ([m - moe, Infinity] as const)
        : ([-Infinity, m + moe] as const);
  const d = s === 0 ? 0 : (m - mu0) / s;
  return { n, mean: m, sd: s, se, t, df, p, ci, d, alpha, reject: p < alpha };
}

export function oneSampleZ(
  data: number[],
  mu0: number,
  sigma: number,
  alt: Alternative = "two-sided",
  alpha = 0.05,
) {
  const n = data.length;
  const m = mean(data);
  const se = sigma / Math.sqrt(n);
  const z = (m - mu0) / se;
  const p = pFromZ(z, alt);
  const crit =
    alt === "two-sided"
      ? jStat.normal.inv(1 - alpha / 2, 0, 1)
      : jStat.normal.inv(1 - alpha, 0, 1);
  const moe = crit * se;
  return {
    n,
    mean: m,
    se,
    z,
    p,
    ci: [m - moe, m + moe] as const,
    alpha,
    reject: p < alpha,
  };
}

export function pairedT(
  x: number[],
  y: number[],
  alt: Alternative = "two-sided",
  alpha = 0.05,
) {
  const n = Math.min(x.length, y.length);
  const d = Array.from({ length: n }, (_, i) => x[i] - y[i]);
  return { ...oneSampleT(d, 0, alt, alpha), differences: d };
}

export function twoSampleT(
  a: number[],
  b: number[],
  equalVar: boolean,
  alt: Alternative = "two-sided",
  alpha = 0.05,
) {
  const n1 = a.length;
  const n2 = b.length;
  const m1 = mean(a);
  const m2 = mean(b);
  const s1 = stdev(a, true);
  const s2 = stdev(b, true);
  let se: number;
  let df: number;
  let t: number;
  if (equalVar) {
    const sp = Math.sqrt(
      ((n1 - 1) * s1 ** 2 + (n2 - 1) * s2 ** 2) / (n1 + n2 - 2),
    );
    se = sp * Math.sqrt(1 / n1 + 1 / n2);
    df = n1 + n2 - 2;
    t = (m1 - m2) / se;
  } else {
    se = Math.sqrt(s1 ** 2 / n1 + s2 ** 2 / n2);
    const num = (s1 ** 2 / n1 + s2 ** 2 / n2) ** 2;
    const den =
      (s1 ** 2 / n1) ** 2 / (n1 - 1) + (s2 ** 2 / n2) ** 2 / (n2 - 2);
    df = num / den;
    t = (m1 - m2) / se;
  }
  const p = pFromT(t, df, alt);
  const crit = jStat.studentt.inv(1 - alpha / 2, df);
  const moe = crit * se;
  const pooled = equalVar
    ? Math.sqrt(((n1 - 1) * s1 ** 2 + (n2 - 1) * s2 ** 2) / (n1 + n2 - 2))
    : Math.sqrt((s1 ** 2 + s2 ** 2) / 2);
  const d = pooled === 0 ? 0 : (m1 - m2) / pooled;
  return {
    n1,
    n2,
    m1,
    m2,
    s1,
    s2,
    se,
    t,
    df,
    p,
    ci: [m1 - m2 - moe, m1 - m2 + moe] as const,
    d,
    alpha,
    reject: p < alpha,
    equalVar,
  };
}

export function twoSampleZ(
  a: number[],
  b: number[],
  sigma1: number,
  sigma2: number,
  alt: Alternative = "two-sided",
  alpha = 0.05,
) {
  const n1 = a.length;
  const n2 = b.length;
  const m1 = mean(a);
  const m2 = mean(b);
  const se = Math.sqrt(sigma1 ** 2 / n1 + sigma2 ** 2 / n2);
  const z = (m1 - m2) / se;
  const p = pFromZ(z, alt);
  return { n1, n2, m1, m2, se, z, p, alpha, reject: p < alpha };
}

export function oneWayAnova(groups: number[][]) {
  const k = groups.length;
  const ns = groups.map((g) => g.length);
  const N = ns.reduce((a, b) => a + b, 0);
  const means = groups.map(mean);
  const grand =
    groups.flat().reduce((a, b) => a + b, 0) / N;
  const ssb = means.reduce((s, m, i) => s + ns[i] * (m - grand) ** 2, 0);
  const ssw = groups.reduce(
    (s, g, i) => s + g.reduce((ss, x) => ss + (x - means[i]) ** 2, 0),
    0,
  );
  const dfb = k - 1;
  const dfw = N - k;
  const msb = ssb / dfb;
  const msw = ssw / dfw;
  const F = msb / msw;
  const p = 1 - jStat.centralF.cdf(F, dfb, dfw);
  return { k, N, means, grand, ssb, ssw, dfb, dfw, msb, msw, F, p };
}

export function oneProportionZ(
  successes: number,
  n: number,
  p0: number,
  alt: Alternative = "two-sided",
  alpha = 0.05,
) {
  const phat = successes / n;
  const se = Math.sqrt((p0 * (1 - p0)) / n);
  const z = (phat - p0) / se;
  const p = pFromZ(z, alt);
  return { phat, se, z, p, alpha, reject: p < alpha, n, successes };
}

export function twoProportionZ(
  x1: number,
  n1: number,
  x2: number,
  n2: number,
  alt: Alternative = "two-sided",
  alpha = 0.05,
) {
  const p1 = x1 / n1;
  const p2 = x2 / n2;
  const pPool = (x1 + x2) / (n1 + n2);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2));
  const z = (p1 - p2) / se;
  const p = pFromZ(z, alt);
  return { p1, p2, pPool, se, z, p, alpha, reject: p < alpha };
}

export function chiSquareGof(observed: number[], expected?: number[]) {
  const n = observed.reduce((a, b) => a + b, 0);
  const exp =
    expected ?? observed.map(() => n / observed.length);
  const chi2 = observed.reduce(
    (s, o, i) => s + (o - exp[i]) ** 2 / exp[i],
    0,
  );
  const df = observed.length - 1;
  const p = 1 - jStat.chisquare.cdf(chi2, df);
  return { chi2, df, p, expected: exp, observed };
}

export function chiSquareIndependence(table: number[][]) {
  const rows = table.length;
  const cols = table[0].length;
  const rowSums = table.map((r) => r.reduce((a, b) => a + b, 0));
  const colSums = Array.from({ length: cols }, (_, j) =>
    table.reduce((s, r) => s + r[j], 0),
  );
  const N = rowSums.reduce((a, b) => a + b, 0);
  let chi2 = 0;
  const expected: number[][] = [];
  for (let i = 0; i < rows; i++) {
    expected[i] = [];
    for (let j = 0; j < cols; j++) {
      const e = (rowSums[i] * colSums[j]) / N;
      expected[i][j] = e;
      chi2 += (table[i][j] - e) ** 2 / e;
    }
  }
  const df = (rows - 1) * (cols - 1);
  const p = 1 - jStat.chisquare.cdf(chi2, df);
  return { chi2, df, p, expected, N };
}

function factorial(n: number): number {
  if (n < 0) return NaN;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export function fishersExact(a: number, b: number, c: number, d: number) {
  const n = a + b + c + d;
  const hyper = (x: number) =>
    (factorial(a + b) *
      factorial(c + d) *
      factorial(a + c) *
      factorial(b + d)) /
    (factorial(n) * factorial(x) * factorial(a + b - x) * factorial(a + c - x) * factorial(n - (a + b) - (a + c) + x));

  const pObs = hyper(a);
  let p = 0;
  const maxA = Math.min(a + b, a + c);
  for (let x = Math.max(0, a + b + c + d - (b + d) - (c + d)); x <= maxA; x++) {
    // iterate feasible table corners for fixed margins
  }
  // Two-sided Fisher using all tables with p <= pObs (fixed margins)
  const row1 = a + b;
  const col1 = a + c;
  const lo = Math.max(0, row1 + col1 - n);
  const hi = Math.min(row1, col1);
  for (let x = lo; x <= hi; x++) {
    const px =
      (factorial(row1) *
        factorial(n - row1) *
        factorial(col1) *
        factorial(n - col1)) /
      (factorial(n) *
        factorial(x) *
        factorial(row1 - x) *
        factorial(col1 - x) *
        factorial(n - row1 - col1 + x));
    if (px <= pObs + 1e-12) p += px;
  }
  return { p, oddsRatio: (a * d) / (b * c || 1) };
}

export function mannWhitney(a: number[], b: number[]) {
  const n1 = a.length;
  const n2 = b.length;
  const combined = [
    ...a.map((v) => ({ v, g: 1 })),
    ...b.map((v) => ({ v, g: 2 })),
  ].sort((x, y) => x.v - y.v);
  // average ranks for ties
  const ranks = new Array(combined.length);
  let i = 0;
  while (i < combined.length) {
    let j = i;
    while (j < combined.length && combined[j].v === combined[i].v) j++;
    const avg = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) ranks[k] = avg;
    i = j;
  }
  let R1 = 0;
  combined.forEach((item, idx) => {
    if (item.g === 1) R1 += ranks[idx];
  });
  const U1 = R1 - (n1 * (n1 + 1)) / 2;
  const U2 = n1 * n2 - U1;
  const U = Math.min(U1, U2);
  const mu = (n1 * n2) / 2;
  const sigma = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
  const z = (U - mu) / sigma;
  const p = 2 * (1 - jStat.normal.cdf(Math.abs(z), 0, 1));
  return { U, U1, U2, z, p, R1 };
}

export function wilcoxonSignedRank(x: number[], y?: number[]) {
  const d = y ? x.map((v, i) => v - y[i]) : x;
  const nonzero = d
    .map((v, i) => ({ v: Math.abs(v), sign: Math.sign(v), i }))
    .filter((o) => o.v !== 0)
    .sort((a, b) => a.v - b.v);
  const n = nonzero.length;
  const ranks = new Array(n);
  let i = 0;
  while (i < n) {
    let j = i;
    while (j < n && nonzero[j].v === nonzero[i].v) j++;
    const avg = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) ranks[k] = avg;
    i = j;
  }
  let Wplus = 0;
  let Wminus = 0;
  nonzero.forEach((o, idx) => {
    if (o.sign > 0) Wplus += ranks[idx];
    else Wminus += ranks[idx];
  });
  const W = Math.min(Wplus, Wminus);
  const mu = (n * (n + 1)) / 4;
  const sigma = Math.sqrt((n * (n + 1) * (2 * n + 1)) / 24);
  const z = (W - mu) / sigma;
  const p = 2 * (1 - jStat.normal.cdf(Math.abs(z), 0, 1));
  return { W, Wplus, Wminus, z, p, n };
}

export function kruskalWallis(groups: number[][]) {
  const flat = groups.flatMap((g, gi) => g.map((v) => ({ v, g: gi })));
  flat.sort((a, b) => a.v - b.v);
  const N = flat.length;
  const ranks = new Array(N);
  let i = 0;
  while (i < N) {
    let j = i;
    while (j < N && flat[j].v === flat[i].v) j++;
    const avg = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) ranks[k] = avg;
    i = j;
  }
  const k = groups.length;
  const R = Array(k).fill(0);
  flat.forEach((item, idx) => {
    R[item.g] += ranks[idx];
  });
  const ns = groups.map((g) => g.length);
  const H =
    (12 / (N * (N + 1))) *
      R.reduce((s, r, idx) => s + r ** 2 / ns[idx], 0) -
    3 * (N + 1);
  const df = k - 1;
  const p = 1 - jStat.chisquare.cdf(H, df);
  return { H, df, p, rankSums: R };
}

export function grubbsOutliers(data: number[], alpha = 0.05) {
  const n = data.length;
  const m = mean(data);
  const s = stdev(data, true);
  const indexed = data.map((v, i) => ({ v, i, g: Math.abs(v - m) / s }));
  indexed.sort((a, b) => b.g - a.g);
  const G = indexed[0].g;
  const tcrit = jStat.studentt.inv(1 - alpha / (2 * n), n - 2);
  const Gcrit =
    ((n - 1) / Math.sqrt(n)) *
    Math.sqrt(tcrit ** 2 / (n - 2 + tcrit ** 2));
  return {
    suspect: indexed[0],
    G,
    Gcrit,
    isOutlier: G > Gcrit,
    mean: m,
    sd: s,
  };
}

export function shapiroWilkApprox(data: number[]) {
  // Simplified normality diagnostic using skewness/kurtosis (Jarque–Bera)
  const n = data.length;
  const m = mean(data);
  const s = stdev(data, true);
  const m3 = data.reduce((a, x) => a + ((x - m) / s) ** 3, 0) / n;
  const m4 = data.reduce((a, x) => a + ((x - m) / s) ** 4, 0) / n;
  const JB = (n / 6) * (m3 ** 2 + ((m4 - 3) ** 2) / 4);
  const p = 1 - jStat.chisquare.cdf(JB, 2);
  return { JB, p, skewness: m3, kurtosis: m4 - 3, n };
}

export { variance };

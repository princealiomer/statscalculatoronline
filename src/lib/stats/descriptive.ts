import jStat from "jstat";

export function mean(arr: number[]) {
  return jStat.mean(arr);
}

export function median(arr: number[]) {
  return jStat.median(arr);
}

export function mode(arr: number[]): number[] {
  const freq = new Map<number, number>();
  for (const x of arr) freq.set(x, (freq.get(x) ?? 0) + 1);
  let max = 0;
  for (const c of freq.values()) max = Math.max(max, c);
  if (max <= 1) return [];
  return [...freq.entries()].filter(([, c]) => c === max).map(([v]) => v);
}

export function variance(arr: number[], sample = true) {
  return jStat.variance(arr, sample);
}

export function stdev(arr: number[], sample = true) {
  return jStat.stdev(arr, sample);
}

export function geometricMean(arr: number[]) {
  if (arr.some((x) => x <= 0)) throw new Error("Geometric mean requires positive values.");
  return Math.exp(mean(arr.map(Math.log)));
}

export function harmonicMean(arr: number[]) {
  if (arr.some((x) => x === 0)) throw new Error("Harmonic mean undefined for zero values.");
  return arr.length / arr.reduce((s, x) => s + 1 / x, 0);
}

export function mad(arr: number[]) {
  const m = mean(arr);
  return mean(arr.map((x) => Math.abs(x - m)));
}

export function medianAbsoluteDeviation(arr: number[]) {
  const med = median(arr);
  return median(arr.map((x) => Math.abs(x - med)));
}

export function range(arr: number[]) {
  return Math.max(...arr) - Math.min(...arr);
}

export function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

export function sumOfSquares(arr: number[]) {
  const m = mean(arr);
  return arr.reduce((a, x) => a + (x - m) ** 2, 0);
}

export function rootMeanSquare(arr: number[]) {
  return Math.sqrt(arr.reduce((a, x) => a + x * x, 0) / arr.length);
}

export function midrange(arr: number[]) {
  return (Math.min(...arr) + Math.max(...arr)) / 2;
}

export function percentile(arr: number[], p: number) {
  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;
  if (n === 1) return sorted[0];
  const idx = (p / 100) * (n - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

export function quartiles(arr: number[]) {
  return {
    q1: percentile(arr, 25),
    q2: percentile(arr, 50),
    q3: percentile(arr, 75),
    iqr: percentile(arr, 75) - percentile(arr, 25),
  };
}

export function iqrOutliers(arr: number[]) {
  const q = quartiles(arr);
  const lowerFence = q.q1 - 1.5 * q.iqr;
  const upperFence = q.q3 + 1.5 * q.iqr;
  const outliers = arr.filter((x) => x < lowerFence || x > upperFence);
  return { lowerFence, upperFence, outliers };
}

export function skewness(arr: number[], sample = true) {
  const n = arr.length;
  const m = mean(arr);
  const s = stdev(arr, sample);
  if (s === 0) return 0;
  if (!sample) {
    const m3 = arr.reduce((a, x) => a + (x - m) ** 3, 0) / n;
    return m3 / s ** 3;
  }
  // Bias-corrected sample skewness
  const g1 = arr.reduce((a, x) => a + ((x - m) / s) ** 3, 0);
  return (n / ((n - 1) * (n - 2))) * g1;
}

export function kurtosis(arr: number[], sample = true) {
  const n = arr.length;
  const m = mean(arr);
  const s = stdev(arr, sample);
  if (s === 0) return 3;
  if (!sample) {
    const m4 = arr.reduce((a, x) => a + (x - m) ** 4, 0) / n;
    return m4 / s ** 4;
  }
  const g2 = arr.reduce((a, x) => a + ((x - m) / s) ** 4, 0);
  return (n * (n + 1) / ((n - 1) * (n - 2) * (n - 3))) * g2;
}

export function kurtosisExcess(arr: number[], sample = true) {
  const n = arr.length;
  if (!sample) return kurtosis(arr, false) - 3;
  if (n < 4) return NaN;
  const m = mean(arr);
  const s = stdev(arr, true);
  if (s === 0) return 0;
  const g2 = arr.reduce((a, x) => a + ((x - m) / s) ** 4, 0);
  const term1 = (n * (n + 1) / ((n - 1) * (n - 2) * (n - 3))) * g2;
  const term2 = (3 * (n - 1) ** 2) / ((n - 2) * (n - 3));
  return term1 - term2;
}

export function zScores(arr: number[], sample = true) {
  const m = mean(arr);
  const s = stdev(arr, sample);
  return arr.map((x) => (s === 0 ? 0 : (x - m) / s));
}

export function cv(arr: number[], sample = true) {
  const m = mean(arr);
  if (m === 0) throw new Error("Coefficient of variation undefined when mean is 0.");
  return (stdev(arr, sample) / Math.abs(m)) * 100;
}

export function correlation(x: number[], y: number[]) {
  if (x.length !== y.length || x.length < 2) {
    throw new Error("Need equal-length series with at least 2 points.");
  }
  return jStat.corrcoeff(x, y);
}

export function covariance(x: number[], y: number[], sample = true) {
  if (x.length !== y.length || x.length < 2) {
    throw new Error("Need equal-length series with at least 2 points.");
  }
  const mx = mean(x);
  const my = mean(y);
  const n = x.length;
  let sumXY = 0;
  for (let i = 0; i < n; i++) sumXY += (x[i] - mx) * (y[i] - my);
  return sumXY / (sample ? n - 1 : n);
}

export function fiveNumberSummary(arr: number[]) {
  const q = quartiles(arr);
  return {
    min: Math.min(...arr),
    q1: q.q1,
    median: q.q2,
    q3: q.q3,
    max: Math.max(...arr),
  };
}

export function frequencyTable(arr: number[]) {
  const freq = new Map<number, number>();
  for (const x of arr) freq.set(x, (freq.get(x) ?? 0) + 1);
  const rows = [...freq.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([value, count]) => ({
      value,
      count,
      relative: count / arr.length,
    }));
  return rows;
}

export function fullDescriptive(arr: number[], sample = true) {
  const q = quartiles(arr);
  const fences = iqrOutliers(arr);
  const m = mean(arr);
  const s = stdev(arr, sample);
  const ss = sumOfSquares(arr);
  return {
    n: arr.length,
    sum: sum(arr),
    min: Math.min(...arr),
    max: Math.max(...arr),
    range: range(arr),
    mean: m,
    median: median(arr),
    mode: mode(arr),
    midrange: midrange(arr),
    variance: variance(arr, sample),
    stdev: s,
    sumOfSquares: ss,
    mad: mad(arr),
    rms: rootMeanSquare(arr),
    seMean: s / Math.sqrt(arr.length),
    q1: q.q1,
    q2: q.q2,
    q3: q.q3,
    iqr: q.iqr,
    lowerFence: fences.lowerFence,
    upperFence: fences.upperFence,
    outliers: fences.outliers,
    skewness: skewness(arr, sample),
    kurtosis: kurtosis(arr, sample),
    kurtosisExcess: kurtosisExcess(arr, sample),
    cv: m !== 0 ? (s / Math.abs(m)) * 100 : NaN,
    rsd: m !== 0 ? (s / Math.abs(m)) * 100 : NaN,
    frequency: frequencyTable(arr),
  };
}

export function basicStatistics(arr: number[], sample = true) {
  return {
    n: arr.length,
    sum: sum(arr),
    min: Math.min(...arr),
    max: Math.max(...arr),
    range: range(arr),
    mean: mean(arr),
    median: median(arr),
    mode: mode(arr),
    variance: variance(arr, sample),
    stdev: stdev(arr, sample),
  };
}

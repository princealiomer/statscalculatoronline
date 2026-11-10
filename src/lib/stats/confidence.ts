import jStat from "jstat";
import { mean, stdev, correlation } from "./descriptive";

export function meanCI(data: number[], level = 0.95) {
  const n = data.length;
  const m = mean(data);
  const s = stdev(data, true);
  const se = s / Math.sqrt(n);
  const alpha = 1 - level;
  const t = jStat.studentt.inv(1 - alpha / 2, n - 1);
  const moe = t * se;
  return { mean: m, se, moe, low: m - moe, high: m + moe, df: n - 1, level, n };
}

export function proportionCI(successes: number, n: number, level = 0.95) {
  const p = successes / n;
  const alpha = 1 - level;
  const z = jStat.normal.inv(1 - alpha / 2, 0, 1);
  const se = Math.sqrt((p * (1 - p)) / n);
  const moe = z * se;
  return { p, se, moe, low: p - moe, high: p + moe, level, n };
}

export function sdCI(data: number[], level = 0.95) {
  const n = data.length;
  const s = stdev(data, true);
  const alpha = 1 - level;
  const chiL = jStat.chisquare.inv(alpha / 2, n - 1);
  const chiU = jStat.chisquare.inv(1 - alpha / 2, n - 1);
  const low = Math.sqrt(((n - 1) * s ** 2) / chiU);
  const high = Math.sqrt(((n - 1) * s ** 2) / chiL);
  return { sd: s, low, high, level, n, df: n - 1 };
}

export function diffMeansCI(
  a: number[],
  b: number[],
  equalVar = true,
  level = 0.95,
) {
  const n1 = a.length;
  const n2 = b.length;
  const m1 = mean(a);
  const m2 = mean(b);
  const s1 = stdev(a, true);
  const s2 = stdev(b, true);
  let se: number;
  let df: number;
  if (equalVar) {
    const sp = Math.sqrt(
      ((n1 - 1) * s1 ** 2 + (n2 - 1) * s2 ** 2) / (n1 + n2 - 2),
    );
    se = sp * Math.sqrt(1 / n1 + 1 / n2);
    df = n1 + n2 - 2;
  } else {
    se = Math.sqrt(s1 ** 2 / n1 + s2 ** 2 / n2);
    df =
      (s1 ** 2 / n1 + s2 ** 2 / n2) ** 2 /
      ((s1 ** 2 / n1) ** 2 / (n1 - 1) + (s2 ** 2 / n2) ** 2 / (n2 - 1));
  }
  const alpha = 1 - level;
  const t = jStat.studentt.inv(1 - alpha / 2, df);
  const moe = t * se;
  const diff = m1 - m2;
  return { diff, se, moe, low: diff - moe, high: diff + moe, df, level };
}

export function diffPropsCI(
  x1: number,
  n1: number,
  x2: number,
  n2: number,
  level = 0.95,
) {
  const p1 = x1 / n1;
  const p2 = x2 / n2;
  const diff = p1 - p2;
  const se = Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2);
  const z = jStat.normal.inv(1 - (1 - level) / 2, 0, 1);
  const moe = z * se;
  return { diff, se, moe, low: diff - moe, high: diff + moe, level };
}

export function correlationCI(x: number[], y: number[], level = 0.95) {
  const r = correlation(x, y);
  const n = Math.min(x.length, y.length);
  const z = 0.5 * Math.log((1 + r) / (1 - r));
  const se = 1 / Math.sqrt(n - 3);
  const zcrit = jStat.normal.inv(1 - (1 - level) / 2, 0, 1);
  const lowZ = z - zcrit * se;
  const highZ = z + zcrit * se;
  const tanh = (v: number) => (Math.exp(2 * v) - 1) / (Math.exp(2 * v) + 1);
  return { r, low: tanh(lowZ), high: tanh(highZ), level, n };
}

export function marginOfError(opts: {
  kind: "mean" | "proportion";
  sd?: number;
  p?: number;
  n: number;
  level?: number;
}) {
  const level = opts.level ?? 0.95;
  const z = jStat.normal.inv(1 - (1 - level) / 2, 0, 1);
  if (opts.kind === "mean") {
    const sd = opts.sd ?? 1;
    return { moe: z * (sd / Math.sqrt(opts.n)), z, level };
  }
  const p = opts.p ?? 0.5;
  return { moe: z * Math.sqrt((p * (1 - p)) / opts.n), z, level };
}

import { mean, correlation, stdev } from "./descriptive";
import jStat from "jstat";

export function simpleLinearRegression(x: number[], y: number[]) {
  const n = Math.min(x.length, y.length);
  const xs = x.slice(0, n);
  const ys = y.slice(0, n);
  const mx = mean(xs);
  const my = mean(ys);
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    sxx += dx * dx;
    sxy += dx * dy;
    syy += dy * dy;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const r = correlation(xs, ys);
  const r2 = r ** 2;
  const residuals = ys.map((yi, i) => yi - (intercept + slope * xs[i]));
  const sse = residuals.reduce((s, e) => s + e * e, 0);
  const sst = syy;
  const mse = sse / (n - 2);
  const seSlope = Math.sqrt(mse / sxx);
  const t = slope / seSlope;
  const p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), n - 2));
  return {
    n,
    slope,
    intercept,
    r,
    r2,
    seSlope,
    t,
    p,
    mse,
    sse,
    sst,
    residuals,
    predict: (xv: number) => intercept + slope * xv,
  };
}

export function quadraticRegression(x: number[], y: number[]) {
  const n = Math.min(x.length, y.length);
  const xs = x.slice(0, n);
  const ys = y.slice(0, n);
  // Fit y = a + b x + c x^2 via normal equations
  let Sx = 0,
    Sx2 = 0,
    Sx3 = 0,
    Sx4 = 0,
    Sy = 0,
    Sxy = 0,
    Sx2y = 0;
  for (let i = 0; i < n; i++) {
    const xi = xs[i];
    const yi = ys[i];
    const x2 = xi * xi;
    Sx += xi;
    Sx2 += x2;
    Sx3 += x2 * xi;
    Sx4 += x2 * x2;
    Sy += yi;
    Sxy += xi * yi;
    Sx2y += x2 * yi;
  }
  // Solve 3x3
  const A = [
    [n, Sx, Sx2],
    [Sx, Sx2, Sx3],
    [Sx2, Sx3, Sx4],
  ];
  const B = [Sy, Sxy, Sx2y];
  const [a, b, c] = solve3(A, B);
  const fitted = xs.map((xi) => a + b * xi + c * xi * xi);
  const my = mean(ys);
  const sst = ys.reduce((s, yi) => s + (yi - my) ** 2, 0);
  const sse = ys.reduce((s, yi, i) => s + (yi - fitted[i]) ** 2, 0);
  const r2 = 1 - sse / sst;
  return { a, b, c, r2, n, sse, predict: (xv: number) => a + b * xv + c * xv * xv };
}

function solve3(A: number[][], B: number[]): number[] {
  const M = A.map((row, i) => [...row, B[i]]);
  const n = 3;
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
    }
    [M[col], M[pivot]] = [M[pivot], M[col]];
    const div = M[col][col];
    for (let j = col; j <= n; j++) M[col][j] /= div;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col];
      for (let j = col; j <= n; j++) M[r][j] -= f * M[col][j];
    }
  }
  return [M[0][3], M[1][3], M[2][3]];
}

export function exponentialRegression(x: number[], y: number[]) {
  if (y.some((v) => v <= 0)) throw new Error("Exponential regression requires positive y.");
  const logY = y.map(Math.log);
  const lin = simpleLinearRegression(x, logY);
  // y = A e^{bx} => ln y = ln A + b x
  const A = Math.exp(lin.intercept);
  const b = lin.slope;
  const fitted = x.map((xi) => A * Math.exp(b * xi));
  const my = mean(y);
  const sst = y.reduce((s, yi) => s + (yi - my) ** 2, 0);
  const sse = y.reduce((s, yi, i) => s + (yi - fitted[i]) ** 2, 0);
  return { A, b, r2: 1 - sse / sst, n: x.length, predict: (xv: number) => A * Math.exp(b * xv) };
}

export function multipleLinearRegression(X: number[][], y: number[]) {
  // X without intercept column; we add ones
  const n = y.length;
  const p = X[0].length;
  const A: number[][] = X.map((row) => [1, ...row]);
  // (A'A)^{-1} A'y via normal equations (Gaussian)
  const AtA: number[][] = Array.from({ length: p + 1 }, () => Array(p + 1).fill(0));
  const Aty: number[] = Array(p + 1).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < p + 1; j++) {
      Aty[j] += A[i][j] * y[i];
      for (let k = 0; k < p + 1; k++) AtA[j][k] += A[i][j] * A[i][k];
    }
  }
  const beta = solveN(AtA, Aty);
  const fitted = A.map((row) => row.reduce((s, v, j) => s + v * beta[j], 0));
  const my = mean(y);
  const sst = y.reduce((s, yi) => s + (yi - my) ** 2, 0);
  const sse = y.reduce((s, yi, i) => s + (yi - fitted[i]) ** 2, 0);
  const r2 = 1 - sse / sst;
  const adjR2 = 1 - (1 - r2) * ((n - 1) / (n - p - 1));
  return { beta, r2, adjR2, n, p, sse };
}

function solveN(A: number[][], B: number[]): number[] {
  const n = B.length;
  const M = A.map((row, i) => [...row, B[i]]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
    }
    [M[col], M[pivot]] = [M[pivot], M[col]];
    const div = M[col][col] || 1e-12;
    for (let j = col; j <= n; j++) M[col][j] /= div;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col];
      for (let j = col; j <= n; j++) M[r][j] -= f * M[col][j];
    }
  }
  return M.map((row) => row[n]);
}

export function logisticRegression(X: number[][], y: number[], iters = 50) {
  // Simple Newton-Raphson for binary logistic with intercept
  const n = y.length;
  const p = X[0].length;
  let beta = Array(p + 1).fill(0);
  for (let iter = 0; iter < iters; iter++) {
    const grad = Array(p + 1).fill(0);
    const hess: number[][] = Array.from({ length: p + 1 }, () => Array(p + 1).fill(0));
    for (let i = 0; i < n; i++) {
      const xi = [1, ...X[i]];
      const eta = xi.reduce((s, v, j) => s + v * beta[j], 0);
      const pi = 1 / (1 + Math.exp(-eta));
      const w = pi * (1 - pi);
      for (let j = 0; j < p + 1; j++) {
        grad[j] += (y[i] - pi) * xi[j];
        for (let k = 0; k < p + 1; k++) hess[j][k] -= w * xi[j] * xi[k];
      }
    }
    // solve hess * d = -grad  => d = solve(-hess, grad) wait we want hess d = -grad
    // our hess is negative definite approx; solve (-hess) d = grad
    const negH = hess.map((row) => row.map((v) => -v));
    const d = solveN(negH, grad);
    beta = beta.map((b, j) => b + d[j]);
  }
  return { beta };
}

export { stdev };

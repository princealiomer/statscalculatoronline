import { mean, stdev } from "./descriptive";
import jStat from "jstat";

/** Clone a matrix. */
function clone(M: number[][]): number[][] {
  return M.map((r) => r.slice());
}

/** Transpose. */
export function transpose(M: number[][]): number[][] {
  if (!M.length) return [];
  const p = M[0].length;
  return Array.from({ length: p }, (_, j) => M.map((r) => r[j]));
}

/** Matrix × matrix. */
export function matMul(A: number[][], B: number[][]): number[][] {
  const n = A.length;
  const m = B[0].length;
  const k = B.length;
  const out = Array.from({ length: n }, () => Array(m).fill(0));
  for (let i = 0; i < n; i++) {
    for (let t = 0; t < k; t++) {
      const a = A[i][t];
      for (let j = 0; j < m; j++) out[i][j] += a * B[t][j];
    }
  }
  return out;
}

/** Matrix × vector. */
export function matVec(A: number[][], v: number[]): number[] {
  return A.map((row) => row.reduce((s, a, j) => s + a * v[j], 0));
}

/** Invert symmetric/general square matrix via Gauss–Jordan. */
export function invert(A: number[][]): number[][] {
  const n = A.length;
  const M = A.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
    }
    if (Math.abs(M[pivot][col]) < 1e-14) throw new Error("Matrix is singular (not invertible).");
    [M[col], M[pivot]] = [M[pivot], M[col]];
    const div = M[col][col];
    for (let j = 0; j < 2 * n; j++) M[col][j] /= div;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col];
      for (let j = 0; j < 2 * n; j++) M[r][j] -= f * M[col][j];
    }
  }
  return M.map((row) => row.slice(n));
}

/** Column means. */
export function columnMeans(M: number[][]): number[] {
  const p = M[0].length;
  return Array.from({ length: p }, (_, j) => mean(M.map((r) => r[j])));
}

/** Center columns. */
export function centerColumns(M: number[][]): { centered: number[][]; means: number[] } {
  const means = columnMeans(M);
  const centered = M.map((r) => r.map((v, j) => v - means[j]));
  return { centered, means };
}

/** Sample covariance matrix (n−1). */
export function covMatrix(M: number[][]): number[][] {
  const { centered } = centerColumns(M);
  const n = centered.length;
  const p = centered[0].length;
  const cov = Array.from({ length: p }, () => Array(p).fill(0));
  for (let i = 0; i < n; i++) {
    for (let a = 0; a < p; a++) {
      for (let b = 0; b < p; b++) cov[a][b] += centered[i][a] * centered[i][b];
    }
  }
  const d = Math.max(1, n - 1);
  for (let a = 0; a < p; a++) for (let b = 0; b < p; b++) cov[a][b] /= d;
  return cov;
}

/** Correlation matrix from data. */
export function corrMatrix(M: number[][]): number[][] {
  const cov = covMatrix(M);
  const p = cov.length;
  const sd = cov.map((row, i) => Math.sqrt(Math.max(row[i], 0)));
  const R = Array.from({ length: p }, () => Array(p).fill(0));
  for (let i = 0; i < p; i++) {
    for (let j = 0; j < p; j++) {
      const denom = sd[i] * sd[j];
      R[i][j] = denom > 1e-14 ? cov[i][j] / denom : i === j ? 1 : 0;
    }
  }
  return R;
}

/**
 * Jacobi eigenvalue decomposition for a symmetric matrix.
 * Returns eigenvalues (descending) and matching orthonormal eigenvectors as columns of V.
 */
export function eigenSymmetric(Ain: number[][], maxIter = 200): { values: number[]; vectors: number[][] } {
  const n = Ain.length;
  const A = clone(Ain);
  const V: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );

  for (let iter = 0; iter < maxIter; iter++) {
    let p = 0;
    let q = 1;
    let max = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = Math.abs(A[i][j]);
        if (a > max) {
          max = a;
          p = i;
          q = j;
        }
      }
    }
    if (max < 1e-12) break;

    const app = A[p][p];
    const aqq = A[q][q];
    const apq = A[p][q];
    const theta = 0.5 * Math.atan2(2 * apq, aqq - app);
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    for (let i = 0; i < n; i++) {
      if (i === p || i === q) continue;
      const aip = A[i][p];
      const aiq = A[i][q];
      A[i][p] = A[p][i] = c * aip - s * aiq;
      A[i][q] = A[q][i] = s * aip + c * aiq;
    }
    A[p][p] = c * c * app - 2 * s * c * apq + s * s * aqq;
    A[q][q] = s * s * app + 2 * s * c * apq + c * c * aqq;
    A[p][q] = A[q][p] = 0;

    for (let i = 0; i < n; i++) {
      const vip = V[i][p];
      const viq = V[i][q];
      V[i][p] = c * vip - s * viq;
      V[i][q] = s * vip + c * viq;
    }
  }

  const values = A.map((row, i) => row[i]);
  const order = values.map((_, i) => i).sort((a, b) => values[b] - values[a]);
  const sortedValues = order.map((i) => values[i]);
  const vectors = Array.from({ length: n }, (_, i) => order.map((j) => V[i][j]));
  return { values: sortedValues, vectors };
}

/** PCA on the correlation (default) or covariance matrix. */
export function pca(M: number[][], useCorrelation = true) {
  if (M.length < 2 || M[0].length < 2) throw new Error("Need ≥2 rows and ≥2 columns.");
  const S = useCorrelation ? corrMatrix(M) : covMatrix(M);
  const { values, vectors } = eigenSymmetric(S);
  const total = values.reduce((s, v) => s + Math.max(v, 0), 0) || 1;
  const components = values.map((lambda, k) => {
    const loadings = vectors.map((row) => row[k] * Math.sqrt(Math.max(lambda, 0)));
    return {
      eigenvalue: lambda,
      varianceExplained: (Math.max(lambda, 0) / total) * 100,
      cumulative: 0,
      loadings,
      eigenvector: vectors.map((row) => row[k]),
    };
  });
  let cum = 0;
  for (const c of components) {
    cum += c.varianceExplained;
    c.cumulative = cum;
  }
  return { matrix: S, components, totalVariance: total };
}

/**
 * Exploratory factor analysis via principal-axis factoring on the correlation matrix.
 * Communalities start at squared multiple correlations (approx via 1 − 1/R⁻¹_ii) when invertible,
 * otherwise max off-diagonal |r|.
 */
export function efa(M: number[][], nFactors?: number) {
  if (M.length < 3 || M[0].length < 2) throw new Error("Need ≥3 rows and ≥2 variables for EFA.");
  const p = M[0].length;
  const R = corrMatrix(M);

  let h2 = Array(p).fill(0.5);
  try {
    const Ri = invert(R);
    h2 = Ri.map((row, i) => Math.max(0.05, Math.min(0.99, 1 - 1 / row[i])));
  } catch {
    for (let i = 0; i < p; i++) {
      let mx = 0;
      for (let j = 0; j < p; j++) if (i !== j) mx = Math.max(mx, Math.abs(R[i][j]));
      h2[i] = Math.max(0.1, mx);
    }
  }

  // Iterate communalities a few times
  let values: number[] = [];
  let vectors: number[][] = [];
  for (let iter = 0; iter < 12; iter++) {
    const RR = clone(R);
    for (let i = 0; i < p; i++) RR[i][i] = h2[i];
    ({ values, vectors } = eigenSymmetric(RR));
    const k =
      nFactors && nFactors > 0
        ? Math.min(nFactors, p)
        : Math.max(1, values.filter((v) => v > 1).length || 1);
    const newH2 = Array(p).fill(0);
    for (let i = 0; i < p; i++) {
      for (let f = 0; f < k; f++) {
        const load = vectors[i][f] * Math.sqrt(Math.max(values[f], 0));
        newH2[i] += load * load;
      }
      newH2[i] = Math.max(0.05, Math.min(0.995, newH2[i]));
    }
    const delta = newH2.reduce((s, v, i) => s + Math.abs(v - h2[i]), 0);
    h2 = newH2;
    if (delta < 1e-5) break;
  }

  const kAuto = Math.max(1, values.filter((v) => v > 1).length || 1);
  const k = nFactors && nFactors > 0 ? Math.min(nFactors, p) : Math.min(kAuto, p);
  const factors = Array.from({ length: k }, (_, f) => {
    const loadings = vectors.map((row) => {
      const L = row[f] * Math.sqrt(Math.max(values[f], 0));
      // Soft-clamp Heywood loadings on the correlation scale
      return Math.max(-0.999, Math.min(0.999, L));
    });
    return {
      eigenvalue: values[f],
      varianceExplained: (Math.max(values[f], 0) / p) * 100,
      loadings,
    };
  });

  // Kaiser–Meyer–Olkin (simplified overall)
  let rSum = 0;
  let partialProxy = 0;
  for (let i = 0; i < p; i++) {
    for (let j = i + 1; j < p; j++) {
      rSum += R[i][j] ** 2;
      partialProxy += (R[i][j] * (1 - (h2[i] + h2[j]) / 2)) ** 2;
    }
  }
  const kmo = rSum / (rSum + partialProxy + 1e-12);

  return { factors, communalities: h2, kmo, nFactors: k, correlation: R };
}

/**
 * One-factor confirmatory model on the correlation matrix (least-squares loadings).
 * Reports loadings, uniquenesses, residual RMSR, and a χ² approximation for residuals.
 */
export function cfaOneFactor(M: number[][]) {
  if (M.length < 3 || M[0].length < 3) throw new Error("CFA needs ≥3 rows and ≥3 variables.");
  const R = corrMatrix(M);
  const p = R.length;
  // Start from first principal component of R
  const { values, vectors } = eigenSymmetric(R);
  let lambda = vectors.map((row) => row[0] * Math.sqrt(Math.max(values[0], 0)));
  // Clamp loadings into (-0.99, 0.99)
  lambda = lambda.map((l) => Math.max(-0.99, Math.min(0.99, l)));

  // A few ALS iterations: λ_i ← sum_j R_ij λ_j / (sum λ_j²) style for one factor LS
  for (let iter = 0; iter < 40; iter++) {
    const next = Array(p).fill(0);
    for (let i = 0; i < p; i++) {
      let num = 0;
      let den = 0;
      for (let j = 0; j < p; j++) {
        if (i === j) continue;
        num += R[i][j] * lambda[j];
        den += lambda[j] * lambda[j];
      }
      next[i] = den > 1e-12 ? num / den : lambda[i];
      next[i] = Math.max(-0.99, Math.min(0.99, next[i]));
    }
    const delta = next.reduce((s, v, i) => s + Math.abs(v - lambda[i]), 0);
    lambda = next;
    if (delta < 1e-7) break;
  }

  const uniqueness = lambda.map((l) => Math.max(0.01, 1 - l * l));
  const implied = Array.from({ length: p }, (_, i) =>
    Array.from({ length: p }, (_, j) => (i === j ? 1 : lambda[i] * lambda[j])),
  );
  let ss = 0;
  let count = 0;
  for (let i = 0; i < p; i++) {
    for (let j = i + 1; j < p; j++) {
      const e = R[i][j] - implied[i][j];
      ss += e * e;
      count++;
    }
  }
  const rmsr = Math.sqrt(ss / Math.max(count, 1));
  // Large-sample residual χ² approx (Browne-ish educational proxy): n * ss
  const n = M.length;
  const chi2 = n * ss;
  const df = Math.max(1, (p * (p - 1)) / 2 - p);
  const pValue = 1 - jStat.chisquare.cdf(chi2, df);

  return { loadings: lambda, uniqueness, rmsr, chi2, df, pValue, n, correlation: R };
}

/**
 * Fisher's linear discriminant analysis.
 * Last column = group label (numeric codes). Remaining columns = predictors.
 */
export function lda(M: number[][]) {
  if (M.length < 4 || M[0].length < 2) throw new Error("LDA needs predictors plus a group column (last col).");
  const p = M[0].length - 1;
  const X = M.map((r) => r.slice(0, p));
  const g = M.map((r) => r[p]);
  const labels = [...new Set(g)];
  if (labels.length < 2) throw new Error("Need at least 2 groups in the last column.");

  const groups = labels.map((lab) => ({
    label: lab,
    rows: X.filter((_, i) => g[i] === lab),
  }));
  for (const gr of groups) {
    if (gr.rows.length < 2) throw new Error(`Group ${gr.label} needs ≥2 observations.`);
  }

  const overall = columnMeans(X);
  const means = groups.map((gr) => ({ label: gr.label, mean: columnMeans(gr.rows), n: gr.rows.length }));

  // Pooled within-class scatter Sw / covariance
  const Sw = Array.from({ length: p }, () => Array(p).fill(0));
  let dfw = 0;
  for (const gr of groups) {
    const mu = columnMeans(gr.rows);
    for (const row of gr.rows) {
      for (let a = 0; a < p; a++) {
        for (let b = 0; b < p; b++) Sw[a][b] += (row[a] - mu[a]) * (row[b] - mu[b]);
      }
    }
    dfw += gr.rows.length - 1;
  }
  const SwInv = invert(Sw.map((row) => row.map((v) => v / Math.max(dfw, 1))));

  // Between-class scatter for first discriminant direction (two-group or multi via first eigen of Sw^{-1} Sb)
  const Sb = Array.from({ length: p }, () => Array(p).fill(0));
  for (const m of means) {
    for (let a = 0; a < p; a++) {
      for (let b = 0; b < p; b++) {
        Sb[a][b] += m.n * (m.mean[a] - overall[a]) * (m.mean[b] - overall[b]);
      }
    }
  }

  // For 2 groups: w ∝ Sw^{-1}(μ1 − μ0). For multi: eigen of Sw^{-1} Sb via symmetric trick on Sw^{-1/2} Sb Sw^{-1/2} approx using SwInv*Sb then power.
  let weights: number[];
  if (labels.length === 2) {
    const diff = means[0].mean.map((v, j) => v - means[1].mean[j]);
    weights = matVec(SwInv, diff);
  } else {
    const A = matMul(SwInv, Sb);
    // Power iteration on A for dominant direction
    let v = Array(p).fill(1 / Math.sqrt(p));
    for (let iter = 0; iter < 80; iter++) {
      const w = matVec(A, v);
      const norm = Math.sqrt(w.reduce((s, x) => s + x * x, 0)) || 1;
      v = w.map((x) => x / norm);
    }
    weights = v;
  }
  const wNorm = Math.sqrt(weights.reduce((s, x) => s + x * x, 0)) || 1;
  weights = weights.map((w) => w / wNorm);

  const scores = X.map((row) => row.reduce((s, x, j) => s + x * weights[j], 0));
  const groupScoreMeans = means.map((m) => ({
    label: m.label,
    scoreMean: m.mean.reduce((s, x, j) => s + x * weights[j], 0),
    n: m.n,
  }));

  // Classify by nearest group score mean
  let correct = 0;
  const pred = scores.map((s, i) => {
    let best = groupScoreMeans[0].label;
    let bestD = Infinity;
    for (const gs of groupScoreMeans) {
      const d = Math.abs(s - gs.scoreMean);
      if (d < bestD) {
        bestD = d;
        best = gs.label;
      }
    }
    if (best === g[i]) correct++;
    return best;
  });
  const accuracy = correct / M.length;

  return {
    weights,
    groupMeans: means,
    groupScoreMeans,
    accuracy,
    nGroups: labels.length,
    n: M.length,
    p,
    predictions: pred,
  };
}

/**
 * Canonical correlation analysis.
 * First `nX` columns = set X; remaining columns = set Y.
 */
export function cca(M: number[][], nX: number) {
  if (M.length < 5) throw new Error("CCA needs ≥5 observations.");
  const p = M[0].length;
  if (nX < 1 || nX >= p) throw new Error("nX must leave at least one Y column.");
  const q = p - nX;
  const X = M.map((r) => r.slice(0, nX));
  const Y = M.map((r) => r.slice(nX));

  // Standardize columns
  const stdize = (A: number[][]) => {
    const means = columnMeans(A);
    const sds = A[0].map((_, j) => stdev(A.map((r) => r[j]), true) || 1);
    return A.map((r) => r.map((v, j) => (v - means[j]) / sds[j]));
  };
  const Xs = stdize(X);
  const Ys = stdize(Y);
  const n = Xs.length;

  const cross = (A: number[][], B: number[][]) => {
    const pa = A[0].length;
    const pb = B[0].length;
    const C = Array.from({ length: pa }, () => Array(pb).fill(0));
    for (let i = 0; i < n; i++) {
      for (let a = 0; a < pa; a++) for (let b = 0; b < pb; b++) C[a][b] += A[i][a] * B[i][b];
    }
    for (let a = 0; a < pa; a++) for (let b = 0; b < pb; b++) C[a][b] /= n - 1;
    return C;
  };

  const Rxx = cross(Xs, Xs);
  const Ryy = cross(Ys, Ys);
  const Rxy = cross(Xs, Ys);
  const Ryx = transpose(Rxy);

  // Regularize diagonals slightly for stability
  for (let i = 0; i < nX; i++) Rxx[i][i] += 1e-8;
  for (let i = 0; i < q; i++) Ryy[i][i] += 1e-8;

  const RxxInv = invert(Rxx);
  const RyyInv = invert(Ryy);
  // M = Rxx^{-1} Rxy Ryy^{-1} Ryx
  const Mmat = matMul(matMul(matMul(RxxInv, Rxy), RyyInv), Ryx);
  // Eigenvalues of M are ρ²
  const { values } = eigenSymmetric(
    // Symmetrize for Jacobi
    Mmat.map((row, i) => row.map((v, j) => 0.5 * (v + Mmat[j][i]))),
  );
  const k = Math.min(nX, q);
  const rhos = values.slice(0, k).map((v) => Math.sqrt(Math.max(0, Math.min(1, v))));

  // Wilks' lambda approx for first k
  let wilks = 1;
  for (const r of rhos) wilks *= 1 - r * r;
  const df1 = nX * q;
  const df2 = n - 1.5 - (nX + q) / 2;
  // Bartlett: -[n - 1 - (p+q+1)/2] ln Λ ~ χ²_{pq}
  const bartlett = -(n - 1 - (nX + q + 1) / 2) * Math.log(Math.max(wilks, 1e-15));
  const pValue = 1 - jStat.chisquare.cdf(bartlett, df1);

  return { rhos, wilks, bartlett, df: df1, pValue, nX, nY: q, n, df2 };
}

function olsFit(Xaug: number[][], y: number[]): { beta: number[]; sigma: number } {
  const n = y.length;
  const k = Xaug[0].length;
  const AtA: number[][] = Array.from({ length: k }, () => Array(k).fill(0));
  const Aty: number[] = Array(k).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < k; j++) {
      Aty[j] += Xaug[i][j] * y[i];
      for (let t = 0; t < k; t++) AtA[j][t] += Xaug[i][j] * Xaug[i][t];
    }
  }
  for (let i = 0; i < k; i++) AtA[i][i] += 1e-10;
  const beta = invert(AtA).map((row) => row.reduce((s, v, j) => s + v * Aty[j], 0));
  const resid = y.map((yi, i) => yi - Xaug[i].reduce((s, v, j) => s + v * beta[j], 0));
  const sigma = Math.sqrt(resid.reduce((s, e) => s + e * e, 0) / Math.max(1, n - k)) || 1;
  return { beta, sigma };
}

/**
 * Type I Tobit (left-censored at `limit`) via EM (Amemiya / Fair-style).
 * Rows: y, x1, x2, ...
 */
export function tobitMLE(rows: number[][], limit = 0, iters = 60) {
  if (rows.length < 5) throw new Error("Need ≥5 rows as y,x1,x2,...");
  if (!rows[0] || rows[0].length < 2) throw new Error("Paste rows as y,x1,x2,...");
  const y = rows.map((r) => r[0]);
  const Xraw = rows.map((r) => r.slice(1));
  const p = Xraw[0].length;
  const n = y.length;
  const X = Xraw.map((r) => [1, ...r]);
  const censored = y.map((yi) => yi <= limit + 1e-12);
  const nCens = censored.filter(Boolean).length;
  if (nCens === n) throw new Error("All outcomes are censored; cannot estimate Tobit.");

  // Start from OLS on all rows (censored y treated as limit) — stable
  let { beta, sigma } = olsFit(
    X,
    y.map((yi, i) => (censored[i] ? limit : yi)),
  );
  sigma = Math.max(sigma, 1e-4);

  const phi = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
  const Phi = (z: number) => Math.min(1 - 1e-15, Math.max(1e-15, jStat.normal.cdf(z, 0, 1)));

  for (let iter = 0; iter < iters; iter++) {
    const yStar = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      const xb = X[i].reduce((s, v, j) => s + v * beta[j], 0);
      if (!censored[i]) {
        yStar[i] = y[i];
      } else {
        const z = (limit - xb) / sigma;
        const mills = phi(z) / Phi(z); // λ(z)
        // E[y* | y* ≤ L] = xb - σ λ(z)
        yStar[i] = xb - sigma * mills;
      }
    }
    beta = olsFit(X, yStar).beta;
    // EM σ² = mean of E[(y*-xb)²]
    let ss = 0;
    for (let i = 0; i < n; i++) {
      const xb = X[i].reduce((s, v, j) => s + v * beta[j], 0);
      if (!censored[i]) ss += (y[i] - xb) ** 2;
      else {
        const z = (limit - xb) / sigma;
        const mills = phi(z) / Phi(z);
        ss += sigma * sigma * Math.max(1e-8, 1 - z * mills - mills * mills);
      }
    }
    sigma = Math.sqrt(ss / n) || sigma;
    sigma = Math.max(sigma, 1e-4);
  }

  // Observed-data log-likelihood
  let ll = 0;
  for (let i = 0; i < n; i++) {
    const xb = X[i].reduce((s, v, j) => s + v * beta[j], 0);
    if (censored[i]) {
      ll += Math.log(Phi((limit - xb) / sigma));
    } else {
      const z = (y[i] - xb) / sigma;
      ll += -0.5 * Math.log(2 * Math.PI) - Math.log(sigma) - 0.5 * z * z;
    }
  }

  return {
    beta,
    sigma,
    logLik: ll,
    n,
    nCensored: nCens,
    nObserved: n - nCens,
    limit,
    p,
  };
}

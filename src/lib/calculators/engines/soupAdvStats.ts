import jStat from "jstat";
import { fmt, fmtP, apaTest, type CalcResult } from "@/lib/stats/format";
import { correlation, mean, stdev, variance } from "@/lib/stats/descriptive";
import { parseMatrix, parseNumbers, parsePaired } from "@/lib/stats/parse";

type Input = Record<string, string>;

function ok(fields: CalcResult["fields"], steps: CalcResult["steps"], apa?: string): CalcResult {
  return { fields, steps, apa };
}

function num(input: Input, key: string, fallback?: number) {
  const v = Number(input[key] ?? fallback);
  if (!Number.isFinite(v)) throw new Error(`Enter a valid ${key}.`);
  return v;
}

function ranks(arr: number[]) {
  const indexed = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const out = Array(arr.length).fill(0);
  let i = 0;
  while (i < indexed.length) {
    let j = i;
    while (j + 1 < indexed.length && indexed[j + 1].v === indexed[i].v) j++;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) out[indexed[k].i] = avg;
    i = j + 1;
  }
  return out;
}

function pearson(x: number[], y: number[]) {
  return correlation(x, y);
}

function spearman(x: number[], y: number[]) {
  return pearson(ranks(x), ranks(y));
}

function kendallTau(x: number[], y: number[]) {
  const n = x.length;
  let concordant = 0;
  let discordant = 0;
  let tiesX = 0;
  let tiesY = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = Math.sign(x[i] - x[j]);
      const dy = Math.sign(y[i] - y[j]);
      const p = dx * dy;
      if (p > 0) concordant++;
      else if (p < 0) discordant++;
      if (dx === 0) tiesX++;
      if (dy === 0) tiesY++;
    }
  }
  const n0 = (n * (n - 1)) / 2;
  const denom = Math.sqrt((n0 - tiesX) * (n0 - tiesY));
  const tau = denom === 0 ? 0 : (concordant - discordant) / denom;
  return { tau, concordant, discordant, n0 };
}

function pointBiserial(binary: number[], continuous: number[]) {
  const g0 = continuous.filter((_, i) => binary[i] === 0);
  const g1 = continuous.filter((_, i) => binary[i] === 1);
  if (!g0.length || !g1.length) throw new Error("Binary variable must include both 0 and 1.");
  const p = g1.length / continuous.length;
  const q = 1 - p;
  const s = stdev(continuous, true);
  if (s === 0) return 0;
  return ((mean(g1) - mean(g0)) / s) * Math.sqrt(p * q);
}

function euclid(a: number[], b: number[]) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += (a[i] - b[i]) ** 2;
  return Math.sqrt(s);
}

export function runSoupAdvStats(engine: string, input: Input): CalcResult | null {
  switch (engine) {
    case "spearman": {
      const { x, y } = parsePaired(input.data ?? "");
      if (x.length < 3) throw new Error("Enter at least 3 paired observations.");
      const r = spearman(x, y);
      const n = x.length;
      const t = r * Math.sqrt((n - 2) / Math.max(1e-12, 1 - r * r));
      const p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), n - 2));
      return ok(
        [
          { label: "n", value: n },
          { label: "Spearman ρ", value: fmt(r) },
          { label: "t", value: fmt(t) },
          { label: "df", value: n - 2 },
          { label: "p (approx)", value: fmtP(p) },
        ],
        [{ title: "Spearman", detail: "Pearson correlation of ranks" }],
        apaTest({ test: "Spearman rank correlation", statistic: "ρ", value: r, p, df: n - 2 }),
      );
    }

    case "kendall": {
      const { x, y } = parsePaired(input.data ?? "");
      if (x.length < 3) throw new Error("Enter at least 3 paired observations.");
      const { tau, concordant, discordant, n0 } = kendallTau(x, y);
      return ok(
        [
          { label: "n", value: x.length },
          { label: "Kendall τ", value: fmt(tau) },
          { label: "Concordant pairs", value: concordant },
          { label: "Discordant pairs", value: discordant },
          { label: "Total pairs", value: n0 },
        ],
        [{ title: "Kendall tau-b", detail: `(C − D) / √[(n0−tx)(n0−ty)]` }],
      );
    }

    case "point-biserial": {
      const { x, y } = parsePaired(input.data ?? "");
      if (x.length < 3) throw new Error("Paste binary,continuous pairs (0/1, value).");
      const rpb = pointBiserial(x, y);
      const n = x.length;
      const t = rpb * Math.sqrt((n - 2) / Math.max(1e-12, 1 - rpb * rpb));
      const p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), n - 2));
      return ok(
        [
          { label: "n", value: n },
          { label: "Point-biserial r", value: fmt(rpb) },
          { label: "t", value: fmt(t) },
          { label: "p (approx)", value: fmtP(p) },
        ],
        [{ title: "Point-biserial", detail: "Correlation of dichotomous x with continuous y" }],
        apaTest({ test: "Point-biserial correlation", statistic: "rpb", value: rpb, p, df: n - 2 }),
      );
    }

    case "bartlett": {
      const groups = parseMatrix(input.data ?? "").length
        ? parseMatrix(input.data ?? "")
        : input.data
            ?.split(/\n\s*\n/)
            .map((g) => parseNumbers(g))
            .filter((g) => g.length >= 2) ?? [];
      // Also support blank-line groups via parseGroups-like split
      let gs = groups;
      if (gs.length < 2) {
        const chunks = (input.data ?? "").trim().split(/\n\s*\n/);
        gs = chunks.map((c) => parseNumbers(c)).filter((g) => g.length >= 2);
      }
      if (gs.length < 2) throw new Error("Paste 2+ groups (blank-line separated).");
      const k = gs.length;
      const ni = gs.map((g) => g.length);
      const N = ni.reduce((a, b) => a + b, 0);
      const si2 = gs.map((g) => variance(g, true));
      const sp2 = si2.reduce((s, v, i) => s + (ni[i] - 1) * v, 0) / (N - k);
      let numer = (N - k) * Math.log(sp2);
      let denomCorr = 0;
      for (let i = 0; i < k; i++) {
        numer -= (ni[i] - 1) * Math.log(si2[i]);
        denomCorr += 1 / (ni[i] - 1);
      }
      const C = 1 + (1 / (3 * (k - 1))) * (denomCorr - 1 / (N - k));
      const chi2 = numer / C;
      const df = k - 1;
      const p = 1 - jStat.chisquare.cdf(chi2, df);
      return ok(
        [
          { label: "k groups", value: k },
          { label: "Pooled variance", value: fmt(sp2) },
          { label: "χ²", value: fmt(chi2) },
          { label: "df", value: df },
          { label: "p", value: fmtP(p) },
        ],
        [{ title: "Bartlett’s test", detail: "Homogeneity of variances" }],
        apaTest({ test: "Bartlett test", statistic: "χ²", value: chi2, df, p }),
      );
    }

    case "hartley-fmax": {
      const chunks = (input.data ?? "").trim().split(/\n\s*\n/);
      const gs = chunks.map((c) => parseNumbers(c)).filter((g) => g.length >= 2);
      if (gs.length < 2) throw new Error("Paste 2+ groups (blank-line separated).");
      const vars = gs.map((g) => variance(g, true));
      const fmax = Math.max(...vars) / Math.min(...vars);
      return ok(
        [
          { label: "k", value: gs.length },
          { label: "Max variance", value: fmt(Math.max(...vars)) },
          { label: "Min variance", value: fmt(Math.min(...vars)) },
          { label: "Fmax", value: fmt(fmax) },
        ],
        [{ title: "Hartley’s Fmax", detail: "max s² / min s² (compare to critical tables)" }],
      );
    }

    case "bonferroni": {
      const pvals = parseNumbers(input.pvalues ?? input.data ?? "");
      if (pvals.length < 1) throw new Error("Enter p-values.");
      const alpha = num(input, "alpha", 0.05);
      const m = pvals.length;
      const adjAlpha = alpha / m;
      const adjusted = pvals.map((p) => Math.min(1, p * m));
      return ok(
        [
          { label: "Comparisons m", value: m },
          { label: "Family α", value: fmt(alpha) },
          { label: "Per-test α", value: fmt(adjAlpha) },
          ...adjusted.map((p, i) => ({
            label: `Adj p${i + 1}`,
            value: `${fmtP(p)} (${p <= alpha ? "sig" : "ns"})`,
          })),
        ],
        [{ title: "Bonferroni", detail: `Adjusted p = min(1, m·p); α/m = ${fmt(adjAlpha)}` }],
      );
    }

    case "chi-homogeneity": {
      // Same math as independence; labeled as homogeneity of proportions across populations
      const table = parseMatrix(input.data ?? "");
      if (table.length < 2 || table[0].length < 2) throw new Error("Paste a contingency table (rows = populations).");
      const rowSums = table.map((r) => r.reduce((a, b) => a + b, 0));
      const colSums = table[0].map((_, j) => table.reduce((s, r) => s + r[j], 0));
      const N = rowSums.reduce((a, b) => a + b, 0);
      let chi2 = 0;
      for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[0].length; j++) {
          const e = (rowSums[i] * colSums[j]) / N;
          chi2 += (table[i][j] - e) ** 2 / e;
        }
      }
      const df = (table.length - 1) * (table[0].length - 1);
      const p = 1 - jStat.chisquare.cdf(chi2, df);
      return ok(
        [
          { label: "χ²", value: fmt(chi2) },
          { label: "df", value: df },
          { label: "p", value: fmtP(p) },
          { label: "N", value: N },
        ],
        [{ title: "Chi-square homogeneity", detail: "Compare categorical distributions across populations" }],
        apaTest({ test: "Chi-square test of homogeneity", statistic: "χ²", value: chi2, df, p }),
      );
    }

    case "bayes-rule": {
      const prior = num(input, "prior", 0.01);
      const sens = num(input, "sensitivity", 0.95);
      const spec = num(input, "specificity", 0.9);
      if ([prior, sens, spec].some((v) => v < 0 || v > 1)) throw new Error("Probabilities must be in [0,1].");
      const pPos = sens * prior + (1 - spec) * (1 - prior);
      const post = (sens * prior) / pPos;
      const pNeg = (1 - sens) * prior + spec * (1 - prior);
      const postNeg = ((1 - sens) * prior) / pNeg;
      return ok(
        [
          { label: "P(A)", value: fmt(prior) },
          { label: "P(+|A) sensitivity", value: fmt(sens) },
          { label: "P(−|¬A) specificity", value: fmt(spec) },
          { label: "P(A|+)", value: fmt(post) },
          { label: "P(A|−)", value: fmt(postNeg) },
        ],
        [{ title: "Bayes’ rule", detail: `P(A|+) = P(+|A)P(A) / P(+)` }],
      );
    }

    case "multinomial": {
      const n = Math.floor(num(input, "n", 10));
      const probs = parseNumbers(input.probs ?? "0.2,0.3,0.5");
      const counts = parseNumbers(input.counts ?? "2,3,5");
      if (probs.length !== counts.length) throw new Error("probs and counts must have equal length.");
      if (Math.abs(probs.reduce((a, b) => a + b, 0) - 1) > 1e-6) throw new Error("Probabilities must sum to 1.");
      if (counts.reduce((a, b) => a + b, 0) !== n) throw new Error("Counts must sum to n.");
      let logP = 0;
      // n! / (n1! n2! ...) * p1^n1 ...
      for (let i = 2; i <= n; i++) logP += Math.log(i);
      for (const c of counts) for (let i = 2; i <= c; i++) logP -= Math.log(i);
      for (let i = 0; i < counts.length; i++) logP += counts[i] * Math.log(probs[i]);
      return ok(
        [
          { label: "n", value: n },
          { label: "P(X=x)", value: fmt(Math.exp(logP)) },
          { label: "log P", value: fmt(logP) },
        ],
        [{ title: "Multinomial PMF", detail: `n! / (n1!…nk!) · Π p_i^{n_i}` }],
      );
    }

    case "fleiss-kappa": {
      // rows = subjects, cols = category counts across raters
      const table = parseMatrix(input.data ?? "");
      if (table.length < 2 || table[0].length < 2) throw new Error("Paste subjects × category counts.");
      const N = table.length;
      const k = table[0].length;
      const n = table[0].reduce((a, b) => a + b, 0);
      if (!table.every((r) => r.reduce((a, b) => a + b, 0) === n)) {
        throw new Error("Each subject row must sum to the same number of raters n.");
      }
      let pBar = 0;
      const pj = Array(k).fill(0);
      for (let i = 0; i < N; i++) {
        let sumSq = 0;
        for (let j = 0; j < k; j++) {
          sumSq += table[i][j] ** 2;
          pj[j] += table[i][j];
        }
        pBar += (sumSq - n) / (n * (n - 1));
      }
      pBar /= N;
      for (let j = 0; j < k; j++) pj[j] /= N * n;
      const pe = pj.reduce((s, p) => s + p * p, 0);
      const kappa = (pBar - pe) / (1 - pe || 1);
      return ok(
        [
          { label: "Subjects N", value: N },
          { label: "Raters n", value: n },
          { label: "Categories", value: k },
          { label: "P̄", value: fmt(pBar) },
          { label: "Pe", value: fmt(pe) },
          { label: "Fleiss κ", value: fmt(kappa) },
        ],
        [{ title: "Fleiss’ kappa", detail: "Multi-rater agreement" }],
      );
    }

    case "roc-auc": {
      // score,label (0/1)
      const { x: scores, y: labels } = parsePaired(input.data ?? "");
      if (scores.length < 4) throw new Error("Paste score,label rows (label 0/1).");
      if (!labels.every((v) => v === 0 || v === 1)) throw new Error("Labels must be 0 or 1.");
      const pos = scores.filter((_, i) => labels[i] === 1);
      const neg = scores.filter((_, i) => labels[i] === 0);
      if (!pos.length || !neg.length) throw new Error("Need both positive and negative labels.");
      // AUC via Mann–Whitney
      let beats = 0;
      for (const p of pos) for (const n of neg) {
        if (p > n) beats += 1;
        else if (p === n) beats += 0.5;
      }
      const auc = beats / (pos.length * neg.length);
      const thr = num(input, "threshold", mean(scores));
      const tp = scores.filter((s, i) => s >= thr && labels[i] === 1).length;
      const fp = scores.filter((s, i) => s >= thr && labels[i] === 0).length;
      const tn = scores.filter((s, i) => s < thr && labels[i] === 0).length;
      const fn = scores.filter((s, i) => s < thr && labels[i] === 1).length;
      const sens = tp / (tp + fn || 1);
      const spec = tn / (tn + fp || 1);
      return ok(
        [
          { label: "n", value: scores.length },
          { label: "AUC", value: fmt(auc) },
          { label: "Threshold", value: fmt(thr) },
          { label: "Sensitivity", value: fmt(sens) },
          { label: "Specificity", value: fmt(spec) },
          { label: "Precision", value: fmt(tp / (tp + fp || 1)) },
        ],
        [{ title: "ROC / AUC", detail: "AUC = Mann–Whitney probability that score ranks a positive above a negative" }],
      );
    }

    case "hierarchical-cluster": {
      const m = parseMatrix(input.data ?? "");
      if (m.length < 2) throw new Error("Paste a numeric matrix (rows = observations).");
      const kWant = Math.min(m.length, Math.max(1, Math.floor(num(input, "k", 2))));
      // Agglomerative single-linkage until k clusters
      let clusters = m.map((_, i) => [i]);
      const dist = (A: number[], B: number[]) => {
        let min = Infinity;
        for (const i of A) for (const j of B) min = Math.min(min, euclid(m[i], m[j]));
        return min;
      };
      while (clusters.length > kWant) {
        let bestI = 0;
        let bestJ = 1;
        let bestD = Infinity;
        for (let i = 0; i < clusters.length; i++) {
          for (let j = i + 1; j < clusters.length; j++) {
            const d = dist(clusters[i], clusters[j]);
            if (d < bestD) {
              bestD = d;
              bestI = i;
              bestJ = j;
            }
          }
        }
        const merged = [...clusters[bestI], ...clusters[bestJ]];
        clusters = clusters.filter((_, idx) => idx !== bestI && idx !== bestJ);
        clusters.push(merged);
      }
      return ok(
        [
          { label: "Observations", value: m.length },
          { label: "Clusters k", value: clusters.length },
          ...clusters.map((c, i) => ({
            label: `Cluster ${i + 1} (0-based rows)`,
            value: c.sort((a, b) => a - b).join(", "),
          })),
        ],
        [{ title: "Hierarchical clustering", detail: "Agglomerative single-linkage" }],
      );
    }

    case "kmeans": {
      const m = parseMatrix(input.data ?? "");
      if (m.length < 2) throw new Error("Paste a numeric matrix.");
      const k = Math.min(m.length, Math.max(1, Math.floor(num(input, "k", 2))));
      const dim = m[0].length;
      const cents = m.slice(0, k).map((r) => [...r]);
      let assign = Array(m.length).fill(0);
      for (let iter = 0; iter < 25; iter++) {
        assign = m.map((row) => {
          let best = 0;
          let bestD = Infinity;
          for (let c = 0; c < k; c++) {
            const d = euclid(row, cents[c]);
            if (d < bestD) {
              bestD = d;
              best = c;
            }
          }
          return best;
        });
        const next = Array.from({ length: k }, () => Array(dim).fill(0));
        const counts = Array(k).fill(0);
        for (let i = 0; i < m.length; i++) {
          counts[assign[i]]++;
          for (let d = 0; d < dim; d++) next[assign[i]][d] += m[i][d];
        }
        for (let c = 0; c < k; c++) {
          if (!counts[c]) continue;
          for (let d = 0; d < dim; d++) next[c][d] /= counts[c];
          cents[c] = next[c];
        }
      }
      return ok(
        [
          { label: "k", value: k },
          { label: "Assignments", value: assign.join(", ") },
          ...cents.map((c, i) => ({ label: `Centroid ${i + 1}`, value: c.map((v) => fmt(v)).join(", ") })),
        ],
        [{ title: "k-means", detail: "Lloyd iterations (Euclidean)" }],
      );
    }

    case "mediator": {
      // Baron-Kenny style paths from columns y,x,m
      const rows = parseMatrix(input.data ?? "");
      if (rows.length < 5 || rows[0].length < 3) throw new Error("Paste rows as y,x,m");
      const y = rows.map((r) => r[0]);
      const x = rows.map((r) => r[1]);
      const m = rows.map((r) => r[2]);
      const n = y.length;
      const regress = (yy: number[], xx: number[]) => {
        const mx = mean(xx);
        const my = mean(yy);
        let sxx = 0;
        let sxy = 0;
        for (let i = 0; i < n; i++) {
          sxx += (xx[i] - mx) ** 2;
          sxy += (xx[i] - mx) * (yy[i] - my);
        }
        const b = sxy / sxx;
        const a = my - b * mx;
        return { a, b };
      };
      const pathC = regress(y, x).b;
      const pathA = regress(m, x).b;
      // y ~ x + m
      const mx = mean(x);
      const mm = mean(m);
      const my = mean(y);
      let sxx = 0;
      let smm = 0;
      let sxm = 0;
      let sxy = 0;
      let smy = 0;
      for (let i = 0; i < n; i++) {
        const dx = x[i] - mx;
        const dm = m[i] - mm;
        const dy = y[i] - my;
        sxx += dx * dx;
        smm += dm * dm;
        sxm += dx * dm;
        sxy += dx * dy;
        smy += dm * dy;
      }
      const det = sxx * smm - sxm * sxm;
      const pathCprime = (sxy * smm - smy * sxm) / det;
      const pathB = (smy * sxx - sxy * sxm) / det;
      const indirect = pathA * pathB;
      return ok(
        [
          { label: "n", value: n },
          { label: "c (X→Y total)", value: fmt(pathC) },
          { label: "a (X→M)", value: fmt(pathA) },
          { label: "b (M→Y | X)", value: fmt(pathB) },
          { label: "c′ (X→Y | M)", value: fmt(pathCprime) },
          { label: "Indirect a·b", value: fmt(indirect) },
        ],
        [{ title: "Mediator paths", detail: "OLS Baron–Kenny path estimates (educational)" }],
      );
    }

    case "moderator": {
      // y ~ x + w + x*w ; columns y,x,w
      const rows = parseMatrix(input.data ?? "");
      if (rows.length < 5 || rows[0].length < 3) throw new Error("Paste rows as y,x,w");
      const y = rows.map((r) => r[0]);
      const x = rows.map((r) => r[1] - mean(rows.map((z) => z[1])));
      const w = rows.map((r) => r[2] - mean(rows.map((z) => z[2])));
      const xw = x.map((xi, i) => xi * w[i]);
      const n = y.length;
      // Solve 3-predictor OLS with intercept via normal equations (4x4)
      const X = y.map((_, i) => [1, x[i], w[i], xw[i]]);
      const xtx = Array.from({ length: 4 }, () => Array(4).fill(0));
      const xty = Array(4).fill(0);
      for (let i = 0; i < n; i++) {
        for (let a = 0; a < 4; a++) {
          xty[a] += X[i][a] * y[i];
          for (let b = 0; b < 4; b++) xtx[a][b] += X[i][a] * X[i][b];
        }
      }
      // Gaussian elimination
      const A = xtx.map((row, i) => [...row, xty[i]]);
      for (let col = 0; col < 4; col++) {
        let piv = col;
        for (let r = col + 1; r < 4; r++) if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
        [A[col], A[piv]] = [A[piv], A[col]];
        const div = A[col][col] || 1e-12;
        for (let j = col; j < 5; j++) A[col][j] /= div;
        for (let r = 0; r < 4; r++) {
          if (r === col) continue;
          const f = A[r][col];
          for (let j = col; j < 5; j++) A[r][j] -= f * A[col][j];
        }
      }
      const beta = A.map((r) => r[4]);
      return ok(
        [
          { label: "n", value: n },
          { label: "Intercept", value: fmt(beta[0]) },
          { label: "b_X", value: fmt(beta[1]) },
          { label: "b_W", value: fmt(beta[2]) },
          { label: "b_XW (interaction)", value: fmt(beta[3]) },
        ],
        [{ title: "Moderator model", detail: "Centered y ~ x + w + x·w" }],
      );
    }

    case "gage-rr": {
      // Nested/crossed simplified: operators × parts matrix of means OR list of replicates
      // Input: rows = parts, cols = operators (one measurement each) — ANOVA Gage R&R approx
      const table = parseMatrix(input.data ?? "");
      if (table.length < 2 || table[0].length < 2) throw new Error("Paste parts × operators measurements.");
      const p = table.length;
      const o = table[0].length;
      const all = table.flat();
      const grand = mean(all);
      let ssParts = 0;
      let ssOps = 0;
      let ssErr = 0;
      const partMeans = table.map((r) => mean(r));
      const opMeans = table[0].map((_, j) => mean(table.map((r) => r[j])));
      for (let i = 0; i < p; i++) ssParts += o * (partMeans[i] - grand) ** 2;
      for (let j = 0; j < o; j++) ssOps += p * (opMeans[j] - grand) ** 2;
      for (let i = 0; i < p; i++) {
        for (let j = 0; j < o; j++) {
          const pred = partMeans[i] + opMeans[j] - grand;
          ssErr += (table[i][j] - pred) ** 2;
        }
      }
      const msParts = ssParts / (p - 1);
      const msOps = ssOps / (o - 1);
      const msErr = ssErr / ((p - 1) * (o - 1) || 1);
      const varRepeat = Math.max(0, msErr);
      const varOps = Math.max(0, (msOps - msErr) / p);
      const varParts = Math.max(0, (msParts - msErr) / o);
      const varGage = varRepeat + varOps;
      const varTotal = varGage + varParts;
      return ok(
        [
          { label: "Parts", value: p },
          { label: "Operators", value: o },
          { label: "σ² repeatability", value: fmt(varRepeat) },
          { label: "σ² operators", value: fmt(varOps) },
          { label: "σ² Gage R&R", value: fmt(varGage) },
          { label: "σ² parts", value: fmt(varParts) },
          { label: "%Gage of total", value: fmt((varGage / (varTotal || 1)) * 100) },
        ],
        [{ title: "Gage R&R (ANOVA approx)", detail: "Crossed parts×operators, one replicate" }],
      );
    }

    case "process-cap-nonnormal": {
      // Percentile method capability
      const data = parseNumbers(input.data ?? "");
      if (data.length < 10) throw new Error("Enter at least 10 observations.");
      const lsl = num(input, "lsl");
      const usl = num(input, "usl");
      const sorted = [...data].sort((a, b) => a - b);
      const q = (p: number) => {
        const idx = (p / 100) * (sorted.length - 1);
        const lo = Math.floor(idx);
        const hi = Math.ceil(idx);
        return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
      };
      const p0_135 = q(0.135);
      const p50 = q(50);
      const p99_865 = q(99.865);
      const pp = (usl - lsl) / (p99_865 - p0_135);
      const ppk = Math.min((usl - p50) / (p99_865 - p50), (p50 - lsl) / (p50 - p0_135));
      return ok(
        [
          { label: "n", value: data.length },
          { label: "P0.135", value: fmt(p0_135) },
          { label: "Median", value: fmt(p50) },
          { label: "P99.865", value: fmt(p99_865) },
          { label: "Pp (percentile)", value: fmt(pp) },
          { label: "Ppk (percentile)", value: fmt(ppk) },
        ],
        [{ title: "Non-normal capability", detail: "Percentile method using 0.135 / 50 / 99.865" }],
      );
    }

    case "monte-carlo": {
      const n = Math.min(100000, Math.max(100, Math.floor(num(input, "n", 5000))));
      const dist = (input.dist ?? "normal").toLowerCase();
      const samples: number[] = [];
      for (let i = 0; i < n; i++) {
        if (dist === "uniform") samples.push(num(input, "a", 0) + Math.random() * (num(input, "b", 1) - num(input, "a", 0)));
        else if (dist === "exponential") {
          const lambda = num(input, "lambda", 1);
          samples.push(-Math.log(1 - Math.random()) / lambda);
        } else {
          // Box-Muller
          const u1 = Math.random();
          const u2 = Math.random();
          const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
          samples.push(num(input, "mean", 0) + num(input, "sd", 1) * z);
        }
      }
      const thr = Number(input.threshold);
      const m = mean(samples);
      const s = stdev(samples, true);
      const fields: CalcResult["fields"] = [
        { label: "Draws", value: n },
        { label: "Mean", value: fmt(m) },
        { label: "SD", value: fmt(s) },
        { label: "Min", value: fmt(Math.min(...samples)) },
        { label: "Max", value: fmt(Math.max(...samples)) },
      ];
      if (Number.isFinite(thr)) {
        const prob = samples.filter((v) => v > thr).length / n;
        fields.push({ label: `P(X > ${fmt(thr)})`, value: fmt(prob) });
      }
      return ok(fields, [{ title: "Monte Carlo", detail: `${dist} simulation` }]);
    }

    case "tost": {
      // Two one-sided tests for equivalence of means (paired or two-sample via difference)
      const data = parseNumbers(input.data ?? "");
      const low = num(input, "low", -0.5);
      const high = num(input, "high", 0.5);
      const alpha = num(input, "alpha", 0.05);
      if (data.length < 3) throw new Error("Enter differences (or one sample of differences).");
      const m = mean(data);
      const se = stdev(data, true) / Math.sqrt(data.length);
      const df = data.length - 1;
      const t1 = (m - low) / se; // H0: m <= low
      const t2 = (high - m) / se; // H0: m >= high
      const p1 = 1 - jStat.studentt.cdf(t1, df);
      const p2 = 1 - jStat.studentt.cdf(t2, df);
      const p = Math.max(p1, p2);
      const equiv = p1 < alpha && p2 < alpha;
      return ok(
        [
          { label: "n", value: data.length },
          { label: "Mean diff", value: fmt(m) },
          { label: "SE", value: fmt(se) },
          { label: "Equivalence bounds", value: `[${fmt(low)}, ${fmt(high)}]` },
          { label: "TOST p", value: fmtP(p) },
          { label: "Equivalent at α?", value: equiv ? "Yes" : "No" },
        ],
        [{ title: "TOST equivalence", detail: "Reject both one-sided nulls inside [low, high]" }],
      );
    }

    case "fractional-factorial": {
      const k = Math.min(6, Math.max(2, Math.floor(num(input, "k", 4))));
      const p = Math.min(k - 1, Math.max(1, Math.floor(num(input, "p", 1))));
      const runs = 2 ** (k - p);
      return ok(
        [
          { label: "Factors k", value: k },
          { label: "Fraction 2^(k-p)", value: `2^${k - p}` },
          { label: "Runs", value: runs },
          { label: "Resolution note", value: p === 1 ? "Half-fraction (often Resolution V/IV depending on generators)" : "Smaller fraction — check aliasing" },
        ],
        [{ title: "Fractional factorial", detail: "Run count planner for 2^(k-p) designs" }],
      );
    }

    case "plackett-burman": {
      const k = Math.min(27, Math.max(3, Math.floor(num(input, "k", 7))));
      // PB runs are multiple of 4, > k
      let runs = Math.ceil((k + 1) / 4) * 4;
      if (runs <= k) runs += 4;
      return ok(
        [
          { label: "Factors", value: k },
          { label: "PB runs (N)", value: runs },
          { label: "Design type", value: "Screening (main effects)" },
        ],
        [{ title: "Plackett–Burman", detail: "N ≡ 0 (mod 4), N > k screening design size" }],
      );
    }

    case "box-behnken": {
      const k = Math.min(7, Math.max(3, Math.floor(num(input, "k", 3))));
      // Approximate BB run formula: 2k(k-1) + center
      const centers = Math.max(1, Math.floor(num(input, "centers", 3)));
      const runs = 2 * k * (k - 1) + centers;
      return ok(
        [
          { label: "Factors", value: k },
          { label: "Center points", value: centers },
          { label: "Approx runs", value: runs },
        ],
        [{ title: "Box–Behnken", detail: "Response-surface design size ≈ 2k(k−1)+n_c" }],
      );
    }

    case "central-composite": {
      const k = Math.min(6, Math.max(2, Math.floor(num(input, "k", 3))));
      const centers = Math.max(1, Math.floor(num(input, "centers", 6)));
      const cube = 2 ** k;
      const axial = 2 * k;
      const runs = cube + axial + centers;
      return ok(
        [
          { label: "Factors", value: k },
          { label: "Cube points", value: cube },
          { label: "Axial points", value: axial },
          { label: "Center points", value: centers },
          { label: "Total runs", value: runs },
        ],
        [{ title: "Central composite design", detail: "CCD = 2^k + 2k + n_c" }],
      );
    }

    case "vif": {
      // columns = predictors; compute VIF from correlations / R^2 of each vs others (pairwise approx for 2, full for more via OLS R2)
      const m = parseMatrix(input.data ?? "");
      if (m.length < 5 || m[0].length < 2) throw new Error("Paste predictor matrix (rows=obs, cols=predictors).");
      const n = m.length;
      const p = m[0].length;
      const cols = Array.from({ length: p }, (_, j) => m.map((r) => r[j]));
      const vifs: number[] = [];
      for (let j = 0; j < p; j++) {
        const y = cols[j];
        const others = cols.filter((_, idx) => idx !== j);
        // multiple R^2 via successive projection (Gram on others)
        // For simplicity use correlation with best linear combo via normal eq if p-1 predictors
        const X = y.map((_, i) => [1, ...others.map((c) => c[i])]);
        const q = others.length + 1;
        const xtx = Array.from({ length: q }, () => Array(q).fill(0));
        const xty = Array(q).fill(0);
        for (let i = 0; i < n; i++) {
          for (let a = 0; a < q; a++) {
            xty[a] += X[i][a] * y[i];
            for (let b = 0; b < q; b++) xtx[a][b] += X[i][a] * X[i][b];
          }
        }
        const A = xtx.map((row, i) => [...row, xty[i]]);
        for (let col = 0; col < q; col++) {
          let piv = col;
          for (let r = col + 1; r < q; r++) if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
          [A[col], A[piv]] = [A[piv], A[col]];
          const div = A[col][col] || 1e-12;
          for (let j2 = col; j2 <= q; j2++) A[col][j2] /= div;
          for (let r = 0; r < q; r++) {
            if (r === col) continue;
            const f = A[r][col];
            for (let j2 = col; j2 <= q; j2++) A[r][j2] -= f * A[col][j2];
          }
        }
        const beta = A.map((r) => r[q]);
        let ssTot = 0;
        let ssRes = 0;
        const my = mean(y);
        for (let i = 0; i < n; i++) {
          const pred = beta.reduce((s, b, idx) => s + b * X[i][idx], 0);
          ssTot += (y[i] - my) ** 2;
          ssRes += (y[i] - pred) ** 2;
        }
        const r2 = 1 - ssRes / (ssTot || 1);
        vifs.push(1 / Math.max(1e-12, 1 - r2));
      }
      return ok(
        vifs.map((v, i) => ({ label: `VIF x${i + 1}`, value: fmt(v) })),
        [{ title: "Variance inflation factors", detail: "VIF_j = 1/(1−R²_j)" }],
      );
    }

    case "matrix-ops": {
      const op = input.op ?? "det";
      const a = parseMatrix(input.a ?? input.data ?? "");
      if (!a.length) throw new Error("Paste matrix A.");
      if (op === "transpose") {
        const t = a[0].map((_, j) => a.map((r) => r[j]));
        return ok(
          [{ label: "Aᵀ", value: t.map((r) => r.map((v) => fmt(v)).join(" ")).join(" | ") }],
          [{ title: "Transpose", detail: `${a.length}×${a[0].length} → ${t.length}×${t[0].length}` }],
        );
      }
      if (op === "add") {
        const b = parseMatrix(input.b ?? "");
        if (b.length !== a.length || b[0].length !== a[0].length) throw new Error("A and B must match.");
        const s = a.map((r, i) => r.map((v, j) => v + b[i][j]));
        return ok(
          [{ label: "A+B", value: s.map((r) => r.map((v) => fmt(v)).join(" ")).join(" | ") }],
          [{ title: "Matrix addition", detail: "Element-wise sum" }],
        );
      }
      if (op === "mul") {
        const b = parseMatrix(input.b ?? "");
        if (a[0].length !== b.length) throw new Error("Inner dimensions must agree.");
        const out = a.map((row) =>
          b[0].map((_, j) => row.reduce((s, aik, k) => s + aik * b[k][j], 0)),
        );
        return ok(
          [{ label: "A×B", value: out.map((r) => r.map((v) => fmt(v)).join(" ")).join(" | ") }],
          [{ title: "Matrix multiply", detail: `${a.length}×${a[0].length} · ${b.length}×${b[0].length}` }],
        );
      }
      // determinant 2x2 / 3x3
      if (a.length !== a[0].length) throw new Error("Determinant needs a square matrix.");
      const det2 = (m: number[][]) => m[0][0] * m[1][1] - m[0][1] * m[1][0];
      let det: number;
      if (a.length === 1) det = a[0][0];
      else if (a.length === 2) det = det2(a);
      else if (a.length === 3) {
        det =
          a[0][0] * det2([
            [a[1][1], a[1][2]],
            [a[2][1], a[2][2]],
          ]) -
          a[0][1] * det2([
            [a[1][0], a[1][2]],
            [a[2][0], a[2][2]],
          ]) +
          a[0][2] * det2([
            [a[1][0], a[1][1]],
            [a[2][0], a[2][1]],
          ]);
      } else throw new Error("Determinant supported up to 3×3 in this calculator.");
      return ok([{ label: "det(A)", value: fmt(det) }], [{ title: "Determinant", detail: `${a.length}×${a.length}` }]);
    }

    case "stratified-n": {
      const N = num(input, "N", 10000);
      const moe = num(input, "moe", 0.05);
      const p = num(input, "p", 0.5);
      const conf = num(input, "level", 0.95);
      const z = jStat.normal.inv(1 - (1 - conf) / 2, 0, 1);
      const n0 = (z * z * p * (1 - p)) / (moe * moe);
      const fpc = n0 / (1 + (n0 - 1) / N);
      return ok(
        [
          { label: "n (infinite pop)", value: Math.ceil(n0) },
          { label: "n with FPC", value: Math.ceil(fpc) },
          { label: "Population N", value: N },
        ],
        [{ title: "Sample size + FPC", detail: `n_adj = n0 / (1+(n0−1)/N)` }],
      );
    }

    case "slope-test": {
      const { x, y } = parsePaired(input.data ?? "");
      if (x.length < 3) throw new Error("Need paired x,y.");
      const n = x.length;
      const mx = mean(x);
      const my = mean(y);
      let sxx = 0;
      let sxy = 0;
      for (let i = 0; i < n; i++) {
        sxx += (x[i] - mx) ** 2;
        sxy += (x[i] - mx) * (y[i] - my);
      }
      const b1 = sxy / sxx;
      const b0 = my - b1 * mx;
      let sse = 0;
      for (let i = 0; i < n; i++) {
        const pred = b0 + b1 * x[i];
        sse += (y[i] - pred) ** 2;
      }
      const s = Math.sqrt(sse / (n - 2));
      const se = s / Math.sqrt(sxx);
      const t = b1 / se;
      const p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), n - 2));
      const tcrit = jStat.studentt.inv(0.975, n - 2);
      return ok(
        [
          { label: "Slope b1", value: fmt(b1) },
          { label: "SE(b1)", value: fmt(se) },
          { label: "t", value: fmt(t) },
          { label: "p", value: fmtP(p) },
          { label: "95% CI", value: `[${fmt(b1 - tcrit * se)}, ${fmt(b1 + tcrit * se)}]` },
        ],
        [{ title: "Slope test / CI", detail: "H0: β1 = 0" }],
        apaTest({ test: "Regression slope", statistic: "t", value: t, df: n - 2, p }),
      );
    }

    default:
      return null;
  }
}

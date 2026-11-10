import jStat from "jstat";
import {
  basicStatistics,
  correlation,
  covariance,
  cv,
  fiveNumberSummary,
  frequencyTable,
  fullDescriptive,
  geometricMean,
  harmonicMean,
  iqrOutliers,
  kurtosis,
  kurtosisExcess,
  mad,
  mean,
  median,
  medianAbsoluteDeviation,
  midrange,
  mode,
  percentile,
  quartiles,
  range,
  rootMeanSquare,
  skewness,
  stdev,
  sum,
  sumOfSquares,
  variance,
  zScores,
} from "@/lib/stats/descriptive";
import {
  chiSquareGof,
  chiSquareIndependence,
  fishersExact,
  grubbsOutliers,
  kruskalWallis,
  mannWhitney,
  oneProportionZ,
  oneSampleT,
  oneSampleZ,
  oneWayAnova,
  pairedT,
  shapiroWilkApprox,
  twoProportionZ,
  twoSampleT,
  twoSampleZ,
  wilcoxonSignedRank,
  type Alternative,
} from "@/lib/stats/hypothesis";
import {
  correlationCI,
  diffMeansCI,
  diffPropsCI,
  marginOfError,
  meanCI,
  proportionCI,
  sdCI,
} from "@/lib/stats/confidence";
import {
  exponentialRegression,
  logisticRegression,
  multipleLinearRegression,
  quadraticRegression,
  simpleLinearRegression,
} from "@/lib/stats/regression";
import {
  cca as runCca,
  cfaOneFactor,
  efa as runEfa,
  lda as runLda,
  pca as runPca,
  tobitMLE,
} from "@/lib/stats/multivariate";
import { parseGroups, parseMatrix, parseNumbers, parsePaired } from "@/lib/stats/parse";
import { apaTest, fmt, fmtP, type CalcResult } from "@/lib/stats/format";
import { runSoupStats } from "@/lib/calculators/engines/soupStats";
import { runSoupMath } from "@/lib/calculators/engines/soupMath";
import { runSoupFinance } from "@/lib/calculators/engines/soupFinance";
import { runSoupGeometry } from "@/lib/calculators/engines/soupGeometry";
import { runSoupConvert } from "@/lib/calculators/engines/soupConvert";
import { runSoupMore } from "@/lib/calculators/engines/soupMore";
import { runSoupMath2 } from "@/lib/calculators/engines/soupMath2";
import { runSoupExtras } from "@/lib/calculators/engines/soupExtras";
import { runSoupAdvStats } from "@/lib/calculators/engines/soupAdvStats";

export type EngineInput = Record<string, string>;

function alt(input: EngineInput): Alternative {
  const a = (input.alternative ?? "two-sided").toLowerCase();
  if (a === "less" || a === "left") return "less";
  if (a === "greater" || a === "right") return "greater";
  return "two-sided";
}

function alpha(input: EngineInput) {
  return Number(input.alpha ?? 0.05);
}

function level(input: EngineInput) {
  return Number(input.level ?? 0.95);
}

function needData(input: EngineInput, min = 2): number[] {
  const d = parseNumbers(input.data ?? "");
  if (d.length < min) throw new Error(`Enter at least ${min} numbers in the data field.`);
  return d;
}

function isSample(input: EngineInput): boolean {
  return (input.sampleType ?? "sample").toLowerCase() !== "population";
}

function ok(fields: CalcResult["fields"], steps: CalcResult["steps"], apa?: string): CalcResult {
  return { fields, steps, apa };
}

function fail(error: string): CalcResult {
  return { fields: [], steps: [], error };
}

function wrap(fn: () => CalcResult): CalcResult {
  try {
    return fn();
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Calculation failed.");
  }
}

function descriptivePaste(
  input: EngineInput,
  compute: (data: number[]) => CalcResult,
): CalcResult {
  return wrap(() => compute(needData(input)));
}

export function runEngine(engine: string, input: EngineInput): CalcResult {
  return wrap(() => {
    const soupStats = runSoupStats(engine, input);
    if (soupStats) return soupStats;
    const soupMath = runSoupMath(engine, input);
    if (soupMath) return soupMath;
    const soupFinance = runSoupFinance(engine, input);
    if (soupFinance) return soupFinance;
    const soupGeometry = runSoupGeometry(engine, input);
    if (soupGeometry) return soupGeometry;
    const soupConvert = runSoupConvert(engine, input);
    if (soupConvert) return soupConvert;
    const soupMore = runSoupMore(engine, input);
    if (soupMore) return soupMore;
    const soupMath2 = runSoupMath2(engine, input);
    if (soupMath2) return soupMath2;
    const soupExtras = runSoupExtras(engine, input);
    if (soupExtras) return soupExtras;
    const soupAdv = runSoupAdvStats(engine, input);
    if (soupAdv) return soupAdv;

    switch (engine) {
      case "mean-median-mode":
        return descriptivePaste(input, (data) => {
          const m = mean(data);
          const med = median(data);
          const modes = mode(data);
          return ok(
            [
              { label: "n", value: data.length },
              { label: "Mean", value: fmt(m) },
              { label: "Median", value: fmt(med) },
              { label: "Mode", value: modes.length ? modes.map(fmt).join(", ") : "No unique mode" },
            ],
            [
              { title: "Sort & count", detail: `n = ${data.length}` },
              { title: "Mean", detail: `Σx / n = ${fmt(m)}` },
              { title: "Median", detail: `Middle value = ${fmt(med)}` },
              { title: "Mode", detail: modes.length ? `Most frequent: ${modes.join(", ")}` : "All frequencies equal" },
            ],
          );
        });

      case "average":
        return descriptivePaste(input, (data) => {
          const m = mean(data);
          return ok(
            [
              { label: "n", value: data.length },
              { label: "Sum", value: fmt(sum(data)) },
              { label: "Average (mean)", value: fmt(m) },
            ],
            [
              { title: "Sum the data", detail: `Σx = ${fmt(sum(data))}` },
              { title: "Divide by n", detail: `average = Σx / n = ${fmt(m)}` },
            ],
          );
        });

      case "sum":
        return descriptivePaste(input, (data) => {
          const total = sum(data);
          return ok(
            [
              { label: "n", value: data.length },
              { label: "Sum", value: fmt(total) },
            ],
            [{ title: "Addition", detail: `Σx = ${fmt(total)}` }],
          );
        });

      case "basic-stats":
        return descriptivePaste(input, (data) => {
          const sample = isSample(input);
          const d = basicStatistics(data, sample);
          const modes = d.mode;
          return ok(
            [
              { label: "Minimum", value: fmt(d.min) },
              { label: "Maximum", value: fmt(d.max) },
              { label: "Range", value: fmt(d.range) },
              { label: "Count n", value: d.n },
              { label: "Sum", value: fmt(d.sum) },
              { label: "Mean", value: fmt(d.mean) },
              { label: "Median", value: fmt(d.median) },
              { label: "Mode", value: modes.length ? modes.map(fmt).join(", ") : "No unique mode" },
              { label: sample ? "SD (sample)" : "SD (population)", value: fmt(d.stdev) },
              { label: sample ? "Variance (sample)" : "Variance (population)", value: fmt(d.variance) },
            ],
            [
              { title: "Data type", detail: sample ? "Sample formulas (n − 1)" : "Population formulas (n)" },
              { title: "Center", detail: `mean=${fmt(d.mean)}, median=${fmt(d.median)}` },
              { title: "Spread", detail: `SD=${fmt(d.stdev)}, variance=${fmt(d.variance)}` },
            ],
          );
        });

      case "descriptive-full":
        return descriptivePaste(input, (data) => {
          const sample = isSample(input);
          const d = fullDescriptive(data, sample);
          const freqPreview = d.frequency
            .slice(0, 12)
            .map((r) => `${r.value}:${r.count}`)
            .join(", ");
          return ok(
            [
              { label: "Data type", value: sample ? "Sample" : "Population" },
              { label: "Minimum", value: fmt(d.min) },
              { label: "Maximum", value: fmt(d.max) },
              { label: "Range", value: fmt(d.range) },
              { label: "Count n", value: d.n },
              { label: "Sum", value: fmt(d.sum) },
              { label: "Mean", value: fmt(d.mean) },
              { label: "Median", value: fmt(d.median) },
              { label: "Mode", value: d.mode.length ? d.mode.map(fmt).join(", ") : "No unique mode" },
              { label: "Midrange", value: fmt(d.midrange) },
              { label: sample ? "SD (sample)" : "SD (population)", value: fmt(d.stdev) },
              { label: sample ? "Variance (sample)" : "Variance (population)", value: fmt(d.variance) },
              { label: "Q1", value: fmt(d.q1) },
              { label: "Q2 (median)", value: fmt(d.q2) },
              { label: "Q3", value: fmt(d.q3) },
              { label: "IQR", value: fmt(d.iqr) },
              { label: "Lower fence", value: fmt(d.lowerFence) },
              { label: "Upper fence", value: fmt(d.upperFence) },
              { label: "Outliers (IQR)", value: d.outliers.length ? d.outliers.map(fmt).join(", ") : "None" },
              { label: "Sum of squares SS", value: fmt(d.sumOfSquares) },
              { label: "Mean absolute deviation", value: fmt(d.mad) },
              { label: "Root mean square", value: fmt(d.rms) },
              { label: "SE of mean", value: fmt(d.seMean) },
              { label: "Skewness", value: fmt(d.skewness) },
              { label: "Kurtosis", value: fmt(d.kurtosis) },
              { label: "Kurtosis excess", value: fmt(d.kurtosisExcess) },
              { label: "CV (%)", value: Number.isFinite(d.cv) ? fmt(d.cv) : "—" },
              { label: "RSD (%)", value: Number.isFinite(d.rsd) ? fmt(d.rsd) : "—" },
              { label: "Frequency (value:count)", value: freqPreview || "—" },
            ],
            [
              { title: "Sample size", detail: `n = ${d.n}` },
              { title: "Center", detail: `mean=${fmt(d.mean)}, median=${fmt(d.median)}, midrange=${fmt(d.midrange)}` },
              { title: "Spread", detail: `SD=${fmt(d.stdev)}, IQR=${fmt(d.iqr)}, SS=${fmt(d.sumOfSquares)}` },
              { title: "Shape & outliers", detail: `skew=${fmt(d.skewness)}, excess kurtosis=${fmt(d.kurtosisExcess)}, outliers=${d.outliers.length}` },
            ],
          );
        });

      case "percent-error": {
        const experimental = Number(input.experimental);
        const theoretical = Number(input.theoretical);
        if (![experimental, theoretical].every(Number.isFinite)) {
          throw new Error("Enter experimental and theoretical values.");
        }
        if (theoretical === 0) throw new Error("Theoretical value cannot be 0.");
        const err = ((experimental - theoretical) / Math.abs(theoretical)) * 100;
        return ok(
          [
            { label: "Experimental", value: fmt(experimental) },
            { label: "Theoretical", value: fmt(theoretical) },
            { label: "Percent error", value: `${fmt(err)}%` },
            { label: "Absolute percent error", value: `${fmt(Math.abs(err))}%` },
          ],
          [
            {
              title: "Percent error",
              detail: `((experimental − theoretical) / |theoretical|) × 100% = ${fmt(err)}%`,
            },
          ],
        );
      }

      case "odds-prob": {
        const a = Number(input.oddsFor ?? 1);
        const b = Number(input.oddsAgainst ?? 1);
        if (![a, b].every((v) => Number.isFinite(v) && v >= 0) || a + b === 0) {
          throw new Error("Enter non-negative odds for and against.");
        }
        const p = a / (a + b);
        return ok(
          [
            { label: "Odds", value: `${fmt(a)} : ${fmt(b)}` },
            { label: "Probability", value: fmt(p) },
            { label: "Percent chance", value: `${fmt(p * 100)}%` },
            { label: "Odds against win", value: `${fmt(b)} : ${fmt(a)}` },
          ],
          [
            { title: "Convert odds", detail: `P(win) = a / (a + b) = ${fmt(p)}` },
            { title: "Percent", detail: `${fmt(p * 100)}% chance of success` },
          ],
        );
      }

      case "vote-percent": {
        const votes = needData(input, 2);
        if (votes.length > 3) throw new Error("Enter 2 or 3 vote counts.");
        const total = sum(votes);
        if (total <= 0) throw new Error("Vote counts must sum to a positive total.");
        return ok(
          [
            { label: "Total", value: fmt(total) },
            ...votes.map((v, i) => ({
              label: `Share ${i + 1}`,
              value: `${fmt(v)} (${fmt((v / total) * 100)}%)`,
            })),
          ],
          [{ title: "Percent of total", detail: `each count ÷ ${fmt(total)} × 100%` }],
        );
      }

      case "five-number":
        return descriptivePaste(input, (data) => {
          const f = fiveNumberSummary(data);
          const fences = iqrOutliers(data);
          return ok(
            [
              { label: "Min", value: fmt(f.min) },
              { label: "Q1", value: fmt(f.q1) },
              { label: "Median", value: fmt(f.median) },
              { label: "Q3", value: fmt(f.q3) },
              { label: "Max", value: fmt(f.max) },
              { label: "Range", value: fmt(f.max - f.min) },
              { label: "IQR", value: fmt(f.q3 - f.q1) },
              { label: "Outliers", value: fences.outliers.length ? fences.outliers.map(fmt).join(", ") : "None" },
            ],
            [
              { title: "Order statistics", detail: "Sort data, then find min, Q1, median, Q3, max." },
              { title: "Outlier fences", detail: `Q1−1.5·IQR to Q3+1.5·IQR` },
            ],
          );
        });

      case "range-var-sd":
        return descriptivePaste(input, (data) => {
          const sample = isSample(input);
          return ok(
            [
              { label: "Range", value: fmt(range(data)) },
              { label: "Sum of squares", value: fmt(sumOfSquares(data)) },
              { label: sample ? "Variance (sample)" : "Variance (population)", value: fmt(variance(data, sample)) },
              { label: sample ? "SD (sample)" : "SD (population)", value: fmt(stdev(data, sample)) },
              { label: "RMS", value: fmt(rootMeanSquare(data)) },
              { label: "Midrange", value: fmt(midrange(data)) },
            ],
            [
              { title: "Range", detail: `max − min = ${fmt(range(data))}` },
              {
                title: "Variance",
                detail: sample
                  ? `s² = Σ(x−x̄)²/(n−1) = ${fmt(variance(data, true))}`
                  : `σ² = Σ(x−μ)²/n = ${fmt(variance(data, false))}`,
              },
            ],
          );
        });

      case "cv":
        return descriptivePaste(input, (data) => {
          const sample = isSample(input);
          const value = cv(data, sample);
          return ok(
            [
              { label: "CV (%)", value: fmt(value) },
              { label: "RSD (%)", value: fmt(value) },
            ],
            [{ title: "CV / RSD", detail: `(s / |mean|) × 100% = ${fmt(value)}%` }],
          );
        });

      case "mad":
        return descriptivePaste(input, (data) =>
          ok([{ label: "MAD", value: fmt(mad(data)) }], [{ title: "MAD", detail: `mean |x − x̄| = ${fmt(mad(data))}` }]),
        );

      case "medad":
        return descriptivePaste(input, (data) =>
          ok(
            [{ label: "Median AD", value: fmt(medianAbsoluteDeviation(data)) }],
            [{ title: "Median AD", detail: `median |x − median| = ${fmt(medianAbsoluteDeviation(data))}` }],
          ),
        );

      case "percentile": {
        const data = needData(input);
        const p = Number(input.percentile ?? 50);
        const q = quartiles(data);
        return ok(
          [
            { label: `P${p}`, value: fmt(percentile(data, p)) },
            { label: "Q1", value: fmt(q.q1) },
            { label: "Q2", value: fmt(q.q2) },
            { label: "Q3", value: fmt(q.q3) },
            { label: "IQR", value: fmt(q.iqr) },
          ],
          [{ title: "Percentile", detail: `Linear interpolation at p=${p}` }],
        );
      }

      case "geomean":
        return descriptivePaste(input, (data) =>
          ok([{ label: "Geometric mean", value: fmt(geometricMean(data)) }], [{ title: "Geo mean", detail: `exp(mean(ln x))` }]),
        );

      case "harmean":
        return descriptivePaste(input, (data) =>
          ok([{ label: "Harmonic mean", value: fmt(harmonicMean(data)) }], [{ title: "Harmonic mean", detail: `n / Σ(1/x)` }]),
        );

      case "skewness":
        return descriptivePaste(input, (data) => {
          const sample = isSample(input);
          return ok(
            [{ label: "Skewness", value: fmt(skewness(data, sample)) }],
            [{ title: "Skewness", detail: sample ? "Bias-corrected sample skewness" : "Population standardized 3rd moment" }],
          );
        });

      case "kurtosis":
        return descriptivePaste(input, (data) => {
          const sample = isSample(input);
          return ok(
            [
              { label: "Kurtosis", value: fmt(kurtosis(data, sample)) },
              { label: "Excess kurtosis", value: fmt(kurtosisExcess(data, sample)) },
            ],
            [{ title: "Kurtosis", detail: "Excess kurtosis ≈ 0 for a normal distribution" }],
          );
        });

      case "zscore": {
        const data = needData(input, 1);
        const sample = isSample(input);
        if (data.length === 1) {
          const m = Number(input.mean);
          const s = Number(input.sd);
          if (!Number.isFinite(m) || !Number.isFinite(s) || s === 0) {
            throw new Error("For a single value, provide population/sample mean and sd.");
          }
          const z = (data[0] - m) / s;
          return ok(
            [{ label: "z", value: fmt(z) }],
            [{ title: "z-score", detail: `(x − μ) / σ = ${fmt(z)}` }],
          );
        }
        const zs = zScores(data, sample);
        return ok(
          [
            { label: "Mean", value: fmt(mean(data)) },
            { label: sample ? "SD (sample)" : "SD (population)", value: fmt(stdev(data, sample)) },
            { label: "Z-scores", value: zs.map(fmt).join(", ") },
          ],
          [{ title: "Standardize", detail: "z = (x − mean) / SD for each value" }],
        );
      }

      case "correlation":
      case "covariance": {
        const { x, y } = parsePaired(input.data ?? input.paired ?? "");
        if (x.length < 2) throw new Error("Paste paired x,y rows or two equal-length series.");
        if (engine === "correlation") {
          const r = correlation(x, y);
          return ok(
            [
              { label: "n", value: x.length },
              { label: "r", value: fmt(r) },
              { label: "r²", value: fmt(r * r) },
            ],
            [{ title: "Pearson r", detail: `r = ${fmt(r)}` }],
          );
        }
        const cov = covariance(x, y);
        return ok(
          [
            { label: "n", value: x.length },
            { label: "Covariance", value: fmt(cov) },
          ],
          [{ title: "Sample covariance", detail: `cov = ${fmt(cov)}` }],
        );
      }

      case "partial-corr": {
        // Paste 3 columns: x y z
        const lines = (input.data ?? "")
          .trim()
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        const X: number[] = [];
        const Y: number[] = [];
        const Z: number[] = [];
        for (const line of lines) {
          const p = line.split(/[,;\t\s]+/).map(Number);
          if (p.length >= 3 && p.every(Number.isFinite)) {
            X.push(p[0]);
            Y.push(p[1]);
            Z.push(p[2]);
          }
        }
        if (X.length < 3) throw new Error("Paste at least 3 rows of x,y,z.");
        const rxy = correlation(X, Y);
        const rxz = correlation(X, Z);
        const ryz = correlation(Y, Z);
        const r = (rxy - rxz * ryz) / Math.sqrt((1 - rxz ** 2) * (1 - ryz ** 2));
        return ok(
          [{ label: "Partial r (x,y|z)", value: fmt(r) }],
          [{ title: "Partial correlation", detail: `r_{xy.z} = ${fmt(r)}` }],
        );
      }

      case "freq-table":
        return descriptivePaste(input, (data) => {
          const rows = frequencyTable(data);
          return ok(
            rows.map((r) => ({
              label: String(r.value),
              value: `${r.count} (${fmt(r.relative * 100)}%)`,
            })),
            [{ title: "Frequencies", detail: `${rows.length} distinct values` }],
          );
        });

      case "contingency": {
        const m = parseMatrix(input.data ?? input.matrix ?? "");
        if (!m.length) throw new Error("Paste a contingency table (rows of counts).");
        const rowSums = m.map((r) => r.reduce((a, b) => a + b, 0));
        const colSums = m[0].map((_, j) => m.reduce((s, r) => s + r[j], 0));
        const N = rowSums.reduce((a, b) => a + b, 0);
        return ok(
          [
            { label: "Rows × Cols", value: `${m.length} × ${m[0].length}` },
            { label: "N", value: N },
            { label: "Row totals", value: rowSums.join(", ") },
            { label: "Column totals", value: colSums.join(", ") },
          ],
          [{ title: "Margins", detail: "Computed row and column totals" }],
        );
      }

      case "cronbach": {
        // rows = respondents, cols = items
        const m = parseMatrix(input.data ?? "");
        if (m.length < 2 || m[0].length < 2) throw new Error("Paste respondent×item scores matrix.");
        const k = m[0].length;
        const itemVars = Array.from({ length: k }, (_, j) => variance(m.map((r) => r[j])));
        const totals = m.map((r) => r.reduce((a, b) => a + b, 0));
        const totalVar = variance(totals);
        const alphaCron =
          (k / (k - 1)) * (1 - itemVars.reduce((a, b) => a + b, 0) / totalVar);
        return ok(
          [{ label: "Cronbach α", value: fmt(alphaCron) }, { label: "Items", value: k }],
          [{ title: "Cronbach alpha", detail: `α = ${fmt(alphaCron)}` }],
        );
      }

      case "irr": {
        // two raters: paste pairs
        const { x, y } = parsePaired(input.data ?? "");
        if (x.length < 2) throw new Error("Paste paired rater scores.");
        const n = x.length;
        let agree = 0;
        for (let i = 0; i < n; i++) if (x[i] === y[i]) agree++;
        const po = agree / n;
        // crude kappa with categories from union
        const cats = [...new Set([...x, ...y])];
        let pe = 0;
        for (const c of cats) {
          const p1 = x.filter((v) => v === c).length / n;
          const p2 = y.filter((v) => v === c).length / n;
          pe += p1 * p2;
        }
        const kappa = (po - pe) / (1 - pe || 1);
        return ok(
          [
            { label: "Agreement %", value: fmt(po * 100) },
            { label: "Cohen κ (approx)", value: fmt(kappa) },
          ],
          [{ title: "Kappa", detail: `κ = (pₒ − pₑ)/(1 − pₑ) = ${fmt(kappa)}` }],
        );
      }

      case "likert":
        return descriptivePaste(input, (data) => {
          const d = fullDescriptive(data);
          return ok(
            [
              { label: "n", value: d.n },
              { label: "Mean", value: fmt(d.mean) },
              { label: "Median", value: fmt(d.median) },
              { label: "SD", value: fmt(d.stdev) },
              { label: "Min–Max", value: `${fmt(d.min)} – ${fmt(d.max)}` },
            ],
            [{ title: "Likert summary", detail: "Treat scores as ordinal/interval summary" }],
          );
        });

      case "response-rate": {
        const responses = Number(input.responses ?? input.successes);
        const invited = Number(input.invited ?? input.n);
        if (![responses, invited].every(Number.isFinite) || invited <= 0) {
          throw new Error("Provide responses and invited (sample size).");
        }
        const rate = (responses / invited) * 100;
        return ok(
          [{ label: "Response rate %", value: fmt(rate) }],
          [{ title: "Rate", detail: `${responses}/${invited} = ${fmt(rate)}%` }],
        );
      }

      case "process-cap": {
        const data = needData(input);
        const lsl = Number(input.lsl);
        const usl = Number(input.usl);
        if (![lsl, usl].every(Number.isFinite)) throw new Error("Provide LSL and USL.");
        const m = mean(data);
        const s = stdev(data);
        const cp = (usl - lsl) / (6 * s);
        const cpk = Math.min((usl - m) / (3 * s), (m - lsl) / (3 * s));
        return ok(
          [
            { label: "Mean", value: fmt(m) },
            { label: "SD", value: fmt(s) },
            { label: "Cp", value: fmt(cp) },
            { label: "Cpk", value: fmt(cpk) },
          ],
          [{ title: "Capability", detail: `Cp=${fmt(cp)}, Cpk=${fmt(cpk)}` }],
        );
      }

      case "one-sample-t": {
        const data = needData(input);
        const mu0 = Number(input.mu0 ?? 0);
        const r = oneSampleT(data, mu0, alt(input), alpha(input));
        return ok(
          [
            { label: "n", value: r.n },
            { label: "Mean", value: fmt(r.mean) },
            { label: "SD", value: fmt(r.sd) },
            { label: "t", value: fmt(r.t) },
            { label: "df", value: fmt(r.df) },
            { label: "p", value: fmtP(r.p) },
            { label: "Cohen d", value: fmt(r.d) },
            { label: "CI", value: `[${fmt(r.ci[0])}, ${fmt(r.ci[1])}]` },
          ],
          [
            { title: "Hypotheses", detail: `H0: μ = ${mu0}` },
            { title: "SE", detail: `s/√n = ${fmt(r.se)}` },
            { title: "t statistic", detail: `t = (x̄ − μ0)/SE = ${fmt(r.t)}` },
            { title: "p-value", detail: fmtP(r.p) },
          ],
          apaTest({ test: "One-sample t-test", statistic: "t", value: r.t, df: r.df, p: r.p, alpha: r.alpha }),
        );
      }

      case "one-sample-z": {
        const data = needData(input);
        const mu0 = Number(input.mu0 ?? 0);
        const sigma = Number(input.sigma);
        if (!Number.isFinite(sigma) || sigma <= 0) throw new Error("Provide known population σ > 0.");
        const r = oneSampleZ(data, mu0, sigma, alt(input), alpha(input));
        return ok(
          [
            { label: "z", value: fmt(r.z) },
            { label: "p", value: fmtP(r.p) },
            { label: "Mean", value: fmt(r.mean) },
            { label: "CI", value: `[${fmt(r.ci[0])}, ${fmt(r.ci[1])}]` },
          ],
          [
            { title: "SE", detail: `σ/√n = ${fmt(r.se)}` },
            { title: "z", detail: fmt(r.z) },
          ],
          apaTest({ test: "One-sample z-test", statistic: "z", value: r.z, p: r.p, alpha: r.alpha }),
        );
      }

      case "two-sample-t": {
        const { groups, labels } = parseGroups(input.data ?? "");
        let a: number[];
        let b: number[];
        if (groups.length >= 2) {
          a = groups[0];
          b = groups[1];
        } else {
          a = parseNumbers(input.dataA ?? "");
          b = parseNumbers(input.dataB ?? "");
        }
        if (a.length < 2 || b.length < 2) throw new Error("Provide two groups (blank-line separated or dataA/dataB).");
        const equalVar = (input.equalVar ?? "true") !== "false";
        const r = twoSampleT(a, b, equalVar, alt(input), alpha(input));
        return ok(
          [
            { label: labels[0] ? `${labels[0]} mean` : "Mean 1", value: fmt(r.m1) },
            { label: labels[1] ? `${labels[1]} mean` : "Mean 2", value: fmt(r.m2) },
            { label: "t", value: fmt(r.t) },
            { label: "df", value: fmt(r.df) },
            { label: "p", value: fmtP(r.p) },
            { label: "Cohen d", value: fmt(r.d) },
            { label: "CI (diff)", value: `[${fmt(r.ci[0])}, ${fmt(r.ci[1])}]` },
          ],
          [
            { title: equalVar ? "Pooled variance t-test" : "Welch t-test", detail: `t=${fmt(r.t)}, df=${fmt(r.df)}` },
          ],
          apaTest({
            test: equalVar ? "Two-sample t-test" : "Welch t-test",
            statistic: "t",
            value: r.t,
            df: fmt(r.df),
            p: r.p,
            alpha: r.alpha,
          }),
        );
      }

      case "two-sample-z": {
        const a = parseNumbers(input.dataA ?? "");
        const b = parseNumbers(input.dataB ?? "");
        const s1 = Number(input.sigma1 ?? input.sigma);
        const s2 = Number(input.sigma2 ?? input.sigma);
        if (a.length < 1 || b.length < 1) throw new Error("Provide dataA and dataB.");
        if (![s1, s2].every((v) => Number.isFinite(v) && v > 0)) throw new Error("Provide sigma1 and sigma2.");
        const r = twoSampleZ(a, b, s1, s2, alt(input), alpha(input));
        return ok(
          [
            { label: "z", value: fmt(r.z) },
            { label: "p", value: fmtP(r.p) },
            { label: "Mean 1", value: fmt(r.m1) },
            { label: "Mean 2", value: fmt(r.m2) },
          ],
          [{ title: "Two-sample z", detail: `z=${fmt(r.z)}` }],
          apaTest({ test: "Two-sample z-test", statistic: "z", value: r.z, p: r.p, alpha: r.alpha }),
        );
      }

      case "paired-t": {
        const { x, y } = parsePaired(input.data ?? "");
        if (x.length < 2) throw new Error("Paste paired columns (before after).");
        const r = pairedT(x, y, alt(input), alpha(input));
        return ok(
          [
            { label: "n pairs", value: r.n },
            { label: "Mean diff", value: fmt(r.mean) },
            { label: "t", value: fmt(r.t) },
            { label: "df", value: r.df },
            { label: "p", value: fmtP(r.p) },
            { label: "Cohen d", value: fmt(r.d) },
          ],
          [{ title: "Paired differences", detail: `mean d̄=${fmt(r.mean)}, t=${fmt(r.t)}` }],
          apaTest({ test: "Paired t-test", statistic: "t", value: r.t, df: r.df, p: r.p, alpha: r.alpha }),
        );
      }

      case "one-way-anova":
      case "welch-anova":
      case "tukey":
      case "scheffe":
      case "dunnett":
      case "games-howell":
      case "dunn":
      case "three-way-anova":
      case "two-way-anova":
      case "rm-anova":
      case "ancova":
      case "manova": {
        const { groups, labels } = parseGroups(input.data ?? "");
        if (groups.length < 2) throw new Error("Provide 2+ groups (blank-line separated or Label: values).");
        const r = oneWayAnova(groups);
        const fields = [
          { label: "F", value: fmt(r.F) },
          { label: "df between", value: r.dfb },
          { label: "df within", value: r.dfw },
          { label: "p", value: fmtP(r.p) },
          { label: "MSB", value: fmt(r.msb) },
          { label: "MSW", value: fmt(r.msw) },
          ...r.means.map((m, i) => ({ label: `${labels[i]} mean`, value: fmt(m) })),
        ];
        // Tukey pairwise (approximate using studentized range critical ~ q from normal*sqrt2 for demo)
        if (["tukey", "scheffe", "dunnett", "games-howell", "dunn"].includes(engine)) {
          for (let i = 0; i < groups.length; i++) {
            for (let j = i + 1; j < groups.length; j++) {
              const ni = groups[i].length;
              const nj = groups[j].length;
              const diff = r.means[i] - r.means[j];
              const se = Math.sqrt(r.msw * (1 / ni + 1 / nj));
              const t = diff / se;
              const p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), r.dfw));
              fields.push({
                label: `${labels[i]} vs ${labels[j]}`,
                value: `diff=${fmt(diff)}, p≈${fmtP(p)}`,
              });
            }
          }
        }
        return ok(
          fields,
          [
            { title: "ANOVA table", detail: `SSB=${fmt(r.ssb)}, SSW=${fmt(r.ssw)}` },
            { title: "F-test", detail: `F=${fmt(r.F)}, p=${fmtP(r.p)}` },
          ],
          apaTest({
            test: engine.includes("anova") || engine === "ancova" || engine === "manova" ? "ANOVA" : "Post-hoc",
            statistic: "F",
            value: r.F,
            df: `${r.dfb}, ${r.dfw}`,
            p: r.p,
          }),
        );
      }

      case "kruskal": {
        const { groups, labels } = parseGroups(input.data ?? "");
        if (groups.length < 2) throw new Error("Provide 2+ groups.");
        const r = kruskalWallis(groups);
        return ok(
          [
            { label: "H", value: fmt(r.H) },
            { label: "df", value: r.df },
            { label: "p", value: fmtP(r.p) },
            ...r.rankSums.map((rs, i) => ({ label: `${labels[i]} rank sum`, value: fmt(rs) })),
          ],
          [{ title: "Kruskal-Wallis", detail: `H=${fmt(r.H)}, p=${fmtP(r.p)}` }],
          apaTest({ test: "Kruskal-Wallis", statistic: "H", value: r.H, df: r.df, p: r.p }),
        );
      }

      case "friedman": {
        // matrix: rows=blocks, cols=treatments
        const m = parseMatrix(input.data ?? "");
        if (m.length < 2 || m[0].length < 2) throw new Error("Paste blocks×treatments matrix.");
        const b = m.length;
        const k = m[0].length;
        const ranks = m.map((row) => {
          const indexed = row.map((v, i) => ({ v, i })).sort((a, c) => a.v - c.v);
          const r = Array(k).fill(0);
          indexed.forEach((item, idx) => {
            r[item.i] = idx + 1;
          });
          return r;
        });
        const Rj = Array(k).fill(0);
        for (const row of ranks) row.forEach((rv, j) => (Rj[j] += rv));
        const chi2 =
          (12 / (b * k * (k + 1))) * Rj.reduce((s, r) => s + r * r, 0) - 3 * b * (k + 1);
        const df = k - 1;
        const p = 1 - jStat.chisquare.cdf(chi2, df);
        return ok(
          [
            { label: "χ²", value: fmt(chi2) },
            { label: "df", value: df },
            { label: "p", value: fmtP(p) },
          ],
          [{ title: "Friedman", detail: `χ²=${fmt(chi2)}` }],
          apaTest({ test: "Friedman test", statistic: "χ²", value: chi2, df, p }),
        );
      }

      case "mann-whitney": {
        const { groups } = parseGroups(input.data ?? "");
        let a: number[];
        let b: number[];
        if (groups.length >= 2) {
          a = groups[0];
          b = groups[1];
        } else {
          a = parseNumbers(input.dataA ?? "");
          b = parseNumbers(input.dataB ?? "");
        }
        if (a.length < 1 || b.length < 1) throw new Error("Provide two groups.");
        const r = mannWhitney(a, b);
        return ok(
          [
            { label: "U", value: fmt(r.U) },
            { label: "z", value: fmt(r.z) },
            { label: "p", value: fmtP(r.p) },
          ],
          [{ title: "Mann-Whitney", detail: `U=${fmt(r.U)}, z=${fmt(r.z)}` }],
          apaTest({ test: "Mann-Whitney U", statistic: "U", value: r.U, p: r.p }),
        );
      }

      case "wilcoxon": {
        const { x, y } = parsePaired(input.data ?? "");
        const r = y.length ? wilcoxonSignedRank(x, y) : wilcoxonSignedRank(needData(input));
        return ok(
          [
            { label: "W", value: fmt(r.W) },
            { label: "z", value: fmt(r.z) },
            { label: "p", value: fmtP(r.p) },
          ],
          [{ title: "Wilcoxon signed-rank", detail: `W=${fmt(r.W)}` }],
          apaTest({ test: "Wilcoxon signed-rank", statistic: "W", value: r.W, p: r.p }),
        );
      }

      case "chi-gof": {
        const observed = parseNumbers(input.data ?? input.observed ?? "");
        const expected = input.expected ? parseNumbers(input.expected) : undefined;
        if (observed.length < 2) throw new Error("Provide observed frequencies.");
        const r = chiSquareGof(observed, expected);
        return ok(
          [
            { label: "χ²", value: fmt(r.chi2) },
            { label: "df", value: r.df },
            { label: "p", value: fmtP(r.p) },
          ],
          [{ title: "Goodness of fit", detail: `χ²=${fmt(r.chi2)}` }],
          apaTest({ test: "Chi-square GOF", statistic: "χ²", value: r.chi2, df: r.df, p: r.p }),
        );
      }

      case "chi-ind": {
        const table = parseMatrix(input.data ?? "");
        if (table.length < 2) throw new Error("Paste contingency table.");
        const r = chiSquareIndependence(table);
        return ok(
          [
            { label: "χ²", value: fmt(r.chi2) },
            { label: "df", value: r.df },
            { label: "p", value: fmtP(r.p) },
            { label: "N", value: r.N },
          ],
          [{ title: "Independence test", detail: `χ²=${fmt(r.chi2)}, p=${fmtP(r.p)}` }],
          apaTest({ test: "Chi-square independence", statistic: "χ²", value: r.chi2, df: r.df, p: r.p }),
        );
      }

      case "fisher": {
        const m = parseMatrix(input.data ?? "");
        let a: number, b: number, c: number, d: number;
        if (m.length === 2 && m[0].length === 2) {
          [[a, b], [c, d]] = m as [[number, number], [number, number]];
        } else {
          a = Number(input.a);
          b = Number(input.b);
          c = Number(input.c);
          d = Number(input.d);
        }
        if (![a, b, c, d].every(Number.isFinite)) throw new Error("Provide a 2×2 table.");
        const r = fishersExact(a, b, c, d);
        return ok(
          [
            { label: "Two-sided p", value: fmtP(r.p) },
            { label: "Odds ratio", value: fmt(r.oddsRatio) },
          ],
          [{ title: "Fisher exact", detail: `p=${fmtP(r.p)}` }],
          `Fisher exact test: p = ${fmtP(r.p)}, OR = ${fmt(r.oddsRatio)}.`,
        );
      }

      case "one-prop-z":
      case "binomial-test": {
        const successes = Number(input.successes ?? input.x);
        const n = Number(input.n);
        const p0 = Number(input.p0 ?? 0.5);
        if (![successes, n, p0].every(Number.isFinite)) throw new Error("Provide successes, n, and p0.");
        const r = oneProportionZ(successes, n, p0, alt(input), alpha(input));
        return ok(
          [
            { label: "p̂", value: fmt(r.phat) },
            { label: "z", value: fmt(r.z) },
            { label: "p", value: fmtP(r.p) },
          ],
          [{ title: "Proportion test", detail: `z=${fmt(r.z)}` }],
          apaTest({ test: "One-proportion z-test", statistic: "z", value: r.z, p: r.p, alpha: r.alpha }),
        );
      }

      case "two-prop-z":
      case "ab-test": {
        const x1 = Number(input.x1 ?? input.successes1);
        const n1 = Number(input.n1);
        const x2 = Number(input.x2 ?? input.successes2);
        const n2 = Number(input.n2);
        if (![x1, n1, x2, n2].every(Number.isFinite)) throw new Error("Provide x1,n1,x2,n2.");
        const r = twoProportionZ(x1, n1, x2, n2, alt(input), alpha(input));
        const lift = ((r.p1 - r.p2) / (r.p2 || 1)) * 100;
        return ok(
          [
            { label: "p1", value: fmt(r.p1) },
            { label: "p2", value: fmt(r.p2) },
            { label: "z", value: fmt(r.z) },
            { label: "p", value: fmtP(r.p) },
            ...(engine === "ab-test" ? [{ label: "Lift %", value: fmt(lift) }] : []),
          ],
          [{ title: "Two-proportion z", detail: `z=${fmt(r.z)}` }],
          apaTest({ test: "Two-proportion z-test", statistic: "z", value: r.z, p: r.p, alpha: r.alpha }),
        );
      }

      case "mcnemar": {
        const m = parseMatrix(input.data ?? "");
        let b: number, c: number;
        if (m.length === 2 && m[0].length === 2) {
          b = m[0][1];
          c = m[1][0];
        } else {
          b = Number(input.b);
          c = Number(input.c);
        }
        if (![b, c].every(Number.isFinite)) throw new Error("Provide discordant counts b and c.");
        const chi2 = (Math.abs(b - c) - 1) ** 2 / (b + c);
        const p = 1 - jStat.chisquare.cdf(chi2, 1);
        return ok(
          [
            { label: "χ² (continuity corr.)", value: fmt(chi2) },
            { label: "p", value: fmtP(p) },
          ],
          [{ title: "McNemar", detail: `χ²=${fmt(chi2)}` }],
          apaTest({ test: "McNemar test", statistic: "χ²", value: chi2, df: 1, p }),
        );
      }

      case "levene": {
        const { groups, labels } = parseGroups(input.data ?? "");
        if (groups.length < 2) throw new Error("Provide 2+ groups.");
        const zGroups = groups.map((g) => {
          const med = median(g);
          return g.map((x) => Math.abs(x - med));
        });
        const r = oneWayAnova(zGroups);
        return ok(
          [
            { label: "W (Levene)", value: fmt(r.F) },
            { label: "p", value: fmtP(r.p) },
            ...labels.map((l, i) => ({ label: `${l} mean |dev|`, value: fmt(mean(zGroups[i])) })),
          ],
          [{ title: "Levene (median center)", detail: `W=${fmt(r.F)}` }],
          apaTest({ test: "Levene test", statistic: "W", value: r.F, df: `${r.dfb}, ${r.dfw}`, p: r.p }),
        );
      }

      case "normality": {
        const data = needData(input, 3);
        const r = shapiroWilkApprox(data);
        return ok(
          [
            { label: "Jarque–Bera", value: fmt(r.JB) },
            { label: "p", value: fmtP(r.p) },
            { label: "Skewness", value: fmt(r.skewness) },
            { label: "Excess kurtosis", value: fmt(r.kurtosis) },
          ],
          [{ title: "Normality (JB)", detail: `JB=${fmt(r.JB)}, p=${fmtP(r.p)}` }],
          apaTest({ test: "Jarque–Bera normality", statistic: "JB", value: r.JB, df: 2, p: r.p }),
        );
      }

      case "outliers": {
        const data = needData(input, 3);
        const r = grubbsOutliers(data, alpha(input));
        return ok(
          [
            { label: "Suspect value", value: fmt(r.suspect.v) },
            { label: "G", value: fmt(r.G) },
            { label: "G critical", value: fmt(r.Gcrit) },
            { label: "Outlier?", value: r.isOutlier ? "Yes" : "No" },
          ],
          [{ title: "Grubbs test", detail: `G=${fmt(r.G)} vs ${fmt(r.Gcrit)}` }],
        );
      }

      case "permutation": {
        const { groups } = parseGroups(input.data ?? "");
        let a: number[];
        let b: number[];
        if (groups.length >= 2) {
          a = groups[0];
          b = groups[1];
        } else {
          a = parseNumbers(input.dataA ?? "");
          b = parseNumbers(input.dataB ?? "");
        }
        if (a.length < 2 || b.length < 2) throw new Error("Provide two groups.");
        const obs = Math.abs(mean(a) - mean(b));
        const pooled = [...a, ...b];
        const nA = a.length;
        const reps = Math.min(2000, Number(input.reps ?? 2000));
        let count = 0;
        for (let r = 0; r < reps; r++) {
          // Fisher–Yates shuffle copy
          const sh = [...pooled];
          for (let i = sh.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sh[i], sh[j]] = [sh[j], sh[i]];
          }
          const m1 = mean(sh.slice(0, nA));
          const m2 = mean(sh.slice(nA));
          if (Math.abs(m1 - m2) >= obs) count++;
        }
        const p = count / reps;
        return ok(
          [
            { label: "|Δmean|", value: fmt(obs) },
            { label: "Permutations", value: reps },
            { label: "p", value: fmtP(p) },
          ],
          [{ title: "Permutation test", detail: `p ≈ ${fmtP(p)} from ${reps} shuffles` }],
        );
      }

      case "pvalue": {
        const stat = Number(input.statistic ?? input.x);
        const dist = (input.distribution ?? "z").toLowerCase();
        const a = alt(input);
        let p: number;
        if (dist === "t") {
          const df = Number(input.df);
          p =
            a === "two-sided"
              ? 2 * (1 - jStat.studentt.cdf(Math.abs(stat), df))
              : a === "greater"
                ? 1 - jStat.studentt.cdf(stat, df)
                : jStat.studentt.cdf(stat, df);
        } else if (dist === "chisquare" || dist === "chi") {
          const df = Number(input.df);
          p = 1 - jStat.chisquare.cdf(stat, df);
        } else if (dist === "f") {
          p = 1 - jStat.centralF.cdf(stat, Number(input.df1), Number(input.df2));
        } else {
          p =
            a === "two-sided"
              ? 2 * (1 - jStat.normal.cdf(Math.abs(stat), 0, 1))
              : a === "greater"
                ? 1 - jStat.normal.cdf(stat, 0, 1)
                : jStat.normal.cdf(stat, 0, 1);
        }
        return ok([{ label: "p-value", value: fmtP(p) }], [{ title: "From distribution", detail: `${dist}: p=${fmtP(p)}` }]);
      }

      case "critical": {
        const dist = (input.distribution ?? "z").toLowerCase();
        const a = alpha(input);
        const tail = alt(input);
        let crit: number;
        if (dist === "t") {
          const df = Number(input.df);
          crit = jStat.studentt.inv(tail === "two-sided" ? 1 - a / 2 : 1 - a, df);
        } else if (dist === "chisquare" || dist === "chi") {
          crit = jStat.chisquare.inv(1 - a, Number(input.df));
        } else if (dist === "f") {
          crit = jStat.centralF.inv(1 - a, Number(input.df1), Number(input.df2));
        } else {
          crit = jStat.normal.inv(tail === "two-sided" ? 1 - a / 2 : 1 - a, 0, 1);
        }
        return ok([{ label: "Critical value", value: fmt(crit) }], [{ title: "Critical value", detail: `${dist}: ${fmt(crit)}` }]);
      }

      case "effect-size": {
        const a = parseNumbers(input.dataA ?? "");
        const b = parseNumbers(input.dataB ?? "");
        if (a.length && b.length) {
          const m1 = mean(a);
          const m2 = mean(b);
          const s1 = stdev(a);
          const s2 = stdev(b);
          const sp = Math.sqrt(((a.length - 1) * s1 ** 2 + (b.length - 1) * s2 ** 2) / (a.length + b.length - 2));
          const d = (m1 - m2) / sp;
          const g = d * (1 - 3 / (4 * (a.length + b.length) - 9));
          return ok(
            [
              { label: "Cohen d", value: fmt(d) },
              { label: "Hedges g", value: fmt(g) },
            ],
            [{ title: "Effect size", detail: `d=${fmt(d)}, g=${fmt(g)}` }],
          );
        }
        const data = needData(input);
        const mu0 = Number(input.mu0 ?? 0);
        const d = (mean(data) - mu0) / stdev(data);
        return ok([{ label: "Cohen d", value: fmt(d) }], [{ title: "One-sample d", detail: fmt(d) }]);
      }

      case "std-error": {
        const data = needData(input);
        const sample = isSample(input);
        const s = stdev(data, sample);
        const se = s / Math.sqrt(data.length);
        return ok(
          [
            { label: sample ? "SD (sample)" : "SD (population)", value: fmt(s) },
            { label: "SE mean", value: fmt(se) },
          ],
          [{ title: "SE", detail: `SD/√n = ${fmt(se)}` }],
        );
      }

      case "sample-size":
      case "survey-n": {
        const kind = input.kind ?? (engine === "survey-n" ? "proportion" : "mean");
        const power = Number(input.power ?? 0.8);
        const a = alpha(input);
        const zA = jStat.normal.inv(1 - a / 2, 0, 1);
        const zB = jStat.normal.inv(power, 0, 1);
        if (kind === "proportion") {
          const p = Number(input.p ?? 0.5);
          const moe = Number(input.moe ?? 0.05);
          const n = (zA ** 2 * p * (1 - p)) / moe ** 2;
          return ok([{ label: "n", value: Math.ceil(n) }], [{ title: "Survey n", detail: `n = ${Math.ceil(n)}` }]);
        }
        const delta = Number(input.delta ?? input.effect ?? 0.5);
        const sd = Number(input.sd ?? 1);
        const n = ((zA + zB) * sd / delta) ** 2;
        return ok(
          [{ label: "n (approx per group)", value: Math.ceil(n) }],
          [{ title: "Mean power n", detail: `n ≈ ${Math.ceil(n)}` }],
        );
      }

      case "flow-chart":
        return ok(
          [
            { label: "Comparing means?", value: "t-test / ANOVA" },
            { label: "Proportions?", value: "z-test / chi-square / Fisher" },
            { label: "Ranks / non-normal?", value: "Mann-Whitney / Kruskal-Wallis / Wilcoxon" },
            { label: "Paired data?", value: "Paired t or Wilcoxon signed-rank" },
          ],
          [
            {
              title: "How to choose",
              detail:
                "Start from outcome type (continuous vs categorical), then design (independent vs paired), then assumptions (normality, equal variance).",
            },
          ],
        );

      case "basic-prob": {
        const pA = Number(input.pA);
        const pB = Number(input.pB);
        const pAandB = Number(input.pAandB ?? NaN);
        if (![pA, pB].every(Number.isFinite)) throw new Error("Provide P(A) and P(B).");
        const indep = Number.isFinite(pAandB) ? pAandB : pA * pB;
        const union = pA + pB - indep;
        const pAgivenB = indep / (pB || 1);
        return ok(
          [
            { label: "P(A∩B)", value: fmt(indep) },
            { label: "P(A∪B)", value: fmt(union) },
            { label: "P(A|B)", value: fmt(pAgivenB) },
          ],
          [{ title: "Probability rules", detail: "Addition and conditional probability" }],
        );
      }

      case "dist-normal":
      case "dist-invnorm": {
        const mu = Number(input.mean ?? 0);
        const sd = Number(input.sd ?? 1);
        if (engine === "dist-invnorm") {
          const p = Number(input.p ?? input.prob);
          const x = jStat.normal.inv(p, mu, sd);
          return ok([{ label: "x", value: fmt(x) }], [{ title: "Inverse normal", detail: `x = Φ^{-1}(${p})` }]);
        }
        const x = Number(input.x);
        return ok(
          [
            { label: "PDF", value: fmt(jStat.normal.pdf(x, mu, sd)) },
            { label: "CDF", value: fmt(jStat.normal.cdf(x, mu, sd)) },
          ],
          [{ title: "Normal", detail: `N(${mu}, ${sd}²)` }],
        );
      }

      case "dist-t": {
        const df = Number(input.df);
        const x = Number(input.x);
        return ok(
          [
            { label: "PDF", value: fmt(jStat.studentt.pdf(x, df)) },
            { label: "CDF", value: fmt(jStat.studentt.cdf(x, df)) },
          ],
          [{ title: "Student t", detail: `df=${df}` }],
        );
      }

      case "dist-chi": {
        const df = Number(input.df);
        const x = Number(input.x);
        return ok(
          [
            { label: "PDF", value: fmt(jStat.chisquare.pdf(x, df)) },
            { label: "CDF", value: fmt(jStat.chisquare.cdf(x, df)) },
          ],
          [{ title: "Chi-square", detail: `df=${df}` }],
        );
      }

      case "dist-f": {
        const df1 = Number(input.df1);
        const df2 = Number(input.df2);
        const x = Number(input.x);
        return ok(
          [
            { label: "PDF", value: fmt(jStat.centralF.pdf(x, df1, df2)) },
            { label: "CDF", value: fmt(jStat.centralF.cdf(x, df1, df2)) },
          ],
          [{ title: "F distribution", detail: `df1=${df1}, df2=${df2}` }],
        );
      }

      case "dist-binom": {
        const n = Number(input.n);
        const p = Number(input.p);
        const k = Number(input.k ?? input.x);
        return ok(
          [
            { label: "P(X=k)", value: fmt(jStat.binomial.pdf(k, n, p)) },
            { label: "P(X≤k)", value: fmt(jStat.binomial.cdf(k, n, p)) },
          ],
          [{ title: "Binomial", detail: `n=${n}, p=${p}` }],
        );
      }

      case "dist-pois": {
        const lambda = Number(input.lambda ?? input.mean);
        const k = Number(input.k ?? input.x);
        return ok(
          [
            { label: "P(X=k)", value: fmt(jStat.poisson.pdf(k, lambda)) },
            { label: "P(X≤k)", value: fmt(jStat.poisson.cdf(k, lambda)) },
          ],
          [{ title: "Poisson", detail: `λ=${lambda}` }],
        );
      }

      case "dist-geom": {
        const p = Number(input.p);
        const k = Number(input.k ?? input.x);
        const pmf = p * (1 - p) ** (k - 1);
        const cdf = 1 - (1 - p) ** k;
        return ok(
          [
            { label: "P(X=k)", value: fmt(pmf) },
            { label: "P(X≤k)", value: fmt(cdf) },
          ],
          [{ title: "Geometric", detail: `trials until first success, p=${p}` }],
        );
      }

      case "dist-nbinom": {
        const r = Number(input.r);
        const p = Number(input.p);
        const k = Number(input.k ?? input.x);
        const pmf =
          jStat.combination(k - 1, r - 1) * p ** r * (1 - p) ** (k - r);
        return ok([{ label: "P(X=k)", value: fmt(pmf) }], [{ title: "Negative binomial", detail: `r=${r}, p=${p}` }]);
      }

      case "dist-hyper": {
        const N = Number(input.N);
        const K = Number(input.K);
        const n = Number(input.n);
        const k = Number(input.k ?? input.x);
        const pmf =
          (jStat.combination(K, k) * jStat.combination(N - K, n - k)) /
          jStat.combination(N, n);
        return ok([{ label: "P(X=k)", value: fmt(pmf) }], [{ title: "Hypergeometric", detail: `N=${N}, K=${K}, n=${n}` }]);
      }

      case "dist-exp": {
        const rate = Number(input.rate ?? input.lambda ?? 1);
        const x = Number(input.x);
        return ok(
          [
            { label: "PDF", value: fmt(jStat.exponential.pdf(x, rate)) },
            { label: "CDF", value: fmt(jStat.exponential.cdf(x, rate)) },
          ],
          [{ title: "Exponential", detail: `rate=${rate}` }],
        );
      }

      case "dist-gamma": {
        const shape = Number(input.shape ?? input.alpha);
        const scale = Number(input.scale ?? input.theta ?? 1);
        const x = Number(input.x);
        return ok(
          [
            { label: "PDF", value: fmt(jStat.gamma.pdf(x, shape, scale)) },
            { label: "CDF", value: fmt(jStat.gamma.cdf(x, shape, scale)) },
          ],
          [{ title: "Gamma", detail: `shape=${shape}, scale=${scale}` }],
        );
      }

      case "dist-beta": {
        const a = Number(input.alpha ?? input.a);
        const b = Number(input.beta ?? input.b);
        const x = Number(input.x);
        return ok(
          [
            { label: "PDF", value: fmt(jStat.beta.pdf(x, a, b)) },
            { label: "CDF", value: fmt(jStat.beta.cdf(x, a, b)) },
          ],
          [{ title: "Beta", detail: `α=${a}, β=${b}` }],
        );
      }

      case "dist-unif": {
        const a = Number(input.a ?? 0);
        const b = Number(input.b ?? 1);
        const x = Number(input.x);
        return ok(
          [
            { label: "PDF", value: fmt(jStat.uniform.pdf(x, a, b)) },
            { label: "CDF", value: fmt(jStat.uniform.cdf(x, a, b)) },
          ],
          [{ title: "Uniform", detail: `U(${a}, ${b})` }],
        );
      }

      case "dist-weibull": {
        const scale = Number(input.scale ?? 1);
        const shape = Number(input.shape ?? 1);
        const x = Number(input.x);
        return ok(
          [
            { label: "PDF", value: fmt(jStat.weibull.pdf(x, scale, shape)) },
            { label: "CDF", value: fmt(jStat.weibull.cdf(x, scale, shape)) },
          ],
          [{ title: "Weibull", detail: `scale=${scale}, shape=${shape}` }],
        );
      }

      case "dist-lognorm": {
        const mu = Number(input.mean ?? input.mu ?? 0);
        const sigma = Number(input.sd ?? input.sigma ?? 1);
        const x = Number(input.x);
        return ok(
          [
            { label: "PDF", value: fmt(jStat.lognormal.pdf(x, mu, sigma)) },
            { label: "CDF", value: fmt(jStat.lognormal.cdf(x, mu, sigma)) },
          ],
          [{ title: "Log-normal", detail: `μ=${mu}, σ=${sigma}` }],
        );
      }

      case "dist-logistic": {
        const mu = Number(input.mean ?? 0);
        const s = Number(input.scale ?? 1);
        const x = Number(input.x);
        const z = (x - mu) / s;
        const pdf = Math.exp(-z) / (s * (1 + Math.exp(-z)) ** 2);
        const cdf = 1 / (1 + Math.exp(-z));
        return ok(
          [
            { label: "PDF", value: fmt(pdf) },
            { label: "CDF", value: fmt(cdf) },
          ],
          [{ title: "Logistic", detail: `μ=${mu}, s=${s}` }],
        );
      }

      case "expected-value": {
        const values = parseNumbers(input.values ?? input.data ?? "");
        const probs = parseNumbers(input.probs ?? "");
        if (values.length && probs.length === values.length) {
          const ev = values.reduce((s, v, i) => s + v * probs[i], 0);
          return ok([{ label: "E[X]", value: fmt(ev) }], [{ title: "Discrete EV", detail: `Σ x p(x) = ${fmt(ev)}` }]);
        }
        if (values.length) {
          return ok([{ label: "Sample mean ≈ E[X]", value: fmt(mean(values)) }], [{ title: "Empirical mean", detail: fmt(mean(values)) }]);
        }
        throw new Error("Provide values and probs, or a data sample.");
      }

      case "rng": {
        const n = Math.min(10000, Math.max(1, Number(input.n ?? 10)));
        const dist = (input.distribution ?? "uniform").toLowerCase();
        const out: number[] = [];
        for (let i = 0; i < n; i++) {
          if (dist === "normal") out.push(jStat.normal.inv(Math.random(), Number(input.mean ?? 0), Number(input.sd ?? 1)));
          else out.push(Number(input.a ?? 0) + Math.random() * (Number(input.b ?? 1) - Number(input.a ?? 0)));
        }
        return ok(
          [
            { label: "n", value: n },
            { label: "Sample", value: out.map((v) => fmt(v, 3)).join(", ") },
            { label: "Mean", value: fmt(mean(out)) },
          ],
          [{ title: "Random sample", detail: `${dist} draws` }],
        );
      }

      case "ci-mean": {
        const r = meanCI(needData(input), level(input));
        return ok(
          [
            { label: "Mean", value: fmt(r.mean) },
            { label: "SE", value: fmt(r.se) },
            { label: "MoE", value: fmt(r.moe) },
            { label: "CI", value: `[${fmt(r.low)}, ${fmt(r.high)}]` },
          ],
          [{ title: `${(r.level * 100).toFixed(0)}% CI`, detail: `x̄ ± t* SE` }],
        );
      }

      case "ci-prop": {
        const successes = Number(input.successes ?? input.x);
        const n = Number(input.n);
        const r = proportionCI(successes, n, level(input));
        return ok(
          [
            { label: "p̂", value: fmt(r.p) },
            { label: "MoE", value: fmt(r.moe) },
            { label: "CI", value: `[${fmt(r.low)}, ${fmt(r.high)}]` },
          ],
          [{ title: "Proportion CI", detail: `Wald interval` }],
        );
      }

      case "ci-sd": {
        const r = sdCI(needData(input), level(input));
        return ok(
          [
            { label: "s", value: fmt(r.sd) },
            { label: "CI", value: `[${fmt(r.low)}, ${fmt(r.high)}]` },
          ],
          [{ title: "SD CI", detail: "Chi-square based" }],
        );
      }

      case "ci-diff-means": {
        const { groups } = parseGroups(input.data ?? "");
        const a = groups[0] ?? parseNumbers(input.dataA ?? "");
        const b = groups[1] ?? parseNumbers(input.dataB ?? "");
        const r = diffMeansCI(a, b, (input.equalVar ?? "true") !== "false", level(input));
        return ok(
          [
            { label: "Difference", value: fmt(r.diff) },
            { label: "CI", value: `[${fmt(r.low)}, ${fmt(r.high)}]` },
          ],
          [{ title: "Difference in means CI", detail: fmt(r.diff) }],
        );
      }

      case "ci-diff-props": {
        const r = diffPropsCI(
          Number(input.x1),
          Number(input.n1),
          Number(input.x2),
          Number(input.n2),
          level(input),
        );
        return ok(
          [
            { label: "Difference", value: fmt(r.diff) },
            { label: "CI", value: `[${fmt(r.low)}, ${fmt(r.high)}]` },
          ],
          [{ title: "Difference in proportions", detail: fmt(r.diff) }],
        );
      }

      case "ci-corr": {
        const { x, y } = parsePaired(input.data ?? "");
        const r = correlationCI(x, y, level(input));
        return ok(
          [
            { label: "r", value: fmt(r.r) },
            { label: "CI", value: `[${fmt(r.low)}, ${fmt(r.high)}]` },
          ],
          [{ title: "Fisher z CI", detail: `r=${fmt(r.r)}` }],
        );
      }

      case "moe": {
        const r = marginOfError({
          kind: (input.kind as "mean" | "proportion") ?? "proportion",
          n: Number(input.n),
          sd: Number(input.sd ?? 1),
          p: Number(input.p ?? 0.5),
          level: level(input),
        });
        return ok([{ label: "Margin of error", value: fmt(r.moe) }], [{ title: "MoE", detail: `z* × SE = ${fmt(r.moe)}` }]);
      }

      case "slr":
      case "poly-reg": {
        const { x, y } = parsePaired(input.data ?? "");
        if (x.length < 3) throw new Error("Paste paired x,y with at least 3 rows.");
        const r = simpleLinearRegression(x, y);
        return ok(
          [
            { label: "Intercept", value: fmt(r.intercept) },
            { label: "Slope", value: fmt(r.slope) },
            { label: "r", value: fmt(r.r) },
            { label: "R²", value: fmt(r.r2) },
            { label: "t (slope)", value: fmt(r.t) },
            { label: "p (slope)", value: fmtP(r.p) },
          ],
          [
            { title: "Model", detail: `y = ${fmt(r.intercept)} + ${fmt(r.slope)} x` },
            { title: "Fit", detail: `R²=${fmt(r.r2)}` },
          ],
          apaTest({ test: "Simple linear regression (slope)", statistic: "t", value: r.t, df: r.n - 2, p: r.p }),
        );
      }

      case "quad-reg": {
        const { x, y } = parsePaired(input.data ?? "");
        const r = quadraticRegression(x, y);
        return ok(
          [
            { label: "a", value: fmt(r.a) },
            { label: "b", value: fmt(r.b) },
            { label: "c", value: fmt(r.c) },
            { label: "R²", value: fmt(r.r2) },
          ],
          [{ title: "Quadratic", detail: `y = ${fmt(r.a)} + ${fmt(r.b)}x + ${fmt(r.c)}x²` }],
        );
      }

      case "exp-reg": {
        const { x, y } = parsePaired(input.data ?? "");
        const r = exponentialRegression(x, y);
        return ok(
          [
            { label: "A", value: fmt(r.A) },
            { label: "b", value: fmt(r.b) },
            { label: "R²", value: fmt(r.r2) },
          ],
          [{ title: "Exponential", detail: `y = ${fmt(r.A)} e^{${fmt(r.b)} x}` }],
        );
      }

      case "mlr":
      case "log-reg": {
        const rows = parseMatrix(input.data ?? "");
        if (rows.length < 4) throw new Error("Paste rows as y,x1,x2,...");
        const y = rows.map((r) => r[0]);
        const X = rows.map((r) => r.slice(1));
        if (engine === "log-reg") {
          const { beta } = logisticRegression(X, y);
          return ok(
            beta.map((b, i) => ({
              label: i === 0 ? "Intercept" : `β${i}`,
              value: fmt(b),
            })),
            [{ title: "Logistic regression", detail: "Newton–Raphson coefficients" }],
          );
        }
        const fit = multipleLinearRegression(X, y);
        return ok(
          [
            ...fit.beta.map((b, i) => ({
              label: i === 0 ? "Intercept" : `β${i}`,
              value: fmt(b),
            })),
            { label: "R²", value: fmt(fit.r2) },
            { label: "Adj R²", value: fmt(fit.adjR2) },
          ],
          [{ title: "Multiple regression", detail: `R²=${fmt(fit.r2)}` }],
        );
      }

      case "tobit": {
        const rows = parseMatrix(input.data ?? "");
        if (rows.length < 5) throw new Error("Paste rows as y,x1,x2,...");
        const limit = Number(input.limit ?? "0");
        const fit = tobitMLE(rows, Number.isFinite(limit) ? limit : 0);
        return ok(
          [
            ...fit.beta.map((b, i) => ({
              label: i === 0 ? "Intercept" : `β${i}`,
              value: fmt(b),
            })),
            { label: "σ", value: fmt(fit.sigma) },
            { label: "Log-likelihood", value: fmt(fit.logLik) },
            { label: "Censored / n", value: `${fit.nCensored} / ${fit.n}` },
            { label: "Left-censor limit", value: fit.limit },
          ],
          [
            {
              title: "Tobit (Type I) EM-MLE",
              detail: `Left-censored at ${fit.limit}. EM updates latent y*; observed-data log-likelihood uses φ((y−xβ)/σ)/σ and Φ((L−xβ)/σ).`,
            },
          ],
          `Tobit MLE: σ = ${fmt(fit.sigma)}, log L = ${fmt(fit.logLik)}, ${fit.nCensored}/${fit.n} censored.`,
        );
      }

      case "pca": {
        const m = parseMatrix(input.data ?? "");
        if (m.length < 2 || m[0].length < 2) throw new Error("Paste numeric matrix (rows=obs, cols=vars).");
        const { components } = runPca(m, true);
        const show = components.slice(0, Math.min(3, components.length));
        return ok(
          show.flatMap((c, i) => [
            { label: `PC${i + 1} eigenvalue`, value: fmt(c.eigenvalue) },
            { label: `PC${i + 1} variance`, value: `${fmt(c.varianceExplained)}%` },
            { label: `PC${i + 1} cumulative`, value: `${fmt(c.cumulative)}%` },
            { label: `PC${i + 1} loadings`, value: c.loadings.map(fmt).join(", ") },
          ]),
          [
            {
              title: "PCA (correlation matrix)",
              detail: `Jacobi eigen-decomposition. First ${show.length} component(s) shown.`,
            },
          ],
        );
      }

      case "efa": {
        const m = parseMatrix(input.data ?? "");
        const nFactorsRaw = Number(input.nFactors);
        const nFactors = Number.isFinite(nFactorsRaw) && nFactorsRaw > 0 ? Math.floor(nFactorsRaw) : undefined;
        const { factors, communalities, kmo, nFactors: k } = runEfa(m, nFactors);
        return ok(
          [
            { label: "Factors extracted", value: k },
            { label: "KMO (approx)", value: fmt(kmo) },
            ...factors.flatMap((f, i) => [
              { label: `Factor ${i + 1} λ`, value: fmt(f.eigenvalue) },
              { label: `Factor ${i + 1} var %`, value: `${fmt(f.varianceExplained)}%` },
              { label: `Factor ${i + 1} loadings`, value: f.loadings.map(fmt).join(", ") },
            ]),
            { label: "Communalities", value: communalities.map(fmt).join(", ") },
          ],
          [
            {
              title: "Exploratory factor analysis",
              detail: "Principal-axis factoring on the correlation matrix with iterated communalities (SMC start).",
            },
          ],
        );
      }

      case "cfa": {
        const m = parseMatrix(input.data ?? "");
        const fit = cfaOneFactor(m);
        return ok(
          [
            { label: "Factor loadings", value: fit.loadings.map(fmt).join(", ") },
            { label: "Uniquenesses Ψ", value: fit.uniqueness.map(fmt).join(", ") },
            { label: "RMSR", value: fmt(fit.rmsr) },
            { label: "χ² (residual approx)", value: fmt(fit.chi2) },
            { label: "df", value: fit.df },
            { label: "p", value: fmtP(fit.pValue) },
          ],
          [
            {
              title: "One-factor CFA",
              detail: "Least-squares single-factor model on the correlation matrix; RMSR and residual χ² approx.",
            },
          ],
          apaTest({
            test: "One-factor CFA residual fit",
            statistic: "χ²",
            value: fit.chi2,
            df: fit.df,
            p: fit.pValue,
          }),
        );
      }

      case "lda": {
        const m = parseMatrix(input.data ?? "");
        const fit = runLda(m);
        return ok(
          [
            { label: "Groups", value: fit.nGroups },
            { label: "Predictors", value: fit.p },
            { label: "Discriminant weights", value: fit.weights.map(fmt).join(", ") },
            ...fit.groupMeans.map((g) => ({
              label: `Group ${g.label} means`,
              value: g.mean.map(fmt).join(", "),
            })),
            { label: "Training accuracy", value: `${fmt(fit.accuracy * 100)}%` },
          ],
          [
            {
              title: "Fisher LDA",
              detail: "Last column = group. Weights from pooled within-class covariance; classify by nearest group score.",
            },
          ],
        );
      }

      case "cca": {
        const m = parseMatrix(input.data ?? "");
        const nXRaw = Number(input.nX ?? "2");
        const nX = Number.isFinite(nXRaw) && nXRaw >= 1 ? Math.floor(nXRaw) : Math.max(1, Math.floor(m[0].length / 2));
        const fit = runCca(m, nX);
        return ok(
          [
            { label: "|X| / |Y|", value: `${fit.nX} / ${fit.nY}` },
            ...fit.rhos.map((r, i) => ({ label: `Canonical ρ${i + 1}`, value: fmt(r) })),
            { label: "Wilks' Λ", value: fmt(fit.wilks) },
            { label: "Bartlett χ²", value: fmt(fit.bartlett) },
            { label: "df", value: fit.df },
            { label: "p", value: fmtP(fit.pValue) },
          ],
          [
            {
              title: "Canonical correlation",
              detail: `First ${fit.nX} columns = X, remaining = Y. ρ² from eigenvalues of Rxx⁻¹ Rxy Ryy⁻¹ Ryx.`,
            },
          ],
          apaTest({
            test: "Canonical correlation (Bartlett)",
            statistic: "χ²",
            value: fit.bartlett,
            df: fit.df,
            p: fit.pValue,
          }),
        );
      }

      case "km":
      case "logrank":
      case "cox": {
        // time,event[,group]
        const lines = (input.data ?? "")
          .trim()
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        const rows = lines.map((l) => {
          const p = l.split(/[,;\t\s]+/);
          return {
            t: Number(p[0]),
            e: Number(p[1] ?? 1),
            g: p[2] ?? "A",
          };
        }).filter((r) => Number.isFinite(r.t));
        if (rows.length < 2) throw new Error("Paste time,event rows (event 1=death/0=censor).");
        rows.sort((a, b) => a.t - b.t);
        let atRisk = rows.length;
        let surv = 1;
        const points: string[] = [];
        for (const r of rows) {
          if (r.e === 1) {
            surv *= (atRisk - 1) / atRisk;
            points.push(`t=${fmt(r.t)}: S=${fmt(surv)}`);
          }
          atRisk--;
        }
        return ok(
          [
            { label: "n", value: rows.length },
            { label: "Events", value: rows.filter((r) => r.e === 1).length },
            { label: "Final S(t)", value: fmt(surv) },
            { label: "Curve", value: points.slice(0, 12).join(" | ") || "No events" },
          ],
          [{ title: "Kaplan–Meier", detail: "Product-limit estimator" }],
        );
      }

      case "did":
      case "iv":
      case "rdd":
      case "panel":
      case "crossover":
      case "factorial":
      case "vintage": {
        const m = parseMatrix(input.data ?? "");
        if (!m.length) {
          // param forms
          if (engine === "did") {
            const a = Number(input.treatPost);
            const b = Number(input.treatPre);
            const c = Number(input.ctrlPost);
            const d = Number(input.ctrlPre);
            const did = a - b - (c - d);
            return ok([{ label: "DiD estimate", value: fmt(did) }], [{ title: "DiD", detail: `(Tpost−Tpre) − (Cpost−Cpre)` }]);
          }
          throw new Error("Provide data matrix or DiD cell means.");
        }
        const y = m.map((r) => r[0]);
        return ok(
          [
            { label: "n", value: m.length },
            { label: "Outcome mean", value: fmt(mean(y)) },
            { label: "Estimator", value: engine },
          ],
          [{ title: engine, detail: "Summary statistics for pasted design matrix" }],
        );
      }

      case "randomize": {
        const n = Number(input.n ?? 20);
        const arms = Number(input.arms ?? 2);
        const labels = Array.from({ length: arms }, (_, i) => String.fromCharCode(65 + i));
        const assign = Array.from({ length: n }, (_, i) => labels[i % arms]);
        for (let i = assign.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [assign[i], assign[j]] = [assign[j], assign[i]];
        }
        return ok(
          [
            { label: "Assignments", value: assign.join(", ") },
            ...labels.map((l) => ({ label: `n_${l}`, value: assign.filter((x) => x === l).length })),
          ],
          [{ title: "Randomization", detail: `${n} units → ${arms} arms` }],
        );
      }

      // Charts: return summary stats; UI may also plot
      case "chart-bar":
      case "chart-pie":
      case "chart-hist":
      case "chart-box":
      case "chart-scatter":
      case "chart-line":
      case "chart-qq":
      case "chart-bell":
      case "chart-dot":
      case "chart-density":
      case "chart-violin":
      case "chart-stem":
      case "chart-funnel":
      case "chart-treemap":
      case "chart-waterfall":
      case "chart-area":
      case "chart-bubble":
      case "chart-heatmap":
      case "chart-control":
      case "chart-pareto":
      case "chart-radar":
      case "chart-roc":
      case "chart-forest":
      case "chart-ba":
      case "chart-lollipop":
      case "chart-slope":
      case "chart-sankey":
      case "chart-venn":
      case "chart-builder":
      case "chart-ai": {
        if (engine === "chart-bell") {
          const mu = Number(input.mean ?? 0);
          const sd = Number(input.sd ?? 1);
          return ok(
            [
              { label: "Mean", value: fmt(mu) },
              { label: "SD", value: fmt(sd) },
              { label: "±1 SD", value: `[${fmt(mu - sd)}, ${fmt(mu + sd)}]` },
              { label: "±2 SD", value: `[${fmt(mu - 2 * sd)}, ${fmt(mu + 2 * sd)}]` },
            ],
            [{ title: "Normal curve", detail: `N(${mu}, ${sd}²)` }],
          );
        }
        if (engine === "chart-scatter" || engine === "chart-ba" || engine === "chart-slope") {
          const { x, y } = parsePaired(input.data ?? "");
          if (x.length < 2) throw new Error("Paste paired x,y data.");
          return ok(
            [
              { label: "n", value: x.length },
              { label: "r", value: fmt(correlation(x, y)) },
              { label: "Mean x", value: fmt(mean(x)) },
              { label: "Mean y", value: fmt(mean(y)) },
            ],
            [{ title: "Bivariate summary", detail: "Ready for scatter / agreement plot" }],
          );
        }
        const data = needData(input, 1);
        const freq = frequencyTable(data);
        const fives = data.length >= 2 ? fiveNumberSummary(data) : null;
        return ok(
          [
            { label: "n", value: data.length },
            ...(fives
              ? [
                  { label: "Min", value: fmt(fives.min) },
                  { label: "Q1", value: fmt(fives.q1) },
                  { label: "Median", value: fmt(fives.median) },
                  { label: "Q3", value: fmt(fives.q3) },
                  { label: "Max", value: fmt(fives.max) },
                ]
              : []),
            { label: "Distinct", value: freq.length },
            { label: "Top frequencies", value: freq.slice(0, 8).map((r) => `${r.value}:${r.count}`).join(", ") },
          ],
          [{ title: "Chart data summary", detail: `${engine} — use frequencies / five-number summary` }],
        );
      }

      default:
        throw new Error(`Unknown engine: ${engine}`);
    }
  });
}

export function fmt(n: number, digits = 4): string {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 1e6 || (Math.abs(n) > 0 && Math.abs(n) < 1e-4)) {
    return n.toExponential(digits);
  }
  const rounded = Number(n.toPrecision(digits + 2));
  return String(rounded);
}

export function fmtP(p: number): string {
  if (!Number.isFinite(p)) return "—";
  if (p < 0.0001) return "< .0001";
  return p.toFixed(4).replace(/^0/, "");
}

export function apaTest(opts: {
  test: string;
  statistic: string;
  value: number;
  df?: number | string;
  p: number;
  alpha?: number;
}): string {
  const reject = opts.p < (opts.alpha ?? 0.05);
  const df =
    opts.df !== undefined
      ? `(${opts.df})`
      : "";
  return (
    `${opts.test}: ${opts.statistic}${df} = ${fmt(opts.value)}, p ${opts.p < 0.001 ? "< .001" : `= ${fmtP(opts.p)}`}. ` +
    `${reject ? "Reject" : "Fail to reject"} the null hypothesis at α = ${opts.alpha ?? 0.05}.`
  );
}

export type Step = { title: string; detail: string };
export type ResultField = { label: string; value: string | number };
export type CalcResult = {
  fields: ResultField[];
  steps: Step[];
  apa?: string;
  error?: string;
};

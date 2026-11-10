import { fmt, type CalcResult } from "@/lib/stats/format";

type Input = Record<string, string>;

function ok(fields: CalcResult["fields"], steps: CalcResult["steps"]): CalcResult {
  return { fields, steps };
}

function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) throw new Error("Factorial requires a non-negative integer.");
  if (n > 170) throw new Error("n too large for factorial (max 170).");
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function combinations(n: number, r: number): number {
  if (![n, r].every((v) => Number.isInteger(v) && v >= 0)) throw new Error("n and r must be non-negative integers.");
  if (r > n) return 0;
  r = Math.min(r, n - r);
  let c = 1;
  for (let i = 1; i <= r; i++) c = (c * (n - r + i)) / i;
  return Math.round(c);
}

function permutations(n: number, r: number): number {
  if (![n, r].every((v) => Number.isInteger(v) && v >= 0)) throw new Error("n and r must be non-negative integers.");
  if (r > n) return 0;
  let p = 1;
  for (let i = 0; i < r; i++) p *= n - i;
  return p;
}

function gcd(a: number, b: number): number {
  a = Math.abs(Math.trunc(a));
  b = Math.abs(Math.trunc(b));
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function simplifyFraction(num: number, den: number) {
  const g = gcd(num, den);
  return { num: num / g, den: den / g };
}

export function runSoupMath(engine: string, input: Input): CalcResult | null {
  switch (engine) {
    case "percentage": {
      const mode = input.mode ?? "of";
      if (mode === "of") {
        const pct = Number(input.percent);
        const of = Number(input.of);
        if (![pct, of].every(Number.isFinite)) throw new Error("Enter percent and base value.");
        const value = (pct / 100) * of;
        return ok(
          [
            { label: "Result", value: fmt(value) },
            { label: "Expression", value: `${fmt(pct)}% of ${fmt(of)}` },
          ],
          [{ title: "Percent of", detail: `(p/100)×x = ${fmt(value)}` }],
        );
      }
      const part = Number(input.part);
      const whole = Number(input.whole);
      if (![part, whole].every(Number.isFinite) || whole === 0) throw new Error("Enter part and non-zero whole.");
      const pct = (part / whole) * 100;
      return ok(
        [
          { label: "Percent", value: `${fmt(pct)}%` },
          { label: "Expression", value: `${fmt(part)} is what % of ${fmt(whole)}` },
        ],
        [{ title: "Part of whole", detail: `(part/whole)×100 = ${fmt(pct)}%` }],
      );
    }

    case "percent-change": {
      const from = Number(input.from);
      const to = Number(input.to);
      if (![from, to].every(Number.isFinite) || from === 0) throw new Error("Enter from/to with non-zero starting value.");
      const change = ((to - from) / Math.abs(from)) * 100;
      return ok(
        [
          { label: "From", value: fmt(from) },
          { label: "To", value: fmt(to) },
          { label: "Change", value: fmt(to - from) },
          { label: "Percent change", value: `${fmt(change)}%` },
        ],
        [{ title: "Percent change", detail: `((to − from)/|from|)×100 = ${fmt(change)}%` }],
      );
    }

    case "percent-difference": {
      const a = Number(input.a);
      const b = Number(input.b);
      if (![a, b].every(Number.isFinite)) throw new Error("Enter both values.");
      const avg = (Math.abs(a) + Math.abs(b)) / 2;
      if (avg === 0) throw new Error("Average magnitude is 0.");
      const diff = (Math.abs(a - b) / avg) * 100;
      return ok(
        [
          { label: "A", value: fmt(a) },
          { label: "B", value: fmt(b) },
          { label: "Absolute difference", value: fmt(Math.abs(a - b)) },
          { label: "Percent difference", value: `${fmt(diff)}%` },
        ],
        [{ title: "Percent difference", detail: `|A−B| / ((|A|+|B|)/2) × 100 = ${fmt(diff)}%` }],
      );
    }

    case "percent-increase": {
      const value = Number(input.value);
      const pct = Number(input.percent);
      if (![value, pct].every(Number.isFinite)) throw new Error("Enter value and percent.");
      const result = value * (1 + pct / 100);
      return ok(
        [
          { label: "Original", value: fmt(value) },
          { label: "Increase", value: `${fmt(pct)}%` },
          { label: "New value", value: fmt(result) },
          { label: "Amount added", value: fmt(result - value) },
        ],
        [{ title: "Percent increase", detail: `x×(1 + p/100) = ${fmt(result)}` }],
      );
    }

    case "percent-decrease": {
      const value = Number(input.value);
      const pct = Number(input.percent);
      if (![value, pct].every(Number.isFinite)) throw new Error("Enter value and percent.");
      const result = value * (1 - pct / 100);
      return ok(
        [
          { label: "Original", value: fmt(value) },
          { label: "Decrease", value: `${fmt(pct)}%` },
          { label: "New value", value: fmt(result) },
          { label: "Amount removed", value: fmt(value - result) },
        ],
        [{ title: "Percent decrease", detail: `x×(1 − p/100) = ${fmt(result)}` }],
      );
    }

    case "percent-tolerance": {
      const nominal = Number(input.nominal);
      const measured = Number(input.measured);
      const tol = Number(input.tolerance);
      if (![nominal, measured, tol].every(Number.isFinite) || nominal === 0) {
        throw new Error("Enter nominal, measured, and tolerance %.");
      }
      const err = ((measured - nominal) / Math.abs(nominal)) * 100;
      const within = Math.abs(err) <= Math.abs(tol);
      return ok(
        [
          { label: "Nominal", value: fmt(nominal) },
          { label: "Measured", value: fmt(measured) },
          { label: "Tolerance", value: `±${fmt(tol)}%` },
          { label: "Error", value: `${fmt(err)}%` },
          { label: "Within tolerance?", value: within ? "Yes" : "No" },
        ],
        [{ title: "Tolerance check", detail: `|error| ${within ? "≤" : ">"} ${fmt(Math.abs(tol))}%` }],
      );
    }

    case "decimal-to-percent": {
      const d = Number(input.value);
      if (!Number.isFinite(d)) throw new Error("Enter a decimal.");
      return ok(
        [{ label: "Percent", value: `${fmt(d * 100)}%` }],
        [{ title: "Convert", detail: `decimal × 100 = ${fmt(d * 100)}%` }],
      );
    }

    case "percent-to-decimal": {
      const p = Number(input.value);
      if (!Number.isFinite(p)) throw new Error("Enter a percent.");
      return ok(
        [{ label: "Decimal", value: fmt(p / 100) }],
        [{ title: "Convert", detail: `percent / 100 = ${fmt(p / 100)}` }],
      );
    }

    case "percent-to-fraction": {
      const p = Number(input.value);
      if (!Number.isFinite(p)) throw new Error("Enter a percent.");
      // p/100 = p / 100
      const num = Math.round(p * 1000);
      const den = 100000;
      const s = simplifyFraction(num, den);
      return ok(
        [
          { label: "Percent", value: `${fmt(p)}%` },
          { label: "Fraction", value: `${s.num}/${s.den}` },
          { label: "Decimal", value: fmt(p / 100) },
        ],
        [{ title: "Percent to fraction", detail: `${fmt(p)}/100 simplified` }],
      );
    }

    case "fraction-to-percent": {
      const num = Number(input.num);
      const den = Number(input.den);
      if (![num, den].every(Number.isFinite) || den === 0) throw new Error("Enter numerator and non-zero denominator.");
      const pct = (num / den) * 100;
      return ok(
        [
          { label: "Fraction", value: `${fmt(num)}/${fmt(den)}` },
          { label: "Decimal", value: fmt(num / den) },
          { label: "Percent", value: `${fmt(pct)}%` },
        ],
        [{ title: "Fraction to percent", detail: `(num/den)×100 = ${fmt(pct)}%` }],
      );
    }

    case "factorial": {
      const n = Number(input.n);
      const f = factorial(n);
      return ok(
        [
          { label: "n", value: n },
          { label: "n!", value: f },
        ],
        [{ title: "Factorial", detail: `${n}! = ${f}` }],
      );
    }

    case "combinations": {
      const n = Number(input.n);
      const r = Number(input.r);
      const c = combinations(n, r);
      return ok(
        [
          { label: "n", value: n },
          { label: "r", value: r },
          { label: "C(n, r)", value: c },
        ],
        [{ title: "Combinations", detail: `n! / (r!(n−r)!) = ${c}` }],
      );
    }

    case "combinations-rep": {
      const n = Number(input.n);
      const r = Number(input.r);
      const c = combinations(n + r - 1, r);
      return ok(
        [
          { label: "n", value: n },
          { label: "r", value: r },
          { label: "C with replacement", value: c },
        ],
        [{ title: "Combinations with replacement", detail: `C(n+r−1, r) = ${c}` }],
      );
    }

    case "permutations": {
      const n = Number(input.n);
      const r = Number(input.r);
      const p = permutations(n, r);
      return ok(
        [
          { label: "n", value: n },
          { label: "r", value: r },
          { label: "P(n, r)", value: p },
        ],
        [{ title: "Permutations", detail: `n! / (n−r)! = ${p}` }],
      );
    }

    case "permutations-rep": {
      const n = Number(input.n);
      const r = Number(input.r);
      if (![n, r].every((v) => Number.isInteger(v) && v >= 0)) throw new Error("n and r must be non-negative integers.");
      if (r > 20) throw new Error("r too large.");
      const p = n ** r;
      return ok(
        [
          { label: "n", value: n },
          { label: "r", value: r },
          { label: "P with replacement", value: p },
        ],
        [{ title: "Permutations with replacement", detail: `n^r = ${p}` }],
      );
    }

    case "permutations-circular": {
      const n = Number(input.n);
      if (!Number.isInteger(n) || n < 1) throw new Error("n must be a positive integer.");
      const p = factorial(n - 1);
      return ok(
        [
          { label: "n", value: n },
          { label: "Circular permutations", value: p },
        ],
        [{ title: "Circular permutations", detail: `(n−1)! = ${p}` }],
      );
    }

    case "fibonacci": {
      const n = Math.min(100, Math.max(1, Math.floor(Number(input.n ?? 10))));
      const seq: number[] = [];
      for (let i = 0; i < n; i++) {
        if (i < 2) seq.push(i);
        else seq.push(seq[i - 1] + seq[i - 2]);
      }
      return ok(
        [
          { label: "Terms", value: n },
          { label: "Sequence", value: seq.join(", ") },
          { label: "Last term", value: seq[seq.length - 1] },
        ],
        [{ title: "Fibonacci", detail: `F0=0, F1=1, Fn=Fn−1+Fn−2` }],
      );
    }

    case "pascal-triangle": {
      const rows = Math.min(20, Math.max(1, Math.floor(Number(input.rows ?? 5))));
      const triangle: string[] = [];
      for (let n = 0; n < rows; n++) {
        const row: number[] = [];
        for (let k = 0; k <= n; k++) row.push(combinations(n, k));
        triangle.push(row.join(" "));
      }
      return ok(
        [
          { label: "Rows", value: rows },
          { label: "Triangle", value: triangle.join(" | ") },
        ],
        [{ title: "Pascal's triangle", detail: `Row n entries are C(n, k)` }],
      );
    }

    case "abs-value": {
      const x = Number(input.x);
      if (!Number.isFinite(x)) throw new Error("Enter a number.");
      return ok(
        [
          { label: "x", value: fmt(x) },
          { label: "|x|", value: fmt(Math.abs(x)) },
        ],
        [{ title: "Absolute value", detail: `|x| = ${fmt(Math.abs(x))}` }],
      );
    }

    case "abs-diff": {
      const a = Number(input.a);
      const b = Number(input.b);
      if (![a, b].every(Number.isFinite)) throw new Error("Enter both numbers.");
      return ok(
        [
          { label: "A", value: fmt(a) },
          { label: "B", value: fmt(b) },
          { label: "|A − B|", value: fmt(Math.abs(a - b)) },
        ],
        [{ title: "Absolute difference", detail: `|A−B| = ${fmt(Math.abs(a - b))}` }],
      );
    }

    case "square": {
      const x = Number(input.x);
      if (!Number.isFinite(x)) throw new Error("Enter a number.");
      return ok(
        [
          { label: "x", value: fmt(x) },
          { label: "x²", value: fmt(x * x) },
        ],
        [{ title: "Square", detail: `x × x = ${fmt(x * x)}` }],
      );
    }

    case "cube": {
      const x = Number(input.x);
      if (!Number.isFinite(x)) throw new Error("Enter a number.");
      return ok(
        [
          { label: "x", value: fmt(x) },
          { label: "x³", value: fmt(x * x * x) },
        ],
        [{ title: "Cube", detail: `x × x × x = ${fmt(x ** 3)}` }],
      );
    }

    case "square-root": {
      const x = Number(input.x);
      if (!Number.isFinite(x) || x < 0) throw new Error("Enter a non-negative number.");
      return ok(
        [
          { label: "x", value: fmt(x) },
          { label: "√x", value: fmt(Math.sqrt(x)) },
        ],
        [{ title: "Square root", detail: `√x = ${fmt(Math.sqrt(x))}` }],
      );
    }

    case "cube-root": {
      const x = Number(input.x);
      if (!Number.isFinite(x)) throw new Error("Enter a number.");
      const root = Math.cbrt(x);
      return ok(
        [
          { label: "x", value: fmt(x) },
          { label: "∛x", value: fmt(root) },
        ],
        [{ title: "Cube root", detail: `∛x = ${fmt(root)}` }],
      );
    }

    case "nth-root": {
      const x = Number(input.x);
      const n = Number(input.n ?? 2);
      if (!Number.isFinite(x) || !Number.isFinite(n) || n === 0) throw new Error("Enter x and non-zero n.");
      if (x < 0 && n % 2 === 0) throw new Error("Even root of a negative number is not real.");
      const root = Math.sign(x) * Math.abs(x) ** (1 / n);
      return ok(
        [
          { label: "x", value: fmt(x) },
          { label: "n", value: fmt(n) },
          { label: "ⁿ√x", value: fmt(root) },
        ],
        [{ title: "Nth root", detail: `x^(1/n) = ${fmt(root)}` }],
      );
    }

    case "exponent": {
      const base = Number(input.base);
      const exp = Number(input.exp);
      if (![base, exp].every(Number.isFinite)) throw new Error("Enter base and exponent.");
      const value = base ** exp;
      return ok(
        [
          { label: "Base", value: fmt(base) },
          { label: "Exponent", value: fmt(exp) },
          { label: "Result", value: fmt(value) },
        ],
        [{ title: "Exponentiation", detail: `${fmt(base)}^${fmt(exp)} = ${fmt(value)}` }],
      );
    }

    case "quadratic": {
      const a = Number(input.a);
      const b = Number(input.b);
      const c = Number(input.c);
      if (![a, b, c].every(Number.isFinite) || a === 0) throw new Error("Enter a≠0, b, and c.");
      const disc = b * b - 4 * a * c;
      const fields: CalcResult["fields"] = [
        { label: "Equation", value: `${fmt(a)}x² + ${fmt(b)}x + ${fmt(c)} = 0` },
        { label: "Discriminant", value: fmt(disc) },
      ];
      if (disc > 0) {
        const r1 = (-b + Math.sqrt(disc)) / (2 * a);
        const r2 = (-b - Math.sqrt(disc)) / (2 * a);
        fields.push({ label: "Root 1", value: fmt(r1) }, { label: "Root 2", value: fmt(r2) });
      } else if (disc === 0) {
        fields.push({ label: "Root", value: fmt(-b / (2 * a)) });
      } else {
        const real = -b / (2 * a);
        const imag = Math.sqrt(-disc) / (2 * a);
        fields.push(
          { label: "Root 1", value: `${fmt(real)} + ${fmt(imag)}i` },
          { label: "Root 2", value: `${fmt(real)} − ${fmt(imag)}i` },
        );
      }
      return ok(fields, [{ title: "Quadratic formula", detail: `x = (−b ± √(b²−4ac)) / (2a)` }]);
    }

    default:
      return null;
  }
}

import { fmt, type CalcResult } from "@/lib/stats/format";

type Input = Record<string, string>;

function ok(fields: CalcResult["fields"], steps: CalcResult["steps"]): CalcResult {
  return { fields, steps };
}

function num(input: Input, key: string, fallback?: number) {
  const v = Number(input[key] ?? fallback);
  if (!Number.isFinite(v)) throw new Error(`Enter a valid ${key}.`);
  return v;
}

function gcd(a: number, b: number): number {
  a = Math.abs(Math.trunc(a));
  b = Math.abs(Math.trunc(b));
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function lcm(a: number, b: number): number {
  return Math.abs(Math.trunc(a) * Math.trunc(b)) / gcd(a, b);
}

function simplify(n: number, d: number) {
  if (d === 0) throw new Error("Denominator cannot be 0.");
  const sign = n * d < 0 ? -1 : 1;
  n = Math.abs(Math.round(n));
  d = Math.abs(Math.round(d));
  const g = gcd(n, d);
  return { n: (sign * n) / g, d: d / g };
}

function parseFrac(input: Input, nKey: string, dKey: string, nd = 1, dd = 2) {
  return { n: num(input, nKey, nd), d: num(input, dKey, dd) };
}

function isPrime(n: number) {
  if (n < 2 || !Number.isInteger(n)) return false;
  if (n % 2 === 0) return n === 2;
  for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
  return true;
}

function factorsOf(n: number) {
  n = Math.abs(Math.trunc(n));
  const out: number[] = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      out.push(i);
      if (i * i !== n) out.push(n / i);
    }
  }
  return out.sort((a, b) => a - b);
}

function primeFactors(n: number) {
  n = Math.abs(Math.trunc(n));
  const out: number[] = [];
  for (let p = 2; p * p <= n; p++) {
    while (n % p === 0) {
      out.push(p);
      n /= p;
    }
  }
  if (n > 1) out.push(n);
  return out;
}

export function runSoupMath2(engine: string, input: Input): CalcResult | null {
  switch (engine) {
    case "frac-add":
    case "frac-sub":
    case "frac-mul":
    case "frac-div": {
      const a = parseFrac(input, "n1", "d1", 1, 2);
      const b = parseFrac(input, "n2", "d2", 1, 3);
      let n: number;
      let d: number;
      if (engine === "frac-add") {
        n = a.n * b.d + b.n * a.d;
        d = a.d * b.d;
      } else if (engine === "frac-sub") {
        n = a.n * b.d - b.n * a.d;
        d = a.d * b.d;
      } else if (engine === "frac-mul") {
        n = a.n * b.n;
        d = a.d * b.d;
      } else {
        if (b.n === 0) throw new Error("Cannot divide by zero.");
        n = a.n * b.d;
        d = a.d * b.n;
      }
      const s = simplify(n, d);
      return ok(
        [
          { label: "Result", value: `${s.n}/${s.d}` },
          { label: "Decimal", value: fmt(s.n / s.d) },
          { label: "Mixed", value: `${Math.trunc(s.n / s.d)} ${Math.abs(s.n % s.d)}/${s.d}` },
        ],
        [{ title: "Fraction arithmetic", detail: `${a.n}/${a.d} op ${b.n}/${b.d}` }],
      );
    }

    case "frac-simplify": {
      const s = simplify(num(input, "n", 8), num(input, "d", 12));
      return ok(
        [
          { label: "Simplified", value: `${s.n}/${s.d}` },
          { label: "Decimal", value: fmt(s.n / s.d) },
        ],
        [{ title: "Simplify", detail: `Divide by GCD` }],
      );
    }

    case "frac-compare": {
      const a = parseFrac(input, "n1", "d1", 2, 3);
      const b = parseFrac(input, "n2", "d2", 3, 5);
      const left = a.n * b.d;
      const right = b.n * a.d;
      const cmp = left === right ? "=" : left > right ? ">" : "<";
      return ok(
        [
          { label: "Comparison", value: `${a.n}/${a.d} ${cmp} ${b.n}/${b.d}` },
          { label: "A decimal", value: fmt(a.n / a.d) },
          { label: "B decimal", value: fmt(b.n / b.d) },
        ],
        [{ title: "Compare", detail: "Cross-multiply numerators and denominators" }],
      );
    }

    case "frac-to-dec": {
      const s = simplify(num(input, "n", 3), num(input, "d", 4));
      return ok(
        [
          { label: "Fraction", value: `${s.n}/${s.d}` },
          { label: "Decimal", value: fmt(s.n / s.d) },
          { label: "Percent", value: `${fmt((s.n / s.d) * 100)}%` },
        ],
        [{ title: "Fraction → decimal", detail: "n ÷ d" }],
      );
    }

    case "dec-to-frac": {
      const x = num(input, "value", 0.75);
      const precision = Math.max(1, Math.floor(num(input, "precision", 10000)));
      const n = Math.round(x * precision);
      const s = simplify(n, precision);
      return ok(
        [
          { label: "Decimal", value: fmt(x) },
          { label: "Fraction", value: `${s.n}/${s.d}` },
        ],
        [{ title: "Decimal → fraction", detail: `Approximate with denominator ≤ ${precision}` }],
      );
    }

    case "mixed-to-improper": {
      const whole = Math.trunc(num(input, "whole", 2));
      const n = num(input, "n", 1);
      const d = num(input, "d", 3);
      const improper = whole * d + (whole < 0 ? -Math.abs(n) : Math.abs(n));
      const s = simplify(improper, d);
      return ok(
        [
          { label: "Improper", value: `${s.n}/${s.d}` },
          { label: "Decimal", value: fmt(s.n / s.d) },
        ],
        [{ title: "Mixed → improper", detail: `whole×d + n` }],
      );
    }

    case "improper-to-mixed": {
      const n = Math.trunc(num(input, "n", 7));
      const d = Math.trunc(num(input, "d", 3));
      if (d === 0) throw new Error("Denominator cannot be 0.");
      const whole = Math.trunc(n / d);
      const rem = Math.abs(n % d);
      const s = simplify(rem, d);
      return ok(
        [
          { label: "Mixed", value: rem === 0 ? `${whole}` : `${whole} ${s.n}/${s.d}` },
          { label: "Decimal", value: fmt(n / d) },
        ],
        [{ title: "Improper → mixed", detail: "Divide numerator by denominator" }],
      );
    }

    case "gcf": {
      const nums = (input.data ?? "12,18,24")
        .split(/[,\s]+/)
        .map(Number)
        .filter((v) => Number.isFinite(v) && Number.isInteger(v));
      if (nums.length < 2) throw new Error("Enter at least two integers.");
      const g = nums.reduce((a, b) => gcd(a, b));
      return ok(
        [
          { label: "Numbers", value: nums.join(", ") },
          { label: "GCF / GCD", value: g },
        ],
        [{ title: "GCF", detail: "Euclidean algorithm across all values" }],
      );
    }

    case "lcm-calc": {
      const nums = (input.data ?? "4,6,8")
        .split(/[,\s]+/)
        .map(Number)
        .filter((v) => Number.isFinite(v) && Number.isInteger(v));
      if (nums.length < 2) throw new Error("Enter at least two integers.");
      const L = nums.reduce((a, b) => lcm(a, b));
      return ok(
        [
          { label: "Numbers", value: nums.join(", ") },
          { label: "LCM", value: L },
        ],
        [{ title: "LCM", detail: "|ab|/gcd(a,b) extended to the list" }],
      );
    }

    case "factors": {
      const n = Math.trunc(num(input, "n", 36));
      const f = factorsOf(n);
      return ok(
        [
          { label: "n", value: n },
          { label: "Factor count", value: f.length },
          { label: "Factors", value: f.join(", ") },
        ],
        [{ title: "Factors", detail: `Positive divisors of ${n}` }],
      );
    }

    case "prime-factors": {
      const n = Math.trunc(num(input, "n", 84));
      if (n < 2) throw new Error("Enter an integer ≥ 2.");
      const pf = primeFactors(n);
      return ok(
        [
          { label: "n", value: n },
          { label: "Prime factors", value: pf.join(" × ") },
          { label: "Is prime?", value: isPrime(n) ? "Yes" : "No" },
        ],
        [{ title: "Prime factorization", detail: pf.join(" × ") }],
      );
    }

    case "prime-check": {
      const n = Math.trunc(num(input, "n", 97));
      return ok(
        [
          { label: "n", value: n },
          { label: "Prime?", value: isPrime(n) ? "Yes" : "No" },
        ],
        [{ title: "Primality", detail: "Trial division up to √n" }],
      );
    }

    case "primes-list": {
      const max = Math.min(10000, Math.max(2, Math.floor(num(input, "max", 100))));
      const primes: number[] = [];
      for (let i = 2; i <= max; i++) if (isPrime(i)) primes.push(i);
      return ok(
        [
          { label: "Up to", value: max },
          { label: "Count", value: primes.length },
          { label: "Primes", value: primes.join(", ") },
        ],
        [{ title: "Prime list", detail: `All primes ≤ ${max}` }],
      );
    }

    case "ratio-simplify": {
      const a = num(input, "a", 8);
      const b = num(input, "b", 12);
      const g = gcd(a, b);
      return ok(
        [
          { label: "Original", value: `${fmt(a)} : ${fmt(b)}` },
          { label: "Simplified", value: `${fmt(a / g)} : ${fmt(b / g)}` },
          { label: "As fraction", value: `${fmt(a / g)}/${fmt(b / g)}` },
        ],
        [{ title: "Simplify ratio", detail: `Divide both parts by GCD=${g}` }],
      );
    }

    case "unit-rate": {
      const a = num(input, "a", 12);
      const b = num(input, "b", 3);
      if (b === 0) throw new Error("Second quantity cannot be 0.");
      return ok(
        [
          { label: "Unit rate", value: fmt(a / b) },
          { label: "Per 1", value: `${fmt(a / b)} per 1` },
        ],
        [{ title: "Unit rate", detail: `a ÷ b` }],
      );
    }

    case "sci-notation": {
      const x = num(input, "value", 12300);
      const exp = Math.floor(Math.log10(Math.abs(x) || 1));
      const coef = x / 10 ** exp;
      return ok(
        [
          { label: "Scientific", value: `${fmt(coef)} × 10^${exp}` },
          { label: "E notation", value: x.toExponential(4) },
        ],
        [{ title: "Scientific notation", detail: `a × 10^n with 1 ≤ |a| < 10` }],
      );
    }

    case "sig-figs": {
      const raw = String(input.value ?? "0.00340");
      const cleaned = raw.trim();
      if (!cleaned || Number.isNaN(Number(cleaned))) throw new Error("Enter a numeric value.");
      let s = cleaned.replace(/^[+-]/, "");
      let count: number;
      if (s.includes("e") || s.includes("E")) {
        s = Number(cleaned).toExponential();
        count = s.replace(/^-?\d\.?|\.?e[+-]?\d+$/gi, "").replace(".", "").length + 1;
      } else if (s.includes(".")) {
        s = s.replace(/^0+/, "");
        if (s.startsWith(".")) s = s.replace(/^\./, "0.");
        const digits = s.replace(".", "").replace(/^0+/, "");
        count = digits.length || 1;
      } else {
        count = s.replace(/0+$/, "").replace(/^0+/, "").length || 1;
      }
      return ok(
        [
          { label: "Value", value: cleaned },
          { label: "Significant figures", value: count },
        ],
        [{ title: "Sig figs", detail: "Standard significant-figure counting rules" }],
      );
    }

    case "modulo": {
      const a = num(input, "a", 17);
      const b = num(input, "b", 5);
      if (b === 0) throw new Error("Modulo by 0 is undefined.");
      return ok(
        [
          { label: "a mod b", value: fmt(((a % b) + b) % b) },
          { label: "Quotient", value: fmt(Math.trunc(a / b)) },
          { label: "Remainder", value: fmt(a % b) },
        ],
        [{ title: "Modulo", detail: `a = q·b + r` }],
      );
    }

    case "rounding": {
      const x = num(input, "value", 3.14159);
      const places = Math.max(0, Math.floor(num(input, "places", 2)));
      const f = 10 ** places;
      return ok(
        [
          { label: "Half-up", value: fmt(Math.round(x * f) / f) },
          { label: "Floor", value: fmt(Math.floor(x * f) / f) },
          { label: "Ceil", value: fmt(Math.ceil(x * f) / f) },
          { label: "Trunc", value: fmt(Math.trunc(x * f) / f) },
        ],
        [{ title: "Rounding", detail: `${places} decimal place(s)` }],
      );
    }

    case "place-value": {
      const x = Math.trunc(num(input, "value", 3456));
      const s = String(Math.abs(x));
      const names = ["ones", "tens", "hundreds", "thousands", "ten thousands", "hundred thousands", "millions"];
      const fields = [...s].reverse().map((digit, i) => ({
        label: names[i] ?? `10^${i}`,
        value: digit,
      }));
      return ok(fields.reverse(), [{ title: "Place value", detail: String(x) }]);
    }

    case "expanded-form": {
      const x = Math.trunc(num(input, "value", 3456));
      const s = String(Math.abs(x));
      const parts: string[] = [];
      for (let i = 0; i < s.length; i++) {
        const digit = Number(s[i]);
        if (!digit) continue;
        parts.push(String(digit * 10 ** (s.length - 1 - i)));
      }
      const exp = (x < 0 ? "-" : "") + parts.join(" + ");
      return ok(
        [{ label: "Expanded form", value: exp || "0" }],
        [{ title: "Expanded form", detail: exp }],
      );
    }

    case "log-eq": {
      const base = num(input, "base", 10);
      const arg = num(input, "arg", 1000);
      if (base <= 0 || base === 1) throw new Error("Base must be > 0 and ≠ 1.");
      if (arg <= 0) throw new Error("Argument must be > 0.");
      const value = Math.log(arg) / Math.log(base);
      return ok(
        [
          { label: `log_${fmt(base)}(${fmt(arg)})`, value: fmt(value) },
          { label: "ln", value: fmt(Math.log(arg)) },
          { label: "log10", value: fmt(Math.log10(arg)) },
        ],
        [{ title: "Logarithm", detail: `log_b(a) = ln(a)/ln(b)` }],
      );
    }

    case "radical-simplify": {
      const n = Math.trunc(num(input, "n", 72));
      if (n < 0) throw new Error("Enter a non-negative integer for this simplifier.");
      let m = n;
      let outside = 1;
      for (let i = 2; i * i <= m; i++) {
        while (m % (i * i) === 0) {
          outside *= i;
          m /= i * i;
        }
      }
      return ok(
        [
          { label: "Original", value: `√${n}` },
          { label: "Simplified", value: m === 1 ? `${outside}` : outside === 1 ? `√${m}` : `${outside}√${m}` },
        ],
        [{ title: "Simplify radical", detail: "Factor out perfect squares" }],
      );
    }

    case "foil": {
      const a = num(input, "a", 2);
      const b = num(input, "b", 3);
      const c = num(input, "c", 4);
      const d = num(input, "d", 5);
      // (ax+b)(cx+d)
      const A = a * c;
      const B = a * d + b * c;
      const C = b * d;
      return ok(
        [
          { label: "Expanded", value: `${fmt(A)}x² + ${fmt(B)}x + ${fmt(C)}` },
          { label: "First", value: fmt(a * c) },
          { label: "Outer", value: fmt(a * d) },
          { label: "Inner", value: fmt(b * c) },
          { label: "Last", value: fmt(b * d) },
        ],
        [{ title: "FOIL", detail: `(${fmt(a)}x+${fmt(b)})(${fmt(c)}x+${fmt(d)})` }],
      );
    }

    case "diff-squares": {
      const a = num(input, "a", 5);
      const b = num(input, "b", 3);
      return ok(
        [
          { label: "a² − b²", value: fmt(a * a - b * b) },
          { label: "Factored", value: `(${fmt(a)}−${fmt(b)})(${fmt(a)}+${fmt(b)})` },
        ],
        [{ title: "Difference of squares", detail: `a² − b² = (a−b)(a+b)` }],
      );
    }

    case "complete-square": {
      const a = num(input, "a", 1);
      const b = num(input, "b", -6);
      const c = num(input, "c", 5);
      if (a === 0) throw new Error("a cannot be 0.");
      const h = b / (2 * a);
      const k = c - (b * b) / (4 * a);
      return ok(
        [
          { label: "Vertex form", value: `${fmt(a)}(x − ${fmt(-h)})² + ${fmt(k)}` },
          { label: "h", value: fmt(-h) },
          { label: "k", value: fmt(k) },
        ],
        [{ title: "Complete the square", detail: `a(x−h)² + k` }],
      );
    }

    case "cubic-eq": {
      // depressed cubic via Cardano for real root, then quadratic factor — simplified: try rational roots + numeric
      const a = num(input, "a", 1);
      const b = num(input, "b", -6);
      const c = num(input, "c", 11);
      const d = num(input, "d", -6);
      if (a === 0) throw new Error("Leading coefficient a cannot be 0.");
      // Newton for one real root
      let x = 0;
      for (let i = 0; i < 40; i++) {
        const f = a * x ** 3 + b * x ** 2 + c * x + d;
        const df = 3 * a * x ** 2 + 2 * b * x + c;
        if (Math.abs(df) < 1e-12) break;
        x -= f / df;
      }
      // Factor as (x - r)(A x^2 + B x + C)
      const r = x;
      const A = a;
      const B = b + a * r;
      const C = c + b * r + a * r * r;
      const disc = B * B - 4 * A * C;
      const fields: CalcResult["fields"] = [{ label: "Real root (approx)", value: fmt(r) }];
      if (disc >= 0) {
        fields.push(
          { label: "Root 2", value: fmt((-B + Math.sqrt(disc)) / (2 * A)) },
          { label: "Root 3", value: fmt((-B - Math.sqrt(disc)) / (2 * A)) },
        );
      } else {
        const real = -B / (2 * A);
        const imag = Math.sqrt(-disc) / (2 * A);
        fields.push(
          { label: "Complex root 2", value: `${fmt(real)} + ${fmt(imag)}i` },
          { label: "Complex root 3", value: `${fmt(real)} − ${fmt(imag)}i` },
        );
      }
      return ok(fields, [{ title: "Cubic equation", detail: `ax³+bx²+cx+d=0` }]);
    }

    case "dot-product": {
      const a = (input.a ?? "1,2,3").split(/[,\s]+/).map(Number);
      const b = (input.b ?? "4,5,6").split(/[,\s]+/).map(Number);
      if (a.length !== b.length || !a.every(Number.isFinite) || !b.every(Number.isFinite)) {
        throw new Error("Enter equal-length numeric vectors.");
      }
      const dot = a.reduce((s, v, i) => s + v * b[i], 0);
      return ok(
        [
          { label: "Dimension", value: a.length },
          { label: "Dot product", value: fmt(dot) },
        ],
        [{ title: "Dot product", detail: `Σ a_i b_i` }],
      );
    }

    case "multifactorial": {
      const n = Math.trunc(num(input, "n", 10));
      const k = Math.max(1, Math.trunc(num(input, "k", 2)));
      if (n < 0) throw new Error("n must be ≥ 0.");
      let r = 1;
      for (let i = n; i > 0; i -= k) r *= i;
      return ok(
        [{ label: `${n}${ "!".repeat(k)}`, value: r }],
        [{ title: "Multifactorial", detail: `n!... (${k} bangs)` }],
      );
    }

    default:
      return null;
  }
}

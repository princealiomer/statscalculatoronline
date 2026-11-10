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

/** Periodic payment for amortizing loan. */
function pmt(principal: number, annualRatePct: number, years: number, periodsPerYear = 12) {
  const n = years * periodsPerYear;
  const r = annualRatePct / 100 / periodsPerYear;
  if (n <= 0) throw new Error("Term must be positive.");
  if (r === 0) return principal / n;
  return (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);
}

export function runSoupFinance(engine: string, input: Input): CalcResult | null {
  switch (engine) {
    case "loan-payment": {
      const principal = num(input, "principal", 20000);
      const rate = num(input, "rate", 6);
      const years = num(input, "years", 5);
      const payment = pmt(principal, rate, years);
      const n = years * 12;
      const total = payment * n;
      return ok(
        [
          { label: "Monthly payment", value: fmt(payment, 2) },
          { label: "Total paid", value: fmt(total, 2) },
          { label: "Total interest", value: fmt(total - principal, 2) },
          { label: "Payments", value: n },
        ],
        [{ title: "Amortizing payment", detail: `PMT = P·r(1+r)^n / ((1+r)^n − 1)` }],
      );
    }

    case "mortgage-payment": {
      const home = num(input, "homePrice", 350000);
      const down = num(input, "downPayment", 70000);
      const rate = num(input, "rate", 6.5);
      const years = num(input, "years", 30);
      const principal = home - down;
      if (principal <= 0) throw new Error("Down payment must be less than home price.");
      const payment = pmt(principal, rate, years);
      const total = payment * years * 12;
      return ok(
        [
          { label: "Loan amount", value: fmt(principal, 2) },
          { label: "Monthly payment", value: fmt(payment, 2) },
          { label: "Total paid", value: fmt(total, 2) },
          { label: "Total interest", value: fmt(total - principal, 2) },
        ],
        [{ title: "Mortgage payment", detail: `Based on principal ${fmt(principal, 2)} over ${years} years` }],
      );
    }

    case "simple-interest": {
      const p = num(input, "principal", 1000);
      const rate = num(input, "rate", 5);
      const years = num(input, "years", 2);
      const interest = p * (rate / 100) * years;
      return ok(
        [
          { label: "Interest", value: fmt(interest, 2) },
          { label: "Total", value: fmt(p + interest, 2) },
        ],
        [{ title: "Simple interest", detail: `I = P·r·t = ${fmt(interest, 2)}` }],
      );
    }

    case "compound-interest": {
      const p = num(input, "principal", 1000);
      const rate = num(input, "rate", 5);
      const years = num(input, "years", 5);
      const m = Math.max(1, Math.floor(num(input, "compounds", 12)));
      const amount = p * (1 + rate / 100 / m) ** (m * years);
      return ok(
        [
          { label: "Future value", value: fmt(amount, 2) },
          { label: "Interest earned", value: fmt(amount - p, 2) },
        ],
        [{ title: "Compound interest", detail: `A = P(1 + r/m)^(m t)` }],
      );
    }

    case "cagr": {
      const begin = num(input, "begin", 10000);
      const end = num(input, "end", 16000);
      const years = num(input, "years", 4);
      if (begin <= 0 || years <= 0) throw new Error("Begin value and years must be positive.");
      const cagr = (end / begin) ** (1 / years) - 1;
      return ok(
        [{ label: "CAGR", value: `${fmt(cagr * 100)}%` }],
        [{ title: "CAGR", detail: `(end/begin)^(1/t) − 1` }],
      );
    }

    case "roi": {
      const gain = num(input, "gain", 1500);
      const cost = num(input, "cost", 1000);
      if (cost === 0) throw new Error("Cost cannot be 0.");
      const roi = ((gain - cost) / Math.abs(cost)) * 100;
      return ok(
        [
          { label: "Net profit", value: fmt(gain - cost, 2) },
          { label: "ROI", value: `${fmt(roi)}%` },
        ],
        [{ title: "ROI", detail: `((gain − cost)/|cost|) × 100` }],
      );
    }

    case "tip": {
      const bill = num(input, "bill", 60);
      const pct = num(input, "percent", 18);
      const people = Math.max(1, Math.floor(num(input, "people", 1)));
      const tip = bill * (pct / 100);
      const total = bill + tip;
      return ok(
        [
          { label: "Tip", value: fmt(tip, 2) },
          { label: "Total", value: fmt(total, 2) },
          { label: "Per person", value: fmt(total / people, 2) },
        ],
        [{ title: "Tip", detail: `${fmt(pct)}% of ${fmt(bill, 2)}` }],
      );
    }

    case "discount": {
      const price = num(input, "price", 80);
      const pct = num(input, "percent", 25);
      const off = price * (pct / 100);
      return ok(
        [
          { label: "Discount amount", value: fmt(off, 2) },
          { label: "Sale price", value: fmt(price - off, 2) },
        ],
        [{ title: "Discount", detail: `price × (1 − p/100)` }],
      );
    }

    case "markup": {
      const cost = num(input, "cost", 40);
      const pct = num(input, "percent", 50);
      const price = cost * (1 + pct / 100);
      return ok(
        [
          { label: "Selling price", value: fmt(price, 2) },
          { label: "Markup amount", value: fmt(price - cost, 2) },
        ],
        [{ title: "Markup", detail: `cost × (1 + p/100)` }],
      );
    }

    case "margin": {
      const cost = num(input, "cost", 40);
      const price = num(input, "price", 60);
      if (price === 0) throw new Error("Price cannot be 0.");
      const margin = ((price - cost) / price) * 100;
      return ok(
        [
          { label: "Profit", value: fmt(price - cost, 2) },
          { label: "Margin", value: `${fmt(margin)}%` },
        ],
        [{ title: "Profit margin", detail: `((price − cost)/price) × 100` }],
      );
    }

    case "sales-tax": {
      const amount = num(input, "amount", 100);
      const rate = num(input, "rate", 8.25);
      const tax = amount * (rate / 100);
      return ok(
        [
          { label: "Tax", value: fmt(tax, 2) },
          { label: "Total", value: fmt(amount + tax, 2) },
        ],
        [{ title: "Sales tax", detail: `amount × rate` }],
      );
    }

    case "reverse-sales-tax": {
      const total = num(input, "total", 108.25);
      const rate = num(input, "rate", 8.25);
      const pretax = total / (1 + rate / 100);
      return ok(
        [
          { label: "Pre-tax amount", value: fmt(pretax, 2) },
          { label: "Tax portion", value: fmt(total - pretax, 2) },
        ],
        [{ title: "Reverse sales tax", detail: `total / (1 + rate)` }],
      );
    }

    case "rule-of-72": {
      const rate = num(input, "rate", 8);
      if (rate === 0) throw new Error("Rate cannot be 0.");
      const years = 72 / rate;
      return ok(
        [{ label: "Years to double", value: fmt(years) }],
        [{ title: "Rule of 72", detail: `72 / rate% ≈ ${fmt(years)} years` }],
      );
    }

    case "future-value": {
      const p = num(input, "principal", 1000);
      const rate = num(input, "rate", 5);
      const years = num(input, "years", 10);
      const pmtAmt = Number(input.pmt ?? 0) || 0;
      const r = rate / 100;
      const fvLump = p * (1 + r) ** years;
      const fvAnnuity = r === 0 ? pmtAmt * years : pmtAmt * (((1 + r) ** years - 1) / r);
      const fv = fvLump + fvAnnuity;
      return ok(
        [
          { label: "Future value", value: fmt(fv, 2) },
          { label: "From principal", value: fmt(fvLump, 2) },
          { label: "From deposits", value: fmt(fvAnnuity, 2) },
        ],
        [{ title: "Future value", detail: "Lump sum + ordinary annuity (annual compounding)" }],
      );
    }

    case "present-value": {
      const fv = num(input, "future", 10000);
      const rate = num(input, "rate", 5);
      const years = num(input, "years", 10);
      const pv = fv / (1 + rate / 100) ** years;
      return ok(
        [{ label: "Present value", value: fmt(pv, 2) }],
        [{ title: "Present value", detail: `PV = FV / (1+r)^t` }],
      );
    }

    case "npv": {
      const rate = num(input, "rate", 10) / 100;
      const cashflows = (input.cashflows ?? "")
        .split(/[,\s]+/)
        .map(Number)
        .filter((v) => Number.isFinite(v));
      if (!cashflows.length) throw new Error("Enter cash flows (comma-separated, t=0 first).");
      const npv = cashflows.reduce((s, cf, t) => s + cf / (1 + rate) ** t, 0);
      return ok(
        [
          { label: "Periods", value: cashflows.length },
          { label: "NPV", value: fmt(npv, 2) },
        ],
        [{ title: "NPV", detail: `Σ CF_t / (1+r)^t` }],
      );
    }

    case "salary-hourly": {
      const salary = num(input, "salary", 75000);
      const hours = num(input, "hours", 40);
      const weeks = num(input, "weeks", 52);
      const hourly = salary / (hours * weeks);
      return ok(
        [
          { label: "Hourly", value: fmt(hourly, 2) },
          { label: "Weekly", value: fmt(hourly * hours, 2) },
          { label: "Monthly (approx)", value: fmt(salary / 12, 2) },
        ],
        [{ title: "Salary to hourly", detail: `salary / (hours × weeks)` }],
      );
    }

    case "hourly-salary": {
      const hourly = num(input, "hourly", 35);
      const hours = num(input, "hours", 40);
      const weeks = num(input, "weeks", 52);
      const salary = hourly * hours * weeks;
      return ok(
        [
          { label: "Annual salary", value: fmt(salary, 2) },
          { label: "Monthly (approx)", value: fmt(salary / 12, 2) },
          { label: "Weekly", value: fmt(hourly * hours, 2) },
        ],
        [{ title: "Hourly to salary", detail: `hourly × hours × weeks` }],
      );
    }

    case "inflation": {
      const amount = num(input, "amount", 1000);
      const rate = num(input, "rate", 3);
      const years = num(input, "years", 10);
      const future = amount * (1 + rate / 100) ** years;
      return ok(
        [
          { label: "Future equivalent", value: fmt(future, 2) },
          { label: "Purchasing power loss", value: fmt(future - amount, 2) },
        ],
        [{ title: "Inflation", detail: `A(1+i)^t` }],
      );
    }

    case "apr-ear": {
      const nom = num(input, "rate", 12);
      const m = Math.max(1, Math.floor(num(input, "compounds", 12)));
      const ear = (1 + nom / 100 / m) ** m - 1;
      return ok(
        [
          { label: "Nominal APR", value: `${fmt(nom)}%` },
          { label: "Effective annual rate", value: `${fmt(ear * 100)}%` },
        ],
        [{ title: "EAR", detail: `(1 + r/m)^m − 1` }],
      );
    }

    case "emi": {
      const principal = num(input, "principal", 500000);
      const rate = num(input, "rate", 9);
      const years = num(input, "years", 5);
      const payment = pmt(principal, rate, years);
      return ok(
        [
          { label: "EMI", value: fmt(payment, 2) },
          { label: "Total payment", value: fmt(payment * years * 12, 2) },
          { label: "Total interest", value: fmt(payment * years * 12 - principal, 2) },
        ],
        [{ title: "EMI", detail: "Equated monthly installment (amortizing loan)" }],
      );
    }

    default:
      return null;
  }
}

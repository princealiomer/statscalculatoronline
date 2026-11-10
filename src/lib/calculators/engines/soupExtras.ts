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

const ATOMIC: Record<string, number> = {
  H: 1.008,
  He: 4.003,
  Li: 6.941,
  C: 12.011,
  N: 14.007,
  O: 15.999,
  F: 18.998,
  Na: 22.99,
  Mg: 24.305,
  Al: 26.982,
  Si: 28.086,
  P: 30.974,
  S: 32.065,
  Cl: 35.453,
  K: 39.098,
  Ca: 40.078,
  Fe: 55.845,
  Cu: 63.546,
  Zn: 65.38,
  Br: 79.904,
  Ag: 107.868,
  I: 126.904,
  Ba: 137.327,
  Au: 196.967,
  Pb: 207.2,
};

function parseFormula(formula: string) {
  const re = /([A-Z][a-z]?)(\d*)/g;
  let m: RegExpExecArray | null;
  const counts = new Map<string, number>();
  let matched = false;
  while ((m = re.exec(formula))) {
    matched = true;
    const el = m[1];
    const n = m[2] ? Number(m[2]) : 1;
    if (!(el in ATOMIC)) throw new Error(`Unknown element: ${el}`);
    counts.set(el, (counts.get(el) ?? 0) + n);
  }
  if (!matched) throw new Error("Enter a formula like H2O or C6H12O6.");
  return counts;
}

function pmt(principal: number, annualRatePct: number, years: number) {
  const n = years * 12;
  const r = annualRatePct / 100 / 12;
  if (n <= 0) throw new Error("Term must be positive.");
  if (r === 0) return principal / n;
  return (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);
}

export function runSoupExtras(engine: string, input: Input): CalcResult | null {
  switch (engine) {
    case "molar-mass": {
      const formula = (input.formula ?? "H2O").replace(/\s+/g, "");
      const counts = parseFormula(formula);
      let total = 0;
      const parts: string[] = [];
      for (const [el, n] of counts) {
        const w = ATOMIC[el] * n;
        total += w;
        parts.push(`${el}:${fmt(w)}`);
      }
      return ok(
        [
          { label: "Formula", value: formula },
          { label: "Molar mass (g/mol)", value: fmt(total) },
          { label: "Parts", value: parts.join(", ") },
        ],
        [{ title: "Molecular weight", detail: "Sum of atomic masses × counts" }],
      );
    }

    case "cubic-yards": {
      const l = num(input, "length", 10);
      const w = num(input, "width", 10);
      const d = num(input, "depth", 0.5);
      const unit = input.unit ?? "ft";
      const volFt3 = unit === "yd" ? l * w * d * 27 : l * w * d;
      return ok(
        [
          { label: "Cubic feet", value: fmt(volFt3) },
          { label: "Cubic yards", value: fmt(volFt3 / 27) },
        ],
        [{ title: "Cubic yards", detail: `L×W×D converted to yd³` }],
      );
    }

    case "cubic-feet": {
      const l = num(input, "length", 4);
      const w = num(input, "width", 3);
      const h = num(input, "height", 2);
      return ok(
        [
          { label: "Cubic feet", value: fmt(l * w * h) },
          { label: "Cubic yards", value: fmt((l * w * h) / 27) },
        ],
        [{ title: "Cubic feet", detail: `L×W×H` }],
      );
    }

    case "feet-inches": {
      const mode = input.mode ?? "to-inches";
      if (mode === "to-inches") {
        const ft = num(input, "ft", 5);
        const inches = num(input, "inches", 10);
        return ok(
          [
            { label: "Total inches", value: fmt(ft * 12 + inches) },
            { label: "Total feet (decimal)", value: fmt(ft + inches / 12) },
            { label: "Centimeters", value: fmt((ft * 12 + inches) * 2.54) },
          ],
          [{ title: "Feet & inches", detail: "Convert to total inches" }],
        );
      }
      const total = num(input, "totalInches", 70);
      const ft = Math.floor(total / 12);
      const inches = total - ft * 12;
      return ok(
        [{ label: "Feet & inches", value: `${ft}' ${fmt(inches)}"` }],
        [{ title: "Inches → ft/in", detail: `${fmt(total)} in` }],
      );
    }

    case "gravel":
    case "mulch":
    case "topsoil": {
      const l = num(input, "length", 20);
      const w = num(input, "width", 10);
      const dIn = num(input, "depthIn", 3);
      const cuYd = (l * w * (dIn / 12)) / 27;
      const label = engine === "gravel" ? "Gravel" : engine === "mulch" ? "Mulch" : "Topsoil";
      return ok(
        [
          { label: `${label} cubic yards`, value: fmt(cuYd) },
          { label: "Cubic feet", value: fmt(cuYd * 27) },
        ],
        [{ title: `${label} volume`, detail: `Area × depth / 27` }],
      );
    }

    case "tank-volume": {
      const shape = input.shape ?? "rect";
      if (shape === "cyl") {
        const r = num(input, "r", 2);
        const h = num(input, "h", 5);
        const vol = Math.PI * r * r * h;
        return ok(
          [
            { label: "Volume (ft³)", value: fmt(vol) },
            { label: "Gallons (US)", value: fmt(vol * 7.48052) },
          ],
          [{ title: "Cylindrical tank", detail: `πr²h` }],
        );
      }
      const l = num(input, "length", 4);
      const w = num(input, "width", 3);
      const h = num(input, "height", 2);
      const vol = l * w * h;
      return ok(
        [
          { label: "Volume (ft³)", value: fmt(vol) },
          { label: "Gallons (US)", value: fmt(vol * 7.48052) },
        ],
        [{ title: "Rectangular tank", detail: `L×W×H` }],
      );
    }

    case "dice-roll": {
      const sides = Math.max(2, Math.floor(num(input, "sides", 6)));
      const count = Math.min(100, Math.max(1, Math.floor(num(input, "count", 2))));
      const rolls = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * sides));
      return ok(
        [
          { label: "Dice", value: `${count}d${sides}` },
          { label: "Rolls", value: rolls.join(", ") },
          { label: "Sum", value: rolls.reduce((a, b) => a + b, 0) },
        ],
        [{ title: "Dice roll", detail: `Uniform 1…${sides}` }],
      );
    }

    case "lottery": {
      const max = Math.max(2, Math.floor(num(input, "max", 49)));
      const picks = Math.min(max, Math.max(1, Math.floor(num(input, "picks", 6))));
      const pool = Array.from({ length: max }, (_, i) => i + 1);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      const nums = pool.slice(0, picks).sort((a, b) => a - b);
      return ok(
        [{ label: "Numbers", value: nums.join(", ") }],
        [{ title: "Lottery pick", detail: `${picks} unique from 1…${max}` }],
      );
    }

    case "password-gen": {
      const length = Math.min(128, Math.max(4, Math.floor(num(input, "length", 16))));
      const lower = "abcdefghijklmnopqrstuvwxyz";
      const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const digits = "0123456789";
      const symbols = "!@#$%^&*()-_=+[]{}";
      let alphabet = lower + upper + digits;
      if ((input.symbols ?? "yes") === "yes") alphabet += symbols;
      let out = "";
      for (let i = 0; i < length; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
      return ok(
        [
          { label: "Length", value: length },
          { label: "Password", value: out },
        ],
        [{ title: "Password generator", detail: "Cryptographically-ish random from selected alphabet (Math.random)" }],
      );
    }

    case "odds-convert": {
      const a = num(input, "a", 5);
      const b = num(input, "b", 2);
      if (a + b === 0) throw new Error("Invalid odds.");
      const p = a / (a + b);
      return ok(
        [
          { label: "Odds", value: `${fmt(a)}:${fmt(b)}` },
          { label: "Implied probability", value: `${fmt(p * 100)}%` },
          { label: "Decimal odds", value: fmt((a + b) / a) },
        ],
        [{ title: "Odds", detail: `P = a/(a+b)` }],
      );
    }

    case "batting-avg": {
      const hits = num(input, "hits", 120);
      const ab = num(input, "ab", 400);
      if (ab <= 0) throw new Error("At-bats must be > 0.");
      return ok(
        [{ label: "Batting average", value: (hits / ab).toFixed(3) }],
        [{ title: "AVG", detail: `hits / at-bats` }],
      );
    }

    case "era-calc": {
      const er = num(input, "er", 25);
      const ip = num(input, "ip", 120);
      if (ip <= 0) throw new Error("Innings pitched must be > 0.");
      return ok(
        [{ label: "ERA", value: fmt((er * 9) / ip) }],
        [{ title: "ERA", detail: `(ER × 9) / IP` }],
      );
    }

    case "pregnancy-due": {
      const lmp = new Date(input.lmp ?? "2026-01-15");
      if (Number.isNaN(lmp.getTime())) throw new Error("Enter LMP as YYYY-MM-DD.");
      const due = new Date(lmp.getTime() + 280 * 86400000);
      const today = new Date();
      const daysPregnant = Math.floor((today.getTime() - lmp.getTime()) / 86400000);
      const weeks = Math.floor(Math.max(0, daysPregnant) / 7);
      const days = Math.max(0, daysPregnant) % 7;
      return ok(
        [
          { label: "Estimated due date", value: due.toISOString().slice(0, 10) },
          { label: "Gestational age", value: `${weeks}w ${days}d` },
        ],
        [{ title: "Naegele’s rule", detail: "LMP + 280 days (estimate only)" }],
      );
    }

    case "period-estimate": {
      const last = new Date(input.last ?? "2026-03-01");
      const cycle = Math.max(20, Math.floor(num(input, "cycle", 28)));
      if (Number.isNaN(last.getTime())) throw new Error("Enter last period start YYYY-MM-DD.");
      const next = new Date(last.getTime() + cycle * 86400000);
      const ovulation = new Date(next.getTime() - 14 * 86400000);
      return ok(
        [
          { label: "Next period (est.)", value: next.toISOString().slice(0, 10) },
          { label: "Ovulation (est.)", value: ovulation.toISOString().slice(0, 10) },
          { label: "Cycle length", value: cycle },
        ],
        [{ title: "Cycle estimate", detail: "Educational estimate only, not medical advice" }],
      );
    }

    case "day-of-week": {
      const d = new Date(input.date ?? "2026-11-10");
      if (Number.isNaN(d.getTime())) throw new Error("Enter date YYYY-MM-DD.");
      const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return ok(
        [{ label: "Day", value: names[d.getUTCDay()] }],
        [{ title: "Day of week", detail: input.date ?? "2026-11-10" }],
      );
    }

    case "work-hours": {
      const start = input.start ?? "09:00";
      const end = input.end ?? "17:00";
      const breakMin = num(input, "breakMin", 30);
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      if (![sh, sm, eh, em].every(Number.isFinite)) throw new Error("Use HH:MM times.");
      let mins = eh * 60 + em - (sh * 60 + sm) - breakMin;
      if (mins < 0) mins += 24 * 60;
      return ok(
        [
          { label: "Worked minutes", value: mins },
          { label: "Decimal hours", value: fmt(mins / 60) },
          { label: "H:MM", value: `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, "0")}` },
        ],
        [{ title: "Work hours", detail: "End − start − break" }],
      );
    }

    case "amortization-schedule": {
      const principal = num(input, "principal", 20000);
      const rate = num(input, "rate", 6);
      const years = num(input, "years", 3);
      const payment = pmt(principal, rate, years);
      const r = rate / 100 / 12;
      const n = Math.min(360, Math.round(years * 12));
      let bal = principal;
      const rows: string[] = [];
      let interestTotal = 0;
      for (let i = 1; i <= n; i++) {
        const interest = bal * r;
        const prin = payment - interest;
        bal = Math.max(0, bal - prin);
        interestTotal += interest;
        if (i <= 6 || i > n - 3) {
          rows.push(`#${i}: pay ${fmt(payment, 2)} (int ${fmt(interest, 2)}, prin ${fmt(prin, 2)}, bal ${fmt(bal, 2)})`);
        } else if (i === 7) rows.push("…");
      }
      return ok(
        [
          { label: "Monthly payment", value: fmt(payment, 2) },
          { label: "Payments", value: n },
          { label: "Total interest", value: fmt(interestTotal, 2) },
          { label: "Schedule preview", value: rows.join(" | ") },
        ],
        [{ title: "Amortization", detail: "Standard amortizing loan schedule" }],
      );
    }

    case "straight-line-depr": {
      const cost = num(input, "cost", 10000);
      const salvage = num(input, "salvage", 1000);
      const years = num(input, "years", 5);
      if (years <= 0) throw new Error("Years must be > 0.");
      const annual = (cost - salvage) / years;
      return ok(
        [
          { label: "Annual depreciation", value: fmt(annual, 2) },
          { label: "Depreciable base", value: fmt(cost - salvage, 2) },
        ],
        [{ title: "Straight-line depreciation", detail: `(cost − salvage) / years` }],
      );
    }

    case "declining-balance": {
      const cost = num(input, "cost", 10000);
      const rate = num(input, "rate", 40);
      const years = Math.min(20, Math.max(1, Math.floor(num(input, "years", 5))));
      let book = cost;
      const rows: string[] = [];
      for (let y = 1; y <= years; y++) {
        const dep = book * (rate / 100);
        book -= dep;
        rows.push(`Y${y}: dep ${fmt(dep, 2)}, book ${fmt(book, 2)}`);
      }
      return ok(
        [
          { label: "Ending book value", value: fmt(book, 2) },
          { label: "Schedule", value: rows.join(" | ") },
        ],
        [{ title: "Declining balance", detail: `Book × rate each year` }],
      );
    }

    case "car-afford": {
      const payment = num(input, "payment", 400);
      const rate = num(input, "rate", 6);
      const years = num(input, "years", 5);
      const r = rate / 100 / 12;
      const n = years * 12;
      const principal = r === 0 ? payment * n : (payment * ((1 + r) ** n - 1)) / (r * (1 + r) ** n);
      return ok(
        [
          { label: "Affordable loan amount", value: fmt(principal, 2) },
          { label: "Monthly payment", value: fmt(payment, 2) },
        ],
        [{ title: "Loan affordability", detail: "Invert PMT formula for principal" }],
      );
    }

    case "house-afford": {
      const income = num(input, "income", 90000);
      const debts = num(input, "debts", 500);
      const rate = num(input, "rate", 6.5);
      const years = num(input, "years", 30);
      const downPct = num(input, "downPct", 20);
      const maxHousing = (income / 12) * 0.28;
      const maxTotal = (income / 12) * 0.36 - debts;
      const payment = Math.max(0, Math.min(maxHousing, maxTotal));
      const r = rate / 100 / 12;
      const n = years * 12;
      const loan = r === 0 ? payment * n : (payment * ((1 + r) ** n - 1)) / (r * (1 + r) ** n);
      const price = loan / (1 - downPct / 100);
      return ok(
        [
          { label: "Max monthly housing", value: fmt(payment, 2) },
          { label: "Est. loan amount", value: fmt(loan, 2) },
          { label: "Est. home price", value: fmt(price, 2) },
        ],
        [{ title: "Home affordability", detail: "28/36 rule estimate (simplified)" }],
      );
    }

    case "gas-mileage": {
      const miles = num(input, "miles", 300);
      const gallons = num(input, "gallons", 10);
      const price = num(input, "price", 3.5);
      if (gallons <= 0) throw new Error("Gallons must be > 0.");
      const mpg = miles / gallons;
      return ok(
        [
          { label: "MPG", value: fmt(mpg) },
          { label: "Cost / mile", value: fmt(price / mpg, 3) },
          { label: "Trip fuel cost", value: fmt(gallons * price, 2) },
        ],
        [{ title: "Gas mileage", detail: `miles / gallons` }],
      );
    }

    case "resize-image": {
      const w = num(input, "width", 1920);
      const h = num(input, "height", 1080);
      const mode = input.mode ?? "width";
      if (mode === "width") {
        const nw = num(input, "target", 800);
        const nh = (h * nw) / w;
        return ok(
          [
            { label: "New size", value: `${fmt(nw)} × ${fmt(nh)}` },
            { label: "Scale", value: `${fmt((nw / w) * 100)}%` },
          ],
          [{ title: "Resize by width", detail: "Keep aspect ratio" }],
        );
      }
      const nh = num(input, "target", 600);
      const nw = (w * nh) / h;
      return ok(
        [
          { label: "New size", value: `${fmt(nw)} × ${fmt(nh)}` },
          { label: "Scale", value: `${fmt((nh / h) * 100)}%` },
        ],
        [{ title: "Resize by height", detail: "Keep aspect ratio" }],
      );
    }

    case "speed-distance-time": {
      const mode = input.solve ?? "speed";
      if (mode === "speed") {
        const d = num(input, "distance", 120);
        const t = num(input, "time", 2);
        if (t === 0) throw new Error("Time cannot be 0.");
        return ok([{ label: "Speed", value: fmt(d / t) }], [{ title: "Speed", detail: `d/t` }]);
      }
      if (mode === "distance") {
        const s = num(input, "speed", 60);
        const t = num(input, "time", 2);
        return ok([{ label: "Distance", value: fmt(s * t) }], [{ title: "Distance", detail: `s·t` }]);
      }
      const s = num(input, "speed", 60);
      const d = num(input, "distance", 120);
      if (s === 0) throw new Error("Speed cannot be 0.");
      return ok([{ label: "Time", value: fmt(d / s) }], [{ title: "Time", detail: `d/s` }]);
    }

    default:
      return null;
  }
}

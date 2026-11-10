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

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

export function runSoupMore(engine: string, input: Input): CalcResult | null {
  switch (engine) {
    // —— Physics ——
    case "phys-force": {
      const m = num(input, "mass", 10);
      const a = num(input, "accel", 9.81);
      return ok(
        [{ label: "Force (N)", value: fmt(m * a) }],
        [{ title: "Newton’s 2nd law", detail: `F = m·a` }],
      );
    }
    case "phys-density": {
      const m = num(input, "mass", 1000);
      const v = num(input, "volume", 1);
      if (v === 0) throw new Error("Volume cannot be 0.");
      return ok(
        [{ label: "Density", value: fmt(m / v) }],
        [{ title: "Density", detail: `ρ = m / V` }],
      );
    }
    case "phys-work": {
      const f = num(input, "force", 50);
      const d = num(input, "distance", 10);
      return ok(
        [{ label: "Work (J)", value: fmt(f * d) }],
        [{ title: "Work", detail: `W = F·d (assuming parallel)` }],
      );
    }
    case "phys-kinetic": {
      const m = num(input, "mass", 2);
      const v = num(input, "velocity", 5);
      return ok(
        [{ label: "Kinetic energy (J)", value: fmt(0.5 * m * v * v) }],
        [{ title: "Kinetic energy", detail: `KE = ½mv²` }],
      );
    }
    case "phys-momentum": {
      const m = num(input, "mass", 2);
      const v = num(input, "velocity", 5);
      return ok(
        [{ label: "Momentum", value: fmt(m * v) }],
        [{ title: "Momentum", detail: `p = m·v` }],
      );
    }
    case "phys-pressure": {
      const f = num(input, "force", 100);
      const a = num(input, "area", 0.5);
      if (a === 0) throw new Error("Area cannot be 0.");
      return ok(
        [{ label: "Pressure (Pa)", value: fmt(f / a) }],
        [{ title: "Pressure", detail: `P = F / A` }],
      );
    }
    case "phys-velocity-avg": {
      const d = num(input, "distance", 100);
      const t = num(input, "time", 10);
      if (t === 0) throw new Error("Time cannot be 0.");
      return ok(
        [{ label: "Average velocity", value: fmt(d / t) }],
        [{ title: "Average velocity", detail: `v = Δx / Δt` }],
      );
    }
    case "phys-accel-motion": {
      const u = num(input, "u", 0);
      const a = num(input, "a", 2);
      const t = num(input, "t", 5);
      const v = u + a * t;
      const s = u * t + 0.5 * a * t * t;
      return ok(
        [
          { label: "Final velocity v", value: fmt(v) },
          { label: "Displacement s", value: fmt(s) },
        ],
        [{ title: "Uniform acceleration", detail: `v=u+at, s=ut+½at²` }],
      );
    }
    case "phys-ideal-gas": {
      const mode = input.solve ?? "P";
      const R = 8.314;
      if (mode === "P") {
        const n = num(input, "n", 1);
        const T = num(input, "T", 298);
        const V = num(input, "V", 0.0244);
        if (V === 0) throw new Error("V cannot be 0.");
        return ok(
          [{ label: "Pressure P (Pa)", value: fmt((n * R * T) / V) }],
          [{ title: "Ideal gas", detail: `P = nRT / V` }],
        );
      }
      const P = num(input, "P", 101325);
      const n = num(input, "n", 1);
      const T = num(input, "T", 298);
      return ok(
        [{ label: "Volume V (m³)", value: fmt((n * R * T) / P) }],
        [{ title: "Ideal gas", detail: `V = nRT / P` }],
      );
    }
    case "phys-emc2": {
      const m = num(input, "mass", 0.001);
      const c = 299792458;
      const e = m * c * c;
      return ok(
        [
          { label: "Energy (J)", value: fmt(e) },
          { label: "Energy (kWh)", value: fmt(e / 3.6e6) },
        ],
        [{ title: "E = mc²", detail: `c = 299,792,458 m/s` }],
      );
    }
    case "phys-wavelength": {
      const v = num(input, "speed", 3e8);
      const f = num(input, "freq", 5e14);
      if (f === 0) throw new Error("Frequency cannot be 0.");
      return ok(
        [{ label: "Wavelength", value: fmt(v / f) }],
        [{ title: "Wave relation", detail: `λ = v / f` }],
      );
    }
    case "phys-weight": {
      const m = num(input, "mass", 70);
      const g = num(input, "g", 9.81);
      return ok(
        [{ label: "Weight (N)", value: fmt(m * g) }],
        [{ title: "Weight", detail: `W = m·g` }],
      );
    }
    case "phys-hooke": {
      const k = num(input, "k", 200);
      const x = num(input, "x", 0.05);
      return ok(
        [
          { label: "Force (N)", value: fmt(k * x) },
          { label: "Elastic PE (J)", value: fmt(0.5 * k * x * x) },
        ],
        [{ title: "Hooke’s law", detail: `F=kx, PE=½kx²` }],
      );
    }

    // —— Health ——
    case "bmi": {
      const weight = num(input, "weight", 70);
      const height = num(input, "height", 175);
      const unit = input.unit ?? "metric";
      let bmi: number;
      if (unit === "imperial") {
        bmi = (weight / (height * height)) * 703;
      } else {
        const m = height / 100;
        bmi = weight / (m * m);
      }
      let cat = "Underweight";
      if (bmi >= 30) cat = "Obese";
      else if (bmi >= 25) cat = "Overweight";
      else if (bmi >= 18.5) cat = "Normal";
      return ok(
        [
          { label: "BMI", value: fmt(bmi) },
          { label: "Category", value: cat },
        ],
        [{ title: "BMI", detail: unit === "imperial" ? "703·lb/in²" : "kg/m²" }],
      );
    }
    case "pace": {
      const distance = num(input, "distance", 5);
      const minutes = num(input, "minutes", 30);
      const unit = input.unit ?? "km";
      const pace = minutes / distance;
      const speed = distance / (minutes / 60);
      return ok(
        [
          { label: `Pace (min/${unit})`, value: fmt(pace) },
          { label: `Speed (${unit}/h)`, value: fmt(speed) },
        ],
        [{ title: "Pace", detail: `time / distance` }],
      );
    }
    case "heart-rate-zone": {
      const age = num(input, "age", 30);
      const resting = Number(input.resting ?? 60);
      const max = 220 - age;
      const reserve = max - (Number.isFinite(resting) ? resting : 0);
      const zones = [
        ["Zone 1 (50–60%)", 0.5, 0.6],
        ["Zone 2 (60–70%)", 0.6, 0.7],
        ["Zone 3 (70–80%)", 0.7, 0.8],
        ["Zone 4 (80–90%)", 0.8, 0.9],
        ["Zone 5 (90–100%)", 0.9, 1.0],
      ] as const;
      return ok(
        [
          { label: "Max HR", value: fmt(max) },
          ...zones.map(([label, lo, hi]) => ({
            label,
            value: `${fmt((Number.isFinite(resting) ? resting : 0) + reserve * lo)}–${fmt((Number.isFinite(resting) ? resting : 0) + reserve * hi)} bpm`,
          })),
        ],
        [{ title: "Karvonen zones", detail: `Max ≈ 220 − age; zones use heart-rate reserve` }],
      );
    }

    // —— Time ——
    case "age-calc": {
      const birth = new Date(input.birth ?? "2000-01-01");
      const asOf = new Date(input.asOf || new Date().toISOString().slice(0, 10));
      if (Number.isNaN(birth.getTime()) || Number.isNaN(asOf.getTime())) {
        throw new Error("Enter valid dates (YYYY-MM-DD).");
      }
      let years = asOf.getFullYear() - birth.getFullYear();
      let months = asOf.getMonth() - birth.getMonth();
      let days = asOf.getDate() - birth.getDate();
      if (days < 0) {
        months -= 1;
        const prev = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
        days += prev.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }
      const totalDays = Math.floor((asOf.getTime() - birth.getTime()) / 86400000);
      return ok(
        [
          { label: "Age", value: `${years}y ${months}m ${days}d` },
          { label: "Total days", value: totalDays },
        ],
        [{ title: "Age", detail: "Calendar difference from birth date" }],
      );
    }
    case "date-diff": {
      const a = new Date(input.start ?? "2026-01-01");
      const b = new Date(input.end ?? "2026-12-31");
      if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) throw new Error("Enter valid dates.");
      const days = Math.round((b.getTime() - a.getTime()) / 86400000);
      return ok(
        [
          { label: "Days", value: days },
          { label: "Weeks", value: fmt(days / 7) },
          { label: "Hours", value: days * 24 },
        ],
        [{ title: "Date difference", detail: "end − start in whole days" }],
      );
    }
    case "hours-minutes": {
      const h1 = num(input, "h1", 2);
      const m1 = num(input, "m1", 45);
      const h2 = num(input, "h2", 1);
      const m2 = num(input, "m2", 30);
      const op = input.op ?? "add";
      let total = h1 * 60 + m1 + (op === "sub" ? -(h2 * 60 + m2) : h2 * 60 + m2);
      const sign = total < 0 ? "-" : "";
      total = Math.abs(total);
      return ok(
        [
          { label: "Result", value: `${sign}${Math.floor(total / 60)}h ${total % 60}m` },
          { label: "Total minutes", value: `${sign}${total}` },
        ],
        [{ title: "Hours & minutes", detail: op === "sub" ? "Subtract durations" : "Add durations" }],
      );
    }
    case "decimal-time": {
      const hours = num(input, "hours", 2.75);
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      return ok(
        [
          { label: "Hours", value: h },
          { label: "Minutes", value: m },
          { label: "H:MM", value: `${h}:${String(m).padStart(2, "0")}` },
        ],
        [{ title: "Decimal → clock", detail: "Fractional hours × 60" }],
      );
    }
    case "time-to-decimal": {
      const h = num(input, "h", 2);
      const m = num(input, "m", 45);
      return ok(
        [{ label: "Decimal hours", value: fmt(h + m / 60) }],
        [{ title: "Clock → decimal", detail: `h + m/60` }],
      );
    }
    case "military-time": {
      const mode = input.mode ?? "to-military";
      if (mode === "to-military") {
        let h = Math.floor(num(input, "h", 2));
        const m = Math.floor(num(input, "m", 30));
        const ampm = (input.ampm ?? "PM").toUpperCase();
        if (ampm === "AM") {
          if (h === 12) h = 0;
        } else if (h !== 12) h += 12;
        return ok(
          [{ label: "Military", value: `${String(h).padStart(2, "0")}${String(m).padStart(2, "0")}` }],
          [{ title: "12h → 24h", detail: "Convert AM/PM to military time" }],
        );
      }
      const mil = String(Math.floor(num(input, "military", 1430))).padStart(4, "0");
      let h = Number(mil.slice(0, 2));
      const m = mil.slice(2);
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      return ok(
        [{ label: "12-hour", value: `${h}:${m} ${ampm}` }],
        [{ title: "24h → 12h", detail: mil }],
      );
    }

    // —— Trig ——
    case "trig-functions": {
      const angle = num(input, "angle", 30);
      const unit = input.unit ?? "deg";
      const rad = unit === "rad" ? angle : toRad(angle);
      return ok(
        [
          { label: "sin", value: fmt(Math.sin(rad)) },
          { label: "cos", value: fmt(Math.cos(rad)) },
          { label: "tan", value: fmt(Math.tan(rad)) },
          { label: "csc", value: Math.sin(rad) === 0 ? "undefined" : fmt(1 / Math.sin(rad)) },
          { label: "sec", value: Math.cos(rad) === 0 ? "undefined" : fmt(1 / Math.cos(rad)) },
          { label: "cot", value: Math.tan(rad) === 0 ? "undefined" : fmt(1 / Math.tan(rad)) },
        ],
        [{ title: "Trigonometric functions", detail: `Angle in ${unit}` }],
      );
    }
    case "trig-inverse": {
      const value = num(input, "value", 0.5);
      const fn = input.fn ?? "asin";
      let rad: number;
      if (fn === "asin") rad = Math.asin(value);
      else if (fn === "acos") rad = Math.acos(value);
      else rad = Math.atan(value);
      return ok(
        [
          { label: "Radians", value: fmt(rad) },
          { label: "Degrees", value: fmt(toDeg(rad)) },
        ],
        [{ title: "Inverse trig", detail: fn }],
      );
    }

    // —— Construction helpers ——
    case "sqft-calc": {
      const l = num(input, "length", 12);
      const w = num(input, "width", 10);
      return ok(
        [
          { label: "Square feet", value: fmt(l * w) },
          { label: "Square meters", value: fmt(l * w * 0.09290304) },
        ],
        [{ title: "Square footage", detail: `length × width` }],
      );
    }
    case "concrete-volume": {
      const l = num(input, "length", 10);
      const w = num(input, "width", 10);
      const d = num(input, "depth", 0.333);
      const unit = input.unit ?? "ft";
      const vol = l * w * d;
      const cuYd = unit === "ft" ? vol / 27 : vol;
      return ok(
        [
          { label: unit === "ft" ? "Cubic feet" : "Cubic yards (input)", value: fmt(vol) },
          { label: "Cubic yards", value: fmt(unit === "ft" ? cuYd : vol) },
        ],
        [{ title: "Concrete volume", detail: `L × W × D` }],
      );
    }
    case "paint-calc": {
      const area = num(input, "area", 400);
      const coverage = num(input, "coverage", 350);
      const coats = Math.max(1, Math.floor(num(input, "coats", 2)));
      const gallons = (area * coats) / coverage;
      return ok(
        [
          { label: "Gallons needed", value: fmt(gallons) },
          { label: "Rounded up", value: Math.ceil(gallons) },
        ],
        [{ title: "Paint", detail: `(area × coats) / coverage` }],
      );
    }

    // —— Technology ——
    case "aspect-ratio": {
      const w = num(input, "width", 1920);
      const h = num(input, "height", 1080);
      const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
      const d = g(Math.round(w), Math.round(h)) || 1;
      return ok(
        [
          { label: "Ratio", value: `${Math.round(w / d)}:${Math.round(h / d)}` },
          { label: "Decimal", value: fmt(w / h) },
        ],
        [{ title: "Aspect ratio", detail: "Simplify width:height" }],
      );
    }
    case "ppi-calc": {
      const w = num(input, "width", 1920);
      const h = num(input, "height", 1080);
      const diag = num(input, "diagonal", 24);
      const ppi = Math.hypot(w, h) / diag;
      return ok(
        [{ label: "PPI", value: fmt(ppi) }],
        [{ title: "Pixels per inch", detail: `√(w²+h²) / diagonal` }],
      );
    }

    default:
      return null;
  }
}

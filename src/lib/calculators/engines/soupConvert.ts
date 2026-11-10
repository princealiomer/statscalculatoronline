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

export function runSoupConvert(engine: string, input: Input): CalcResult | null {
  switch (engine) {
    case "temp-convert": {
      const value = num(input, "value", 25);
      const from = (input.from ?? "C").toUpperCase();
      let c: number;
      if (from === "C") c = value;
      else if (from === "F") c = ((value - 32) * 5) / 9;
      else if (from === "K") c = value - 273.15;
      else if (from === "R") c = ((value - 491.67) * 5) / 9;
      else throw new Error("Use from = C, F, K, or R.");
      return ok(
        [
          { label: "Celsius", value: fmt(c) },
          { label: "Fahrenheit", value: fmt((c * 9) / 5 + 32) },
          { label: "Kelvin", value: fmt(c + 273.15) },
          { label: "Rankine", value: fmt(((c + 273.15) * 9) / 5) },
        ],
        [{ title: "Temperature", detail: `Converted via Celsius pivot from ${from}` }],
      );
    }

    case "length-convert": {
      const value = num(input, "value", 1);
      const from = (input.from ?? "m").toLowerCase();
      const toMeters: Record<string, number> = {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        mi: 1609.344,
        yd: 0.9144,
        ft: 0.3048,
        in: 0.0254,
      };
      if (!(from in toMeters)) throw new Error("Supported: m, km, cm, mm, mi, yd, ft, in");
      const meters = value * toMeters[from];
      return ok(
        Object.entries(toMeters).map(([u, f]) => ({ label: u, value: fmt(meters / f) })),
        [{ title: "Length", detail: `${fmt(value)} ${from} → SI meters pivot` }],
      );
    }

    case "weight-convert": {
      const value = num(input, "value", 1);
      const from = (input.from ?? "kg").toLowerCase();
      const toKg: Record<string, number> = {
        kg: 1,
        g: 0.001,
        mg: 1e-6,
        lb: 0.45359237,
        oz: 0.028349523125,
        ton: 1000,
      };
      if (!(from in toKg)) throw new Error("Supported: kg, g, mg, lb, oz, ton");
      const kg = value * toKg[from];
      return ok(
        Object.entries(toKg).map(([u, f]) => ({ label: u, value: fmt(kg / f) })),
        [{ title: "Weight/mass", detail: `${fmt(value)} ${from}` }],
      );
    }

    case "area-convert": {
      const value = num(input, "value", 1);
      const from = (input.from ?? "m2").toLowerCase();
      const toM2: Record<string, number> = {
        m2: 1,
        km2: 1e6,
        cm2: 1e-4,
        ft2: 0.09290304,
        in2: 0.00064516,
        acre: 4046.8564224,
        ha: 10000,
      };
      if (!(from in toM2)) throw new Error("Supported: m2, km2, cm2, ft2, in2, acre, ha");
      const m2 = value * toM2[from];
      return ok(
        Object.entries(toM2).map(([u, f]) => ({ label: u, value: fmt(m2 / f) })),
        [{ title: "Area", detail: `${fmt(value)} ${from}` }],
      );
    }

    case "volume-convert": {
      const value = num(input, "value", 1);
      const from = (input.from ?? "l").toLowerCase();
      const toL: Record<string, number> = {
        l: 1,
        ml: 0.001,
        m3: 1000,
        gal: 3.785411784,
        qt: 0.946352946,
        pt: 0.473176473,
        cup: 0.2365882365,
        ft3: 28.316846592,
      };
      if (!(from in toL)) throw new Error("Supported: l, ml, m3, gal, qt, pt, cup, ft3");
      const liters = value * toL[from];
      return ok(
        Object.entries(toL).map(([u, f]) => ({ label: u, value: fmt(liters / f) })),
        [{ title: "Volume", detail: `${fmt(value)} ${from}` }],
      );
    }

    case "speed-convert": {
      const value = num(input, "value", 60);
      const from = (input.from ?? "mph").toLowerCase();
      const toMs: Record<string, number> = {
        ms: 1,
        kmh: 1000 / 3600,
        mph: 1609.344 / 3600,
        knot: 1852 / 3600,
        fts: 0.3048,
      };
      if (!(from in toMs)) throw new Error("Supported: ms, kmh, mph, knot, fts");
      const ms = value * toMs[from];
      return ok(
        Object.entries(toMs).map(([u, f]) => ({ label: u, value: fmt(ms / f) })),
        [{ title: "Speed", detail: `${fmt(value)} ${from}` }],
      );
    }

    case "time-unit-convert": {
      const value = num(input, "value", 90);
      const from = (input.from ?? "min").toLowerCase();
      const toSec: Record<string, number> = {
        s: 1,
        min: 60,
        h: 3600,
        d: 86400,
        wk: 604800,
      };
      if (!(from in toSec)) throw new Error("Supported: s, min, h, d, wk");
      const sec = value * toSec[from];
      return ok(
        Object.entries(toSec).map(([u, f]) => ({ label: u, value: fmt(sec / f) })),
        [{ title: "Time units", detail: `${fmt(value)} ${from}` }],
      );
    }

    case "storage-convert": {
      const value = num(input, "value", 1);
      const from = (input.from ?? "GB").toUpperCase();
      const toBytes: Record<string, number> = {
        B: 1,
        KB: 1024,
        MB: 1024 ** 2,
        GB: 1024 ** 3,
        TB: 1024 ** 4,
        PB: 1024 ** 5,
      };
      if (!(from in toBytes)) throw new Error("Supported: B, KB, MB, GB, TB, PB");
      const bytes = value * toBytes[from];
      return ok(
        Object.entries(toBytes).map(([u, f]) => ({ label: u, value: fmt(bytes / f) })),
        [{ title: "Computer storage", detail: `Binary (1024) units from ${from}` }],
      );
    }

    case "cm-in": {
      const cm = num(input, "cm", 30);
      return ok(
        [
          { label: "cm", value: fmt(cm) },
          { label: "inches", value: fmt(cm / 2.54) },
          { label: "feet", value: fmt(cm / 30.48) },
        ],
        [{ title: "cm ↔ in", detail: `1 in = 2.54 cm` }],
      );
    }

    case "in-cm": {
      const inches = num(input, "inches", 12);
      return ok(
        [
          { label: "inches", value: fmt(inches) },
          { label: "cm", value: fmt(inches * 2.54) },
          { label: "mm", value: fmt(inches * 25.4) },
        ],
        [{ title: "in ↔ cm", detail: `inches × 2.54` }],
      );
    }

    case "ft-m": {
      const ft = num(input, "ft", 6);
      return ok(
        [
          { label: "feet", value: fmt(ft) },
          { label: "meters", value: fmt(ft * 0.3048) },
          { label: "cm", value: fmt(ft * 30.48) },
        ],
        [{ title: "ft ↔ m", detail: `1 ft = 0.3048 m` }],
      );
    }

    case "lb-kg": {
      const lb = num(input, "lb", 150);
      return ok(
        [
          { label: "pounds", value: fmt(lb) },
          { label: "kilograms", value: fmt(lb * 0.45359237) },
        ],
        [{ title: "lb ↔ kg", detail: `1 lb = 0.45359237 kg` }],
      );
    }

    case "kg-lb": {
      const kg = num(input, "kg", 70);
      return ok(
        [
          { label: "kilograms", value: fmt(kg) },
          { label: "pounds", value: fmt(kg / 0.45359237) },
        ],
        [{ title: "kg ↔ lb", detail: `kg / 0.45359237` }],
      );
    }

    case "sqft-acre": {
      const sqft = num(input, "sqft", 43560);
      return ok(
        [
          { label: "square feet", value: fmt(sqft) },
          { label: "acres", value: fmt(sqft / 43560) },
          { label: "square meters", value: fmt(sqft * 0.09290304) },
        ],
        [{ title: "ft² ↔ acre", detail: `1 acre = 43,560 ft²` }],
      );
    }

    case "acre-sqft": {
      const acres = num(input, "acres", 1);
      return ok(
        [
          { label: "acres", value: fmt(acres) },
          { label: "square feet", value: fmt(acres * 43560) },
        ],
        [{ title: "acre ↔ ft²", detail: `acres × 43,560` }],
      );
    }

    case "angle-convert": {
      const value = num(input, "value", 90);
      const from = (input.from ?? "deg").toLowerCase();
      const rad = from === "rad" ? value : (value * Math.PI) / 180;
      const deg = from === "deg" ? value : (value * 180) / Math.PI;
      return ok(
        [
          { label: "Degrees", value: fmt(deg) },
          { label: "Radians", value: fmt(rad) },
        ],
        [{ title: "Angle", detail: `π rad = 180°` }],
      );
    }

    case "roman-numeral": {
      const mode = input.mode ?? "to-roman";
      if (mode === "to-roman") {
        let n = Math.floor(num(input, "value", 2026));
        if (n < 1 || n > 3999) throw new Error("Enter an integer from 1 to 3999.");
        const map: [number, string][] = [
          [1000, "M"],
          [900, "CM"],
          [500, "D"],
          [400, "CD"],
          [100, "C"],
          [90, "XC"],
          [50, "L"],
          [40, "XL"],
          [10, "X"],
          [9, "IX"],
          [5, "V"],
          [4, "IV"],
          [1, "I"],
        ];
        let out = "";
        for (const [v, s] of map) {
          while (n >= v) {
            out += s;
            n -= v;
          }
        }
        return ok(
          [{ label: "Roman", value: out }],
          [{ title: "Integer → Roman", detail: out }],
        );
      }
      const roman = (input.roman ?? "").toUpperCase().trim();
      if (!roman) throw new Error("Enter a Roman numeral.");
      const vals: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      let total = 0;
      for (let i = 0; i < roman.length; i++) {
        const cur = vals[roman[i]];
        const next = vals[roman[i + 1]] ?? 0;
        if (!cur) throw new Error(`Invalid Roman digit: ${roman[i]}`);
        total += cur < next ? -cur : cur;
      }
      return ok(
        [{ label: "Integer", value: total }],
        [{ title: "Roman → Integer", detail: `${roman} = ${total}` }],
      );
    }

    default:
      return null;
  }
}

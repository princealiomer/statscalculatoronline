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

export function runSoupGeometry(engine: string, input: Input): CalcResult | null {
  switch (engine) {
    case "geo-circle": {
      const r = num(input, "r", 5);
      if (r < 0) throw new Error("Radius must be ≥ 0.");
      return ok(
        [
          { label: "Circumference", value: fmt(2 * Math.PI * r) },
          { label: "Area", value: fmt(Math.PI * r * r) },
          { label: "Diameter", value: fmt(2 * r) },
        ],
        [{ title: "Circle", detail: `C=2πr, A=πr²` }],
      );
    }

    case "geo-rectangle": {
      const l = num(input, "length", 8);
      const w = num(input, "width", 5);
      return ok(
        [
          { label: "Area", value: fmt(l * w) },
          { label: "Perimeter", value: fmt(2 * (l + w)) },
          { label: "Diagonal", value: fmt(Math.hypot(l, w)) },
        ],
        [{ title: "Rectangle", detail: `A=lw, P=2(l+w)` }],
      );
    }

    case "geo-square": {
      const s = num(input, "side", 6);
      return ok(
        [
          { label: "Area", value: fmt(s * s) },
          { label: "Perimeter", value: fmt(4 * s) },
          { label: "Diagonal", value: fmt(s * Math.SQRT2) },
        ],
        [{ title: "Square", detail: `A=s², P=4s` }],
      );
    }

    case "geo-triangle": {
      const a = num(input, "a", 3);
      const b = num(input, "b", 4);
      const c = num(input, "c", 5);
      const s = (a + b + c) / 2;
      const area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));
      return ok(
        [
          { label: "Perimeter", value: fmt(a + b + c) },
          { label: "Semi-perimeter", value: fmt(s) },
          { label: "Area (Heron)", value: fmt(area) },
        ],
        [{ title: "Triangle", detail: `Heron’s formula √[s(s−a)(s−b)(s−c)]` }],
      );
    }

    case "geo-right-triangle": {
      const a = num(input, "a", 3);
      const b = num(input, "b", 4);
      const c = Math.hypot(a, b);
      return ok(
        [
          { label: "Hypotenuse", value: fmt(c) },
          { label: "Area", value: fmt((a * b) / 2) },
          { label: "Perimeter", value: fmt(a + b + c) },
        ],
        [{ title: "Right triangle", detail: `c=√(a²+b²)` }],
      );
    }

    case "geo-pythagorean": {
      const mode = input.mode ?? "hyp";
      if (mode === "hyp") {
        const a = num(input, "a", 3);
        const b = num(input, "b", 4);
        return ok(
          [{ label: "c (hypotenuse)", value: fmt(Math.hypot(a, b)) }],
          [{ title: "Pythagorean theorem", detail: `c=√(a²+b²)` }],
        );
      }
      const c = num(input, "c", 5);
      const a = num(input, "a", 3);
      if (c <= a) throw new Error("Hypotenuse must be longer than leg a.");
      return ok(
        [{ label: "b (other leg)", value: fmt(Math.sqrt(c * c - a * a)) }],
        [{ title: "Pythagorean theorem", detail: `b=√(c²−a²)` }],
      );
    }

    case "geo-trapezoid": {
      const a = num(input, "a", 10);
      const b = num(input, "b", 6);
      const h = num(input, "h", 4);
      return ok(
        [{ label: "Area", value: fmt(((a + b) / 2) * h) }],
        [{ title: "Trapezoid", detail: `A=((a+b)/2)·h` }],
      );
    }

    case "geo-parallelogram": {
      const b = num(input, "base", 8);
      const h = num(input, "height", 5);
      return ok(
        [{ label: "Area", value: fmt(b * h) }],
        [{ title: "Parallelogram", detail: `A=b·h` }],
      );
    }

    case "geo-rhombus": {
      const d1 = num(input, "d1", 8);
      const d2 = num(input, "d2", 6);
      return ok(
        [
          { label: "Area", value: fmt((d1 * d2) / 2) },
          { label: "Side", value: fmt(Math.hypot(d1 / 2, d2 / 2)) },
        ],
        [{ title: "Rhombus", detail: `A=(d1·d2)/2` }],
      );
    }

    case "geo-distance-2d": {
      const x1 = num(input, "x1", 0);
      const y1 = num(input, "y1", 0);
      const x2 = num(input, "x2", 3);
      const y2 = num(input, "y2", 4);
      return ok(
        [{ label: "Distance", value: fmt(Math.hypot(x2 - x1, y2 - y1)) }],
        [{ title: "Distance", detail: `√[(x2−x1)²+(y2−y1)²]` }],
      );
    }

    case "geo-midpoint": {
      const x1 = num(input, "x1", 0);
      const y1 = num(input, "y1", 0);
      const x2 = num(input, "x2", 4);
      const y2 = num(input, "y2", 6);
      return ok(
        [{ label: "Midpoint", value: `(${fmt((x1 + x2) / 2)}, ${fmt((y1 + y2) / 2)})` }],
        [{ title: "Midpoint", detail: `((x1+x2)/2, (y1+y2)/2)` }],
      );
    }

    case "geo-slope": {
      const x1 = num(input, "x1", 1);
      const y1 = num(input, "y1", 2);
      const x2 = num(input, "x2", 4);
      const y2 = num(input, "y2", 8);
      if (x2 === x1) throw new Error("Vertical line: undefined slope.");
      const m = (y2 - y1) / (x2 - x1);
      return ok(
        [
          { label: "Slope m", value: fmt(m) },
          { label: "Angle (°)", value: fmt((Math.atan(m) * 180) / Math.PI) },
        ],
        [{ title: "Slope", detail: `m=(y2−y1)/(x2−x1)` }],
      );
    }

    case "geo-sphere": {
      const r = num(input, "r", 5);
      return ok(
        [
          { label: "Volume", value: fmt((4 / 3) * Math.PI * r ** 3) },
          { label: "Surface area", value: fmt(4 * Math.PI * r * r) },
        ],
        [{ title: "Sphere", detail: `V=4/3 πr³, A=4πr²` }],
      );
    }

    case "geo-cylinder": {
      const r = num(input, "r", 3);
      const h = num(input, "h", 10);
      return ok(
        [
          { label: "Volume", value: fmt(Math.PI * r * r * h) },
          { label: "Lateral area", value: fmt(2 * Math.PI * r * h) },
          { label: "Total surface", value: fmt(2 * Math.PI * r * (r + h)) },
        ],
        [{ title: "Cylinder", detail: `V=πr²h` }],
      );
    }

    case "geo-cone": {
      const r = num(input, "r", 3);
      const h = num(input, "h", 9);
      const l = Math.hypot(r, h);
      return ok(
        [
          { label: "Volume", value: fmt((1 / 3) * Math.PI * r * r * h) },
          { label: "Slant height", value: fmt(l) },
          { label: "Lateral area", value: fmt(Math.PI * r * l) },
          { label: "Total surface", value: fmt(Math.PI * r * (r + l)) },
        ],
        [{ title: "Cone", detail: `V=⅓πr²h` }],
      );
    }

    case "geo-cube": {
      const s = num(input, "side", 4);
      return ok(
        [
          { label: "Volume", value: fmt(s ** 3) },
          { label: "Surface area", value: fmt(6 * s * s) },
          { label: "Space diagonal", value: fmt(s * Math.sqrt(3)) },
        ],
        [{ title: "Cube", detail: `V=s³, A=6s²` }],
      );
    }

    case "geo-box": {
      const l = num(input, "length", 4);
      const w = num(input, "width", 3);
      const h = num(input, "height", 2);
      return ok(
        [
          { label: "Volume", value: fmt(l * w * h) },
          { label: "Surface area", value: fmt(2 * (l * w + l * h + w * h)) },
          { label: "Space diagonal", value: fmt(Math.hypot(l, w, h)) },
        ],
        [{ title: "Rectangular prism", detail: `V=lwh` }],
      );
    }

    case "geo-pyramid": {
      const base = num(input, "base", 6);
      const h = num(input, "height", 8);
      return ok(
        [{ label: "Volume (square base)", value: fmt((base * base * h) / 3) }],
        [{ title: "Pyramid", detail: `V=⅓·base area·height` }],
      );
    }

    case "geo-hemisphere": {
      const r = num(input, "r", 5);
      return ok(
        [
          { label: "Volume", value: fmt((2 / 3) * Math.PI * r ** 3) },
          { label: "Curved surface", value: fmt(2 * Math.PI * r * r) },
          { label: "Total surface", value: fmt(3 * Math.PI * r * r) },
        ],
        [{ title: "Hemisphere", detail: `V=⅔πr³` }],
      );
    }

    case "geo-annulus": {
      const R = num(input, "R", 5);
      const r = num(input, "r", 3);
      if (R < r) throw new Error("Outer radius must be ≥ inner radius.");
      return ok(
        [{ label: "Area", value: fmt(Math.PI * (R * R - r * r)) }],
        [{ title: "Annulus", detail: `A=π(R²−r²)` }],
      );
    }

    default:
      return null;
  }
}

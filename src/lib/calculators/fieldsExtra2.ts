import type { FieldDef } from "@/lib/calculators/fields";

export function fieldsExtra2(engine: string): FieldDef[] | null {
  const n = (name: string, label: string, defaultValue?: string): FieldDef => ({
    name,
    label,
    type: "number",
    defaultValue,
  });
  const sel = (
    name: string,
    label: string,
    options: { value: string; label: string }[],
    defaultValue: string,
  ): FieldDef => ({ name, label, type: "select", options, defaultValue });
  const fracPair = (prefix: string, label: string, nd: string, dd: string): FieldDef[] => [
    n(`${prefix === "1" ? "n1" : "n2"}`, `${label} numerator`, nd),
    n(`${prefix === "1" ? "d1" : "d2"}`, `${label} denominator`, dd),
  ];

  switch (engine) {
    case "frac-add":
    case "frac-sub":
    case "frac-mul":
    case "frac-div":
    case "frac-compare":
      return [...fracPair("1", "A", "1", "2"), ...fracPair("2", "B", "1", "3")];
    case "frac-simplify":
    case "frac-to-dec":
    case "improper-to-mixed":
      return [n("n", "Numerator", "8"), n("d", "Denominator", "12")];
    case "dec-to-frac":
      return [n("value", "Decimal", "0.75"), n("precision", "Max denominator", "10000")];
    case "mixed-to-improper":
      return [n("whole", "Whole", "2"), n("n", "Numerator", "1"), n("d", "Denominator", "3")];
    case "gcf":
    case "lcm-calc":
      return [{ name: "data", label: "Integers", type: "textarea", placeholder: "12, 18, 24", defaultValue: engine === "gcf" ? "12, 18, 24" : "4, 6, 8" }];
    case "factors":
    case "prime-factors":
    case "prime-check":
      return [n("n", "n", engine === "prime-check" ? "97" : "36")];
    case "primes-list":
      return [n("max", "List primes up to", "100")];
    case "ratio-simplify":
      return [n("a", "A", "8"), n("b", "B", "12")];
    case "unit-rate":
      return [n("a", "Quantity A", "12"), n("b", "Quantity B", "3")];
    case "sci-notation":
    case "place-value":
    case "expanded-form":
      return [n("value", "Value", engine === "sci-notation" ? "12300" : "3456")];
    case "sig-figs":
      return [{ name: "value", label: "Number", type: "text", defaultValue: "0.00340" }];
    case "modulo":
      return [n("a", "a", "17"), n("b", "b", "5")];
    case "rounding":
      return [n("value", "Value", "3.14159"), n("places", "Decimal places", "2")];
    case "log-eq":
      return [n("base", "Base", "10"), n("arg", "Argument", "1000")];
    case "radical-simplify":
      return [n("n", "Under √", "72")];
    case "foil":
      return [n("a", "a (ax+b)", "2"), n("b", "b", "3"), n("c", "c (cx+d)", "4"), n("d", "d", "5")];
    case "diff-squares":
      return [n("a", "a", "5"), n("b", "b", "3")];
    case "complete-square":
      return [n("a", "a", "1"), n("b", "b", "-6"), n("c", "c", "5")];
    case "cubic-eq":
      return [n("a", "a", "1"), n("b", "b", "-6"), n("c", "c", "11"), n("d", "d", "-6")];
    case "dot-product":
      return [
        { name: "a", label: "Vector A", type: "text", defaultValue: "1,2,3" },
        { name: "b", label: "Vector B", type: "text", defaultValue: "4,5,6" },
      ];
    case "multifactorial":
      return [n("n", "n", "10"), n("k", "Number of !", "2")];

    case "molar-mass":
      return [{ name: "formula", label: "Chemical formula", type: "text", defaultValue: "H2O", placeholder: "C6H12O6" }];
    case "cubic-yards":
      return [
        n("length", "Length", "10"),
        n("width", "Width", "10"),
        n("depth", "Depth", "0.5"),
        sel("unit", "Units", [
          { value: "ft", label: "Feet" },
          { value: "yd", label: "Yards" },
        ], "ft"),
      ];
    case "cubic-feet":
      return [n("length", "Length", "4"), n("width", "Width", "3"), n("height", "Height", "2")];
    case "feet-inches":
      return [
        sel("mode", "Mode", [
          { value: "to-inches", label: "ft+in → total inches" },
          { value: "from-inches", label: "inches → ft+in" },
        ], "to-inches"),
        n("ft", "Feet", "5"),
        n("inches", "Inches", "10"),
        n("totalInches", "Total inches", "70"),
      ];
    case "gravel":
    case "mulch":
    case "topsoil":
      return [n("length", "Length (ft)", "20"), n("width", "Width (ft)", "10"), n("depthIn", "Depth (inches)", "3")];
    case "tank-volume":
      return [
        sel("shape", "Shape", [
          { value: "rect", label: "Rectangular" },
          { value: "cyl", label: "Cylindrical" },
        ], "rect"),
        n("length", "Length (ft)", "4"),
        n("width", "Width (ft)", "3"),
        n("height", "Height (ft)", "2"),
        n("r", "Radius (ft)", "2"),
        n("h", "Height/length (ft)", "5"),
      ];
    case "dice-roll":
      return [n("sides", "Sides", "6"), n("count", "Number of dice", "2")];
    case "lottery":
      return [n("max", "Max number", "49"), n("picks", "How many picks", "6")];
    case "password-gen":
      return [
        n("length", "Length", "16"),
        sel("symbols", "Include symbols", [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ], "yes"),
      ];
    case "odds-convert":
      return [n("a", "Odds for", "5"), n("b", "Odds against", "2")];
    case "batting-avg":
      return [n("hits", "Hits", "120"), n("ab", "At-bats", "400")];
    case "era-calc":
      return [n("er", "Earned runs", "25"), n("ip", "Innings pitched", "120")];
    case "pregnancy-due":
      return [{ name: "lmp", label: "LMP date (YYYY-MM-DD)", type: "text", defaultValue: "2026-01-15" }];
    case "period-estimate":
      return [
        { name: "last", label: "Last period start", type: "text", defaultValue: "2026-03-01" },
        n("cycle", "Cycle length (days)", "28"),
      ];
    case "day-of-week":
      return [{ name: "date", label: "Date (YYYY-MM-DD)", type: "text", defaultValue: "2026-11-10" }];
    case "work-hours":
      return [
        { name: "start", label: "Start (HH:MM)", type: "text", defaultValue: "09:00" },
        { name: "end", label: "End (HH:MM)", type: "text", defaultValue: "17:00" },
        n("breakMin", "Break minutes", "30"),
      ];
    case "amortization-schedule":
      return [n("principal", "Principal", "20000"), n("rate", "Annual rate %", "6"), n("years", "Years", "3")];
    case "straight-line-depr":
      return [n("cost", "Cost", "10000"), n("salvage", "Salvage", "1000"), n("years", "Years", "5")];
    case "declining-balance":
      return [n("cost", "Cost", "10000"), n("rate", "Rate % / year", "40"), n("years", "Years", "5")];
    case "car-afford":
      return [n("payment", "Max monthly payment", "400"), n("rate", "APR %", "6"), n("years", "Years", "5")];
    case "house-afford":
      return [
        n("income", "Annual income", "90000"),
        n("debts", "Monthly debts", "500"),
        n("rate", "Mortgage rate %", "6.5"),
        n("years", "Years", "30"),
        n("downPct", "Down payment %", "20"),
      ];
    case "gas-mileage":
      return [n("miles", "Miles", "300"), n("gallons", "Gallons", "10"), n("price", "Price / gallon", "3.5")];
    case "resize-image":
      return [
        n("width", "Original width", "1920"),
        n("height", "Original height", "1080"),
        sel("mode", "Constrain", [
          { value: "width", label: "By width" },
          { value: "height", label: "By height" },
        ], "width"),
        n("target", "Target size", "800"),
      ];
    case "speed-distance-time":
      return [
        sel("solve", "Solve for", [
          { value: "speed", label: "Speed" },
          { value: "distance", label: "Distance" },
          { value: "time", label: "Time" },
        ], "speed"),
        n("distance", "Distance", "120"),
        n("time", "Time", "2"),
        n("speed", "Speed", "60"),
      ];
    default:
      return null;
  }
}

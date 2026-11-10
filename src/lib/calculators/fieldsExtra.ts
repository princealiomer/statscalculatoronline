import type { FieldDef } from "@/lib/calculators/fields";

/** Field definitions for finance / geometry / conversions / physics / health / time / trig. */
export function fieldsExtra(engine: string): FieldDef[] | null {
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

  switch (engine) {
    case "loan-payment":
    case "emi":
      return [n("principal", "Principal", "20000"), n("rate", "Annual rate %", "6"), n("years", "Years", "5")];
    case "mortgage-payment":
      return [
        n("homePrice", "Home price", "350000"),
        n("downPayment", "Down payment", "70000"),
        n("rate", "Annual rate %", "6.5"),
        n("years", "Years", "30"),
      ];
    case "simple-interest":
    case "compound-interest":
      return [
        n("principal", "Principal", "1000"),
        n("rate", "Annual rate %", "5"),
        n("years", "Years", "5"),
        ...(engine === "compound-interest" ? [n("compounds", "Compounds / year", "12")] : []),
      ];
    case "cagr":
      return [n("begin", "Beginning value", "10000"), n("end", "Ending value", "16000"), n("years", "Years", "4")];
    case "roi":
      return [n("cost", "Cost / investment", "1000"), n("gain", "Final / return value", "1500")];
    case "tip":
      return [n("bill", "Bill amount", "60"), n("percent", "Tip %", "18"), n("people", "Split between", "2")];
    case "discount":
      return [n("price", "Original price", "80"), n("percent", "Discount %", "25")];
    case "markup":
      return [n("cost", "Cost", "40"), n("percent", "Markup %", "50")];
    case "margin":
      return [n("cost", "Cost", "40"), n("price", "Selling price", "60")];
    case "sales-tax":
      return [n("amount", "Amount before tax", "100"), n("rate", "Tax rate %", "8.25")];
    case "reverse-sales-tax":
      return [n("total", "Total with tax", "108.25"), n("rate", "Tax rate %", "8.25")];
    case "rule-of-72":
      return [n("rate", "Annual return %", "8")];
    case "future-value":
      return [
        n("principal", "Starting principal", "1000"),
        n("rate", "Annual rate %", "5"),
        n("years", "Years", "10"),
        n("pmt", "Annual deposit (optional)", "0"),
      ];
    case "present-value":
      return [n("future", "Future value", "10000"), n("rate", "Annual rate %", "5"), n("years", "Years", "10")];
    case "npv":
      return [
        n("rate", "Discount rate %", "10"),
        { name: "cashflows", label: "Cash flows (t0, t1, …)", type: "textarea", placeholder: "-1000, 300, 400, 500" },
      ];
    case "salary-hourly":
      return [n("salary", "Annual salary", "75000"), n("hours", "Hours / week", "40"), n("weeks", "Weeks / year", "52")];
    case "hourly-salary":
      return [n("hourly", "Hourly wage", "35"), n("hours", "Hours / week", "40"), n("weeks", "Weeks / year", "52")];
    case "inflation":
      return [n("amount", "Amount today", "1000"), n("rate", "Inflation % / year", "3"), n("years", "Years", "10")];
    case "apr-ear":
      return [n("rate", "Nominal APR %", "12"), n("compounds", "Compounds / year", "12")];

    case "geo-circle":
    case "geo-sphere":
    case "geo-hemisphere":
      return [n("r", "Radius", "5")];
    case "geo-rectangle":
      return [n("length", "Length", "8"), n("width", "Width", "5")];
    case "geo-square":
    case "geo-cube":
      return [n("side", "Side", "6")];
    case "geo-triangle":
      return [n("a", "Side a", "3"), n("b", "Side b", "4"), n("c", "Side c", "5")];
    case "geo-right-triangle":
      return [n("a", "Leg a", "3"), n("b", "Leg b", "4")];
    case "geo-pythagorean":
      return [
        sel("mode", "Solve for", [
          { value: "hyp", label: "Hypotenuse c" },
          { value: "leg", label: "Leg b" },
        ], "hyp"),
        n("a", "a", "3"),
        n("b", "b (hyp mode)", "4"),
        n("c", "c (leg mode)", "5"),
      ];
    case "geo-trapezoid":
      return [n("a", "Base a", "10"), n("b", "Base b", "6"), n("h", "Height", "4")];
    case "geo-parallelogram":
      return [n("base", "Base", "8"), n("height", "Height", "5")];
    case "geo-rhombus":
      return [n("d1", "Diagonal 1", "8"), n("d2", "Diagonal 2", "6")];
    case "geo-distance-2d":
    case "geo-midpoint":
    case "geo-slope":
      return [n("x1", "x1", "0"), n("y1", "y1", "0"), n("x2", "x2", "3"), n("y2", "y2", "4")];
    case "geo-cylinder":
    case "geo-cone":
      return [n("r", "Radius", "3"), n("h", "Height", "10")];
    case "geo-box":
      return [n("length", "Length", "4"), n("width", "Width", "3"), n("height", "Height", "2")];
    case "geo-pyramid":
      return [n("base", "Base side", "6"), n("height", "Height", "8")];
    case "geo-annulus":
      return [n("R", "Outer radius", "5"), n("r", "Inner radius", "3")];

    case "temp-convert":
      return [
        n("value", "Value", "25"),
        sel("from", "From", [
          { value: "C", label: "Celsius" },
          { value: "F", label: "Fahrenheit" },
          { value: "K", label: "Kelvin" },
          { value: "R", label: "Rankine" },
        ], "C"),
      ];
    case "length-convert":
      return [
        n("value", "Value", "1"),
        sel("from", "From", ["m", "km", "cm", "mm", "mi", "yd", "ft", "in"].map((u) => ({ value: u, label: u })), "m"),
      ];
    case "weight-convert":
      return [
        n("value", "Value", "1"),
        sel("from", "From", ["kg", "g", "mg", "lb", "oz", "ton"].map((u) => ({ value: u, label: u })), "kg"),
      ];
    case "area-convert":
      return [
        n("value", "Value", "1"),
        sel("from", "From", ["m2", "km2", "cm2", "ft2", "in2", "acre", "ha"].map((u) => ({ value: u, label: u })), "m2"),
      ];
    case "volume-convert":
      return [
        n("value", "Value", "1"),
        sel("from", "From", ["l", "ml", "m3", "gal", "qt", "pt", "cup", "ft3"].map((u) => ({ value: u, label: u })), "l"),
      ];
    case "speed-convert":
      return [
        n("value", "Value", "60"),
        sel("from", "From", ["ms", "kmh", "mph", "knot", "fts"].map((u) => ({ value: u, label: u })), "mph"),
      ];
    case "time-unit-convert":
      return [
        n("value", "Value", "90"),
        sel("from", "From", ["s", "min", "h", "d", "wk"].map((u) => ({ value: u, label: u })), "min"),
      ];
    case "storage-convert":
      return [
        n("value", "Value", "1"),
        sel("from", "From", ["B", "KB", "MB", "GB", "TB", "PB"].map((u) => ({ value: u, label: u })), "GB"),
      ];
    case "cm-in":
      return [n("cm", "Centimeters", "30")];
    case "in-cm":
      return [n("inches", "Inches", "12")];
    case "ft-m":
      return [n("ft", "Feet", "6")];
    case "lb-kg":
      return [n("lb", "Pounds", "150")];
    case "kg-lb":
      return [n("kg", "Kilograms", "70")];
    case "sqft-acre":
      return [n("sqft", "Square feet", "43560")];
    case "acre-sqft":
      return [n("acres", "Acres", "1")];
    case "angle-convert":
      return [
        n("value", "Value", "90"),
        sel("from", "From", [
          { value: "deg", label: "Degrees" },
          { value: "rad", label: "Radians" },
        ], "deg"),
      ];
    case "roman-numeral":
      return [
        sel("mode", "Mode", [
          { value: "to-roman", label: "Number → Roman" },
          { value: "to-int", label: "Roman → Number" },
        ], "to-roman"),
        n("value", "Number (1–3999)", "2026"),
        { name: "roman", label: "Roman numeral", type: "text", placeholder: "MMXXVI" },
      ];

    case "phys-force":
      return [n("mass", "Mass (kg)", "10"), n("accel", "Acceleration (m/s²)", "9.81")];
    case "phys-density":
      return [n("mass", "Mass", "1000"), n("volume", "Volume", "1")];
    case "phys-work":
      return [n("force", "Force (N)", "50"), n("distance", "Distance (m)", "10")];
    case "phys-kinetic":
    case "phys-momentum":
      return [n("mass", "Mass (kg)", "2"), n("velocity", "Velocity (m/s)", "5")];
    case "phys-pressure":
      return [n("force", "Force (N)", "100"), n("area", "Area (m²)", "0.5")];
    case "phys-velocity-avg":
      return [n("distance", "Distance", "100"), n("time", "Time", "10")];
    case "phys-accel-motion":
      return [n("u", "Initial velocity u", "0"), n("a", "Acceleration a", "2"), n("t", "Time t", "5")];
    case "phys-ideal-gas":
      return [
        sel("solve", "Solve for", [
          { value: "P", label: "Pressure P" },
          { value: "V", label: "Volume V" },
        ], "P"),
        n("n", "Moles n", "1"),
        n("T", "Temperature K", "298"),
        n("V", "Volume m³", "0.0244"),
        n("P", "Pressure Pa", "101325"),
      ];
    case "phys-emc2":
      return [n("mass", "Mass (kg)", "0.001")];
    case "phys-wavelength":
      return [n("speed", "Wave speed", "300000000"), n("freq", "Frequency (Hz)", "500000000000000")];
    case "phys-weight":
      return [n("mass", "Mass (kg)", "70"), n("g", "g (m/s²)", "9.81")];
    case "phys-hooke":
      return [n("k", "Spring constant k", "200"), n("x", "Displacement x (m)", "0.05")];

    case "bmi":
      return [
        sel("unit", "Units", [
          { value: "metric", label: "kg & cm" },
          { value: "imperial", label: "lb & in" },
        ], "metric"),
        n("weight", "Weight", "70"),
        n("height", "Height", "175"),
      ];
    case "pace":
      return [
        n("distance", "Distance", "5"),
        n("minutes", "Total minutes", "30"),
        sel("unit", "Unit", [
          { value: "km", label: "km" },
          { value: "mi", label: "mi" },
        ], "km"),
      ];
    case "heart-rate-zone":
      return [n("age", "Age", "30"), n("resting", "Resting HR (optional)", "60")];

    case "age-calc":
      return [
        { name: "birth", label: "Birth date (YYYY-MM-DD)", type: "text", defaultValue: "2000-01-01" },
        { name: "asOf", label: "As of (YYYY-MM-DD)", type: "text", placeholder: "Today if blank" },
      ];
    case "date-diff":
      return [
        { name: "start", label: "Start date", type: "text", defaultValue: "2026-01-01" },
        { name: "end", label: "End date", type: "text", defaultValue: "2026-12-31" },
      ];
    case "hours-minutes":
      return [
        sel("op", "Operation", [
          { value: "add", label: "Add" },
          { value: "sub", label: "Subtract" },
        ], "add"),
        n("h1", "Hours 1", "2"),
        n("m1", "Minutes 1", "45"),
        n("h2", "Hours 2", "1"),
        n("m2", "Minutes 2", "30"),
      ];
    case "decimal-time":
      return [n("hours", "Decimal hours", "2.75")];
    case "time-to-decimal":
      return [n("h", "Hours", "2"), n("m", "Minutes", "45")];
    case "military-time":
      return [
        sel("mode", "Mode", [
          { value: "to-military", label: "12h → Military" },
          { value: "to-12h", label: "Military → 12h" },
        ], "to-military"),
        n("h", "Hour (1–12)", "2"),
        n("m", "Minutes", "30"),
        sel("ampm", "AM/PM", [
          { value: "AM", label: "AM" },
          { value: "PM", label: "PM" },
        ], "PM"),
        n("military", "Military (e.g. 1430)", "1430"),
      ];

    case "trig-functions":
      return [
        n("angle", "Angle", "30"),
        sel("unit", "Unit", [
          { value: "deg", label: "Degrees" },
          { value: "rad", label: "Radians" },
        ], "deg"),
      ];
    case "trig-inverse":
      return [
        n("value", "Value", "0.5"),
        sel("fn", "Function", [
          { value: "asin", label: "arcsin" },
          { value: "acos", label: "arccos" },
          { value: "atan", label: "arctan" },
        ], "asin"),
      ];

    case "sqft-calc":
      return [n("length", "Length (ft)", "12"), n("width", "Width (ft)", "10")];
    case "concrete-volume":
      return [
        n("length", "Length", "10"),
        n("width", "Width", "10"),
        n("depth", "Depth", "0.333"),
        sel("unit", "Units", [
          { value: "ft", label: "Feet" },
          { value: "yd", label: "Yards" },
        ], "ft"),
      ];
    case "paint-calc":
      return [n("area", "Wall area (ft²)", "400"), n("coverage", "Coverage ft²/gallon", "350"), n("coats", "Coats", "2")];
    case "aspect-ratio":
      return [n("width", "Width px", "1920"), n("height", "Height px", "1080")];
    case "ppi-calc":
      return [n("width", "Width px", "1920"), n("height", "Height px", "1080"), n("diagonal", "Diagonal inches", "24")];

    default:
      return null;
  }
}

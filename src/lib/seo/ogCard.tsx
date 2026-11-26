import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = "image/png";

function titleFontSize(title: string) {
  if (title.length > 56) return 42;
  if (title.length > 40) return 48;
  if (title.length > 28) return 54;
  return 60;
}

/** Keep OG text in glyphs the default OG font can download. */
function ogSafeText(text: string) {
  return text
    .replace(/[∛∜]/g, "cbrt ")
    .replace(/[√]/g, "sqrt ")
    .replace(/[×]/g, "x")
    .replace(/[÷]/g, "/")
    .replace(/[≤≥≠≈]/g, (m) => ({ "≤": "<=", "≥": ">=", "≠": "!=", "≈": "~" })[m] ?? m)
    .replace(/[μχσαβ]/g, (m) => ({ μ: "mu", χ: "chi", σ: "sigma", α: "alpha", β: "beta" })[m] ?? m)
    .replace(/[—–]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

type OgCardProps = {
  title: string;
  subtitle: string;
  eyebrow?: string;
  footerLeft?: string;
};

/** Shared 1200×630 Open Graph / Twitter card layout. */
export function renderOgCard({
  title,
  subtitle,
  eyebrow = "Free online calculator",
  footerLeft = "Formulas · Steps · Results · Exports",
}: OgCardProps) {
  const safeTitle = ogSafeText(title);
  const safeSubtitle = ogSafeText(subtitle);
  const safeEyebrow = ogSafeText(eyebrow);
  const safeFooter = ogSafeText(footerLeft);
  const fontSize = titleFontSize(safeTitle);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#e5e7eb",
          padding: "52px 60px",
          fontFamily: "Georgia, Times New Roman, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: "#0d7377",
              color: "#f5d78e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              borderRadius: 8,
            }}
          >
            {siteConfig.shortName}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, color: "#1a1f2c", fontWeight: 700 }}>
              {siteConfig.name}
            </div>
            <div style={{ fontSize: 18, color: "#4b5568", marginTop: 4 }}>
              {siteConfig.domain}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              fontSize: 20,
              color: "#0d7377",
              fontWeight: 700,
              letterSpacing: 0.4,
              textTransform: "uppercase",
            }}
          >
            {safeEyebrow}
          </div>
          <div
            style={{
              fontSize,
              lineHeight: 1.12,
              color: "#1a1f2c",
              fontWeight: 700,
              maxWidth: 1040,
            }}
          >
            {safeTitle}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#4b5568",
              lineHeight: 1.35,
              maxWidth: 980,
            }}
          >
            {safeSubtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "3px solid #0d7377",
            paddingTop: 20,
            color: "#4b5568",
            fontSize: 20,
          }}
        >
          <span>{safeFooter}</span>
          <span style={{ color: "#0d7377", fontWeight: 700 }}>100% free</span>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}

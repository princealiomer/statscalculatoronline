import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — free statistics calculators`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          padding: "56px 64px",
          fontFamily: "Georgia, Times New Roman, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
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
            SCO
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 28, color: "#1a1f2c", fontWeight: 700 }}>
              {siteConfig.name}
            </div>
            <div style={{ fontSize: 18, color: "#4b5568", marginTop: 4 }}>
              {siteConfig.domain}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 58,
              lineHeight: 1.1,
              color: "#1a1f2c",
              fontWeight: 700,
              maxWidth: 980,
            }}
          >
            Free statistics calculators with formulas, steps, and branded PDF reports
          </div>
          <div style={{ fontSize: 26, color: "#0d7377", fontWeight: 600 }}>
            Inputs · Formulas · Worked steps · Results · Exports
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "3px solid #0d7377",
            paddingTop: 22,
            color: "#4b5568",
            fontSize: 22,
          }}
        >
          <span>Hypothesis tests · Probability · Regression · Math</span>
          <span style={{ color: "#0d7377", fontWeight: 700 }}>100% free</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

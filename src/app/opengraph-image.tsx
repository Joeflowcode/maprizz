import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";
import { brandColors } from "@/lib/theme";

export const runtime = "nodejs";
export const alt = "Maprizz — Your next customer is looking for you.";
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
          padding: 72,
          background: brandColors.ink,
          color: brandColors.cream,
          fontFamily: "sans-serif",
          backgroundImage: "radial-gradient(circle at 85% 0%, rgba(255,139,61,0.18), transparent 55%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 40 40" fill="none">
            <path
              d="M20 3.5c-7.2 0-13 5.6-13 12.6 0 8.9 10.4 18.3 12.2 19.8a1.2 1.2 0 0 0 1.6 0C22.6 34.4 33 25 33 16.1 33 9.1 27.2 3.5 20 3.5Z"
              fill={brandColors.accent}
            />
            <circle cx="20" cy="16" r="2.4" fill={brandColors.ink} />
            <path d="M14.6 11.2a7.6 7.6 0 0 0 0 9.6M25.4 11.2a7.6 7.6 0 0 1 0 9.6" stroke={brandColors.ink} strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 800, letterSpacing: -2 }}>Maprizz</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 84, fontWeight: 800, lineHeight: 1, letterSpacing: -4, maxWidth: 1040 }}>
            <span style={{ marginRight: 24 }}>Your next customer is</span>
            <span style={{ color: brandColors.accent }}>looking for you.</span>
          </div>
          <div style={{ fontSize: 28, color: brandColors.mist, maxWidth: 960, lineHeight: 1.3 }}>
            Google Business Profiles, websites, and review tools for local businesses. Based in Bend, Oregon.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: brandColors.mist }}>
          <span>{siteConfig.domain}</span>
          <span>$299 · $599 · $799 / month · Free audit</span>
        </div>
      </div>
    ),
    size,
  );
}

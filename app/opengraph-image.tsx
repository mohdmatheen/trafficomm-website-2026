import { ImageResponse } from "next/og";
import { company } from "@/data/site";

/**
 * The social card. The site had no og:image at all, so every share on LinkedIn —
 * the channel this audience actually uses — rendered as a bare text link.
 *
 * Generated rather than designed: it reuses the brand mark, the wordmark and the
 * paper/ink/signal tokens already in use, and adds nothing new to the site itself.
 * Nothing about the rendered website changes.
 */
export const alt = `${company.name} — ${company.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MARK =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1140 665"><path d="M302 190h239L301 573h236l-60 92H0z" fill="#0c0c0d"/><path d="M537 573 782 190h239L777 573z" fill="#ea3e3a"/><path d="M601 95 660 0h480l-61 95z" fill="#ea3e3a"/></svg>';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f6f3",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <img src={`data:image/svg+xml;utf8,${encodeURIComponent(MARK)}`} width={96} height={56} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 46, fontWeight: 700, color: "#0c0c0d", letterSpacing: "-0.02em" }}>{company.name}</div>
            <div style={{ fontSize: 19, color: "#5d5d64", letterSpacing: "0.14em", textTransform: "uppercase" }}>{company.headerDescriptor}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, color: "#0c0c0d", lineHeight: 1.05, letterSpacing: "-0.035em" }}>Performance Operations.</div>
          <div style={{ fontSize: 76, fontWeight: 700, color: "#ea3e3a", lineHeight: 1.05, letterSpacing: "-0.035em" }}>Built to Scale.</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "2px solid rgba(12,12,13,0.12)", paddingTop: 28 }}>
          <div style={{ fontSize: 24, color: "#5d5d64" }}>Ad operations · Performance · Programmatic · Measurement · Reporting</div>
          <div style={{ fontSize: 22, color: "#5d5d64", letterSpacing: "0.1em" }}>{`SINCE ${company.founded}`}</div>
        </div>
      </div>
    ),
    size,
  );
}

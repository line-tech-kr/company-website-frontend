import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Line Tech — Mass Flow Controllers & Meters";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "80px 100px",
        backgroundColor: "#185686",
        position: "relative",
      }}
    >
      {/* Gold accent bar top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          backgroundColor: "#fdbc04",
        }}
      />

      {/* Wordmark */}
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "-2px",
          lineHeight: 1,
          marginBottom: 28,
        }}
      >
        Line Tech
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 36,
          fontWeight: 400,
          color: "rgba(255,255,255,0.75)",
          letterSpacing: "0px",
          lineHeight: 1.4,
        }}
      >
        Mass Flow Controllers &amp; Meters
      </div>

      {/* Domain */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: 100,
          fontSize: 24,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "1px",
        }}
      >
        linetech.co.kr
      </div>

      {/* Gold accent bar bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 8,
          backgroundColor: "#fdbc04",
        }}
      />
    </div>,
    { ...size },
  );
}

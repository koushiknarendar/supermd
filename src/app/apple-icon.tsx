import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: "#2563eb",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "40px",
      }}
    >
      <span
        style={{
          color: "white",
          fontSize: "96px",
          fontWeight: "700",
          fontFamily: "sans-serif",
          letterSpacing: "-2px",
          lineHeight: 1,
        }}
      >
        M
      </span>
    </div>,
    { ...size }
  )
}

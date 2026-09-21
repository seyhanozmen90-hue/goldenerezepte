import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a1a",
          borderRadius: "16px",
          fontSize: 40,
          fontWeight: 700,
          color: "#D4AF37",
          fontFamily: "serif",
        }}
      >
        G
      </div>
    ),
    { ...size }
  );
}

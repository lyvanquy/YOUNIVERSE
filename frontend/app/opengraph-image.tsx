import { ImageResponse } from "next/og";

export const alt = "YOUniverse - Phụ kiện và charm cá nhân hóa";
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
          justifyContent: "center",
          padding: "72px 84px",
          color: "white",
          background: "radial-gradient(circle at 78% 20%, #92400e 0%, #1c1917 30%, #09090b 72%)",
        }}
      >
        <div style={{ display: "flex", color: "#fbbf24", fontSize: 28, letterSpacing: 8 }}>
          PHỤ KIỆN CÁ NHÂN HÓA
        </div>
        <div style={{ display: "flex", marginTop: 26, fontSize: 92, fontWeight: 800, letterSpacing: -4 }}>
          YOUniverse
        </div>
        <div style={{ display: "flex", marginTop: 18, maxWidth: 900, fontSize: 38, lineHeight: 1.3, color: "#e7e5e4" }}>
          Mỗi dải thiên hà là một câu chuyện được kể.
        </div>
        <div style={{ display: "flex", marginTop: 50, fontSize: 24, color: "#a8a29e" }}>
          Astra · Sirius · Polaris
        </div>
      </div>
    ),
    size,
  );
}

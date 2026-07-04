import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Vert La Planète — Annuaire des acteurs de la transition écologique";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #091f12 0%, #12321e 55%, #1a5230 100%)",
          color: "#fff",
          fontFamily: "Georgia, serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 20,
              background: "#3daa62",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48
            }}
          >
            🌿
          </div>
          <div style={{ fontSize: 40, color: "#bde5cd" }}>vertlaplanete</div>
        </div>
        <div style={{ fontSize: 76, fontWeight: 400, marginTop: 48, lineHeight: 1.08, letterSpacing: -2 }}>
          Le réseau des acteurs de la transition écologique
        </div>
        <div style={{ fontSize: 30, color: "#7ecb99", marginTop: 28 }}>
          Producteurs · Artisans · Marques engagées — près de chez vous
        </div>
      </div>
    ),
    { ...size }
  );
}

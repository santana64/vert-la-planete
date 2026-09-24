import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Vert La Planète — Annuaire des acteurs de la transition écologique";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo-officiel.jpg"));
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
            aria-hidden="true"
            style={{
              width: 84,
              height: 84,
              borderRadius: 20,
              flexShrink: 0,
              backgroundImage: `url(data:image/jpeg;base64,${logo.toString("base64")})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div style={{ fontSize: 40, color: "#bde5cd" }}>Vert La Planète</div>
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

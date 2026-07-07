"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { FRANCE_CENTER } from "@/lib/geo";

export type MapPoint = {
  id: string;
  kind: "partenaire" | "ramassage" | "dechetterie" | "centre";
  name: string;
  detail: string;
  city: string;
  lat: number;
  lng: number;
  href?: string;
  schedule?: string | null;
};

export const KIND_META: Record<
  MapPoint["kind"],
  { label: string; color: string; icon: string }
> = {
  partenaire: { label: "Partenaires", color: "#1a5230", icon: "🛍️" },
  ramassage: { label: "Ramassage de déchets", color: "#3daa62", icon: "🤝" },
  dechetterie: { label: "Déchetteries", color: "#a85e0a", icon: "♻️" },
  centre: { label: "Centres écologiques", color: "#2e6b8a", icon: "🌱" }
};

export default function LeafletMap({
  points,
  height = 480,
  zoom = 6,
  center
}: {
  points: MapPoint[];
  height?: number;
  zoom?: number;
  center?: { lat: number; lng: number };
}) {
  const c = center ?? FRANCE_CENTER;

  return (
    <MapContainer
      center={[c.lat, c.lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height, width: "100%", borderRadius: 16, zIndex: 1 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points
        .filter((p) => p.lat !== 0 || p.lng !== 0)
        .map((p) => {
          const meta = KIND_META[p.kind];
          return (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={9}
              pathOptions={{
                color: "#ffffff",
                weight: 2,
                fillColor: meta.color,
                fillOpacity: 0.95
              }}
            >
              <Popup>
                <div style={{ fontFamily: "var(--sans)", minWidth: 180 }}>
                  <div style={{ fontSize: 11, color: meta.color, fontWeight: 600, marginBottom: 2 }}>
                    {meta.icon} {meta.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#091f12" }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#4e6e58", marginTop: 2 }}>
                    {p.detail} · {p.city}
                  </div>
                  {p.schedule ? (
                    <div style={{ fontSize: 12, color: "#4e6e58", marginTop: 4 }}>🕐 {p.schedule}</div>
                  ) : null}
                  {p.href ? (
                    <a
                      href={p.href}
                      style={{ fontSize: 12, color: "#1a5230", fontWeight: 600, display: "inline-block", marginTop: 6 }}
                    >
                      Voir la fiche →
                    </a>
                  ) : null}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
    </MapContainer>
  );
}

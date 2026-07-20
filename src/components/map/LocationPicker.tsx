"use client";

import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { FRANCE_CENTER } from "@/lib/geo";

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function LocationPicker({
  lat,
  lng,
  onPick
}: {
  lat: number;
  lng: number;
  onPick: (lat: number, lng: number) => void;
}) {
  const hasPoint = lat !== 0 || lng !== 0;

  return (
    <MapContainer
      center={[FRANCE_CENTER.lat, FRANCE_CENTER.lng]}
      zoom={5}
      scrollWheelZoom={false}
      style={{ height: 300, width: "100%", borderRadius: 12, zIndex: 1 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onPick={onPick} />
      {hasPoint ? (
        <CircleMarker
          center={[lat, lng]}
          radius={10}
          pathOptions={{ color: "#fff", weight: 2, fillColor: "#3daa62", fillOpacity: 0.95 }}
        />
      ) : null}
    </MapContainer>
  );
}

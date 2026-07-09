"use client";

import dynamic from "next/dynamic";
import type { MapPoint } from "@/lib/places";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => <div className="skel-hero" style={{ height: 220, marginBottom: 0 }} />
});

export function SellerMiniMap({ point }: { point: MapPoint }) {
  return (
    <div style={{ border: ".5px solid rgba(0,0,0,.08)", borderRadius: 14, overflow: "hidden" }}>
      <LeafletMap points={[point]} height={220} zoom={11} center={{ lat: point.lat, lng: point.lng }} />
    </div>
  );
}

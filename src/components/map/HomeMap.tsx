"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { MapPoint } from "@/components/map/LeafletMap";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => <div className="skel-hero" style={{ height: 360, marginBottom: 0 }} />
});

export function HomeMap({ points, actorCount }: { points: MapPoint[]; actorCount: number }) {
  return (
    <div className="hero-map-wrap" style={{ background: "#fff" }}>
      <LeafletMap points={points} height={360} zoom={5} />
      <div className="map-bar">
        <span className="map-bar-txt">
          <strong>{actorCount} acteurs écologiques</strong> partout en France
        </span>
        <Link href="/partenaires#carte" className="btn-primary" style={{ fontSize: 12, padding: "8px 18px", borderRadius: 8 }}>
          Ouvrir la carte →
        </Link>
      </div>
    </div>
  );
}

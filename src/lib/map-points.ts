import type { EcoPlace, Seller } from "@/db/schema";
import type { MapPoint } from "@/lib/places";

/** Convertit partenaires + lieux écologiques en points de carte (logique unique). */
export function buildMapPoints(sellers: Seller[], places: EcoPlace[]): MapPoint[] {
  return [
    ...sellers.map(
      (s): MapPoint => ({
        id: `s-${s.id}`,
        kind: "partenaire",
        name: s.name,
        detail: s.category,
        city: s.city,
        lat: s.lat,
        lng: s.lng,
        href: `/partenaires/${s.slug}`
      })
    ),
    ...places.map(
      (p): MapPoint => ({
        id: `p-${p.id}`,
        kind: p.kind,
        name: p.name,
        detail: p.description.slice(0, 80),
        city: p.city,
        lat: p.lat,
        lng: p.lng,
        schedule: p.schedule
      })
    )
  ];
}

export function sellerToPoint(s: Seller): MapPoint {
  return {
    id: s.id,
    kind: "partenaire",
    name: s.name,
    detail: s.category,
    city: s.city,
    lat: s.lat,
    lng: s.lng
  };
}

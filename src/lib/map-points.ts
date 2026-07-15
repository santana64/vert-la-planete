import type { EcoPlace, Seller } from "@/db/schema";
import { FOUNDERS_LIMIT } from "@/lib/constants";
import type { MapPoint } from "@/lib/places";

/**
 * Convertit partenaires + lieux écologiques en points de carte (logique unique).
 * Règles métier :
 * - seuls les partenaires ayant souscrit une offre PRO sont localisés sur la carte ;
 * - les premiers abonnés Pro (membres fondateurs) portent un marqueur distinctif.
 */
export function buildMapPoints(sellers: Seller[], places: EcoPlace[]): MapPoint[] {
  const proSellers = sellers
    .filter((s) => s.offer !== "gratuit")
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return [
    ...proSellers.map(
      (s, index): MapPoint => ({
        id: `s-${s.id}`,
        kind: "partenaire",
        name: s.name,
        detail: s.category,
        city: s.city,
        lat: s.lat,
        lng: s.lng,
        href: `/partenaires/${s.slug}`,
        founder: index < FOUNDERS_LIMIT
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

/**
 * Source de vérité des types de points affichés sur la carte
 * (partenaires + lieux écologiques communautaires) : libellés, couleurs, icônes.
 * Utilisée par la carte, les filtres, le compte et les formulaires.
 */
export type MapPointKind = "partenaire" | "ramassage" | "dechetterie" | "centre";

export type MapPoint = {
  id: string;
  kind: MapPointKind;
  name: string;
  detail: string;
  city: string;
  lat: number;
  lng: number;
  href?: string;
  schedule?: string | null;
};

export const KIND_META: Record<MapPointKind, { label: string; color: string; icon: string }> = {
  partenaire: { label: "Partenaires", color: "#1a5230", icon: "🛍️" },
  ramassage: { label: "Ramassage de déchets", color: "#3daa62", icon: "🤝" },
  dechetterie: { label: "Déchetteries", color: "#a85e0a", icon: "♻️" },
  centre: { label: "Centres écologiques", color: "#2e6b8a", icon: "🌱" }
};

export function kindLabel(kind: string): string {
  const meta = KIND_META[kind as MapPointKind];
  return meta ? `${meta.icon} ${meta.label}` : kind;
}

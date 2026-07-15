/**
 * Source de vérité des types de points affichés sur la carte
 * (partenaires Pro + lieux écologiques communautaires) : libellés, couleurs, icônes.
 * Utilisée par la carte, les filtres, le compte et les formulaires.
 *
 * NB : les valeurs techniques (ramassage/dechetterie/centre) sont figées en base ;
 * seuls les libellés publics changent ici.
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
  /** Membre fondateur (premiers abonnés Pro) — marqueur distinctif doré. */
  founder?: boolean;
};

export const KIND_META: Record<MapPointKind, { label: string; color: string; icon: string }> = {
  partenaire: { label: "Partenaires Pro", color: "#1a5230", icon: "🛍️" },
  ramassage: { label: "Événements groupés", color: "#3daa62", icon: "🤝" },
  dechetterie: { label: "Points de collecte", color: "#a85e0a", icon: "♻️" },
  centre: { label: "Initiatives urbaines", color: "#2e6b8a", icon: "🌱" }
};

/** Marqueur « Membre fondateur » (premiers partenaires Pro). */
export const FOUNDER_META = { label: "Membres fondateurs", color: "#e8a020", icon: "★" };

export function kindLabel(kind: string): string {
  const meta = KIND_META[kind as MapPointKind];
  return meta ? `${meta.icon} ${meta.label}` : kind;
}

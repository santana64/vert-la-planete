/** Fixed marketplace taxonomy (French labels, used in filters + forms). */
export const CATEGORIES = [
  "Alimentation bio",
  "Mode durable",
  "Énergie & habitat",
  "Maison & jardin",
  "Cosmétiques naturels",
  "Zéro déchet",
  "Mobilité douce",
  "Artisanat local"
] as const;

export type Category = (typeof CATEGORIES)[number];

export const BADGES = ["Bio", "Local", "Zéro déchet", "Recyclé", "Made in France"] as const;
export type Badge = (typeof BADGES)[number];

export const REGIONS = [
  "Île-de-France",
  "Auvergne-Rhône-Alpes",
  "Nouvelle-Aquitaine",
  "Pays de la Loire",
  "Occitanie",
  "Bretagne",
  "Grand Est",
  "Hauts-de-France"
] as const;

/** Offre gratuite : nombre maximum de produits publiables (accès restreint, art. 2.3). */
export const FREE_PRODUCT_LIMIT = 3;

export type OfferKey = "gratuit" | "pro_mensuel" | "pro_annuel";

/** Les 3 offres partenaires définies au contrat (art. 2.3). */
export const OFFERS: {
  key: OfferKey;
  name: string;
  priceLabel: string;
  periodLabel: string;
  priceCents: number;
  interval: "month" | "year" | null;
  stripeLookupKey: string | null;
  highlight: boolean;
  tagline: string;
  features: string[];
}[] = [
  {
    key: "gratuit",
    name: "Gratuit",
    priceLabel: "0 €",
    periodLabel: "pour toujours",
    priceCents: 0,
    interval: null,
    stripeLookupKey: null,
    highlight: false,
    tagline: "Pour rejoindre l'annuaire et tester la plateforme.",
    features: [
      "Fiche partenaire dans l'annuaire",
      `Jusqu'à ${FREE_PRODUCT_LIMIT} produits`,
      "Présence sur la carte",
      "Formulaire de contact"
    ]
  },
  {
    key: "pro_mensuel",
    name: "Pro Mensuel",
    priceLabel: "14,90 €",
    periodLabel: "par mois",
    priceCents: 1490,
    interval: "month",
    stripeLookupKey: "vlp_pro_mensuel",
    highlight: true,
    tagline: "Pour développer votre visibilité, sans engagement.",
    features: [
      "Produits illimités",
      "Mise en avant dans l'annuaire",
      "Badge « Partenaire Pro »",
      "Boutique partenaire complète",
      "Priorité de référencement"
    ]
  },
  {
    key: "pro_annuel",
    name: "Pro Annuel",
    priceLabel: "118,80 €",
    periodLabel: "par an",
    priceCents: 11880,
    interval: "year",
    stripeLookupKey: "vlp_pro_annuel",
    highlight: false,
    tagline: "Le meilleur tarif : 2 mois offerts.",
    features: [
      "Tous les avantages Pro",
      "≈ 2 mois offerts vs mensuel",
      "Facturation annuelle",
      "Engagement annuel"
    ]
  }
];

/** Données légales du Client (issues du contrat) — pour les pages légales / footer. */
export const COMPANY = {
  name: "VERT LA PLANÈTE",
  legalForm: "SAS — Société par actions simplifiée",
  siren: "991 990 177",
  siret: "991 990 177 00016",
  ape: "70.21Z — Conseil en relations publiques et communication",
  address: "225 rue Evariste Galois, 77350 Le Mée-sur-Seine",
  representative: "Quentin Cuzon",
  email: "contact@vertlaplanete.fr",
  host: {
    name: "Hostinger International Ltd.",
    address: "61 Lordou Vironos Street, 6023 Larnaca, Chypre",
    url: "https://www.hostinger.fr"
  }
} as const;

/** Gradient presets reused for logos / product imagery (matches template palette). */
export const GRADIENTS = [
  "linear-gradient(135deg,#1e5c35,#3daa62)",
  "linear-gradient(135deg,#3d6b4a,#72b888)",
  "linear-gradient(135deg,#1a3a4a,#2e6b8a)",
  "linear-gradient(135deg,#4a6741,#7ab065)",
  "linear-gradient(135deg,#7b4f1a,#d4a857)",
  "linear-gradient(135deg,#4a3728,#8b6b4f)",
  "linear-gradient(135deg,#5a3a7a,#8b5caa)",
  "linear-gradient(135deg,#1a4a2e,#3daa62)"
] as const;

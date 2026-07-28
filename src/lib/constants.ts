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

/**
 * Identité visuelle par thématique (cartes de l'annuaire) : emoji + dégradé
 * « nature » propre à chaque catégorie. Rend les vignettes thématiques et
 * cohérentes plutôt qu'un aplat aléatoire. Verts/terreux, alignés sur la palette.
 */
export const CATEGORY_META: Record<Category, { icon: string; gradient: string }> = {
  "Alimentation bio": {
    icon: "🥕",
    gradient:
      "radial-gradient(circle at 30% 22%,rgba(255,255,255,.28),rgba(255,255,255,0) 58%),linear-gradient(150deg,#1a5230 0%,#3daa62 100%)"
  },
  "Mode durable": {
    icon: "🧵",
    gradient:
      "radial-gradient(circle at 30% 22%,rgba(255,255,255,.26),rgba(255,255,255,0) 58%),linear-gradient(150deg,#24544b 0%,#4f8f82 100%)"
  },
  "Énergie & habitat": {
    icon: "☀️",
    gradient:
      "radial-gradient(circle at 30% 22%,rgba(255,255,255,.26),rgba(255,255,255,0) 58%),linear-gradient(150deg,#12321e 0%,#267a46 100%)"
  },
  "Maison & jardin": {
    icon: "🪴",
    gradient:
      "radial-gradient(circle at 30% 22%,rgba(255,255,255,.28),rgba(255,255,255,0) 58%),linear-gradient(150deg,#2e6b3f 0%,#7ab065 100%)"
  },
  "Cosmétiques naturels": {
    icon: "🌸",
    gradient:
      "radial-gradient(circle at 30% 22%,rgba(255,255,255,.28),rgba(255,255,255,0) 58%),linear-gradient(150deg,#3d6b4a 0%,#7ecb99 100%)"
  },
  "Zéro déchet": {
    icon: "♻️",
    gradient:
      "radial-gradient(circle at 30% 22%,rgba(255,255,255,.26),rgba(255,255,255,0) 58%),linear-gradient(150deg,#1a4a2e 0%,#3daa62 100%)"
  },
  "Mobilité douce": {
    icon: "🚲",
    gradient:
      "radial-gradient(circle at 30% 22%,rgba(255,255,255,.26),rgba(255,255,255,0) 58%),linear-gradient(150deg,#1e5c35 0%,#5fae74 100%)"
  },
  "Artisanat local": {
    icon: "🧺",
    gradient:
      "radial-gradient(circle at 30% 22%,rgba(255,255,255,.24),rgba(255,255,255,0) 58%),linear-gradient(150deg,#4a3728 0%,#a85e0a 100%)"
  }
};

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

/** Engagements de la plateforme — affichés sur l'accueil, le footer, à-propos. */
export const ENGAGEMENTS = [
  { icon: "🌱", title: "Site éco-conçu", desc: "Code sobre, pages légères, zéro script superflu" },
  { icon: "🚫", title: "Zéro newsletter imposée", desc: "Pas de spam, pas d'e-mails non sollicités" },
  { icon: "🔒", title: "Zéro tracking publicitaire", desc: "Aucun traceur, aucune revente de données" },
  { icon: "📍", title: "Circuits courts", desc: "Des acteurs locaux et vérifiés, près de chez vous" }
] as const;

/** Version courte des engagements (hero, footer). */
export const ENGAGEMENTS_SHORT = "🌿 Éco-conçu · 🚫 Pas de newsletter · 🔒 Pas de tracking";

/** Offre gratuite : nombre maximum de produits publiables (accès restreint, art. 2.3). */
export const FREE_PRODUCT_LIMIT = 3;

/** Membres fondateurs : les N premiers abonnés Pro (marqueur doré sur la carte). */
export const FOUNDERS_LIMIT = 50;

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
    tagline: "Pour référencer votre activité et être trouvé près de chez vous.",
    features: [
      "Votre fiche boutique (présentation, avis, contact)",
      "Visible dans l'annuaire des partenaires",
      `Jusqu'à ${FREE_PRODUCT_LIMIT} produits présentés sur votre fiche`,
      "Les visiteurs vous contactent directement"
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
    tagline: "Pour être vu en premier et présenter tout votre catalogue.",
    features: [
      "Tout le contenu de l'offre Gratuite",
      "Produits illimités sur votre fiche",
      "Localisation sur la carte de France interactive",
      "Affiché EN PREMIER : section « Partenaires Pro » en haut de l'annuaire",
      "Badge « ★ Partenaire Pro » — marqueur doré pour les premiers abonnés",
      "Sans engagement — résiliable à tout moment"
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
    tagline: "Les mêmes avantages Pro, au meilleur prix.",
    features: [
      "Identique à l'offre Pro Mensuelle",
      "9,90 €/mois au lieu de 14,90 € (2 mois offerts)",
      "Une seule facture par an",
      "Idéal si vous êtes déjà convaincu"
    ]
  }
];

/**
 * Promotion de lancement (art. 2.3 — « préparation d'une promotion de lancement
 * pour les premiers partenaires, dans la limite d'une configuration simple »).
 * Mettre `active: false` pour la retirer partout, sans toucher au code.
 */
export const LAUNCH_PROMO = {
  active: true,
  badge: "Offre de lancement",
  title: "Membre fondateur",
  detail:
    "Les 50 premiers partenaires Pro reçoivent le badge « Membre fondateur », une mise en avant prioritaire dans l'annuaire et un accompagnement personnalisé à la création de leur fiche.",
  short: "Badge « Membre fondateur » + mise en avant prioritaire pour les 50 premiers partenaires Pro."
} as const;

/** Données légales du Client (issues du contrat) — pour les pages légales / footer. */
export const COMPANY = {
  name: "VERT LA PLANÈTE",
  legalForm: "SAS — Société par actions simplifiée",
  siren: "991 990 177",
  siret: "991 990 177 00016",
  ape: "70.21Z — Conseil en relations publiques et communication",
  address: "225 rue Evariste Galois, 77350 Le Mée-sur-Seine",
  representative: "Quentin Cuzon",
  email: "appli.eco@outlook.fr",
  phone: "+33 7 86 28 88 45",
  whatsappUrl:
    "https://wa.me/33786288845?text=Bonjour%20Vert%20La%20Plan%C3%A8te%20%F0%9F%8C%B1%2C%20je%20vous%20contacte%20au%20sujet%20de%20...",
  domain: "https://vertlaplanete.com",
  domainLabel: "vertlaplanete.com",
  host: {
    name: "Hostinger International Ltd.",
    address: "61 Lordou Vironos Street, 6023 Larnaca, Chypre",
    url: "https://www.hostinger.fr"
  }
} as const;

/**
 * Réseaux sociaux & cagnotte de soutien.
 * Laisser une chaîne vide masque automatiquement le lien partout (footer, etc.).
 * Renseigner l'URL complète (https://…) suffit à l'afficher — aucun autre code à toucher.
 */
export const SOCIAL: { instagram: string; facebook: string; linkedin: string } = {
  instagram: "https://www.instagram.com/vertlaplanete",
  // Communauté Messenger (lien d'invitation fourni par le client, sans le paramètre de partage).
  facebook: "https://m.me/ch/AbZFPahioDDmJGF0/",
  // Profil LinkedIn (slug avec accent + emoji, percent-encodé pour l'attribut href).
  linkedin: "https://www.linkedin.com/in/vert-la-plan%C3%A8te-%F0%9F%8C%BF-5888752ba"
};

/** Cagnotte Leetchi de soutien au projet — vide = bouton masqué. */
export const LEETCHI_URL: string =
  "https://www.leetchi.com/c/soutenez-levolution-de-notre-entreprise-engagee-pour-lenvironnement-1467200";

/** Gradient presets reused for logos / product imagery (matches template palette). */
export const GRADIENTS = [
  "linear-gradient(135deg,#1e5c35,#3daa62)",
  "linear-gradient(135deg,#3d6b4a,#72b888)",
  "linear-gradient(135deg,#24544b,#4f8f82)",
  "linear-gradient(135deg,#4a6741,#7ab065)",
  "linear-gradient(135deg,#7b4f1a,#d4a857)",
  "linear-gradient(135deg,#4a3728,#8b6b4f)",
  "linear-gradient(135deg,#3e5c48,#7a9c86)",
  "linear-gradient(135deg,#1a4a2e,#3daa62)"
] as const;

import "../lib/load-env";
import bcrypt from "bcryptjs";
import { db } from "./index";
import { articles, jobs, products, reviews, sellers, users } from "./schema";
import { GRADIENTS, type OfferKey } from "../lib/constants";
import { slugify } from "../lib/format";

type SeedSeller = {
  email: string;
  ownerName: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  city: string;
  region: string;
  ecoScore: number;
  ecoLabel: string;
  verified: boolean;
  offer: OfferKey;
  gradient: string;
  mapX: number;
  mapY: number;
  websiteUrl?: string;
  products: {
    name: string;
    description: string;
    price: number;
    unit?: string;
    badge?: string;
    isNew?: boolean;
    gradient: string;
  }[];
  reviews?: { author: string; rating: number; body: string }[];
};

const DATA: SeedSeller[] = [
  {
    email: "maxime@vertlaplanete.fr",
    ownerName: "Maxime Lemaire",
    name: "La Ferme de Maxime",
    category: "Alimentation bio",
    tagline: "Maraîcher bio en circuit court · Val de Loire",
    description:
      "Agriculteur depuis plus de 10 ans, je cultive 40 variétés de légumes de saison sur 12 hectares certifiés Agriculture Biologique depuis 2019. Paniers hebdomadaires en livraison directe, semences paysannes, zéro intrant chimique.",
    city: "Tours",
    region: "Pays de la Loire",
    ecoScore: 94,
    ecoLabel: "Agriculture biologique certifiée AB",
    verified: true,
    offer: "pro_mensuel",
    gradient: GRADIENTS[0],
    mapX: 41,
    mapY: 33,
    websiteUrl: "https://example.com/ferme-maxime",
    products: [
      { name: "Panier hebdomadaire bio — Petit", description: "4 à 6 kg de légumes de saison cultivés sans intrant chimique.", price: 18, unit: "/ semaine", badge: "Bio", isNew: true, gradient: GRADIENTS[0] },
      { name: "Panier hebdomadaire bio — Grand", description: "8 à 10 kg de légumes de saison pour les familles.", price: 34, unit: "/ semaine", badge: "Bio", gradient: GRADIENTS[3] },
      { name: "Coffret de semences paysannes", description: "12 variétés anciennes reproductibles, récoltées à la ferme.", price: 16, badge: "Local", gradient: GRADIENTS[7] }
    ],
    reviews: [
      { author: "Sophie M.", rating: 5, body: "Des légumes d'une fraîcheur incomparable. Un engagement réel pour la biodiversité." },
      { author: "Pierre D.", rating: 5, body: "Circuit court vrai de vrai. Mon panier chaque semaine depuis 2 ans, jamais déçu." }
    ]
  },
  {
    email: "contact@energivert.fr",
    ownerName: "Claire Fontaine",
    name: "ÉnergiVert Solutions",
    category: "Énergie & habitat",
    tagline: "Énergies renouvelables & rénovation · Certifié RGE",
    description:
      "Installateur certifié RGE spécialisé dans le solaire, les pompes à chaleur et la récupération d'eau. Nous accompagnons particuliers et collectivités vers l'autonomie énergétique.",
    city: "Lyon",
    region: "Auvergne-Rhône-Alpes",
    ecoScore: 88,
    ecoLabel: "Certifié RGE — énergies renouvelables",
    verified: true,
    offer: "pro_annuel",
    gradient: GRADIENTS[2],
    mapX: 50,
    mapY: 52,
    products: [
      { name: "Kit récupération d'eau de pluie", description: "Cuve 300 L, filtre et collecteur pour réduire votre consommation d'eau potable.", price: 45, badge: "Recyclé", gradient: GRADIENTS[2] },
      { name: "Audit énergétique à domicile", description: "Diagnostic complet et plan de rénovation chiffré par un expert RGE.", price: 80, badge: "Made in France", isNew: true, gradient: GRADIENTS[6] }
    ],
    reviews: [{ author: "Julien R.", rating: 5, body: "Audit très complet, conseils concrets et sans survente." }]
  },
  {
    email: "atelier@biotiss.fr",
    ownerName: "Nadia Benali",
    name: "BioTiss Création",
    category: "Mode durable",
    tagline: "Mode & accessoires en fibres naturelles · Éco-conçu",
    description:
      "Atelier de mode durable basé à Bordeaux. Nous créons des accessoires en lin, chanvre et liège, teints naturellement et confectionnés à la main.",
    city: "Bordeaux",
    region: "Nouvelle-Aquitaine",
    ecoScore: 82,
    ecoLabel: "Éco-conçu — fibres naturelles",
    verified: true,
    offer: "gratuit",
    gradient: GRADIENTS[5],
    mapX: 28,
    mapY: 66,
    products: [
      { name: "Tote bag en liège naturel", description: "Sac résistant et léger en liège véritable, doublure coton bio.", price: 22, badge: "Made in France", isNew: true, gradient: GRADIENTS[5] },
      { name: "Trousse en lin lavé", description: "Trousse zéro plastique en lin français, teinture végétale.", price: 18, badge: "Recyclé", gradient: GRADIENTS[4] }
    ]
  },
  {
    email: "hello@recyclaction.fr",
    ownerName: "Thomas Girard",
    name: "RecyclAction",
    category: "Zéro déchet",
    tagline: "Économie circulaire & objets reconditionnés",
    description:
      "Recyclerie nouvelle génération : nous collectons, réparons et revalorisons mobilier et objets du quotidien pour leur offrir une seconde vie.",
    city: "Nantes",
    region: "Pays de la Loire",
    ecoScore: 79,
    ecoLabel: "Économie circulaire",
    verified: true,
    offer: "gratuit",
    gradient: GRADIENTS[3],
    mapX: 32,
    mapY: 44,
    products: [
      { name: "Kit salle de bain zéro déchet", description: "Brosse à dents bambou, shampoing solide, cotons lavables et porte-savon.", price: 28, badge: "Zéro déchet", isNew: true, gradient: GRADIENTS[3] },
      { name: "Lot de 6 cotons démaquillants lavables", description: "Coton bio et éponge, lavables des centaines de fois.", price: 12, badge: "Zéro déchet", gradient: GRADIENTS[1] }
    ]
  },
  {
    email: "bonjour@savonvert.fr",
    ownerName: "Inès Marchand",
    name: "SavonVert",
    category: "Cosmétiques naturels",
    tagline: "Savons & cosmétiques solides artisanaux",
    description:
      "Savonnerie artisanale en saponification à froid. Huiles bio, parfums naturels, zéro huile de palme et emballages compostables.",
    city: "Montpellier",
    region: "Occitanie",
    ecoScore: 84,
    ecoLabel: "Cosmétique artisanale & naturelle",
    verified: true,
    offer: "pro_mensuel",
    gradient: GRADIENTS[4],
    mapX: 55,
    mapY: 70,
    products: [
      { name: "Coffret 3 savons artisanaux", description: "Savons surgras saponifiés à froid : lavande, argile, calendula.", price: 19, badge: "Bio", gradient: GRADIENTS[4] },
      { name: "Shampoing solide cheveux normaux", description: "Équivaut à 2 flacons, sans sulfate ni plastique.", price: 11, badge: "Zéro déchet", isNew: true, gradient: GRADIENTS[0] }
    ],
    reviews: [{ author: "Léa P.", rating: 5, body: "Le coffret sent divinement bon et la peau ne tiraille plus. Adopté !" }]
  },
  {
    email: "contact@urbangarden.fr",
    ownerName: "Hugo Petit",
    name: "UrbanGarden",
    category: "Maison & jardin",
    tagline: "Potagers urbains & jardinage écologique",
    description:
      "Nous concevons des kits de potager pour balcons et petits espaces, avec terreau sans tourbe et semences bio adaptées à la ville.",
    city: "Paris",
    region: "Île-de-France",
    ecoScore: 81,
    ecoLabel: "Jardinage écologique",
    verified: false,
    offer: "gratuit",
    gradient: GRADIENTS[7],
    mapX: 70,
    mapY: 30,
    products: [
      { name: "Kit potager urbain de balcon", description: "Bac géotextile, terreau sans tourbe et 5 sachets de semences bio.", price: 34, badge: "Bio", isNew: true, gradient: GRADIENTS[7] },
      { name: "Lombricomposteur d'appartement", description: "Compostez vos déchets de cuisine sans odeur, même en appartement.", price: 59, badge: "Zéro déchet", gradient: GRADIENTS[3] }
    ]
  },
  {
    email: "atelier@cyclovert.fr",
    ownerName: "Camille Roy",
    name: "CycloVert",
    category: "Mobilité douce",
    tagline: "Vélos reconditionnés & accessoires durables",
    description:
      "Atelier de reconditionnement de vélos et vente d'accessoires durables pour une mobilité douce au quotidien. Garantie 1 an.",
    city: "Strasbourg",
    region: "Grand Est",
    ecoScore: 80,
    ecoLabel: "Mobilité douce",
    verified: true,
    offer: "gratuit",
    gradient: GRADIENTS[1],
    mapX: 78,
    mapY: 24,
    products: [
      { name: "Sacoche vélo imperméable recyclée", description: "Sacoche en bâche publicitaire recyclée, 100 % imperméable et unique.", price: 42, badge: "Recyclé", isNew: true, gradient: GRADIENTS[1] },
      { name: "Révision complète de vélo", description: "Diagnostic et remise en état complète par nos mécaniciens.", price: 49, badge: "Made in France", gradient: GRADIENTS[2] }
    ]
  }
];

const ARTICLES = [
  {
    title: "Maxime, agriculteur : comment j'ai reconverti 12 hectares en bio",
    category: "Biodiversité",
    author: "Partenaire Vert La Planète",
    readMinutes: 8,
    gradient: GRADIENTS[0],
    excerpt:
      "De la grande culture conventionnelle au maraîchage diversifié : le récit d'une conversion en agriculture biologique.",
    body:
      "Quand j'ai repris la ferme familiale, tout était pensé pour le rendement : monoculture, intrants, gros matériel. En quelques années, j'ai vu les sols s'appauvrir et la biodiversité disparaître.\n\nLa conversion en bio a pris trois ans. J'ai réintroduit des haies, diversifié les cultures et adopté des semences paysannes. Aujourd'hui, je cultive 40 variétés de légumes et je vends en circuit court.\n\nLe plus beau changement ? Le retour des insectes, des oiseaux et d'une vie du sol que je croyais perdue."
  },
  {
    title: "Transition énergétique : les nouvelles aides 2026 pour les particuliers",
    category: "Énergies renouvelables",
    author: "Actualité",
    readMinutes: 5,
    gradient: GRADIENTS[2],
    excerpt:
      "Panorama des dispositifs d'aide à la rénovation énergétique et aux énergies renouvelables pour 2026.",
    body:
      "Les dispositifs d'accompagnement à la rénovation évoluent. Entre primes, prêts à taux zéro et certificats d'économie d'énergie, il est parfois difficile de s'y retrouver.\n\nUn audit énergétique reste la première étape : il permet de prioriser les travaux les plus rentables et d'optimiser les aides mobilisables.\n\nNos partenaires certifiés RGE peuvent vous accompagner dans ce parcours, du diagnostic à la réalisation."
  },
  {
    title: "Guide pratique : recycler et consommer autrement au quotidien",
    category: "Économie circulaire",
    author: "Guide pratique",
    readMinutes: 6,
    gradient: GRADIENTS[3],
    excerpt:
      "Des gestes simples pour réduire ses déchets et soutenir une économie circulaire locale.",
    body:
      "Consommer autrement ne veut pas dire tout changer du jour au lendemain. Quelques gestes ont un impact réel : privilégier le réparable, acheter en vrac, choisir le reconditionné.\n\nL'économie circulaire repose aussi sur des acteurs locaux : recycleries, ressourceries, artisans de la réparation.\n\nSur Vert La Planète, vous retrouvez ces partenaires près de chez vous, avec leur démarche détaillée."
  }
];

const JOBS = [
  {
    title: "Maraîcher·ère bio en circuit court",
    organisation: "La Ferme de Maxime",
    kind: "Emploi",
    contractType: "CDI",
    location: "Tours (37)",
    description:
      "Nous recherchons un·e maraîcher·ère passionné·e pour rejoindre notre exploitation en agriculture biologique.\n\nMissions : culture maraîchère diversifiée, préparation des paniers, lien avec les adhérents.\n\nProfil : expérience en maraîchage bio appréciée, sens du collectif et goût du travail en plein air."
  },
  {
    title: "Technicien·ne installateur photovoltaïque",
    organisation: "ÉnergiVert Solutions",
    kind: "Emploi",
    contractType: "CDI",
    location: "Lyon (69)",
    description:
      "Rejoignez une entreprise certifiée RGE en plein développement.\n\nMissions : installation de panneaux solaires et pompes à chaleur chez les particuliers, mise en service, conseil client.\n\nFormation interne assurée. Permis B exigé."
  },
  {
    title: "Formation : initiation à la permaculture",
    organisation: "Réseau Vert La Planète",
    kind: "Formation",
    contractType: "Formation courte",
    location: "Nantes (44)",
    description:
      "Une formation de 3 jours pour découvrir les principes de la permaculture et concevoir son premier jardin nourricier.\n\nAu programme : design permacole, gestion de l'eau, associations de cultures, sol vivant.\n\nOuverte à tous, aucun prérequis."
  },
  {
    title: "Chargé·e de communication écoresponsable",
    organisation: "BioTiss Création",
    kind: "Emploi",
    contractType: "Alternance",
    location: "Bordeaux (33)",
    description:
      "Dans le cadre d'une alternance, vous accompagnez notre atelier de mode durable sur sa communication.\n\nMissions : réseaux sociaux, contenus, relations partenaires, événements.\n\nProfil : formation en communication, sensibilité aux enjeux écologiques."
  },
  {
    title: "Formation : ouvrir et gérer une recyclerie",
    organisation: "RecyclAction",
    kind: "Formation",
    contractType: "Formation certifiante",
    location: "À distance",
    description:
      "Une formation complète pour porter un projet de recyclerie ou de ressourcerie.\n\nModules : modèle économique, collecte et tri, réemploi, cadre réglementaire, animation locale.\n\nFormat hybride, accompagnement individualisé."
  }
];

async function main() {
  console.log("🌱 Seeding Vert La Planète (conforme contrat)…");

  await db.delete(reviews);
  await db.delete(products);
  await db.delete(sellers);
  await db.delete(jobs);
  await db.delete(articles);
  await db.delete(users);

  const passwordHash = await bcrypt.hash("password123", 10);

  // Membre de démonstration.
  await db.insert(users).values({
    email: "marie@vertlaplanete.fr",
    passwordHash,
    name: "Marie Laurent",
    role: "membre",
    offer: "gratuit",
    location: "Paris (75)"
  });

  for (const s of DATA) {
    const [owner] = await db
      .insert(users)
      .values({
        email: s.email,
        passwordHash,
        name: s.ownerName,
        role: "partenaire",
        offer: s.offer,
        location: s.city
      })
      .returning();

    const [seller] = await db
      .insert(sellers)
      .values({
        userId: owner.id,
        slug: slugify(s.name),
        name: s.name,
        category: s.category,
        tagline: s.tagline,
        description: s.description,
        city: s.city,
        region: s.region,
        ecoScore: s.ecoScore,
        ecoLabel: s.ecoLabel,
        verified: s.verified,
        offer: s.offer,
        logoInitials: s.name.replace(/[^A-Za-zÀ-ÿ ]/g, "").slice(0, 2).toUpperCase(),
        gradient: s.gradient,
        mapX: s.mapX,
        mapY: s.mapY,
        websiteUrl: s.websiteUrl ?? null
      })
      .returning();

    for (const p of s.products) {
      await db.insert(products).values({
        sellerId: seller.id,
        slug: slugify(p.name),
        name: p.name,
        description: p.description,
        priceCents: Math.round(p.price * 100),
        unit: p.unit ?? null,
        category: s.category,
        badge: p.badge ?? null,
        gradient: p.gradient,
        isNew: p.isNew ?? false
      });
    }

    if (s.reviews) {
      for (const r of s.reviews) {
        await db.insert(reviews).values({
          sellerId: seller.id,
          authorName: `${r.author} · Membre Vert La Planète`,
          rating: r.rating,
          body: r.body
        });
      }
    }
  }

  for (const a of ARTICLES) {
    await db.insert(articles).values({ slug: slugify(a.title), ...a });
  }
  for (const j of JOBS) {
    await db.insert(jobs).values({ slug: slugify(j.title), ...j });
  }

  console.log(
    `✅ Done — ${DATA.length} partenaires, ${ARTICLES.length} articles, ${JOBS.length} offres emploi/formation.`
  );
  console.log("   Comptes démo (password123) : marie@vertlaplanete.fr (membre) · maxime@vertlaplanete.fr (partenaire Pro).");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";

/**
 * Vert La Planète — site vitrine + annuaire de partenaires + offres d'abonnement.
 * Conforme au contrat de prestation V4 : version de lancement professionnelle.
 * (Pas de marketplace transactionnelle, pas de dashboard vendeur avancé, pas de stocks.)
 */

export const userRole = pgEnum("user_role", ["membre", "partenaire"]);
// Offres partenaires (article 2.3 du contrat).
export const offerType = pgEnum("offer_type", ["gratuit", "pro_mensuel", "pro_annuel"]);

// ── Comptes ─────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: userRole("role").notNull().default("membre"),
  // Offre souscrite (pertinent pour les partenaires ; "gratuit" par défaut).
  offer: offerType("offer").notNull().default("gratuit"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status"),
  location: text("location"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

// ── Partenaires (boutiques) ───────────────────────────────────────────────────
export const sellers = pgTable("sellers", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  city: text("city").notNull(),
  region: text("region").notNull(),
  ecoScore: integer("eco_score").notNull().default(0),
  ecoLabel: text("eco_label").notNull().default("Démarche écologique vérifiée"),
  verified: boolean("verified").notNull().default(false),
  // Reflète l'offre du partenaire (pour la mise en avant / accès restreint).
  offer: offerType("offer").notNull().default("gratuit"),
  logoInitials: text("logo_initials").notNull(),
  gradient: text("gradient").notNull(),
  mapX: real("map_x").notNull().default(50),
  mapY: real("map_y").notNull().default(50),
  websiteUrl: text("website_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

// ── Produits (vitrine de la boutique partenaire, sans gestion de stock) ────────
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => sellers.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  priceCents: integer("price_cents").notNull(),
  unit: text("unit"),
  category: text("category").notNull(),
  badge: text("badge"),
  gradient: text("gradient").notNull(),
  isNew: boolean("is_new").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

// ── Avis (sur un partenaire) ──────────────────────────────────────────────────
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => sellers.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  rating: integer("rating").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

// ── Actualités / Blog (article 2.2) ───────────────────────────────────────────
export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  gradient: text("gradient").notNull(),
  readMinutes: integer("read_minutes").notNull().default(5),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow()
});

// ── Emplois & Formations (article 2.2) ────────────────────────────────────────
export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  organisation: text("organisation").notNull(),
  kind: text("kind").notNull(), // "Emploi" | "Formation"
  contractType: text("contract_type").notNull(), // CDI, CDD, Alternance, Formation…
  location: text("location").notNull(),
  description: text("description").notNull(),
  contactUrl: text("contact_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

// ── Messages de contact (formulaire public, art. 2.3) ────────────────────────
export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  profile: text("profile").notNull(), // Acheteur, Producteur/artisan, Marque, Presse…
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

// ── Relations ─────────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ one }) => ({
  seller: one(sellers, { fields: [users.id], references: [sellers.userId] })
}));

export const sellersRelations = relations(sellers, ({ one, many }) => ({
  owner: one(users, { fields: [sellers.userId], references: [users.id] }),
  products: many(products),
  reviews: many(reviews)
}));

export const productsRelations = relations(products, ({ one }) => ({
  seller: one(sellers, { fields: [products.sellerId], references: [sellers.id] })
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  seller: one(sellers, { fields: [reviews.sellerId], references: [sellers.id] })
}));

export type User = typeof users.$inferSelect;
export type Seller = typeof sellers.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type Offer = (typeof offerType.enumValues)[number];

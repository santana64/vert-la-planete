import "server-only";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  articles,
  ecoPlaces,
  favorites,
  jobs,
  products,
  reviews,
  sellers,
  type Article,
  type EcoPlace,
  type Job,
  type Product,
  type Seller
} from "@/db/schema";

// ── Partenaires ───────────────────────────────────────────────────────────────
export async function listSellers(filters: {
  q?: string;
  category?: string;
  region?: string;
} = {}): Promise<Seller[]> {
  const conditions = [];
  if (filters.q) {
    const term = `%${filters.q}%`;
    conditions.push(
      or(ilike(sellers.name, term), ilike(sellers.tagline, term), ilike(sellers.city, term))
    );
  }
  if (filters.category) conditions.push(eq(sellers.category, filters.category));
  if (filters.region) conditions.push(eq(sellers.region, filters.region));

  // Mise en avant selon l'offre : Pro d'abord, puis vérifiés, puis score éco.
  return db
    .select()
    .from(sellers)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(
      sql`case when ${sellers.offer} = 'gratuit' then 1 else 0 end`,
      desc(sellers.verified),
      desc(sellers.ecoScore)
    );
}

export async function getFeaturedSellers(limit = 4): Promise<Seller[]> {
  return db
    .select()
    .from(sellers)
    .orderBy(
      sql`case when ${sellers.offer} = 'gratuit' then 1 else 0 end`,
      desc(sellers.verified),
      desc(sellers.ecoScore)
    )
    .limit(limit);
}

export async function getSellerBySlug(slug: string): Promise<Seller | null> {
  const [seller] = await db.select().from(sellers).where(eq(sellers.slug, slug)).limit(1);
  return seller ?? null;
}

export async function getSellerProducts(sellerId: string): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(eq(products.sellerId, sellerId))
    .orderBy(desc(products.createdAt));
}

export async function getSellerProductCount(sellerId: string): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(products)
    .where(eq(products.sellerId, sellerId));
  return row?.n ?? 0;
}

export async function getSellerReviews(sellerId: string) {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.sellerId, sellerId))
    .orderBy(desc(reviews.createdAt));
}

// ── Actualités / Blog ───────────────────────────────────────────────────────────
export async function listArticles(): Promise<Article[]> {
  return db.select().from(articles).orderBy(desc(articles.publishedAt));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const [article] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  return article ?? null;
}

// ── Emplois & Formations ─────────────────────────────────────────────────────────
export async function listJobs(kind?: string): Promise<Job[]> {
  return db
    .select()
    .from(jobs)
    .where(kind ? eq(jobs.kind, kind) : undefined)
    .orderBy(desc(jobs.createdAt));
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const [job] = await db.select().from(jobs).where(eq(jobs.slug, slug)).limit(1);
  return job ?? null;
}

// ── Lieux écologiques (carte) ──────────────────────────────────────────────────
export async function listEcoPlaces(): Promise<EcoPlace[]> {
  return db.select().from(ecoPlaces).orderBy(desc(ecoPlaces.createdAt));
}

// ── Compte : favoris & publications ───────────────────────────────────────────
export async function getUserFavoriteSellers(userId: string): Promise<Seller[]> {
  return db
    .select({ seller: sellers })
    .from(favorites)
    .innerJoin(sellers, eq(favorites.sellerId, sellers.id))
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt))
    .then((rows) => rows.map((r) => r.seller));
}

export async function isFavoriteSeller(userId: string, sellerId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: favorites.id })
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.sellerId, sellerId)))
    .limit(1);
  return Boolean(row);
}

export type UserPublications = {
  places: EcoPlace[];
  reviews: { id: string; rating: number; body: string; createdAt: Date; sellerName: string; sellerSlug: string }[];
};

export async function getUserPublications(userId: string): Promise<UserPublications> {
  const [places, userReviews] = await Promise.all([
    db.select().from(ecoPlaces).where(eq(ecoPlaces.createdBy, userId)).orderBy(desc(ecoPlaces.createdAt)),
    db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        body: reviews.body,
        createdAt: reviews.createdAt,
        sellerName: sellers.name,
        sellerSlug: sellers.slug
      })
      .from(reviews)
      .innerJoin(sellers, eq(reviews.sellerId, sellers.id))
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt))
  ]);
  return { places, reviews: userReviews };
}

// ── Notifications partenaire (dérivées des données réelles) ───────────────────
export type PartnerNotification = {
  id: string;
  icon: string;
  title: string;
  body: string;
  date: Date;
};

export async function getPartnerNotifications(seller: Seller): Promise<PartnerNotification[]> {
  const sellerReviews = await getSellerReviews(seller.id);
  const notifications: PartnerNotification[] = sellerReviews.map((r) => ({
    id: `review-${r.id}`,
    icon: "⭐",
    title: `Nouvel avis ${"★".repeat(r.rating)}`,
    body: `« ${r.body.slice(0, 120)}${r.body.length > 120 ? "…" : ""} » — ${r.authorName}`,
    date: r.createdAt
  }));
  if (seller.verified) {
    notifications.push({
      id: "verified",
      icon: "✅",
      title: "Fiche vérifiée",
      body: "Votre démarche écologique a été vérifiée par l'équipe — le badge « Vérifié » est affiché sur votre fiche.",
      date: seller.createdAt
    });
  }
  notifications.push({
    id: "welcome",
    icon: "🌱",
    title: "Bienvenue sur Vert La Planète !",
    body: "Votre boutique est en ligne. Complétez votre fiche et ajoutez vos produits pour gagner en visibilité.",
    date: seller.createdAt
  });
  return notifications.sort((a, b) => b.date.getTime() - a.date.getTime());
}

// ── Statistiques (accueil) ───────────────────────────────────────────────────────
export async function getMarketplaceStats() {
  const [productCount] = await db.select({ n: sql<number>`count(*)::int` }).from(products);
  const [sellerCount] = await db.select({ n: sql<number>`count(*)::int` }).from(sellers);
  const [regionCount] = await db
    .select({ n: sql<number>`count(distinct ${sellers.region})::int` })
    .from(sellers);
  return {
    products: productCount?.n ?? 0,
    sellers: sellerCount?.n ?? 0,
    regions: regionCount?.n ?? 0
  };
}

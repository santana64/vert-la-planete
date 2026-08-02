import "server-only";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  articles,
  contactMessages,
  ecoPlaces,
  jobs,
  reviews,
  sellers,
  users,
  type Article,
  type ContactMessage,
  type EcoPlace,
  type Job
} from "@/db/schema";

/**
 * Couche de lecture de l'espace admin. Aucune vérification d'accès ici : les
 * pages/actions qui consomment ces fonctions passent OBLIGATOIREMENT par
 * `requireAdmin()` (layout + actions). Ces requêtes ne sont jamais atteignables
 * sans être admin.
 */

export type AdminStats = {
  sellers: number;
  sellersVerified: number;
  sellersPro: number;
  users: number;
  members: number;
  partners: number;
  reviews: number;
  ecoPlaces: number;
  messages: number;
  articles: number;
  jobs: number;
};

async function countOf(table: typeof sellers | typeof users | typeof reviews | typeof ecoPlaces | typeof contactMessages | typeof articles | typeof jobs): Promise<number> {
  const [row] = await db.select({ n: sql<number>`count(*)::int` }).from(table);
  return row?.n ?? 0;
}

export async function getAdminStats(): Promise<AdminStats> {
  const [
    sellersTotal,
    sellersVerified,
    sellersPro,
    usersTotal,
    members,
    reviewsTotal,
    ecoTotal,
    messagesTotal,
    articlesTotal,
    jobsTotal
  ] = await Promise.all([
    countOf(sellers),
    db.select({ n: sql<number>`count(*)::int` }).from(sellers).where(eq(sellers.verified, true)).then((r) => r[0]?.n ?? 0),
    db.select({ n: sql<number>`count(*)::int` }).from(sellers).where(sql`${sellers.offer} <> 'gratuit'`).then((r) => r[0]?.n ?? 0),
    countOf(users),
    db.select({ n: sql<number>`count(*)::int` }).from(users).where(eq(users.role, "membre")).then((r) => r[0]?.n ?? 0),
    countOf(reviews),
    countOf(ecoPlaces),
    countOf(contactMessages),
    countOf(articles),
    countOf(jobs)
  ]);

  return {
    sellers: sellersTotal,
    sellersVerified,
    sellersPro,
    users: usersTotal,
    members,
    partners: usersTotal - members,
    reviews: reviewsTotal,
    ecoPlaces: ecoTotal,
    messages: messagesTotal,
    articles: articlesTotal,
    jobs: jobsTotal
  };
}

export type AdminSellerRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  city: string;
  region: string;
  offer: string;
  verified: boolean;
  logoInitials: string;
  gradient: string;
  createdAt: Date;
  ownerEmail: string | null;
};

export async function adminListSellers(): Promise<AdminSellerRow[]> {
  return db
    .select({
      id: sellers.id,
      slug: sellers.slug,
      name: sellers.name,
      category: sellers.category,
      city: sellers.city,
      region: sellers.region,
      offer: sellers.offer,
      verified: sellers.verified,
      logoInitials: sellers.logoInitials,
      gradient: sellers.gradient,
      createdAt: sellers.createdAt,
      ownerEmail: users.email
    })
    .from(sellers)
    .leftJoin(users, eq(sellers.userId, users.id))
    .orderBy(desc(sellers.createdAt));
}

export type AdminUserRow = {
  id: string;
  email: string;
  name: string;
  role: string;
  offer: string;
  createdAt: Date;
};

export async function adminListUsers(): Promise<AdminUserRow[]> {
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      offer: users.offer,
      createdAt: users.createdAt
    })
    .from(users)
    .orderBy(desc(users.createdAt));
}

export type AdminReviewRow = {
  id: string;
  authorName: string;
  rating: number;
  body: string;
  createdAt: Date;
  sellerName: string | null;
  sellerSlug: string | null;
};

export async function adminListReviews(): Promise<AdminReviewRow[]> {
  return db
    .select({
      id: reviews.id,
      authorName: reviews.authorName,
      rating: reviews.rating,
      body: reviews.body,
      createdAt: reviews.createdAt,
      sellerName: sellers.name,
      sellerSlug: sellers.slug
    })
    .from(reviews)
    .leftJoin(sellers, eq(reviews.sellerId, sellers.id))
    .orderBy(desc(reviews.createdAt));
}

export async function adminListEcoPlaces(): Promise<EcoPlace[]> {
  return db.select().from(ecoPlaces).orderBy(desc(ecoPlaces.createdAt));
}

export async function adminListMessages(): Promise<ContactMessage[]> {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function adminListArticles(): Promise<Article[]> {
  return db.select().from(articles).orderBy(desc(articles.publishedAt));
}

/** Garde UUID : un segment d'URL non-UUID renverrait une erreur Postgres (colonne uuid). */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function adminGetArticle(id: string): Promise<Article | null> {
  if (!UUID_RE.test(id)) return null;
  const [row] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return row ?? null;
}

export async function adminListJobs(): Promise<Job[]> {
  return db.select().from(jobs).orderBy(desc(jobs.createdAt));
}

export async function adminGetJob(id: string): Promise<Job | null> {
  if (!UUID_RE.test(id)) return null;
  const [row] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return row ?? null;
}

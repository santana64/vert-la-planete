"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { articles, contactMessages, ecoPlaces, jobs, reviews, sellers, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { GRADIENTS } from "@/lib/constants";
import { slugify } from "@/lib/format";

/**
 * Actions de l'espace admin. CHAQUE fonction commence par `requireAdmin()` :
 * la sécurité ne repose jamais sur l'UI (un non-admin qui appellerait l'action
 * directement est rejeté ici). Toutes revalident les chemins concernés.
 */

export type AdminFormState = { error?: string; ok?: boolean };

const uuid = z.string().uuid();
const offerEnum = z.enum(["gratuit", "pro_mensuel", "pro_annuel"]);
const roleEnum = z.enum(["membre", "partenaire"]);

function id(formData: FormData): string | null {
  const parsed = uuid.safeParse(formData.get("id"));
  return parsed.success ? parsed.data : null;
}

// ── Partenaires ───────────────────────────────────────────────────────────────
export async function adminToggleSellerVerified(formData: FormData): Promise<void> {
  await requireAdmin();
  const sellerId = id(formData);
  if (!sellerId) return;
  // Bascule depuis l'état EN BASE (on ne fait pas confiance à un champ client).
  await db.update(sellers).set({ verified: sql`not ${sellers.verified}` }).where(eq(sellers.id, sellerId));
  revalidatePath("/admin/partenaires");
}

export async function adminSetSellerOffer(formData: FormData): Promise<void> {
  await requireAdmin();
  const sellerId = id(formData);
  const offer = offerEnum.safeParse(formData.get("offer"));
  if (!sellerId || !offer.success) return;
  await db.update(sellers).set({ offer: offer.data }).where(eq(sellers.id, sellerId));
  revalidatePath("/admin/partenaires");
}

export async function adminDeleteSeller(formData: FormData): Promise<void> {
  await requireAdmin();
  const sellerId = id(formData);
  if (!sellerId) return;
  await db.delete(sellers).where(eq(sellers.id, sellerId));
  revalidatePath("/admin/partenaires");
  revalidatePath("/partenaires");
}

// ── Utilisateurs ────────────────────────────────────────────────────────────
export async function adminSetUserRole(formData: FormData): Promise<void> {
  await requireAdmin();
  const userId = id(formData);
  const role = roleEnum.safeParse(formData.get("role"));
  if (!userId || !role.success) return;
  await db.update(users).set({ role: role.data }).where(eq(users.id, userId));
  revalidatePath("/admin/membres");
}

export async function adminDeleteUser(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const userId = id(formData);
  if (!userId) return;
  // Garde-fou : un admin ne peut pas supprimer son propre compte depuis l'admin.
  if (userId === admin.id) return;
  await db.delete(users).where(eq(users.id, userId));
  revalidatePath("/admin/membres");
}

// ── Avis ───────────────────────────────────────────────────────────────────
export async function adminDeleteReview(formData: FormData): Promise<void> {
  await requireAdmin();
  const reviewId = id(formData);
  if (!reviewId) return;
  await db.delete(reviews).where(eq(reviews.id, reviewId));
  revalidatePath("/admin/avis");
}

// ── Lieux proposés ───────────────────────────────────────────────────────────
export async function adminDeleteEcoPlace(formData: FormData): Promise<void> {
  await requireAdmin();
  const placeId = id(formData);
  if (!placeId) return;
  await db.delete(ecoPlaces).where(eq(ecoPlaces.id, placeId));
  revalidatePath("/admin/lieux");
  revalidatePath("/partenaires");
}

// ── Messages de contact ──────────────────────────────────────────────────────
export async function adminDeleteMessage(formData: FormData): Promise<void> {
  await requireAdmin();
  const messageId = id(formData);
  if (!messageId) return;
  await db.delete(contactMessages).where(eq(contactMessages.id, messageId));
  revalidatePath("/admin/messages");
}

// ── Articles (CRUD) ──────────────────────────────────────────────────────────
const articleSchema = z.object({
  title: z.string().trim().min(4, "Titre trop court"),
  excerpt: z.string().trim().min(10, "Chapô trop court").max(400),
  body: z.string().trim().min(20, "Contenu trop court"),
  category: z.string().trim().min(2, "Catégorie requise"),
  author: z.string().trim().min(2, "Auteur requis"),
  readMinutes: z.coerce.number().int().min(1).max(60).default(5)
});

async function uniqueSlug(
  table: typeof articles | typeof jobs,
  base: string,
  ignoreId?: string
): Promise<string> {
  const root = slugify(base) || "item";
  let slug = root;
  let i = 1;
  while (true) {
    const [exists] = await db.select({ id: table.id, slug: table.slug }).from(table).where(eq(table.slug, slug)).limit(1);
    if (!exists || exists.id === ignoreId) return slug;
    slug = `${root}-${++i}`;
  }
}

export async function adminSaveArticle(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const editId = uuid.safeParse(formData.get("id"));
  const parsed = articleSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    category: formData.get("category"),
    author: formData.get("author"),
    readMinutes: formData.get("readMinutes")
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const data = parsed.data;

  if (editId.success) {
    await db
      .update(articles)
      .set({ title: data.title, excerpt: data.excerpt, body: data.body, category: data.category, author: data.author, readMinutes: data.readMinutes })
      .where(eq(articles.id, editId.data));
  } else {
    const slug = await uniqueSlug(articles, data.title);
    await db.insert(articles).values({
      slug,
      title: data.title,
      excerpt: data.excerpt,
      body: data.body,
      category: data.category,
      author: data.author,
      readMinutes: data.readMinutes,
      gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
    });
  }
  revalidatePath("/admin/articles");
  revalidatePath("/actualites");
  redirect("/admin/articles");
}

export async function adminDeleteArticle(formData: FormData): Promise<void> {
  await requireAdmin();
  const articleId = id(formData);
  if (!articleId) return;
  await db.delete(articles).where(eq(articles.id, articleId));
  revalidatePath("/admin/articles");
  revalidatePath("/actualites");
}

// ── Emplois & Formations (CRUD) ──────────────────────────────────────────────
const jobSchema = z.object({
  title: z.string().trim().min(4, "Titre trop court"),
  organisation: z.string().trim().min(2, "Organisation requise"),
  kind: z.enum(["Emploi", "Formation"]),
  contractType: z.string().trim().min(2, "Type de contrat requis"),
  location: z.string().trim().min(2, "Lieu requis"),
  description: z.string().trim().min(20, "Description trop courte"),
  contactUrl: z.union([z.string().trim().url("URL invalide"), z.literal("")]).optional()
});

export async function adminSaveJob(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const editId = uuid.safeParse(formData.get("id"));
  const parsed = jobSchema.safeParse({
    title: formData.get("title"),
    organisation: formData.get("organisation"),
    kind: formData.get("kind"),
    contractType: formData.get("contractType"),
    location: formData.get("location"),
    description: formData.get("description"),
    contactUrl: formData.get("contactUrl") ?? ""
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const data = parsed.data;
  const contactUrl = data.contactUrl ? data.contactUrl : null;

  if (editId.success) {
    await db
      .update(jobs)
      .set({ title: data.title, organisation: data.organisation, kind: data.kind, contractType: data.contractType, location: data.location, description: data.description, contactUrl })
      .where(eq(jobs.id, editId.data));
  } else {
    const slug = await uniqueSlug(jobs, data.title);
    await db.insert(jobs).values({
      slug,
      title: data.title,
      organisation: data.organisation,
      kind: data.kind,
      contractType: data.contractType,
      location: data.location,
      description: data.description,
      contactUrl
    });
  }
  revalidatePath("/admin/emplois");
  revalidatePath("/emplois");
  redirect("/admin/emplois");
}

export async function adminDeleteJob(formData: FormData): Promise<void> {
  await requireAdmin();
  const jobId = id(formData);
  if (!jobId) return;
  await db.delete(jobs).where(eq(jobs.id, jobId));
  revalidatePath("/admin/emplois");
  revalidatePath("/emplois");
}

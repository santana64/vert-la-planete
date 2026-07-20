"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { reviews, sellers } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { isUniqueViolation } from "@/lib/db-errors";
import { checkContent } from "@/lib/moderation";

export type ReviewState = { ok?: boolean; error?: string };

const schema = z.object({
  sellerId: z.string().uuid(),
  rating: z.coerce.number().int().min(1, "Choisissez une note").max(5),
  body: z.string().trim().min(10, "Votre avis est un peu court").max(2000)
});

export async function addReviewAction(
  _prev: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const parsed = schema.safeParse({
    sellerId: formData.get("sellerId"),
    rating: formData.get("rating"),
    body: formData.get("body")
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }
  const { sellerId, rating, body } = parsed.data;

  const moderation = checkContent(body);
  if (!moderation.ok) return { error: moderation.reason };

  const [seller] = await db
    .select({ id: sellers.id, slug: sellers.slug, userId: sellers.userId })
    .from(sellers)
    .where(eq(sellers.id, sellerId))
    .limit(1);
  if (!seller) return { error: "Partenaire introuvable" };
  if (seller.userId === user.id) {
    return { error: "Vous ne pouvez pas laisser un avis sur votre propre boutique." };
  }

  const [existing] = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(and(eq(reviews.sellerId, sellerId), eq(reviews.userId, user.id)))
    .limit(1);
  if (existing) {
    return { error: "Vous avez déjà laissé un avis pour ce partenaire." };
  }

  try {
    await db.insert(reviews).values({
      sellerId,
      userId: user.id,
      authorName: `${user.name} · Membre Vert La Planète`,
      rating,
      body
    });
  } catch (err) {
    // Double-soumission concurrente : l'index unique (seller, user) a tranché.
    if (isUniqueViolation(err)) {
      return { error: "Vous avez déjà laissé un avis pour ce partenaire." };
    }
    throw err;
  }

  revalidatePath(`/partenaires/${seller.slug}`);
  return { ok: true };
}

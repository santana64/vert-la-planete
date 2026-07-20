"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { favorites, sellers } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { isUniqueViolation } from "@/lib/db-errors";

export type FavoriteState = { favorited?: boolean; error?: string };

export async function toggleFavoriteAction(
  _prev: FavoriteState,
  formData: FormData
): Promise<FavoriteState> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const parsed = z.string().uuid().safeParse(formData.get("sellerId"));
  if (!parsed.success) return { error: "Partenaire invalide" };
  const sellerId = parsed.data;

  const [seller] = await db
    .select({ id: sellers.id, slug: sellers.slug })
    .from(sellers)
    .where(eq(sellers.id, sellerId))
    .limit(1);
  if (!seller) return { error: "Partenaire introuvable" };

  const [existing] = await db
    .select({ id: favorites.id })
    .from(favorites)
    .where(and(eq(favorites.userId, user.id), eq(favorites.sellerId, sellerId)))
    .limit(1);

  let favorited: boolean;
  if (existing) {
    await db.delete(favorites).where(eq(favorites.id, existing.id));
    favorited = false;
  } else {
    try {
      await db.insert(favorites).values({ userId: user.id, sellerId });
    } catch (err) {
      // Double-clic concurrent : déjà en favori (index unique) — état idempotent.
      if (!isUniqueViolation(err)) throw err;
    }
    favorited = true;
  }

  revalidatePath(`/partenaires/${seller.slug}`);
  revalidatePath("/compte");
  return { favorited };
}

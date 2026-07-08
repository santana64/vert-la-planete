"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export type AvatarState = { ok?: boolean; error?: string };

// Data-URL compressée côté client (canvas 256px) — plafond serveur strict.
const MAX_DATA_URL_LENGTH = 120_000; // ~90 Ko d'image

export async function updateAvatarAction(
  _prev: AvatarState,
  formData: FormData
): Promise<AvatarState> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const dataUrl = formData.get("avatar");
  if (typeof dataUrl !== "string" || !/^data:image\/(jpeg|png|webp);base64,/.test(dataUrl)) {
    return { error: "Image invalide" };
  }
  if (dataUrl.length > MAX_DATA_URL_LENGTH) {
    return { error: "Image trop lourde — réessayez avec une photo plus petite." };
  }

  await db.update(users).set({ avatarUrl: dataUrl }).where(eq(users.id, user.id));
  revalidatePath("/compte");
  return { ok: true };
}

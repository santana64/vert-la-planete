"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { ecoPlaces } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { checkContentFields } from "@/lib/moderation";

export type PlaceState = { ok?: boolean; error?: string };

const schema = z.object({
  kind: z.enum(["ramassage", "dechetterie", "centre"]),
  name: z.string().trim().min(3, "Nom trop court").max(120),
  description: z.string().trim().min(10, "Décrivez le lieu ou l'initiative").max(2000),
  city: z.string().trim().min(2, "Ville requise"),
  schedule: z.string().trim().max(200).optional(),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180)
});

/** « Proposer un lieu » — membres connectés ; position choisie en cliquant la carte. */
export async function createEcoPlaceAction(
  _prev: PlaceState,
  formData: FormData
): Promise<PlaceState> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/lieux/proposer");

  const parsed = schema.safeParse({
    kind: formData.get("kind"),
    name: formData.get("name"),
    description: formData.get("description"),
    city: formData.get("city"),
    schedule: formData.get("schedule") ?? "",
    lat: formData.get("lat"),
    lng: formData.get("lng")
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }
  if (parsed.data.lat === 0 && parsed.data.lng === 0) {
    return { error: "Placez le lieu sur la carte (un clic suffit)." };
  }

  const moderation = checkContentFields(parsed.data.name, parsed.data.description);
  if (!moderation.ok) return { error: moderation.reason };

  await db.insert(ecoPlaces).values({
    ...parsed.data,
    schedule: parsed.data.schedule ? parsed.data.schedule : null,
    createdBy: user.id
  });

  revalidatePath("/partenaires");
  return { ok: true };
}

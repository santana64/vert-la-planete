"use server";

import { z } from "zod";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";

export type ContactState = { ok?: boolean; error?: string };

const schema = z.object({
  firstName: z.string().trim().min(2, "Prénom requis"),
  lastName: z.string().trim().min(2, "Nom requis"),
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide"),
  profile: z.string().trim().min(2),
  message: z.string().trim().min(10, "Votre message est un peu court").max(5000)
});

export async function sendContactAction(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot anti-spam : champ invisible, un humain le laisse vide.
  if (typeof formData.get("website") === "string" && formData.get("website") !== "") {
    return { ok: true };
  }

  const parsed = schema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    profile: formData.get("profile"),
    message: formData.get("message")
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  await db.insert(contactMessages).values(parsed.data);
  return { ok: true };
}

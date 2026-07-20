"use server";

import { z } from "zod";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { COMPANY } from "@/lib/constants";
import { checkContent } from "@/lib/moderation";

export type ContactState = { ok?: boolean; error?: string };

/**
 * Transfert du message vers la boîte mail (Resend, sans SDK).
 * S'active dès que RESEND_API_KEY est défini ; la cible est CONTACT_EMAIL_TO
 * (défaut : adresse de contact de la société). L'enregistrement en base reste
 * la source de vérité — un échec d'e-mail ne fait pas échouer l'envoi.
 */
async function forwardByEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  profile: string;
  message: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const to = process.env.CONTACT_EMAIL_TO ?? COMPANY.email;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Vert La Planète <onboarding@resend.dev>",
        to: [to],
        reply_to: data.email,
        subject: `[Contact] ${data.firstName} ${data.lastName} — ${data.profile}`,
        text: `De : ${data.firstName} ${data.lastName} <${data.email}>\nProfil : ${data.profile}\n\n${data.message}`
      })
    });
  } catch {
    // L'e-mail est un confort ; le message est déjà en base.
  }
}

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

  const moderation = checkContent(parsed.data.message);
  if (!moderation.ok) return { error: moderation.reason };

  await db.insert(contactMessages).values(parsed.data);
  await forwardByEmail(parsed.data);
  return { ok: true };
}

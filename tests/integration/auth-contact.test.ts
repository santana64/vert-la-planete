import { afterAll, describe, expect, it } from "vitest";
import { and, eq } from "drizzle-orm";
import { loginAction, registerAction } from "@/app/actions/auth";
import { sendContactAction } from "@/app/actions/contact";
import { addReviewAction } from "@/app/actions/reviews";
import { db } from "@/db";
import { contactMessages, reviews, sellers, users } from "@/db/schema";

/**
 * Tests d'intégration — exigent une base locale joignable (docker vlp-pg).
 * Les Server Actions qui réussissent terminent par redirect(), qui LÈVE
 * une erreur NEXT_REDIRECT : c'est notre signal de succès.
 */
const EMAIL = `vitest-${Date.now()}@test.local`;
const CONTACT_EMAIL = `vitest-contact-${Date.now()}@test.local`;

function fd(entries: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) f.set(k, v);
  return f;
}

async function expectRedirect(promise: Promise<unknown>): Promise<void> {
  try {
    await promise;
    throw new Error("attendu: redirect() — rien n'a été levé");
  } catch (err) {
    const digest = (err as { digest?: string }).digest ?? "";
    expect(digest).toContain("NEXT_REDIRECT");
  }
}

afterAll(async () => {
  const [u] = await db.select({ id: users.id }).from(users).where(eq(users.email, EMAIL));
  if (u) await db.delete(reviews).where(eq(reviews.userId, u.id));
  await db.delete(users).where(eq(users.email, EMAIL));
  await db.delete(contactMessages).where(eq(contactMessages.email, CONTACT_EMAIL));
});

describe("inscription + connexion (bout en bout)", () => {
  it("crée un compte membre puis redirige", async () => {
    await expectRedirect(
      registerAction({}, fd({ name: "Vitest Membre", email: EMAIL, password: "motdepasse123", confirmPassword: "motdepasse123", role: "membre" }))
    );
    const [row] = await db.select().from(users).where(eq(users.email, EMAIL));
    expect(row).toBeTruthy();
    expect(row.role).toBe("membre");
    expect(row.passwordHash).not.toContain("motdepasse123"); // jamais en clair
  });

  it("refuse un doublon d'e-mail", async () => {
    const res = await registerAction(
      {},
      fd({ name: "Doublon", email: EMAIL, password: "motdepasse123", confirmPassword: "motdepasse123", role: "membre" })
    );
    expect(res.error).toContain("existe déjà");
  });

  it("refuse un mauvais mot de passe, accepte le bon", async () => {
    const bad = await loginAction({}, fd({ email: EMAIL, password: "mauvais-mdp" }));
    expect(bad.error).toContain("incorrect");
    await expectRedirect(loginAction({}, fd({ email: EMAIL, password: "motdepasse123" })));
  });
});

describe("avis (bout en bout, session issue du login précédent)", () => {
  it("publie un avis puis refuse le doublon", async () => {
    const [seller] = await db.select({ id: sellers.id }).from(sellers).limit(1);
    expect(seller).toBeTruthy();

    const first = await addReviewAction(
      {},
      fd({ sellerId: seller.id, rating: "5", body: "Avis de test d'intégration, nettoyé après coup." })
    );
    expect(first).toEqual({ ok: true });

    const [u] = await db.select({ id: users.id }).from(users).where(eq(users.email, EMAIL));
    const rows = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.sellerId, seller.id), eq(reviews.userId, u.id)));
    expect(rows).toHaveLength(1);
    expect(rows[0].rating).toBe(5);

    const dup = await addReviewAction(
      {},
      fd({ sellerId: seller.id, rating: "4", body: "Deuxième avis qui doit être refusé poliment." })
    );
    expect(dup.error).toContain("déjà");
  });

  it("bloque le brute-force après 5 échecs de connexion", async () => {
    for (let i = 0; i < 5; i++) {
      const res = await loginAction({}, fd({ email: EMAIL, password: "mauvais-mdp" }));
      expect(res.error).toContain("incorrect");
    }
    const blocked = await loginAction({}, fd({ email: EMAIL, password: "mauvais-mdp" }));
    expect(blocked.error).toContain("Trop de tentatives");
  });
});

describe("formulaire de contact (bout en bout)", () => {
  it("enregistre un message valide en base", async () => {
    const res = await sendContactAction(
      {},
      fd({
        firstName: "Vitest",
        lastName: "Intégration",
        email: CONTACT_EMAIL,
        profile: "Acheteur",
        message: "Message de test d'intégration écrit puis nettoyé automatiquement.",
        website: ""
      })
    );
    expect(res).toEqual({ ok: true });
    const rows = await db.select().from(contactMessages).where(eq(contactMessages.email, CONTACT_EMAIL));
    expect(rows).toHaveLength(1);
  });
});

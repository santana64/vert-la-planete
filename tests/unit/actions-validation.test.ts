import { describe, expect, it } from "vitest";
import { loginAction, registerAction } from "@/app/actions/auth";
import { sendContactAction } from "@/app/actions/contact";

/**
 * Chemins de VALIDATION des Server Actions — aucun accès base nécessaire
 * (le parsing échoue avant toute requête, grâce au client DB paresseux).
 */
function fd(entries: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) f.set(k, v);
  return f;
}

describe("registerAction — validation", () => {
  it("rejette un e-mail invalide", async () => {
    const res = await registerAction({}, fd({ name: "Test", email: "pas-un-email", password: "12345678", confirmPassword: "12345678" }));
    expect(res.error).toBeTruthy();
  });

  it("rejette un mot de passe trop court", async () => {
    const res = await registerAction({}, fd({ name: "Test", email: "a@b.fr", password: "court", confirmPassword: "court" }));
    expect(res.error).toContain("8 caractères");
  });

  it("rejette deux mots de passe différents (confirmation 2x)", async () => {
    const res = await registerAction(
      {},
      fd({ name: "Test", email: "a@b.fr", password: "motdepasse123", confirmPassword: "autre-mdp-456" })
    );
    expect(res.error).toContain("ne correspondent pas");
  });
});

describe("loginAction — validation", () => {
  it("rejette un e-mail invalide sans toucher la base", async () => {
    const res = await loginAction({}, fd({ email: "nope", password: "x" }));
    expect(res.error).toBeTruthy();
  });
});

describe("sendContactAction — anti-spam & validation", () => {
  it("le honeypot absorbe le spam sans l'enregistrer (réponse ok factice)", async () => {
    const res = await sendContactAction(
      {},
      fd({
        firstName: "Bot",
        lastName: "Spam",
        email: "bot@spam.io",
        profile: "Autre",
        message: "spam spam spam spam",
        website: "http://spam.io" // champ piège rempli → bot
      })
    );
    expect(res).toEqual({ ok: true });
  });

  it("rejette un message trop court", async () => {
    const res = await sendContactAction(
      {},
      fd({
        firstName: "Marie",
        lastName: "Dupont",
        email: "marie@exemple.fr",
        profile: "Acheteur",
        message: "court",
        website: ""
      })
    );
    expect(res.error).toBeTruthy();
  });
});

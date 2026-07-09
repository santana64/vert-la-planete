import { afterAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { registerAction } from "@/app/actions/auth";
import { createEcoPlaceAction } from "@/app/actions/places";
import { db } from "@/db";
import { ecoPlaces, users } from "@/db/schema";
import { fd } from "../helpers";

const EMAIL = `vitest-places-${Date.now()}@test.local`;

afterAll(async () => {
  const [u] = await db.select({ id: users.id }).from(users).where(eq(users.email, EMAIL));
  if (u) await db.delete(ecoPlaces).where(eq(ecoPlaces.createdBy, u.id));
  await db.delete(users).where(eq(users.email, EMAIL));
});

describe("proposer un lieu (bout en bout)", () => {
  it("crée le compte de session", async () => {
    try {
      await registerAction({}, fd({ name: "Vitest Lieux", email: EMAIL, password: "motdepasse123", confirmPassword: "motdepasse123", role: "membre" }));
    } catch (err) {
      expect((err as { digest?: string }).digest ?? "").toContain("NEXT_REDIRECT");
    }
  });

  it("refuse un lieu sans position sur la carte", async () => {
    const res = await createEcoPlaceAction(
      {},
      fd({
        kind: "ramassage",
        name: "Ramassage test",
        description: "Description suffisamment longue pour le test.",
        city: "Marseille",
        lat: "0",
        lng: "0"
      })
    );
    expect(res.error).toContain("Placez le lieu");
  });

  it("enregistre un lieu valide, visible sur la carte", async () => {
    const res = await createEcoPlaceAction(
      {},
      fd({
        kind: "dechetterie",
        name: "Déchetterie de test vitest",
        description: "Point de collecte créé par le test d'intégration.",
        city: "Marseille",
        schedule: "Lun-Sam 9h-18h",
        lat: "43.2965",
        lng: "5.3698"
      })
    );
    expect(res).toEqual({ ok: true });
    const rows = await db.select().from(ecoPlaces).where(eq(ecoPlaces.name, "Déchetterie de test vitest"));
    expect(rows).toHaveLength(1);
    expect(rows[0].kind).toBe("dechetterie");
  });
});

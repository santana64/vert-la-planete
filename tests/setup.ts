import { vi } from "vitest";
import { config } from "dotenv";

// Charge la config locale (DATABASE_URL, AUTH_SECRET) pour les tests d'intégration.
config({ path: ".env" });
config({ path: ".env.local", override: true });

// `cookies()` de next/headers exige un contexte de requête — on le simule avec
// un simple magasin en mémoire, suffisant pour créer/lire une session en test.
const jar = new Map<string, string>();
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (jar.has(name) ? { name, value: jar.get(name)! } : undefined),
    set: (name: string, value: string) => {
      jar.set(name, value);
    },
    delete: (name: string) => {
      jar.delete(name);
    }
  })
}));

// revalidatePath exige le store de génération statique — no-op en test.
vi.mock("next/cache", () => ({ revalidatePath: () => {} }));

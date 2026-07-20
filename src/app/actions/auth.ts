"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { sellers, users } from "@/db/schema";
import {
  createSession,
  destroySession,
  getCurrentUser,
  hashPassword,
  verifyPassword
} from "@/lib/auth";
import { GRADIENTS } from "@/lib/constants";
import { slugify } from "@/lib/format";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

export type AuthState = { error?: string };

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Nom trop court"),
    email: z.string().trim().toLowerCase().email("Adresse e-mail invalide"),
    password: z.string().min(8, "Minimum 8 caractères"),
    confirmPassword: z.string(),
    role: z.enum(["membre", "partenaire"]).default("membre")
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Les deux mots de passe ne correspondent pas",
    path: ["confirmPassword"]
  });

async function uniqueSellerSlug(base: string): Promise<string> {
  const root = slugify(base) || "partenaire";
  let slug = root;
  let i = 1;
  while (true) {
    const [exists] = await db.select({ id: sellers.id }).from(sellers).where(eq(sellers.slug, slug)).limit(1);
    if (!exists) return slug;
    slug = `${root}-${++i}`;
  }
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword") ?? "",
    role: formData.get("role") ?? "membre"
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }
  const { name, email, password, role } = parsed.data;

  // 3 créations / 15 min par adresse — limite les inscriptions automatisées.
  const limit = checkRateLimit(`register:${email}`, 3, 15 * 60 * 1000);
  if (!limit.allowed) {
    return { error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) return { error: "Un compte existe déjà avec cette adresse." };

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash, role, offer: "gratuit" })
    .returning();

  if (role === "partenaire") {
    const slug = await uniqueSellerSlug(name);
    await db.insert(sellers).values({
      userId: user.id,
      slug,
      name,
      category: "Artisanat local",
      tagline: "Nouveau partenaire engagé sur Vert La Planète",
      description: "Présentez votre démarche écologique, vos produits et votre histoire.",
      city: "France",
      region: "Île-de-France",
      ecoScore: 60,
      verified: false,
      offer: "gratuit",
      logoInitials: name.slice(0, 2).toUpperCase(),
      gradient: GRADIENTS[user.id.charCodeAt(0) % GRADIENTS.length],
      mapX: 50,
      mapY: 50
    });
  }

  await createSession(user.id);
  // Partenaire : accès direct aux offres juste après la création du compte.
  redirect(role === "partenaire" ? "/offres?bienvenue=1" : "/compte");
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide"),
  password: z.string().min(1, "Mot de passe requis")
});

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }
  const { email, password } = parsed.data;

  // 5 tentatives / 10 min par adresse — anti brute-force.
  const limit = checkRateLimit(`login:${email}`, 5, 10 * 60 * 1000);
  if (!limit.allowed) {
    return {
      error: `Trop de tentatives. Réessayez dans ${Math.ceil(limit.retryAfterSec / 60)} min.`
    };
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "E-mail ou mot de passe incorrect." };
  }

  resetRateLimit(`login:${email}`);
  await createSession(user.id, formData.get("remember") === "on");

  const next = formData.get("next");
  // Chemin interne uniquement : commence par "/" mais pas "//" ni "/\" (open redirect).
  const safeNext = typeof next === "string" && /^\/(?![/\\])/.test(next) ? next : null;
  const dest = safeNext ?? (user.role === "partenaire" ? "/espace-partenaire" : "/compte");
  redirect(dest);
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

const sellerSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court"),
  category: z.string().trim().min(2),
  tagline: z.string().trim().min(4, "Décrivez votre activité en une phrase"),
  description: z.string().trim().min(10, "Description trop courte"),
  city: z.string().trim().min(2),
  region: z.string().trim().min(2)
});

/** "Devenir partenaire" — promeut le compte courant et crée sa boutique. */
export async function createSellerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const parsed = sellerSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    city: formData.get("city"),
    region: formData.get("region")
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const [existing] = await db.select({ id: sellers.id }).from(sellers).where(eq(sellers.userId, user.id)).limit(1);
  if (existing) redirect("/espace-partenaire");

  const slug = await uniqueSellerSlug(parsed.data.name);
  await db.insert(sellers).values({
    userId: user.id,
    slug,
    ...parsed.data,
    ecoScore: 60,
    verified: false,
    offer: user.offer,
    logoInitials: parsed.data.name.slice(0, 2).toUpperCase(),
    gradient: GRADIENTS[user.id.charCodeAt(0) % GRADIENTS.length],
    mapX: 30 + (user.id.charCodeAt(1) % 40),
    mapY: 25 + (user.id.charCodeAt(2) % 45)
  });
  await db.update(users).set({ role: "partenaire" }).where(eq(users.id, user.id));
  redirect("/espace-partenaire");
}

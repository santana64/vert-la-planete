import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/db";
import { sellers, users, type Seller, type User } from "@/db/schema";

const SESSION_COOKIE = "vlp_session";
const SESSION_DAYS = 30;

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET is missing or too short (set a long random value).");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSession(userId: string, remember = true): Promise<void> {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // « Se souvenir de moi » : cookie 30 jours ; sinon cookie de session
    // (supprimé à la fermeture du navigateur).
    ...(remember ? { maxAge: SESSION_DAYS * 24 * 60 * 60 } : {})
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const userId = typeof payload.sub === "string" ? payload.sub : null;
    if (!userId) return null;
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return user ?? null;
  } catch {
    return null;
  }
}

export async function requireUser(redirectTo = "/connexion"): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(redirectTo);
  return user;
}

/**
 * Administrateurs = e-mails listés dans ADMIN_EMAILS (séparés par des virgules).
 * Choix volontaire : aucun rôle « admin » en base → impossible de s'auto-promouvoir
 * via l'application. Seule une variable d'environnement (contrôlée par l'hébergeur)
 * accorde l'accès. Insensible à la casse.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.trim().toLowerCase());
}

/**
 * Exige un utilisateur connecté ET administrateur. À appeler dans le layout
 * /admin ET dans chaque action de mutation admin (défense en profondeur —
 * la frontière de sécurité ne repose jamais sur l'UI seule).
 */
export async function requireAdmin(): Promise<User> {
  const user = await requireUser("/connexion?next=/admin");
  if (!isAdminEmail(user.email)) redirect("/");
  return user;
}

export async function getSellerForUser(userId: string): Promise<Seller | null> {
  const [seller] = await db.select().from(sellers).where(eq(sellers.userId, userId)).limit(1);
  return seller ?? null;
}

/** Requires a logged-in user who owns a seller profile; returns both. */
export async function requireSeller(): Promise<{ user: User; seller: Seller }> {
  const user = await requireUser();
  const seller = await getSellerForUser(user.id);
  if (!seller) redirect("/espace-partenaire/creer");
  return { user, seller };
}

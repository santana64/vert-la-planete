import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ACCESS_GATE } from "@/lib/constants";

/**
 * Porte d'entrée du site — demande du Client du 13/08/2026.
 *
 * Tout visiteur non connecté est redirigé vers /bienvenue, où il crée un compte
 * gratuit ou se connecte. Sa destination initiale est conservée dans `next`
 * pour l'y ramener après authentification.
 *
 * RESTENT ACCESSIBLES SANS COMPTE, et ce n'est pas négociable :
 * - les pages légales (mentions, CGV, confidentialité, RGPD) — les rendre
 *   inatteignables serait une infraction, pas un choix commercial ;
 * - /bienvenue, /connexion, /inscription, sans quoi personne ne pourrait entrer ;
 * - les ressources techniques (assets, images, API, robots, plan du site).
 *
 * Le contrôle fait ici est un filtre de CONFORT, pas une frontière de sécurité :
 * il vérifie la signature du jeton, sans consulter la base. Les véritables
 * autorisations restent posées dans chaque page et chaque action serveur
 * (requireUser / requireSeller / requireAdmin) — défense en profondeur.
 *
 * Pour rouvrir le site : ACCESS_GATE.active = false dans constants.ts.
 */

const SESSION_COOKIE = "vlp_session";

/** Chemins toujours ouverts, même sans compte. */
const OPEN_PATHS = [
  "/bienvenue",
  "/connexion",
  "/inscription",
  "/mentions-legales",
  "/cgv",
  "/confidentialite",
  "/rgpd"
];

function isOpen(pathname: string): boolean {
  return OPEN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  if (!ACCESS_GATE.active) return NextResponse.next();

  const { pathname, search } = req.nextUrl;
  if (isOpen(pathname)) return NextResponse.next();
  if (await hasValidSession(req)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/bienvenue";
  url.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  /**
   * Tout sauf les ressources techniques : fichiers Next.js, API (dont le webhook
   * Stripe, qui doit rester joignable), icônes, robots et plan du site, et tout
   * chemin comportant une extension de fichier.
   */
  matcher: ["/((?!_next/|api/|favicon|icon|apple-icon|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.).*)"]
};

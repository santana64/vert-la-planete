import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ACCESS_GATE } from "@/lib/constants";

/**
 * Porte d'entrée du site — demande du Client des 13 et 28/08/2026.
 *
 * AUCUNE page du site n'est accessible sans compte. Tout visiteur non connecté
 * est redirigé vers /bienvenue, quelle que soit l'URL demandée, y compris en
 * arrivant depuis un lien externe ou un moteur de recherche. Sa destination est
 * conservée dans `next` et il y est ramené après authentification.
 *
 * SEULES EXCEPTIONS, et elles ne sont pas négociables :
 * - /bienvenue, /connexion, /inscription — sans quoi personne ne pourrait entrer ;
 * - les pages légales (mentions, CGV, confidentialité, RGPD) — les rendre
 *   inatteignables serait une infraction, pas un choix commercial ;
 * - les ressources techniques : fichiers Next.js, images, robots.txt, plan du
 *   site, et l'API — le webhook Stripe doit rester joignable, sans quoi les
 *   résiliations d'abonnement ne remonteraient plus.
 *
 * CONSÉQUENCE CONNUE ET ASSUMÉE PAR LE CLIENT, consignée ici pour la suite :
 * un moteur de recherche ne peut pas créer de compte. Le site n'est donc plus
 * exploré ni indexé, et les fiches des partenaires Pro ne sont plus visibles des
 * visiteurs de passage — alors que c'est précisément ce que ces partenaires
 * paient 14,90 €/mois. Le Prestataire l'a signalé par écrit à trois reprises
 * avant réalisation ; le Client a maintenu sa demande.
 *
 * Rouvrir le site en cas de chute de fréquentation ou d'abonnements :
 * ACCESS_GATE.active = false dans constants.ts. Aucune autre modification.
 *
 * Le contrôle fait ici vérifie la signature du jeton sans consulter la base :
 * c'est un filtre d'accès, pas une frontière de sécurité. Les autorisations
 * réelles restent posées dans chaque page et chaque action serveur
 * (requireUser / requireSeller / requireAdmin) — défense en profondeur.
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
  /** Tout, sauf les ressources techniques et les fichiers (chemins avec extension). */
  matcher: ["/((?!_next/|api/|favicon|icon|apple-icon|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.).*)"]
};

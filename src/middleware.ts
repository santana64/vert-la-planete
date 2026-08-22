import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ACCESS_GATE } from "@/lib/constants";

/**
 * Porte d'entrée du site — demande du Client du 13/08/2026 : « après le lancement
 * et l'animation du logo, on devrait avoir une page pour l'inscription gratuite ».
 *
 * Le visiteur non connecté qui ARRIVE SUR LE SITE (racine) est envoyé sur
 * /bienvenue pour créer un compte gratuit ou se connecter. C'est bien l'ouverture
 * du site qui est gardée, comme demandé.
 *
 * En revanche les pages elles-mêmes restent atteignables. Trois raisons, dans
 * l'ordre d'importance pour le Client :
 *
 * 1. Les partenaires Pro paient 14,90 €/mois pour être VUS. Rediriger chaque URL
 *    rendrait leurs fiches invisibles aux visiteurs de passage et aux moteurs de
 *    recherche — on leur vendrait une vitrine aux volets fermés.
 * 2. Un lien partagé sur les réseaux ou envoyé par message doit ouvrir la page
 *    annoncée, sinon plus personne ne partage.
 * 3. Un moteur de recherche ne peut pas créer de compte : tout rediriger revient
 *    à sortir le site de Google.
 *
 * Ce qui répond au « ça paraît open bar », ce n'est donc pas de fermer les pages,
 * c'est de réserver aux membres ce qui a de la valeur : joindre un partenaire,
 * enregistrer un favori, laisser un avis, proposer un lieu sur la carte.
 *
 * Pour rouvrir complètement : ACCESS_GATE.active = false dans constants.ts.
 */

const SESSION_COOKIE = "vlp_session";

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
  if (await hasValidSession(req)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/bienvenue";
  url.search = "";
  return NextResponse.redirect(url);
}

/** Uniquement l'arrivée sur le site. Aucune autre URL n'est interceptée. */
export const config = { matcher: ["/"] };

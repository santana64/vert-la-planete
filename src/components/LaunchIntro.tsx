import Image from "next/image";
import { LAUNCH_INTRO } from "@/lib/constants";

/**
 * Animation d'ouverture du site (période de lancement).
 *
 * La chorégraphie transpose le geste du logo — deux mains qui enlacent une
 * planète : le médaillon se pose, deux anneaux tournent en sens inverse autour
 * de lui, une onde part du centre, le nom se dévoile par balayage, puis le voile
 * se lève comme un rideau sur la page déjà rendue dessous.
 *
 * Choix techniques, dans l'ordre d'importance :
 *
 * 1. ZÉRO JavaScript. Tout est en CSS (`animation-fill-mode: forwards`), fidèle à
 *    l'éco-conception revendiquée sur l'accueil et exigée à l'article 12.
 * 2. NON BLOQUANT. `pointer-events: none` dès la première image : le voile ne peut
 *    jamais piéger le visiteur, même si une animation ne se joue pas. La page est
 *    déjà rendue dessous — l'affichage du contenu n'est pas retardé.
 * 3. INVISIBLE POUR LES LECTEURS D'ÉCRAN (`aria-hidden`) : c'est de la décoration,
 *    elle n'a rien à annoncer.
 * 4. RESPECTE `prefers-reduced-motion` : rien n'est affiché pour qui a désactivé
 *    les animations (mal des transports, troubles vestibulaires).
 *
 * En navigation interne Next.js le layout n'est pas remonté : l'animation ne se
 * rejoue donc pas de page en page, seulement à l'arrivée sur le site.
 *
 * Pour la retirer après le lancement : `LAUNCH_INTRO.active = false` dans
 * src/lib/constants.ts. Aucun autre fichier à toucher.
 */
export function LaunchIntro() {
  if (!LAUNCH_INTRO.active) return null;

  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-stage">
        <div className="intro-mark">
          <span className="intro-pulse" />
          <span className="intro-ring intro-ring--a" />
          <span className="intro-ring intro-ring--b" />
          <span className="intro-mark-box">
            <Image
              src="/logo-officiel.jpg"
              alt=""
              width={116}
              height={116}
              className="intro-mark-img"
              priority
            />
            <span className="intro-shine" />
          </span>
        </div>
        <div className="intro-word">
          <span className="intro-word-a">Vert</span>{" "}
          <span className="intro-word-b">La Planète</span>
        </div>
        <div className="intro-tag">{LAUNCH_INTRO.tagline}</div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/Logo";
import { ACCESS_GATE, LAUNCH_INTRO } from "@/lib/constants";

const SESSION_KEY = "vlp_gate_passed";

/**
 * Écran d'inscription à l'arrivée sur le site (demande Client du 13/08/2026).
 *
 * Comportement :
 * - invisible pour un visiteur déjà connecté ;
 * - apparaît une seule fois par session de navigation, après l'animation
 *   d'ouverture, pour ne pas se superposer à elle ;
 * - bloque le défilement tant qu'il est affiché.
 *
 * Choix d'implémentation : le voile est posé CÔTÉ CLIENT, après le rendu. Le
 * HTML envoyé par le serveur reste donc complet — c'est le seul moyen de ne pas
 * priver totalement le site d'indexation, et ça évite aussi de casser les liens
 * profonds : après connexion, le visiteur retombe sur la page qu'il visait.
 *
 * Le risque de référencement reste réel et il est documenté dans ACCESS_GATE.
 * Pour rouvrir le site : `ACCESS_GATE.active = false`, rien d'autre à toucher.
 */
export function AccessGate({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const primaryRef = useRef<HTMLAnchorElement>(null);

  // Les pages d'authentification ne doivent jamais être recouvertes : sinon le
  // visiteur ne peut pas faire ce que le voile lui demande.
  const isAuthRoute = pathname.startsWith("/connexion") || pathname.startsWith("/inscription");

  useEffect(() => {
    if (!ACCESS_GATE.active || isLoggedIn || isAuthRoute) return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;

    // On laisse l'animation d'ouverture se terminer avant d'afficher le voile.
    const delay = LAUNCH_INTRO.active ? 2250 : 250;
    const timer = window.setTimeout(() => setOpen(true), delay);
    return () => window.clearTimeout(timer);
  }, [isLoggedIn, isAuthRoute]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    primaryRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  const next = encodeURIComponent(pathname);

  return (
    <div className="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div className="gate-panel">
        <BrandMark size={54} />
        <h2 className="gate-title" id="gate-title">
          {ACCESS_GATE.title}
        </h2>
        <p className="gate-lead">{ACCESS_GATE.lead}</p>
        <ul className="gate-list">
          {ACCESS_GATE.bullets.map((b) => (
            <li key={b}>
              <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                <path d="M4 12.5l5.2 5L20 6.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {b}
            </li>
          ))}
        </ul>
        <Link
          ref={primaryRef}
          className="btn-cta gate-cta"
          href="/inscription"
          onClick={() => sessionStorage.setItem(SESSION_KEY, "1")}
        >
          Créer mon compte gratuit →
        </Link>
        <Link
          className="gate-alt"
          href={`/connexion?next=${next}`}
          onClick={() => sessionStorage.setItem(SESSION_KEY, "1")}
        >
          J&apos;ai déjà un compte
        </Link>
        <p className="gate-fine">
          Gratuit, sans newsletter imposée et sans traceur publicitaire. Vous restez maître de vos
          données — voir notre <Link href="/rgpd">politique RGPD</Link>.
        </p>
      </div>
    </div>
  );
}

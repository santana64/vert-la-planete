"use client";

import { useEffect, useState } from "react";
import { CO2_COUNTER } from "@/lib/constants";

/** Année civile courante (UTC → identique côté serveur et client, sans figer un millésime). */
function currentYear(): number {
  return new Date().getUTCFullYear();
}

/** Nombre de secondes dans l'année donnée (gère les années bissextiles). */
function secondsInYear(year: number): number {
  return (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / 1000;
}

/** Tonnes de CO₂ émises par la France depuis le 1ᵉʳ janvier de l'année en cours. */
function tonnesSoFar(): number {
  const year = currentYear();
  const start = Date.UTC(year, 0, 1);
  const yearMs = Date.UTC(year + 1, 0, 1) - start;
  const frac = Math.min(Math.max((Date.now() - start) / yearMs, 0), 1);
  return CO2_COUNTER.franceTonnesPerYear * frac;
}

/**
 * Compteur CO₂ « en direct » — 100 % local : AUCUN appel réseau, AUCUNE police
 * ni asset externe, AUCUN traceur. Décor entièrement en CSS.
 *
 * Robustesse :
 *  - SSR neutre : rend « — » (aucune valeur dépendante de l'heure) → zéro
 *    mismatch d'hydratation ; la valeur réelle apparaît puis s'incrémente une
 *    fois par seconde côté client uniquement.
 *  - Année dérivée dynamiquement via getUTCFullYear (identique serveur/client).
 *  - Sous-repère « + X t / seconde » dérivé de secondsInYear(year) : ne dépend
 *    PAS de Date.now → rendu déterministe, sûr dès le SSR.
 *  - Intervalle nettoyé au démontage, mis en pause si l'onglet est masqué,
 *    désactivé en prefers-reduced-motion (valeur figée).
 *
 * NB : « estimation continue » (et non « temps réel ») car il s'agit d'une
 * projection linéaire d'un total annuel, pas d'une mesure instantanée.
 */
export function Co2Counter() {
  const [tonnes, setTonnes] = useState<number | null>(null);
  const [year, setYear] = useState<number>(() => currentYear());
  // Passe à true seulement APRÈS montage → la pastille pulsée n'existe pas au SSR.
  const [live, setLive] = useState<boolean>(false);

  useEffect(() => {
    const tick = () => {
      setTonnes(tonnesSoFar());
      setYear(currentYear());
    };
    tick();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setLive(true);
    const id = window.setInterval(() => {
      if (!document.hidden) tick(); // pause quand l'onglet est masqué
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const display = tonnes === null ? "—" : Math.floor(tonnes).toLocaleString("fr-FR");

  // Débit moyen : déterministe (constante / secondes de l'année) → sûr au SSR.
  const perSecond = Math.round(
    CO2_COUNTER.franceTonnesPerYear / secondsInYear(year)
  ).toLocaleString("fr-FR");

  const ariaLabel =
    tonnes === null
      ? "Compteur des émissions de CO₂ de la France : estimation en cours de chargement"
      : `Émissions de CO₂ de la France depuis le 1ᵉʳ janvier ${year} : environ ${display} tonnes, estimation continue`;

  return (
    <section className="co2-band" aria-label={ariaLabel}>
      {/* Décor 100 % CSS, purement visuel. */}
      <span className="co2-stars" aria-hidden />
      <span className="co2-halo" aria-hidden />

      <div className="co2-band-inner">
        <div className="co2-lead">
          <span className="co2-ico" aria-hidden>
            🌍
          </span>
          <span className={`co2-live${live ? " is-live" : ""}`} aria-hidden>
            <span className="co2-live-dot" />
            en direct
          </span>
        </div>

        <div className="co2-main">
          <p className="co2-num" aria-hidden>
            <span className="co2-num-val" suppressHydrationWarning>
              {display}
            </span>
            <span className="co2-unit">t&nbsp;CO₂</span>
          </p>
          <p className="co2-lbl">
            Émissions de la France depuis le 1ᵉʳ&nbsp;janvier&nbsp;{year}
            <span className="co2-sub">
              {" · "}
              <span className="co2-rate">+&nbsp;{perSecond}&nbsp;t / seconde</span>
              {" · estimation continue"}
            </span>
          </p>
        </div>

        <div className="co2-actions">
          <a
            href={CO2_COUNTER.sourceCompteur}
            target="_blank"
            rel="noreferrer"
            className="co2-btn"
            aria-label="Voir le compteur national sur compteur.net (nouvelle fenêtre)"
          >
            Voir le compteur <span aria-hidden>↗</span>
          </a>
          <a href="#electricite" className="co2-btn co2-btn--ghost">
            L&apos;électricité en direct <span aria-hidden>↓</span>
          </a>
          <span className="co2-eco" aria-hidden>
            éco-conçu · 0&nbsp;tracking
          </span>
        </div>
      </div>
    </section>
  );
}

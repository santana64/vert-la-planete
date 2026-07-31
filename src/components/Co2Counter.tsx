"use client";

import { useEffect, useState } from "react";
import { CO2_COUNTER } from "@/lib/constants";

const YEAR_START = Date.UTC(CO2_COUNTER.year, 0, 1);
const YEAR_MS = Date.UTC(CO2_COUNTER.year + 1, 0, 1) - YEAR_START;

/** Tonnes de CO₂ émises par la France depuis le 1ᵉʳ janvier, au prorata du temps écoulé. */
function tonnesSoFar(): number {
  const frac = Math.min(Math.max((Date.now() - YEAR_START) / YEAR_MS, 0), 1);
  return CO2_COUNTER.franceTonnesPerYear * frac;
}

/**
 * Compteur CO₂ « en direct » — 100 % local (aucun appel réseau, aucun traceur).
 * SSR : rend un tiret (pas de valeur dépendante de l'heure → zéro mismatch
 * d'hydratation) ; la valeur réelle apparaît puis s'incrémente côté client.
 */
export function Co2Counter() {
  const [tonnes, setTonnes] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setTonnes(tonnesSoFar());
    tick();
    // prefers-reduced-motion : valeur figée, pas d'incrément par seconde.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!document.hidden) tick();
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const display = tonnes === null ? "—" : Math.floor(tonnes).toLocaleString("fr-FR");

  return (
    <section className="co2-band" aria-label="Compteur des émissions de CO₂ de la France">
      <div className="co2-band-inner">
        <div className="co2-ico" aria-hidden>
          🌍
        </div>
        <div className="co2-main">
          <div className="co2-num">
            <span suppressHydrationWarning>{display}</span>
            <span className="co2-unit">t&nbsp;CO₂</span>
          </div>
          <div className="co2-lbl">
            Émissions de la France depuis le 1ᵉʳ&nbsp;janvier&nbsp;{CO2_COUNTER.year} · estimation en temps réel
          </div>
        </div>
        <div className="co2-actions">
          <a href={CO2_COUNTER.sourceCompteur} target="_blank" rel="noreferrer" className="co2-btn">
            Voir le compteur ↗
          </a>
          <a href={CO2_COUNTER.sourceRte} target="_blank" rel="noreferrer" className="co2-btn co2-btn--ghost">
            Données RTE ↗
          </a>
        </div>
      </div>
    </section>
  );
}

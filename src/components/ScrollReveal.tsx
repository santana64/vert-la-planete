"use client";

import { useEffect } from "react";

/** Sélecteurs révélés automatiquement (aucun balisage à ajouter dans les pages). */
const AUTO_TARGETS = [
  ".step",
  ".pchip",
  ".art-card",
  ".audience-card",
  ".mission-card",
  ".rcard",
  ".rev-card",
  ".fav-card",
  ".contact-cta",
  ".prd-mini",
  ".mini-cal-card",
  ".kpi-card"
].join(",");

/**
 * Révélation au scroll, montée une seule fois dans le layout.
 * - Sans JavaScript : tout reste visible (la classe rv-ready n'est jamais posée).
 * - prefers-reduced-motion : neutralisé par la règle globale du CSS.
 * - Cascade automatique entre éléments voisins (délai par index).
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("rv-ready");

    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const siblings = el.parentElement
            ? Array.from(el.parentElement.children).filter((c) => seen.has(c) === false && c.matches("[data-rv]"))
            : [];
          const index = Math.max(0, siblings.indexOf(el));
          el.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
          el.classList.add("rv-in");
          seen.add(el);
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    const mark = () => {
      document.querySelectorAll<HTMLElement>(`${AUTO_TARGETS},[data-reveal]`).forEach((el) => {
        if (el.dataset.rv !== undefined) return;
        el.dataset.rv = "";
        observer.observe(el);
      });
    };

    mark();
    // Contenu ajouté après coup (navigation client, cartes chargées dynamiquement).
    const mutations = new MutationObserver(() => mark());
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      root.classList.remove("rv-ready");
    };
  }, []);

  return null;
}

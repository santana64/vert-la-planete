/** Petites icônes en trait fin (stroke currentColor) — cohérentes avec le langage
 *  graphique du site (steps, eco-band). Zéro dépendance, zéro emoji. */

export function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 21s7-5.6 7-11a7 7 0 0 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 20C4 12 9 5 20 4c1 9-4 15-13 16z" />
      <path d="M9 16c2.6-3 5.3-5 8-6" />
    </svg>
  );
}

export function GradIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5 2 9l10 4 10-4-10-4z" />
      <path d="M5 10.6V15c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-4.4" />
      <path d="M22 9v4.2" />
    </svg>
  );
}

export function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
    </svg>
  );
}

/** Tracés (paths) d'icône par catégorie — trait fin, 24×24, monochrome. */
const CATEGORY_PATHS: Record<string, string> = {
  "Alimentation bio":
    "M12 20v-8 M12 13c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5z M12 15c0-3-2.2-5-5.5-5 0 3 2.2 5 5.5 5z",
  "Mode durable": "M12 7a1.5 1.5 0 1 1 1.2 2.4 M12 9.4 4 16h16z",
  "Énergie & habitat":
    "M12 4v2 M12 18v2 M4 12h2 M18 12h2 M6.3 6.3l1.4 1.4 M16.3 16.3l1.4 1.4 M17.7 6.3l-1.4 1.4 M7.7 16.3l-1.4 1.4",
  "Maison & jardin":
    "M8 14h8l-1 6H9z M12 14c0-3.5 2-5.5 5.5-5.5C17.5 12 15.5 14 12 14z M12 14c0-2.5-1.5-4-4.5-4",
  "Cosmétiques naturels":
    "M12 3.5c3.2 4.2 5 6.7 5 9.2a5 5 0 0 1-10 0c0-2.5 1.8-5 5-9.2z M9.5 13a2.5 2.5 0 0 0 2.5 2.5",
  "Zéro déchet":
    "M6 10a6.2 6.2 0 0 1 10.5-3 M18 14a6.2 6.2 0 0 1-10.5 3 M16.5 4.2v3.2h-3.2 M7.5 19.8v-3.2h3.2",
  "Mobilité douce":
    "M6.5 15.5 10 8.5h4l3.5 7 M10 8.5l2 7 M9 8.5h2.5",
  "Artisanat local":
    "M5 9.5h14l-1.3 8.2a1 1 0 0 1-1 .8H7.3a1 1 0 0 1-1-.8z M9 9.5 11 5 M15 9.5 13 5 M9.5 13v2.4 M14.5 13v2.4"
};

/** Icône thématique d'une catégorie (défaut : pousse). Décorative. */
export function CategoryIcon({ category }: { category: string }) {
  const isBike = category === "Mobilité douce";
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {isBike ? (
        <>
          <circle cx="6.5" cy="15.5" r="3.2" />
          <circle cx="17.5" cy="15.5" r="3.2" />
          <path d={CATEGORY_PATHS[category]} />
        </>
      ) : (
        <path d={CATEGORY_PATHS[category] ?? CATEGORY_PATHS["Alimentation bio"]} />
      )}
    </svg>
  );
}

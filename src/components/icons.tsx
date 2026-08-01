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

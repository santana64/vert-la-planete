"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  {
    href: "/",
    label: "Accueil",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
    match: (p: string) => p === "/"
  },
  {
    href: "/partenaires",
    label: "Partenaires",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 7h12l1 13H5L6 7z" />
        <path d="M9 10a3 3 0 0 0 6 0" />
      </svg>
    ),
    match: (p: string) => p === "/partenaires" || p.startsWith("/partenaires/")
  },
  {
    href: "/partenaires#carte",
    label: "Carte",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
        <path d="M9 4v14M15 6v14" />
      </svg>
    ),
    match: () => false
  },
  {
    href: "/actualites",
    label: "Actus",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 9h6M7 13h10" />
      </svg>
    ),
    match: (p: string) => p.startsWith("/actualites")
  },
  {
    href: "/compte",
    label: "Compte",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
      </svg>
    ),
    match: (p: string) => p.startsWith("/compte") || p.startsWith("/espace-partenaire") || p.startsWith("/connexion")
  }
];

export function BottomNav() {
  const pathname = usePathname();
  // Page d'entrée : chaque onglet renverrait ici, la barre n'a rien à proposer.
  if (pathname === "/bienvenue") return null;
  return (
    <div className="bottom-nav">
      {ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`bottom-nav-item${item.match(pathname) ? " active" : ""}`}
        >
          <span className="bottom-nav-item-icon">{item.icon}</span>
          <span className="bottom-nav-item-label">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}

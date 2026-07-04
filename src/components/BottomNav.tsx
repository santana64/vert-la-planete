"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Accueil", icon: "🌿", match: (p: string) => p === "/" },
  { href: "/partenaires", label: "Partenaires", icon: "🛍️", match: (p: string) => p.startsWith("/partenaires") },
  { href: "/actualites", label: "Actus", icon: "📰", match: (p: string) => p.startsWith("/actualites") },
  { href: "/offres", label: "Offres", icon: "✨", match: (p: string) => p.startsWith("/offres") },
  { href: "/compte", label: "Compte", icon: "👤", match: (p: string) => p.startsWith("/compte") || p.startsWith("/espace-partenaire") || p.startsWith("/connexion") }
];

export function BottomNav() {
  const pathname = usePathname();
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

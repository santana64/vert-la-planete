"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

export function DashNav({
  sellerName,
  sellerSlug,
  userName,
  offerLabel
}: {
  sellerName: string;
  sellerSlug: string;
  userName: string;
  offerLabel: string;
}) {
  const pathname = usePathname();

  const items = [
    { href: "/espace-partenaire", label: "Vue d'ensemble", exact: true },
    { href: "/espace-partenaire/produits", label: "Mes produits", exact: false },
    { href: "/espace-partenaire/profil", label: "Ma fiche", exact: false }
  ];

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="dash-nav">
      <div className="dash-nav-top">
        <div className="dash-nav-logo">
          <span className="dash-nav-logo-mark">
            <svg viewBox="0 0 24 24">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            </svg>
          </span>
          Espace partenaire
        </div>
      </div>

      <div className="dash-nav-sec">Ma boutique</div>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`dash-nav-item${isActive(item.href, item.exact) ? " on" : ""}`}
        >
          <span className="dash-nav-dot" />
          {item.label}
        </Link>
      ))}

      <div className="dash-nav-sec">Liens</div>
      <Link href={`/partenaires/${sellerSlug}`} className="dash-nav-item">
        <span className="dash-nav-dot" />
        Voir ma vitrine
      </Link>
      <Link href="/offres" className="dash-nav-item">
        <span className="dash-nav-dot" />
        Mon offre
        <span className="dash-nav-badge">{offerLabel}</span>
      </Link>

      <div className="dash-nav-user">
        <div className="dash-nav-avatar">{userName.slice(0, 2).toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="dash-nav-uname">{sellerName}</div>
          <div className="dash-nav-role">{userName}</div>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="tbl-action" title="Déconnexion">
            ⎋
          </button>
        </form>
      </div>
    </div>
  );
}

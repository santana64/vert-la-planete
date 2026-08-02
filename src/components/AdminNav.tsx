"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

type Counts = {
  partenaires: number;
  membres: number;
  avis: number;
  lieux: number;
  messages: number;
  articles: number;
  emplois: number;
};

const SECTIONS: { title: string; items: { href: string; label: string; key?: keyof Counts; exact?: boolean }[] }[] = [
  {
    title: "Pilotage",
    items: [{ href: "/admin", label: "Tableau de bord", exact: true }]
  },
  {
    title: "Modération",
    items: [
      { href: "/admin/partenaires", label: "Partenaires", key: "partenaires" },
      { href: "/admin/membres", label: "Membres", key: "membres" },
      { href: "/admin/avis", label: "Avis", key: "avis" },
      { href: "/admin/lieux", label: "Lieux proposés", key: "lieux" },
      { href: "/admin/messages", label: "Messages", key: "messages" }
    ]
  },
  {
    title: "Contenus",
    items: [
      { href: "/admin/articles", label: "Actualités", key: "articles" },
      { href: "/admin/emplois", label: "Emplois & formations", key: "emplois" }
    ]
  }
];

export function AdminNav({ userName, counts }: { userName: string; counts: Counts }) {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  return (
    <div className="dash-nav">
      <div className="dash-nav-top">
        <div className="dash-nav-logo">
          <span className="dash-nav-logo-mark">
            <svg viewBox="0 0 24 24">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            </svg>
          </span>
          Espace admin
        </div>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title}>
          <div className="dash-nav-sec">{section.title}</div>
          {section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`dash-nav-item${isActive(item.href, item.exact) ? " on" : ""}`}
            >
              <span className="dash-nav-dot" />
              {item.label}
              {item.key ? <span className="dash-nav-badge">{counts[item.key]}</span> : null}
            </Link>
          ))}
        </div>
      ))}

      <div className="dash-nav-sec">Site</div>
      <Link href="/" className="dash-nav-item">
        <span className="dash-nav-dot" />
        Retour au site
      </Link>

      <div className="dash-nav-user">
        <div className="dash-nav-avatar">{userName.slice(0, 2).toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="dash-nav-uname">Administrateur</div>
          <div className="dash-nav-role">{userName}</div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="tbl-action"
            title="Déconnexion"
            aria-label="Déconnexion"
            style={{ display: "flex", alignItems: "center", padding: "6px 8px" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

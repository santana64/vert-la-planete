"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NavLogo } from "@/components/Logo";
import { logoutAction } from "@/app/actions/auth";

type NavUser = { name: string; role: "membre" | "partenaire" } | null;

const LINKS = [
  { href: "/", label: "Accueil", match: (p: string) => p === "/" },
  { href: "/partenaires", label: "Partenaires", match: (p: string) => p.startsWith("/partenaires") },
  { href: "/actualites", label: "Actualités", match: (p: string) => p.startsWith("/actualites") },
  { href: "/emplois", label: "Emplois & Formations", match: (p: string) => p.startsWith("/emplois") },
  { href: "/offres", label: "Offres", match: (p: string) => p.startsWith("/offres") },
  { href: "/a-propos", label: "À propos", match: (p: string) => p.startsWith("/a-propos") },
  { href: "/contact", label: "Contact", match: (p: string) => p.startsWith("/contact") }
];

export function Nav({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className={`nav${scrolled ? " scrolled" : ""}`} id="main-nav">
        <NavLogo />

        <div className="nav-links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={l.match(pathname) ? "active" : ""}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              {user.role === "partenaire" && (
                <Link href="/espace-partenaire" className="btn-ghost">
                  Espace partenaire
                </Link>
              )}
              <Link href="/compte" className="btn-primary">
                {user.name.split(" ")[0]}
              </Link>
            </>
          ) : (
            <>
              <Link href="/connexion" className="btn-ghost">
                Connexion
              </Link>
              <Link href="/inscription" className="btn-primary">
                Rejoindre
              </Link>
            </>
          )}

          <button
            className={`mob-nav-toggle${drawerOpen ? " open" : ""}`}
            id="mob-toggle"
            aria-label="Menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mob-nav-drawer${drawerOpen ? " open" : ""}`} id="mob-drawer">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={l.match(pathname) ? "active" : ""}>
            {l.label}
          </Link>
        ))}
        <div className="mob-nav-drawer-footer">
          {user ? (
            <>
              <Link href="/compte" className="btn-ghost" style={{ textAlign: "center" }}>
                Mon compte
              </Link>
              <form action={logoutAction} style={{ flex: 1 }}>
                <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                  Déconnexion
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/connexion" className="btn-ghost" style={{ textAlign: "center" }}>
                Connexion
              </Link>
              <Link href="/inscription" className="btn-primary" style={{ textAlign: "center" }}>
                Rejoindre
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

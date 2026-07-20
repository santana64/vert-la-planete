import Link from "next/link";
import { CarteInteractive } from "@/components/map/CarteInteractive";
import { PartnerChip, SectionHead } from "@/components/cards";
import { getCurrentUser } from "@/lib/auth";
import { CATEGORIES, REGIONS } from "@/lib/constants";
import { buildMapPoints } from "@/lib/map-points";
import { listEcoPlaces, listSellers } from "@/lib/queries";
import { buildFilterHref, str } from "@/lib/search-params";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Boutiques partenaires — Vert La Planète",
  alternates: { canonical: "/partenaires" }
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const buildHref = (current: Record<string, string | undefined>, changes: Record<string, string | null>) =>
  buildFilterHref("/partenaires", current, changes);

export default async function PartenairesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const current = { q: str(sp.q), category: str(sp.category), region: str(sp.region) };

  const [sellers, allSellers, places, user] = await Promise.all([
    listSellers(current),
    listSellers(),
    listEcoPlaces(),
    getCurrentUser()
  ]);

  const proSellers = sellers.filter((s) => s.offer !== "gratuit");
  const otherSellers = sellers.filter((s) => s.offer === "gratuit");

  const points = buildMapPoints(allSellers, places);

  return (
    <div className="page active">
      <div className="explorer-header">
        <div className="explorer-header-inner">
          <h1 className="explorer-h1">Boutiques partenaires</h1>
          <p className="explorer-sub">
            Producteurs, artisans et marques engagés — trouvez les acteurs écologiques près de chez
            vous.
          </p>
          <form className="search-wrap" action="/partenaires">
            {current.category ? <input type="hidden" name="category" value={current.category} /> : null}
            {current.region ? <input type="hidden" name="region" value={current.region} /> : null}
            <span className="search-ico">⌕</span>
            <input
              className="search-input"
              type="text"
              name="q"
              defaultValue={current.q ?? ""}
              placeholder="Rechercher un partenaire, une ville, une activité…"
            />
            <button className="search-btn" type="submit">
              Rechercher
            </button>
          </form>
        </div>
      </div>

      {/* PARTENAIRES PRO — mise en avant exclusive */}
      {proSellers.length > 0 ? (
        <div className="section-alt">
          <div className="section" style={{ paddingBottom: 40 }}>
            <SectionHead
              kicker="Sélection Pro"
              title="Nos partenaires"
              em="Pro"
              href="/offres"
              linkLabel="Rejoindre la sélection →"
            />
            <div className="pchips-grid">
              {proSellers.map((seller) => (
                <PartnerChip key={seller.id} seller={seller} />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="explorer-body">
        <aside className="filters-panel">
          <div className="filter-group">
            <div className="filter-title">Catégorie</div>
            <div className="filter-chips">
              <Link className={`fchip${!current.category ? " on" : ""}`} href={buildHref(current, { category: null })}>
                Toutes
              </Link>
              {CATEGORIES.map((c) => (
                <Link key={c} className={`fchip${current.category === c ? " on" : ""}`} href={buildHref(current, { category: c })}>
                  {c}
                </Link>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-title">Région</div>
            <div className="filter-chips">
              <Link className={`fchip${!current.region ? " on" : ""}`} href={buildHref(current, { region: null })}>
                Toutes
              </Link>
              {REGIONS.map((r) => (
                <Link key={r} className={`fchip${current.region === r ? " on" : ""}`} href={buildHref(current, { region: r })}>
                  {r}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div className="results-area">
          <div className="results-topbar">
            <span className="results-count">
              <strong>{sellers.length}</strong> partenaire{sellers.length > 1 ? "s" : ""}
            </span>
            <a href="#carte" className="see-all">
              Voir sur la carte ↓
            </a>
          </div>

          {sellers.length === 0 ? (
            <p style={{ color: "var(--pb)", fontWeight: 300 }}>
              Aucun partenaire ne correspond à votre recherche.
            </p>
          ) : (
            <div className="results-list two-col">
              {(proSellers.length > 0 ? otherSellers : sellers).map((seller) => (
                <Link key={seller.id} href={`/partenaires/${seller.slug}`} className="rcard">
                  <div className="rcard-thumb" style={{ background: seller.gradient }} />
                  <div className="rcard-body">
                    <div className="rcard-hd">
                      <div className="rcard-name">{seller.name}</div>
                      <div className="rcard-dist">{seller.city}</div>
                    </div>
                    <div className="rcard-desc">{seller.tagline}</div>
                    <div className="rcard-tags">
                      <span className="rtag">{seller.category}</span>
                      <span className="rtag">{seller.region}</span>
                    </div>
                  </div>
                  <div className="rcard-act">
                    <span className="btn-sm-outline">Voir →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CARTE INTERACTIVE */}
      <div style={{ background: "#fff" }}>
        <div className="section">
          <div className="kicker">Cartographie de France</div>
          <div className="h2" style={{ marginBottom: 6 }}>
            Agir <em>près de chez vous</em>
          </div>
          <p style={{ fontSize: 14, color: "var(--pb)", fontWeight: 300, marginBottom: 24, maxWidth: 620 }}>
            Partenaires Pro, points de collecte, initiatives urbaines et événements groupés —
            une carte collaborative enrichie par la communauté.
          </p>
          <CarteInteractive points={points} isLoggedIn={Boolean(user)} />
        </div>
      </div>
    </div>
  );
}

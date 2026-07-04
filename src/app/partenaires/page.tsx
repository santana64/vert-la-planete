import Link from "next/link";
import { CarteExplorer, type CarteSeller } from "@/components/CarteExplorer";
import { CATEGORIES, REGIONS } from "@/lib/constants";
import { listSellers } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Boutiques partenaires — Vert La Planète" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function str(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function buildHref(current: Record<string, string | undefined>, changes: Record<string, string | null>) {
  const sp = new URLSearchParams();
  const merged = { ...current };
  for (const [k, v] of Object.entries(changes)) {
    if (v === null) delete merged[k];
    else merged[k] = v;
  }
  for (const [k, v] of Object.entries(merged)) if (v) sp.set(k, v);
  const qs = sp.toString();
  return `/partenaires${qs ? `?${qs}` : ""}`;
}

export default async function PartenairesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const current = { q: str(sp.q), category: str(sp.category), region: str(sp.region) };

  const [sellers, allSellers] = await Promise.all([listSellers(current), listSellers()]);

  const mapped: CarteSeller[] = allSellers.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    category: s.category,
    city: s.city,
    region: s.region,
    tagline: s.tagline,
    gradient: s.gradient,
    mapX: s.mapX,
    mapY: s.mapY,
    verified: s.verified
  }));

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
          </div>

          {sellers.length === 0 ? (
            <p style={{ color: "var(--pb)", fontWeight: 300 }}>
              Aucun partenaire ne correspond à votre recherche.
            </p>
          ) : (
            <div className="results-list">
              {sellers.map((seller) => (
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
                      {seller.offer !== "gratuit" ? <span className="rtag">Pro ✓</span> : null}
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

      <div className="section-alt">
        <div className="section" style={{ paddingBottom: 24 }}>
          <div className="kicker">Cartographie</div>
          <div className="h2">
            Les partenaires <em>près de chez vous</em>
          </div>
        </div>
      </div>
      <CarteExplorer sellers={mapped} />
    </div>
  );
}

import Link from "next/link";
import { HeroMap } from "@/components/HeroMap";
import { OfferCards } from "@/components/OfferCards";
import { formatDate } from "@/lib/format";
import {
  getFeaturedSellers,
  getMarketplaceStats,
  listArticles
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [sellers, stats, articles] = await Promise.all([
    getFeaturedSellers(4),
    getMarketplaceStats(),
    listArticles()
  ]);
  const latestArticles = articles.slice(0, 3);

  return (
    <div className="page active">
      {/* HERO */}
      <section className="hero">
        <div className="hero-grid-bg" />
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              <span>Annuaire écologique & local</span>
            </div>
            <h1 className="hero-h1">
              Le réseau des acteurs
              <br />
              de la <em>transition écologique</em>
            </h1>
            <p className="hero-p">
              Découvrez près de chez vous les producteurs, artisans et marques engagés. Référencez
              votre activité, partagez vos produits et rejoignez une communauté qui consomme
              autrement.
            </p>
            <div className="hero-disclaimer">🌿 Circuits courts · Partenaires vérifiés · Éco-conçu</div>
            <div className="hero-btns">
              <Link className="btn-cta" href="/partenaires">
                Explorer les partenaires →
              </Link>
              <Link className="btn-outline" href="/devenir-partenaire">
                Devenir partenaire
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-val">{stats.sellers}</div>
                <div className="stat-lbl">Partenaires engagés</div>
              </div>
              <div className="stat-item">
                <div className="stat-val">{stats.products}</div>
                <div className="stat-lbl">Produits référencés</div>
              </div>
              <div className="stat-item">
                <div className="stat-val">{stats.regions}</div>
                <div className="stat-lbl">Régions couvertes</div>
              </div>
            </div>
          </div>
          <HeroMap actorCount={stats.sellers} />
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <div style={{ background: "#fff" }}>
        <div className="section">
          <div className="kicker">Comment ça marche</div>
          <div className="h2">
            Agir ensemble, <em>localement</em>
          </div>
          <p style={{ fontSize: 15, color: "var(--pb)", marginTop: 6, fontWeight: 300, maxWidth: 560 }}>
            Une plateforme pour rapprocher citoyens et acteurs écologiques de leur région, en toute
            transparence.
          </p>
          <div className="steps-grid">
            <div className="step">
              <div className="step-n">01</div>
              <div className="step-ico">
                <svg viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <div className="step-h">Découvrir</div>
              <div className="step-p">
                Explorez l&apos;annuaire et la carte pour trouver des partenaires engagés près de
                chez vous.
              </div>
            </div>
            <div className="step">
              <div className="step-n">02</div>
              <div className="step-ico">
                <svg viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <div className="step-h">Se connecter</div>
              <div className="step-p">
                Consultez les fiches, les produits et les démarches écologiques de chaque
                partenaire.
              </div>
            </div>
            <div className="step">
              <div className="step-n">03</div>
              <div className="step-ico">
                <svg viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="step-h">Soutenir</div>
              <div className="step-p">
                Contactez les partenaires en direct et soutenez une économie locale et durable.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PARTENAIRES */}
      <div className="section-alt">
        <div className="section">
          <div className="sec-head">
            <div>
              <div className="kicker">Boutiques partenaires</div>
              <div className="h2">
                Des acteurs <em>engagés</em>
              </div>
            </div>
            <Link className="see-all" href="/partenaires">
              Voir tous les partenaires →
            </Link>
          </div>
          <div className="pchips-grid">
            {sellers.map((seller) => (
              <Link key={seller.id} href={`/partenaires/${seller.slug}`} className="pchip">
                <div className="pchip-logo">{seller.logoInitials}</div>
                <div className="pchip-name">{seller.name}</div>
                <div className="pchip-cat">{seller.category}</div>
                <span className="badge badge-eco">
                  {seller.offer !== "gratuit" ? "Partenaire Pro" : seller.region}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* OFFRES */}
      <div style={{ background: "#fff" }}>
        <div className="section">
          <div className="sec-head">
            <div>
              <div className="kicker">Nos offres</div>
              <div className="h2">
                Référencez votre <em>activité</em>
              </div>
            </div>
            <Link className="see-all" href="/offres">
              Comparer les offres →
            </Link>
          </div>
          <OfferCards currentOffer={null} />
        </div>
      </div>

      {/* ACTUALITÉS */}
      {latestArticles.length > 0 ? (
        <div className="section-alt">
          <div className="section">
            <div className="sec-head">
              <div>
                <div className="kicker">Actualités</div>
                <div className="h2">
                  Contenus & <em>initiatives</em>
                </div>
              </div>
              <Link className="see-all" href="/actualites">
                Voir tout le fil →
              </Link>
            </div>
            <div className="articles-grid">
              {latestArticles.map((a) => (
                <Link key={a.id} href={`/actualites/${a.slug}`} className="art-card">
                  <div className="art-img" style={{ background: a.gradient }} />
                  <div className="art-body">
                    <span className="badge badge-eco">{a.category}</span>
                    <div className="art-title">{a.title}</div>
                    <div className="art-meta">
                      {a.readMinutes} min · {formatDate(a.publishedAt)}
                    </div>
                    <span className="art-read">Lire →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-kicker">Vous produisez, créez, cultivez ?</div>
        <h2 className="cta-h">
          Rejoignez l&apos;annuaire
          <br />
          d&apos;un <em>monde plus vert</em>
        </h2>
        <p className="cta-sub">
          Créez votre fiche partenaire, présentez votre démarche et gagnez en visibilité auprès
          d&apos;une communauté engagée.
        </p>
        <div className="cta-acts">
          <Link className="btn-cta" href="/devenir-partenaire">
            Devenir partenaire →
          </Link>
          <Link className="btn-outline" href="/offres">
            Voir les offres
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { CountUp } from "@/components/CountUp";
import { HomeMap } from "@/components/map/HomeMap";
import { OfferCards } from "@/components/OfferCards";
import { ArticleCard, PartnerChip, SectionHead } from "@/components/cards";
import { ENGAGEMENTS, ENGAGEMENTS_SHORT, LAUNCH_PROMO } from "@/lib/constants";
import { buildMapPoints } from "@/lib/map-points";
import {
  getFeaturedSellers,
  getMarketplaceStats,
  listArticles,
  listEcoPlaces,
  listSellers
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [sellers, stats, articles, allSellers, places] = await Promise.all([
    getFeaturedSellers(4),
    getMarketplaceStats(),
    listArticles(),
    listSellers(),
    listEcoPlaces()
  ]);
  const latestArticles = articles.slice(0, 3);
  const points = buildMapPoints(allSellers, places);

  return (
    <div className="page active">
      {/* HERO */}
      <section className="hero">
        <div className="hero-grid-bg" />
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              <span>Réseau écologique & local</span>
            </div>
            <h1 className="hero-h1">
              Le réseau des acteurs
              <br />
              de la <em>transition écologique</em>
            </h1>
            <p className="hero-p">
              Trouvez près de chez vous les producteurs, artisans, déchetteries, centres
              écologiques et groupes de ramassage de déchets. Un site éco-conçu, sans newsletter
              ni tracking.
            </p>
            <div className="hero-disclaimer">{ENGAGEMENTS_SHORT}</div>
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
                <div className="stat-val">
                  <CountUp value={stats.sellers} />
                </div>
                <div className="stat-lbl">Partenaires engagés</div>
              </div>
              <div className="stat-item">
                <div className="stat-val">
                  <CountUp value={points.length - stats.sellers} />
                </div>
                <div className="stat-lbl">Lieux écologiques</div>
              </div>
              <div className="stat-item">
                <div className="stat-val">
                  <CountUp value={stats.regions} />
                </div>
                <div className="stat-lbl">Régions couvertes</div>
              </div>
            </div>
          </div>
          <HomeMap points={points} actorCount={points.length} />
        </div>
      </section>

      {/* ENGAGEMENTS */}
      <div style={{ background: "#fff" }}>
        <div className="section" style={{ paddingTop: 52, paddingBottom: 52 }}>
          <div className="audience-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginTop: 0 }}>
            {ENGAGEMENTS.map((e) => (
              <div key={e.title} className="audience-card">
                <div className="audience-icon">{e.icon}</div>
                <div className="audience-h">{e.title}</div>
                <div className="audience-p">{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COMMENT ÇA MARCHE */}
      <div className="section-alt">
        <div className="section">
          <SectionHead kicker="Comment ça marche" title="Agir ensemble," em="localement" />
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
                Explorez la carte de France : partenaires engagés, déchetteries, centres
                écologiques et ramassages près de chez vous.
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
              <div className="step-h">Participer</div>
              <div className="step-p">
                Rejoignez un groupe de ramassage, proposez un lieu, laissez un avis — la carte
                est enrichie par la communauté.
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
                Contactez les partenaires en direct et soutenez une économie locale, durable et
                vérifiée.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PARTENAIRES */}
      <div style={{ background: "#fff" }}>
        <div className="section">
          <SectionHead
            kicker="Boutiques partenaires"
            title="Des acteurs"
            em="engagés"
            href="/partenaires"
            linkLabel="Voir tous les partenaires →"
          />
          <div className="pchips-grid">
            {sellers.map((seller) => (
              <PartnerChip key={seller.id} seller={seller} />
            ))}
          </div>
        </div>
      </div>

      {/* OFFRES */}
      <div className="section-alt">
        <div className="section">
          <SectionHead
            kicker="Nos offres"
            title="Référencez votre"
            em="activité"
            href="/offres"
            linkLabel="Comparer les offres →"
          />
          {LAUNCH_PROMO.active ? (
            <p style={{ fontSize: 13, color: "var(--s)", fontWeight: 500, margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span className="badge badge-amber">{LAUNCH_PROMO.badge}</span>
              {LAUNCH_PROMO.short}
            </p>
          ) : null}
          <OfferCards currentOffer={null} />
        </div>
      </div>

      {/* ACTUALITÉS */}
      {latestArticles.length > 0 ? (
        <div style={{ background: "#fff" }}>
          <div className="section">
            <SectionHead
              kicker="Actualités"
              title="Contenus &"
              em="initiatives"
              href="/actualites"
              linkLabel="Voir tout le fil →"
            />
            <div className="articles-grid">
              {latestArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
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

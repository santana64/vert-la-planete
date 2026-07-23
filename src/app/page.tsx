import Link from "next/link";
import { CountUp } from "@/components/CountUp";
import { PartnerChip, SectionHead } from "@/components/cards";
import { ENGAGEMENTS } from "@/lib/constants";
import { KIND_META, type MapPointKind } from "@/lib/places";
import {
  getFeaturedSellers,
  getMarketplaceStats,
  listArticles,
  listEcoPlaces
} from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Les 4 familles d'acteurs de la carte — présentées « en tête » d'accueil. */
const NETWORK: { kind: MapPointKind; desc: string }[] = [
  { kind: "partenaire", desc: "Producteurs, artisans et marques engagées, référencés et vérifiés." },
  { kind: "dechetterie", desc: "Points de collecte et de recyclage près de chez vous." },
  { kind: "centre", desc: "Initiatives citoyennes et projets urbains durables." },
  { kind: "ramassage", desc: "Événements et actions de ramassage organisés en groupe." }
];

export default async function HomePage() {
  const [sellers, stats, articles, places] = await Promise.all([
    getFeaturedSellers(4),
    getMarketplaceStats(),
    listArticles(),
    listEcoPlaces()
  ]);
  const latestArticles = articles.slice(0, 3);

  return (
    <div className="page active">
      {/* HERO — carte déplacée dans le menu (« Carte »), accueil allégé */}
      <section className="hero">
        <div className="hero-grid-bg" />
        <div className="hero-inner hero-inner--solo">
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
            <p className="hero-p" style={{ marginBottom: 28 }}>
              La carte de France des acteurs engagés : trouvez qui agit près de chez vous,
              participez aux initiatives de la communauté et soutenez l&apos;économie locale.
            </p>
            <div className="hero-btns">
              <Link className="btn-cta" href="/partenaires#carte">
                Voir la carte →
              </Link>
              <Link className="btn-outline" href="/lieux/proposer">
                ＋ Proposer un lieu
              </Link>
            </div>
            <div className="hero-stats hero-stats--row">
              <div className="stat-item">
                <div className="stat-val">
                  <CountUp value={stats.sellers} />
                </div>
                <div className="stat-lbl">Partenaires</div>
              </div>
              <div className="stat-sep" aria-hidden />
              <div className="stat-item">
                <div className="stat-val">
                  <CountUp value={places.length} />
                </div>
                <div className="stat-lbl">Lieux écolo</div>
              </div>
              <div className="stat-sep" aria-hidden />
              <div className="stat-item">
                <div className="stat-val">
                  <CountUp value={stats.regions} />
                </div>
                <div className="stat-lbl">Régions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RÉSEAU — les familles d'acteurs, en tête */}
      <div style={{ background: "#fff" }}>
        <div className="section" style={{ paddingTop: 46, paddingBottom: 46 }}>
          <SectionHead
            kicker="Le réseau"
            title="Quatre familles"
            em="d'acteurs"
            href="/partenaires#carte"
            linkLabel="Explorer la carte →"
          />
          <div className="audience-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginTop: 0 }}>
            {NETWORK.map(({ kind, desc }) => (
              <Link key={kind} href="/partenaires#carte" className="audience-card" data-reveal style={{ textAlign: "left" }}>
                <div className="audience-icon" style={{ background: `${KIND_META[kind].color}14`, color: KIND_META[kind].color }}>
                  {KIND_META[kind].icon}
                </div>
                <div className="audience-h">{KIND_META[kind].label}</div>
                <div className="audience-p">{desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* À PROPOS — bref */}
      <div className="section-alt">
        <div className="section" style={{ maxWidth: 760, textAlign: "center" }}>
          <div className="kicker" style={{ justifyContent: "center" }}>À propos</div>
          <h2 className="h2" style={{ marginBottom: 14 }}>
            Rendre visibles les <em>acteurs écologiques</em>
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--pb)", fontWeight: 300, margin: "0 auto 22px" }}>
            Vert La Planète rassemble producteurs, artisans, marques engagées, points de collecte
            et initiatives citoyennes sur une carte de France. Chaque acteur présente sa démarche —
            on vous met en relation directe, en circuit court, sans intermédiaire.
          </p>
          <Link className="see-all" href="/a-propos" style={{ justifyContent: "center" }}>
            Découvrir notre mission →
          </Link>
        </div>
      </div>

      {/* SITE ÉCO — juste sous l'à-propos */}
      <div style={{ background: "#fff" }}>
        <div className="section" style={{ paddingTop: 52, paddingBottom: 52 }}>
          <SectionHead kicker="Nos engagements" title="Un site" em="éco-responsable" />
          <div className="audience-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginTop: 0 }}>
            {ENGAGEMENTS.map((e) => (
              <div key={e.title} className="audience-card" data-reveal>
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
                Parcourez l&apos;annuaire et la carte interactive pour repérer les acteurs
                écologiques autour de vous, filtrés par type de lieu.
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

      {/* PARTENAIRES — deux colonnes + voir tout */}
      <div style={{ background: "#fff" }}>
        <div className="section">
          <SectionHead
            kicker="Boutiques partenaires"
            title="Des acteurs"
            em="engagés"
            href="/partenaires"
            linkLabel="Voir tous les partenaires →"
          />
          <div className="pchips-grid pchips-grid--two">
            {sellers.map((seller) => (
              <PartnerChip key={seller.id} seller={seller} />
            ))}
          </div>
        </div>
      </div>

      {/* ACTUALITÉS — juste un lien */}
      {latestArticles.length > 0 ? (
        <div className="section-alt">
          <div className="section" style={{ paddingTop: 40, paddingBottom: 40 }}>
            <SectionHead
              kicker="Actualités"
              title="Contenus &"
              em="initiatives"
              href="/actualites"
              linkLabel="Voir tout le fil d'actualités →"
            />
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

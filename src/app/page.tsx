import Image from "next/image";
import Link from "next/link";
import { Co2Chart } from "@/components/Co2Chart";
import { Co2Counter } from "@/components/Co2Counter";
import { CountUp } from "@/components/CountUp";
import { PartnerChip, SectionHead } from "@/components/cards";
import { ADEME_TOOLS, ENGAGEMENTS_SHORT } from "@/lib/constants";
import { KIND_META, type MapPointKind } from "@/lib/places";
import {
  getFeaturedSellers,
  getMarketplaceStats,
  listArticles,
  listEcoPlaces
} from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Chiffres relevés sur le panneau de plantation photographié (bloc « Territoires »). */
const COMMUNES_STATS = [
  { n: "370", label: "arbres plantés" },
  { n: "7 500", label: "plantes vivaces" },
  { n: "20 350", label: "arbustes" }
];

/** Mosaïque du bloc « Territoires » — trois clichés pris dans l'espace public. */
const COMMUNES_PHOTOS = [
  {
    src: "/photos/communes-plantation.jpg",
    w: 948,
    h: 711,
    alt: "Panneau au bord d'une avenue : « Ici la Communauté d'Agglomération a planté 370 arbres, 7 500 plantes vivaces, 20 350 arbustes »",
    titre: "Planter, à l'échelle d'une avenue",
    legende: "Une agglomération replante ses axes routiers et l'affiche au bord de la route."
  },
  {
    src: "/photos/communes-gestion-nature.jpg",
    w: 1271,
    h: 953,
    alt: "Panneau « Gestion différenciée — nature préservée » planté sur un talus laissé en végétation libre",
    titre: "Tondre moins, laisser vivre",
    legende: "La gestion différenciée : un talus non fauché abrite insectes, oiseaux et fleurs sauvages."
  },
  {
    src: "/photos/climat-bandes-co2.jpg",
    w: 900,
    h: 675,
    alt: "Bandes colorées peintes au sol sur un quai, avec une dalle gravée « 1865 — CO₂ = 287 ppm »",
    titre: "Le climat peint au sol",
    legende: "Une bande par année depuis 1865. La dalle indique 287 ppm de CO₂ — on dépasse 420 aujourd'hui."
  }
];

/** Les 4 familles d'acteurs de la carte — chacune renvoie vers la page concernée. */
const NETWORK: { kind: MapPointKind; desc: string; href: string }[] = [
  { kind: "partenaire", desc: "Producteurs, artisans et marques engagées, référencés et vérifiés.", href: "/partenaires" },
  { kind: "dechetterie", desc: "Points de collecte et de recyclage près de chez vous.", href: "/partenaires#carte" },
  { kind: "centre", desc: "Initiatives citoyennes et projets urbains durables.", href: "/partenaires#carte" },
  { kind: "ramassage", desc: "Événements et actions de ramassage organisés en groupe.", href: "/partenaires#carte" }
];

export default async function HomePage() {
  const [sellers, stats, articles, places] = await Promise.all([
    getFeaturedSellers(6),
    getMarketplaceStats(),
    listArticles(),
    listEcoPlaces()
  ]);
  const latestArticles = articles.slice(0, 3);

  return (
    <div className="page active">
      {/* COMPTEUR CO₂ « en direct » — en tête (calcul local, 0 traceur) */}
      <Co2Counter />

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
              Le réseau des acteurs de la
              <br />
              <em>transition écologique</em>
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
                <div className="stat-lbl">Partenaires engagés</div>
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
            <p className="hero-eco-line">{ENGAGEMENTS_SHORT}</p>
          </div>
        </div>
      </section>

      {/* RÉSEAU — les familles d'acteurs, chacune vers sa page */}
      <div style={{ background: "#fff" }}>
        <div className="section section--compact">
          <SectionHead
            kicker="Le réseau"
            title="Quatre familles"
            em="d'acteurs"
            href="/partenaires#carte"
            linkLabel="Explorer la carte →"
          />
          <div className="audience-grid audience-grid--four">
            {NETWORK.map(({ kind, desc, href }) => (
              <Link key={kind} href={href} className="audience-card audience-card--link" data-reveal style={{ textAlign: "left" }}>
                <div className="audience-icon" style={{ background: `${KIND_META[kind].color}14`, color: KIND_META[kind].color }}>
                  {KIND_META[kind].icon}
                </div>
                <div className="audience-h">{KIND_META[kind].label}</div>
                <div className="audience-p">{desc}</div>
                <span className="audience-go">Découvrir →</span>
              </Link>
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

      {/* GRAPHIQUE CO₂ 24 h — fetch serveur caché 1 h, SVG inline, 0 traceur */}
      <Co2Chart />

      {/* OUTILS ADEME — mesurer son impact (liens externes) */}
      <div style={{ background: "#fff" }}>
        <div className="section section--compact">
          <SectionHead kicker="Passez à l'action" title="Mesurez votre" em="impact" />
          <div className="ademe-grid">
            {ADEME_TOOLS.map((tool) => (
              <a key={tool.href} href={tool.href} target="_blank" rel="noreferrer" className="ademe-card" data-reveal>
                <div className="ademe-ico">{tool.icon}</div>
                <div className="ademe-body">
                  <div className="ademe-h">{tool.title}</div>
                  <div className="ademe-p">{tool.desc}</div>
                  <span className="ademe-cta">{tool.cta} ↗</span>
                </div>
              </a>
            ))}
          </div>
          <p className="ademe-note">Outils gratuits proposés par l&apos;ADEME — ils s&apos;ouvrent sur un site externe.</p>
        </div>
      </div>

      {/* COMMUNES & AGGLOMÉRATIONS — photos de terrain fournies par le client.
          Les légendes nomment la collectivité photographiée : ce sont des clichés
          pris dans l'espace public, pas des partenariats. */}
      <div className="topic-sec--alt">
        <div className="section section--compact">
          <SectionHead
            kicker="Territoires"
            title="Les communes"
            em="s'engagent"
            href="/contact"
            linkLabel="Parler d'un partenariat →"
          />
          {/* Les chiffres du panneau photographié, sortis de l'image : lisibles à
              l'écran, indexables, et accessibles aux lecteurs d'écran. */}
          <div className="communes-stats">
            {COMMUNES_STATS.map((s) => (
              <div key={s.label} className="communes-stat" data-reveal>
                <span className="communes-stat-n">{s.n}</span>
                <span className="communes-stat-l">{s.label}</span>
              </div>
            ))}
          </div>
          <p className="communes-stat-src">
            Relevé sur une seule avenue — Communauté d&apos;Agglomération de La Rochelle.
          </p>

          <div className="pmosaic">
            {COMMUNES_PHOTOS.map((p) => (
              <figure key={p.src} className="ptile" data-reveal>
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.w}
                  height={p.h}
                  sizes="(max-width: 560px) 100vw, (max-width: 960px) 50vw, 33vw"
                />
                <figcaption>
                  <b>{p.titre}</b>
                  {p.legende}
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="communes-note">
            Les collectivités sont devenues les premiers acteurs de la transition sur le terrain :
            plantations, désimperméabilisation des sols, gestion différenciée des espaces verts,
            pistes cyclables, points de collecte. Ces chantiers ne se voient qu&apos;au détour
            d&apos;un panneau — les rendre visibles, c&apos;est déjà les encourager.
          </p>
          <div className="communes-acts">
            <Link className="btn-outline" href="/mobilite-verte">
              Mobilité verte
            </Link>
            <Link className="btn-outline" href="/recyclage">
              Recyclage &amp; réemploi
            </Link>
          </div>
        </div>
      </div>

      {/* PARTENAIRES — deux colonnes + voir tout */}
      <div className="section-alt">
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
        <div style={{ background: "#fff" }}>
          <div className="section section--compact">
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
          <Link className="btn-outline btn-offers" href="/offres">
            ✨ Voir les offres
          </Link>
        </div>
      </div>
    </div>
  );
}

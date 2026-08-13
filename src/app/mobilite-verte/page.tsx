import Image from "next/image";
import Link from "next/link";
import { SectionHead } from "@/components/cards";

export const metadata = {
  title: "Mobilité verte — se déplacer sans peser sur le climat",
  description:
    "Vélo, transports collectifs, autopartage, poids lourds électriques : les solutions de mobilité bas-carbone et les acteurs qui les portent près de chez vous.",
  alternates: { canonical: "/mobilite-verte" }
};

/**
 * Page thématique « Mobilité verte ».
 *
 * Contenu entièrement en dur : aucune requête en base, donc aucune latence de
 * données et aucune panne possible côté contenu. (La page reste rendue à la
 * demande, comme tout le site, parce que le layout lit la session pour la barre
 * de navigation.) Les photos viennent du Client et passent par next/image —
 * redimensionnement et formats modernes automatiques, cf. article 12.
 */

const LEVIERS = [
  {
    h: "Le vélo, d'abord",
    p: "La moitié des trajets en voiture font moins de 5 km. Sur cette distance, le vélo est souvent plus rapide en ville — et un vélo à assistance électrique efface le relief comme la fatigue. Location longue durée, vélo-cargo pour les familles et les artisans, ateliers de réparation : les solutions existent déjà, presque partout.",
    ico: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17" r="3.5" />
        <circle cx="18.5" cy="17" r="3.5" />
        <path d="M5.5 17 9 8h5l3.5 9M9 8l-1-3H6.5M14 8h3" />
      </svg>
    )
  },
  {
    h: "Les transports collectifs",
    p: "Un bus rempli, c'est une trentaine de voitures en moins. De plus en plus de réseaux roulent au biocarburant, au biogaz issu de déchets ou à l'électrique. À l'échelle d'une agglomération, c'est le levier qui déplace le plus de monde pour le moins d'émissions.",
    ico: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="13" rx="2.5" />
        <path d="M3 10h18M7.5 16v3M16.5 16v3" />
        <circle cx="7.5" cy="13" r=".6" fill="currentColor" />
        <circle cx="16.5" cy="13" r=".6" fill="currentColor" />
      </svg>
    )
  },
  {
    h: "Partager la voiture",
    p: "Une voiture particulière passe environ 95 % de son temps à l'arrêt. L'autopartage et le covoiturage du quotidien attaquent directement ce gâchis : moins de véhicules produits, moins de places de stationnement, moins de bitume — et un budget transport qui s'allège nettement.",
    ico: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 16v-3l2-5h13l2 5v3" />
        <path d="M2.5 16h19M6 16v2.5M18 16v2.5" />
        <circle cx="7" cy="12.5" r=".7" fill="currentColor" />
        <circle cx="17" cy="12.5" r=".7" fill="currentColor" />
      </svg>
    )
  },
  {
    h: "Le dernier kilomètre",
    p: "Les livraisons urbaines pèsent lourd dans la circulation et la pollution des centres-villes. Utilitaires électriques, poids lourds hybrides, rétrofit de flottes existantes, cyclologistique : les artisans et commerçants qui franchissent le pas allègent la facture énergétique de tout un quartier.",
    ico: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 6.5h11v10h-11z" />
        <path d="M13.5 10h4l3 3.2v3.3h-7z" />
        <circle cx="6.5" cy="18" r="1.8" />
        <circle cx="17" cy="18" r="1.8" />
      </svg>
    )
  }
];

export default function MobiliteVertePage() {
  return (
    <div className="page active">
      <section className="topic-hero">
        <div className="topic-hero-inner">
          <div>
            <div className="kicker">Mobilité verte</div>
            <h1 className="topic-h">
              Se déplacer sans <em>peser sur le climat</em>
            </h1>
            <p className="topic-p topic-lead">
              Les transports sont le premier poste d&apos;émissions de gaz à effet de serre en
              France — près d&apos;un tiers du total. C&apos;est aussi celui sur lequel chacun a le
              plus de prise au quotidien.
            </p>
            <p className="topic-p">
              Changer de mobilité ne veut pas dire renoncer à se déplacer. Cela veut dire choisir,
              pour chaque trajet, le mode le plus sobre qui fait le travail. Voici les quatre
              leviers qui comptent vraiment, et les acteurs qui les rendent accessibles près de
              chez vous.
            </p>
            <div className="hero-btns" style={{ marginTop: 24 }}>
              <Link className="btn-cta" href="/partenaires?category=Mobilit%C3%A9%20douce">
                Les acteurs de la mobilité →
              </Link>
              <Link className="btn-outline" href="/partenaires#carte">
                Voir la carte
              </Link>
            </div>
          </div>
          <figure className="topic-figure">
            <Image
              src="/photos/mobilite-velo.jpg"
              alt="Dépliant de location de vélos tenu à la main, au-dessus d'une piste cyclable marquée au sol"
              width={900}
              height={1125}
              sizes="(max-width: 960px) 100vw, 42vw"
              priority
            />
            <figcaption>
              Location de vélos et piste cyclable urbaine — La Rochelle. Le service de location
              courte durée est souvent la première marche vers un changement d&apos;habitude.
            </figcaption>
          </figure>
        </div>
      </section>

      <div style={{ background: "#fff" }}>
        <div className="topic-sec">
          <SectionHead kicker="Les leviers" title="Quatre façons de" em="changer d'échelle" />
          <div className="topic-grid">
            {LEVIERS.map((l) => (
              <article key={l.h} className="topic-card" data-reveal>
                <div className="topic-card-ico">{l.ico}</div>
                <h2 className="topic-card-h">{l.h}</h2>
                <p className="topic-card-p">{l.p}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <section className="topic-band">
        <Image
          src="/photos/marais-littoral.jpg"
          alt="Marais littoral bordé d'arbres, avec des habitations au loin"
          width={1900}
          height={814}
          sizes="100vw"
        />
        <div className="topic-band-body">
          <h2 className="topic-band-h">Ce que la route traverse</h2>
          <p className="topic-band-p">
            Chaque axe routier coupe un milieu vivant. Marais, haies, zones humides : ces espaces
            stockent du carbone, filtrent l&apos;eau et abritent une part considérable de la
            biodiversité. Réduire le trafic, ce n&apos;est pas seulement réduire le CO₂ —
            c&apos;est aussi laisser ces milieux respirer.
          </p>
          <div className="topic-band-cap">Marais littoral en bordure d&apos;agglomération.</div>
        </div>
      </section>

      <div className="topic-sec--alt">
        <div className="topic-sec">
          <SectionHead kicker="Des repères" title="Quelques ordres de" em="grandeur" small />
          <div className="topic-stats">
            <div className="topic-stat" data-reveal>
              <div className="topic-stat-n">~1/3</div>
              <div className="topic-stat-l">
                des émissions françaises de gaz à effet de serre proviennent des transports
              </div>
            </div>
            <div className="topic-stat" data-reveal>
              <div className="topic-stat-n">&lt; 5 km</div>
              <div className="topic-stat-l">
                pour environ la moitié des trajets effectués en voiture
              </div>
            </div>
            <div className="topic-stat" data-reveal>
              <div className="topic-stat-n">95 %</div>
              <div className="topic-stat-l">
                du temps, une voiture particulière reste stationnée
              </div>
            </div>
          </div>
          <p className="topic-src">
            Ordres de grandeur issus des publications publiques de l&apos;ADEME et du ministère de
            la Transition écologique. Pour mesurer précisément vos propres trajets, les
            calculateurs officiels sont accessibles depuis la page d&apos;accueil.
          </p>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-kicker">Vous proposez une solution de mobilité ?</div>
        <h2 className="cta-h">
          Réparateur, loueur, garage,
          <br />
          <em>collectivité</em>
        </h2>
        <p className="cta-sub">
          Référencez votre activité dans l&apos;annuaire pour être trouvé par celles et ceux qui
          cherchent une alternative près de chez eux.
        </p>
        <div className="cta-acts">
          <Link className="btn-cta" href="/devenir-partenaire">
            Devenir partenaire →
          </Link>
          <Link className="btn-outline" href="/lieux/proposer">
            Proposer un lieu sur la carte
          </Link>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { SectionHead } from "@/components/cards";

export const metadata = {
  title: "Recyclage & réemploi — donner une seconde vie",
  description:
    "Boîtes à docs et à livres, vrac et consigne, recycleries, points de collecte : les gestes du réemploi et les lieux où les pratiquer près de chez vous.",
  alternates: { canonical: "/recyclage" }
};

/**
 * Page thématique « Recyclage & réemploi ».
 *
 * Contenu entièrement en dur : aucune requête en base, donc aucune latence de
 * données et aucune panne possible côté contenu. (La page reste rendue à la
 * demande, comme tout le site, parce que le layout lit la session pour la barre
 * de navigation.) Photos fournies par le Client, servies via next/image.
 */

const GESTES = [
  {
    h: "Le réemploi avant le recyclage",
    p: "Recycler consomme de l'énergie : il faut collecter, trier, broyer, refondre. Réemployer n'en consomme presque aucune. Un objet qui repart chez quelqu'un d'autre en l'état est toujours le meilleur scénario — c'est la logique des boîtes à dons, des ressourceries et du don entre voisins.",
    ico: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.5 14.6 8h-5.2z" />
        <path d="M4.6 16.5 7.2 12l2.6 4.5z" />
        <path d="M19.4 16.5 16.8 12l-2.6 4.5z" />
        <path d="M6.5 19.5h11" />
        <path d="M4.6 16.5h4.4M19.4 16.5H15" />
      </svg>
    )
  },
  {
    h: "Boîtes à docs, boîtes à livres",
    p: "Une étagère en bois, posée dans un hall ou sur une place : on dépose ce qu'on n'utilise plus, on prend ce qui sert. Papier déjà imprimé d'un côté, livres lus, cartes et guides de l'autre. Le dispositif ne coûte presque rien à installer et fonctionne sans surveillance — sa force est là.",
    ico: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3.5" width="16" height="17" rx="1.6" />
        <path d="M4 9h16M4 14.5h16M9.5 3.5v17" />
      </svg>
    )
  },
  {
    h: "Le vrac et la consigne",
    p: "L'emballage le plus vertueux est celui qu'on ne produit pas. Acheter en vrac avec ses propres contenants supprime le problème à la source ; la consigne, elle, fait revenir le contenant pour qu'il resserve des dizaines de fois. Les deux se pratiquent déjà chez de nombreux commerçants de proximité.",
    ico: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6v2.5l2.4 3.2v10.1a1.6 1.6 0 0 1-1.6 1.6H8.2a1.6 1.6 0 0 1-1.6-1.6V8.7L9 5.5z" />
        <path d="M6.6 12.5h10.8" />
      </svg>
    )
  },
  {
    h: "Trier ce qui reste",
    p: "Une fois le réemploi épuisé, le tri devient utile — à condition d'être juste. Déchetteries, points d'apport volontaire, collectes spécifiques pour les piles, textiles, huiles ou appareils électriques : chaque flux mal orienté dégrade toute une benne. Savoir où déposer quoi fait la différence.",
    ico: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 7h14l-1.1 12.1a1.6 1.6 0 0 1-1.6 1.4H7.7a1.6 1.6 0 0 1-1.6-1.4z" />
        <path d="M3.5 7h17M9.5 4h5M10 11v6M14 11v6" />
      </svg>
    )
  }
];

/** Points de dépôt — chaque carte renvoie vers la carte ou l'annuaire filtré. */
const OU_DEPOSER = [
  {
    h: "Les points de collecte",
    p: "Déchetteries, bornes textiles, collecte des piles et des appareils électriques : la carte les recense au fil des signalements de la communauté.",
    href: "/partenaires#carte",
    ico: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.6" />
      </svg>
    )
  },
  {
    h: "Les commerçants du vrac",
    p: "Épiceries en vrac, consigne, réparateurs et ressourceries référencés dans l'annuaire, avec leur démarche et leur contact direct.",
    href: "/partenaires?category=Z%C3%A9ro%20d%C3%A9chet",
    ico: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8h16l-1.2 11.2a1.6 1.6 0 0 1-1.6 1.4H6.8a1.6 1.6 0 0 1-1.6-1.4z" />
        <path d="M8.6 8V6.2a3.4 3.4 0 0 1 6.8 0V8" />
      </svg>
    )
  },
  {
    h: "Signaler un lieu",
    p: "Une boîte à livres au coin de la rue, un composteur de quartier, une recyclerie ? Ajoutez-la : elle servira à tous vos voisins.",
    href: "/lieux/proposer",
    ico: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8.6" />
        <path d="M12 8.2v7.6M8.2 12h7.6" />
      </svg>
    )
  },
  {
    h: "Mesurer avant d'agir",
    p: "Les calculateurs publics de l'ADEME, accessibles depuis l'accueil, chiffrent l'impact réel de chaque geste — utile pour prioriser.",
    href: "/",
    ico: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="2.4" />
        <path d="M7.6 15.4V11M12 15.4V8.2M16.4 15.4v-2.6" />
      </svg>
    )
  }
];

export default function RecyclagePage() {
  return (
    <div className="page active">
      <section className="topic-hero">
        <div className="topic-hero-inner">
          <div>
            <div className="kicker">Recyclage &amp; réemploi</div>
            <h1 className="topic-h">
              Rien ne se perd, <em>tout se transmet</em>
            </h1>
            <p className="topic-p topic-lead">
              Le meilleur déchet est celui qui n&apos;existe pas. Le deuxième meilleur est celui
              qui repart chez quelqu&apos;un d&apos;autre, tel quel.
            </p>
            <p className="topic-p">
              Avant de penser bac de tri, il y a tout un espace d&apos;actions plus simples et plus
              efficaces : donner, réparer, emprunter, acheter sans emballage. Ce sont des gestes
              modestes, qui ne demandent aucun équipement — seulement de savoir où aller.
            </p>
            <div className="hero-btns" style={{ marginTop: 24 }}>
              <Link className="btn-cta" href="/partenaires?category=Z%C3%A9ro%20d%C3%A9chet">
                Les acteurs du zéro déchet →
              </Link>
              <Link className="btn-outline" href="/partenaires#carte">
                Trouver un point de collecte
              </Link>
            </div>
          </div>
          <figure className="topic-figure">
            <Image
              src="/photos/recyclage-boite-a-docs.jpg"
              alt="Meuble en bois recyclé intitulé « Boîte à docs », invitant à déposer et reprendre des documents"
              width={900}
              height={1125}
              sizes="(max-width: 960px) 100vw, 42vw"
              priority
            />
            <figcaption>
              « Boîte à docs » — donnez une seconde vie à vos documents. Le meuble lui-même est
              fabriqué en panneaux de bois recyclé.
            </figcaption>
          </figure>
        </div>
      </section>

      <div style={{ background: "#fff" }}>
        <div className="topic-sec">
          <SectionHead kicker="Les gestes" title="Dans l'ordre" em="d'efficacité" />
          <div className="topic-grid">
            {GESTES.map((g) => (
              <article key={g.h} className="topic-card" data-reveal>
                <div className="topic-card-ico">{g.ico}</div>
                <h2 className="topic-card-h">{g.h}</h2>
                <p className="topic-card-p">{g.p}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <section className="topic-band">
        <Image
          src="/photos/marais-village.jpg"
          alt="Zone humide préservée en lisière d'un village"
          width={1900}
          height={814}
          sizes="100vw"
        />
        <div className="topic-band-body">
          <h2 className="topic-band-h">Là où finit ce qu&apos;on jette</h2>
          <p className="topic-band-p">
            Un déchet abandonné ne disparaît pas : il descend. Fossé, cours d&apos;eau, zone
            humide, estuaire, puis la mer. Les plastiques qui arrivent à l&apos;océan viennent en
            grande majorité des terres. C&apos;est très en amont, dans nos gestes de tous les
            jours, que se joue ce qui échoue sur les plages.
          </p>
          <div className="topic-band-cap">Zone humide en lisière d&apos;agglomération.</div>
        </div>
      </section>

      <div className="topic-sec--alt">
        <div className="topic-sec">
          <SectionHead kicker="En pratique" title="Où déposer" em="près de chez vous" small />
          <p className="topic-p" style={{ marginTop: 4 }}>
            Le bon geste dépend surtout d&apos;une chose : savoir où aller. La carte recense les
            lieux signalés par la communauté, et chacun peut en ajouter.
          </p>
          <div className="topic-grid">
            {OU_DEPOSER.map((o) => (
              <Link key={o.h} href={o.href} className="topic-card" data-reveal>
                <div className="topic-card-ico">{o.ico}</div>
                <h2 className="topic-card-h">{o.h}</h2>
                <p className="topic-card-p">{o.p}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-kicker">Vous connaissez un point de collecte ?</div>
        <h2 className="cta-h">
          Ajoutez-le à la carte,
          <br />
          <em>il servira à tout le monde</em>
        </h2>
        <p className="cta-sub">
          Boîte à livres, recyclerie, déchetterie, composteur de quartier : chaque lieu signalé
          rend le réemploi un peu plus facile pour vos voisins.
        </p>
        <div className="cta-acts">
          <Link className="btn-cta" href="/lieux/proposer">
            Proposer un lieu →
          </Link>
          <Link className="btn-outline" href="/devenir-partenaire">
            Devenir partenaire
          </Link>
        </div>
      </div>
    </div>
  );
}

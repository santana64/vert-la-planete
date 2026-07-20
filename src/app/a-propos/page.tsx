import Link from "next/link";

export const metadata = {
  title: "À propos — Vert La Planète",
  alternates: { canonical: "/a-propos" }
};

export default function AProposPage() {
  return (
    <div className="page active">
      <div className="about-hero">
        <div className="about-hero-inner">
          <div>
            <div className="kicker">Notre mission</div>
            <h1 className="about-h">
              Rendre visibles les <em>acteurs écologiques</em>
            </h1>
            <p className="about-p">
              Vert La Planète est le réseau des acteurs de la transition écologique en France :
              un annuaire et une carte qui rassemblent producteurs, artisans, marques engagées,
              points de collecte et initiatives citoyennes.
            </p>
            <p className="about-p">
              Chaque partenaire présente sa démarche et son score écologique. On vous met en
              relation directe avec lui — sans intermédiaire, en circuit court, en toute
              transparence.
            </p>
            <div className="about-no-ai">
              <div className="about-no-ai-icon">🌍</div>
              <div>
                <div className="about-no-ai-text">Circuits courts &amp; démarches vérifiées</div>
                <div className="about-no-ai-sub">
                  Des partenaires sélectionnés pour leur engagement réel.
                </div>
              </div>
            </div>
          </div>
          <div className="founder-card">
            <div className="founder-avatar">VP</div>
            <div className="founder-name">Un réseau engagé</div>
            <div className="founder-title">Pour consommer mieux, près de chez soi</div>
            <p className="founder-bio">
              Nous croyons que trouver et soutenir les acteurs écologiques doit être simple. Vert
              La Planète les réunit en un seul endroit et leur donne les moyens de gagner en
              visibilité auprès d&apos;une communauté qui veut agir.
            </p>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff" }}>
        <div className="section">
          <div className="kicker">Nos engagements</div>
          <div className="h2">
            Ce qui nous <em>guide</em>
          </div>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">🤝</div>
              <div className="mission-h">Mise en relation directe</div>
              <p className="mission-p">
                Zéro intermédiaire : vous contactez les partenaires en direct, ils gardent le lien
                avec leur communauté.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">🌿</div>
              <div className="mission-h">Démarches vérifiées</div>
              <p className="mission-p">
                Chaque fiche affiche un score écologique et des critères d&apos;engagement, pour
                s&apos;orienter en confiance.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">📍</div>
              <div className="mission-h">Ancrage local</div>
              <p className="mission-p">
                Une carte de France pour découvrir les acteurs et initiatives écologiques de votre
                région.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">♻️</div>
              <div className="mission-h">Éco-conception</div>
              <p className="mission-p">
                Un site sobre et léger, sans newsletter imposée ni tracking publicitaire — à
                l&apos;image de nos valeurs.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-kicker">Rejoignez le mouvement</div>
        <h2 className="cta-h">
          Agissez, <em>localement</em>
        </h2>
        <p className="cta-sub">
          Explorez la carte des acteurs près de chez vous, ou référencez votre activité pour
          gagner en visibilité.
        </p>
        <div className="cta-acts">
          <Link className="btn-cta" href="/partenaires">
            Explorer la carte →
          </Link>
          <Link className="btn-outline" href="/devenir-partenaire">
            Devenir partenaire
          </Link>
        </div>
      </div>
    </div>
  );
}

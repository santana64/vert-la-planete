import Link from "next/link";

export const metadata = { title: "À propos — Vert La Planète" };

export default function AProposPage() {
  return (
    <div className="page active">
      <div className="about-hero">
        <div className="about-hero-inner">
          <div>
            <div className="kicker">Notre mission</div>
            <h1 className="about-h">
              Rapprocher les acheteurs des <em>acteurs écologiques</em>
            </h1>
            <p className="about-p">
              Vert La Planète est une marketplace qui met en relation directe les consommateurs
              avec les producteurs, artisans et marques engagés. Sans intermédiaire, en circuit
              court, et en toute transparence.
            </p>
            <p className="about-p">
              Chaque vendeur présente sa démarche et son score écologique. Chaque achat soutient
              une économie locale et durable.
            </p>
            <div className="about-no-ai">
              <div className="about-no-ai-icon">🌍</div>
              <div>
                <div className="about-no-ai-text">Circuits courts &amp; démarches vérifiées</div>
                <div className="about-no-ai-sub">
                  Des vendeurs sélectionnés pour leur engagement réel.
                </div>
              </div>
            </div>
          </div>
          <div className="founder-card">
            <div className="founder-avatar">VP</div>
            <div className="founder-name">Une marketplace engagée</div>
            <div className="founder-title">Pour consommer mieux, près de chez soi</div>
            <p className="founder-bio">
              Nous croyons qu&apos;acheter responsable doit être simple. Vert La Planète réunit en
              un seul endroit les meilleurs produits écologiques de France, et donne aux petits
              producteurs les moyens de vendre en direct.
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
              <div className="mission-h">Vente directe</div>
              <p className="mission-p">
                Zéro intermédiaire : les vendeurs fixent leurs prix et gardent le lien avec leurs
                clients.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">🌿</div>
              <div className="mission-h">Démarches vérifiées</div>
              <p className="mission-p">
                Chaque boutique affiche son score écologique et ses labels, pour acheter en
                confiance.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">📍</div>
              <div className="mission-h">Ancrage local</div>
              <p className="mission-p">
                Une cartographie pour découvrir les acteurs écologiques de votre région.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">♻️</div>
              <div className="mission-h">Consommation durable</div>
              <p className="mission-p">
                Des produits pensés pour durer, réduire les déchets et respecter le vivant.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-kicker">Rejoignez le mouvement</div>
        <h2 className="cta-h">
          Achetez ou vendez <em>autrement</em>
        </h2>
        <p className="cta-sub">
          Découvrez des centaines de produits écologiques, ou ouvrez votre boutique en quelques
          minutes.
        </p>
        <div className="cta-acts">
          <Link className="btn-cta" href="/partenaires">
            Explorer les partenaires →
          </Link>
          <Link className="btn-outline" href="/devenir-partenaire">
            Devenir partenaire
          </Link>
        </div>
      </div>
    </div>
  );
}

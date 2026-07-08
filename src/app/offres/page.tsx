import { OfferCards } from "@/components/OfferCards";
import { getCurrentUser } from "@/lib/auth";
import { LAUNCH_PROMO } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata = { title: "Offres & tarifs — Vert La Planète" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function OffresPage({ searchParams }: { searchParams: SearchParams }) {
  const [user, sp] = await Promise.all([getCurrentUser(), searchParams]);
  const justRegistered = sp.bienvenue === "1";

  return (
    <div className="page active">
      <div className="about-hero" style={{ paddingBottom: 48 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", textAlign: "center" }}>
          <div className="kicker" style={{ justifyContent: "center" }}>
            Offres partenaires
          </div>
          <h1 className="about-h" style={{ maxWidth: 720, margin: "0 auto" }}>
            Gagnez en visibilité, <em>à votre rythme</em>
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--pb)",
              fontWeight: 300,
              maxWidth: 560,
              margin: "12px auto 0",
              lineHeight: 1.75
            }}
          >
            Référencez votre activité gratuitement, puis passez à l&apos;offre Pro quand vous
            voulez. Sans engagement pour l&apos;offre mensuelle, résiliable à tout moment.
          </p>
        </div>
      </div>

      <div style={{ background: "#fff" }}>
        <div className="section">
          {justRegistered ? (
            <div className="eco-band" style={{ marginBottom: 20, borderColor: "var(--l)", background: "var(--fo)" }} role="status">
              <div style={{ fontSize: 26 }}>🎉</div>
              <div>
                <div className="eco-h">Votre compte partenaire est créé !</div>
                <div className="eco-s">
                  Dernière étape : choisissez votre offre ci-dessous pour activer votre visibilité
                  — l&apos;offre Gratuite suffit pour démarrer.
                </div>
              </div>
              <div className="eco-vrf">Étape 2/2</div>
            </div>
          ) : null}
          {LAUNCH_PROMO.active ? (
            <div
              className="eco-band"
              style={{ marginBottom: 28, borderColor: "var(--l)" }}
            >
              <div className="eco-ico" aria-hidden>
                <svg viewBox="0 0 24 24">
                  <path d="M12 2l2.9 6.26L21 9.27l-4.5 4.38L17.8 20 12 16.9 6.2 20l1.3-6.35L3 9.27l6.1-1.01L12 2z" />
                </svg>
              </div>
              <div>
                <div className="eco-h">
                  {LAUNCH_PROMO.badge} — {LAUNCH_PROMO.title}
                </div>
                <div className="eco-s">{LAUNCH_PROMO.detail}</div>
              </div>
              <div className="eco-vrf">Lancement 🌱</div>
            </div>
          ) : null}
          <OfferCards currentOffer={user ? user.offer : null} />

          {/* Comparatif détaillé */}
          <div className="table-card" style={{ marginTop: 40, maxWidth: 860, marginLeft: "auto", marginRight: "auto" }}>
            <div className="table-card-hd">
              <span className="table-card-title">Ce que chaque offre comprend, en détail</span>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ce que vous obtenez</th>
                  <th style={{ textAlign: "center" }}>Gratuit</th>
                  <th style={{ textAlign: "center" }}>Pro Mensuel</th>
                  <th style={{ textAlign: "center" }}>Pro Annuel</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Fiche boutique complète (présentation, avis, contact)", "✓", "✓", "✓"],
                  ["Visible dans l'annuaire et sur la carte de France", "✓", "✓", "✓"],
                  ["Produits présentés sur votre fiche", "3 max", "Illimités", "Illimités"],
                  ["Affiché en premier (section « Partenaires Pro »)", "—", "✓", "✓"],
                  ["Badge « ★ Partenaire Pro »", "—", "✓", "✓"],
                  ["Prix", "0 €", "14,90 €/mois", "118,80 €/an (≈ 9,90 €/mois)"],
                  ["Engagement", "Aucun", "Aucun — résiliable à tout moment", "12 mois"]
                ].map(([label, a, b, c]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td style={{ textAlign: "center", color: a === "—" ? "var(--sd)" : "var(--s)", fontWeight: 500 }}>{a}</td>
                    <td style={{ textAlign: "center", color: b === "—" ? "var(--sd)" : "var(--s)", fontWeight: 500 }}>{b}</td>
                    <td style={{ textAlign: "center", color: c === "—" ? "var(--sd)" : "var(--s)", fontWeight: 500 }}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 12, color: "var(--sd)", fontWeight: 300, marginTop: 24, textAlign: "center" }}>
            Paiement sécurisé par Stripe · TVA non applicable, art. 293 B du CGI · Résiliation en
            ligne.
          </p>
        </div>
      </div>
    </div>
  );
}

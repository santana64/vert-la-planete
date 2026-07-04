import { OfferCards } from "@/components/OfferCards";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Offres & tarifs — Vert La Planète" };

export default async function OffresPage() {
  const user = await getCurrentUser();

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
          <OfferCards currentOffer={user ? user.offer : null} />
          <p style={{ fontSize: 12, color: "var(--sd)", fontWeight: 300, marginTop: 24, textAlign: "center" }}>
            Paiement sécurisé par Stripe · TVA non applicable, art. 293 B du CGI · Résiliation en
            ligne.
          </p>
        </div>
      </div>
    </div>
  );
}

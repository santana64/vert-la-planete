import Link from "next/link";
import { CreateSellerForm } from "@/components/CreateSellerForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getCurrentUser, getSellerForUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Devenir partenaire — Vert La Planète" };

export default async function DevenirPartenairePage() {
  const user = await getCurrentUser();
  const seller = user ? await getSellerForUser(user.id) : null;

  return (
    <div className="page active">
      <div className="about-hero">
        <div className="about-hero-inner">
          <div>
            <div className="kicker">Devenir partenaire</div>
            <h1 className="about-h">
              Référencez votre activité <em>écologique</em>
            </h1>
            <p className="about-p">
              Rejoignez l&apos;annuaire Vert La Planète : créez votre fiche, présentez vos produits
              et votre démarche, et gagnez en visibilité auprès d&apos;une communauté engagée.
            </p>
            <div className="audience-grid" style={{ marginTop: 8 }}>
              <div className="audience-card">
                <div className="audience-icon">🪧</div>
                <div className="audience-h">Une fiche dédiée</div>
                <div className="audience-p">Présentez votre histoire, vos produits et votre localisation.</div>
              </div>
              <div className="audience-card">
                <div className="audience-icon">📈</div>
                <div className="audience-h">De la visibilité</div>
                <div className="audience-p">Apparaissez dans l&apos;annuaire et sur la carte des partenaires.</div>
              </div>
              <div className="audience-card">
                <div className="audience-icon">🌱</div>
                <div className="audience-h">Gratuit pour démarrer</div>
                <div className="audience-p">
                  Commencez gratuitement, passez à l&apos;offre <Link href="/offres" style={{ color: "var(--s)" }}>Pro</Link> quand vous voulez.
                </div>
              </div>
            </div>
          </div>

          <div className="founder-card">
            {seller ? (
              <>
                <div className="founder-name" style={{ fontSize: 20 }}>
                  Vous êtes déjà partenaire 🎉
                </div>
                <p className="founder-bio" style={{ marginBottom: 16 }}>
                  Gérez votre boutique et vos produits depuis votre espace.
                </p>
                <Link href="/espace-partenaire" className="btn-cta" style={{ justifyContent: "center" }}>
                  Aller à mon espace →
                </Link>
              </>
            ) : user ? (
              <>
                <div className="contact-form-h" style={{ marginBottom: 6 }}>
                  Créez votre boutique
                </div>
                <p className="contact-form-sub">Quelques informations et votre fiche est en ligne.</p>
                <CreateSellerForm />
              </>
            ) : (
              <>
                <div className="contact-form-h" style={{ marginBottom: 6 }}>
                  Créer mon compte partenaire
                </div>
                <p className="contact-form-sub">
                  Déjà inscrit ? <Link href="/connexion" style={{ color: "var(--s)" }}>Connectez-vous</Link>.
                </p>
                <RegisterForm initialRole="partenaire" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

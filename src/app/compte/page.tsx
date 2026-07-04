import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { getSellerForUser, requireUser } from "@/lib/auth";
import { OFFERS } from "@/lib/constants";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ComptePage() {
  const user = await requireUser();
  const seller = await getSellerForUser(user.id);
  const offer = OFFERS.find((o) => o.key === user.offer);

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="page active">
      <div className="profil-hero">
        <div className="profil-hero-inner">
          <div className="p-av">{initials}</div>
          <div className="p-info">
            <div className="p-name">{user.name}</div>
            <div className="p-email">
              {user.email} · {user.role === "partenaire" ? "Partenaire" : "Membre"} depuis{" "}
              {formatDate(user.createdAt)}
            </div>
            <div className="p-stats">
              <div className="ps">
                <div className="ps-val">{offer?.name ?? "Gratuit"}</div>
                <div className="ps-lbl">Offre</div>
              </div>
              <div className="ps">
                <div className="ps-val">{user.role === "partenaire" ? "Oui" : "Non"}</div>
                <div className="ps-lbl">Partenaire</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {seller ? (
              <Link href="/espace-partenaire" className="btn-sm-outline">
                Espace partenaire →
              </Link>
            ) : (
              <Link href="/devenir-partenaire" className="btn-sm-outline">
                Devenir partenaire
              </Link>
            )}
            <form action={logoutAction}>
              <button type="submit" className="btn-sm-outline">
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="profil-body">
        <div className="kicker">Mon compte</div>
        <div className="h2" style={{ fontSize: 26, marginBottom: 24 }}>
          Informations <em>du compte</em>
        </div>

        <div className="dash-2col">
          <div className="mini-cal-card">
            <div className="activity-title">Mon offre</div>
            <p style={{ fontSize: 14, color: "var(--pb)", fontWeight: 300, lineHeight: 1.7 }}>
              Offre actuelle : <strong style={{ color: "var(--f)" }}>{offer?.name ?? "Gratuit"}</strong>
              {" — "}
              {offer?.tagline}
            </p>
            <div style={{ marginTop: 14 }}>
              <Link href="/offres" className="btn-sm-outline">
                Voir / changer d&apos;offre →
              </Link>
            </div>
          </div>

          <div className="mini-cal-card">
            <div className="activity-title">
              {seller ? "Ma boutique partenaire" : "Devenir partenaire"}
            </div>
            <p style={{ fontSize: 14, color: "var(--pb)", fontWeight: 300, lineHeight: 1.7 }}>
              {seller
                ? "Gérez votre fiche et vos produits depuis votre espace partenaire."
                : "Référencez votre activité écologique et gagnez en visibilité."}
            </p>
            <div style={{ marginTop: 14 }}>
              <Link href={seller ? "/espace-partenaire" : "/devenir-partenaire"} className="btn-sm-outline">
                {seller ? "Ouvrir mon espace →" : "Créer ma fiche →"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

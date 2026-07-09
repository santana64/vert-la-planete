import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { AvatarUpload } from "@/components/AvatarUpload";
import { BillingPortalButton } from "@/components/BillingPortalButton";
import { getSellerForUser, requireUser } from "@/lib/auth";
import { OFFERS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { kindLabel } from "@/lib/places";
import { getUserFavoriteSellers, getUserPublications } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mon compte",
  robots: { index: false, follow: false }
};

export default async function ComptePage() {
  const user = await requireUser();
  const [seller, favoris, publications] = await Promise.all([
    getSellerForUser(user.id),
    getUserFavoriteSellers(user.id),
    getUserPublications(user.id)
  ]);
  const offer = OFFERS.find((o) => o.key === user.offer);

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const publicationCount = publications.places.length + publications.reviews.length;

  return (
    <div className="page active">
      <div className="profil-hero">
        <div className="profil-hero-inner">
          <AvatarUpload initials={initials} avatarUrl={user.avatarUrl} />
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
                <div className="ps-val">{favoris.length}</div>
                <div className="ps-lbl">Favoris</div>
              </div>
              <div className="ps">
                <div className="ps-val">{publicationCount}</div>
                <div className="ps-lbl">Publications</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
        {/* MES AVANTAGES */}
        <div className="kicker">Mes avantages</div>
        <div className="h2" style={{ fontSize: 26, marginBottom: 20 }}>
          Ce que votre offre <em>vous apporte</em>
        </div>
        <div className="dash-2col" style={{ marginBottom: 40 }}>
          <div className="mini-cal-card" style={{ borderColor: offer?.highlight ? "var(--l)" : undefined }}>
            <div className="activity-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {user.offer !== "gratuit" ? "★" : "🌱"} Offre {offer?.name ?? "Gratuit"}
              {user.offer !== "gratuit" ? <span className="badge badge-amber">Pro</span> : null}
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, margin: "6px 0 0" }}>
              {(offer?.features ?? []).map((f) => (
                <li key={f} style={{ fontSize: 13, color: "var(--st)", fontWeight: 300, display: "flex", gap: 8 }}>
                  <span style={{ color: "var(--s)", fontWeight: 500 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="mini-cal-card">
            <div className="activity-title">
              {user.offer === "gratuit" ? "Passez à l'offre Pro" : "Gérer mon offre"}
            </div>
            <p style={{ fontSize: 13, color: "var(--pb)", fontWeight: 300, lineHeight: 1.7 }}>
              {user.offer === "gratuit"
                ? "Produits illimités, mise en avant en tête d'annuaire et badge « ★ Partenaire Pro » — dès 9,90 €/mois en annuel."
                : "Changez d'offre, mettez à jour votre moyen de paiement ou résiliez à tout moment."}
            </p>
            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/offres" className="btn-sm-outline">
                Voir les offres →
              </Link>
            </div>
          </div>
        </div>

        {/* TRANSACTIONS / FACTURES / MOYEN DE PAIEMENT */}
        <div className="kicker">Paiements</div>
        <div className="h2" style={{ fontSize: 26, marginBottom: 20 }}>
          Mes transactions & <em>factures</em>
        </div>
        <div className="dash-2col" style={{ marginBottom: 40 }}>
          <div className="mini-cal-card">
            <div className="activity-title">🧾 Mes achats, transactions et factures</div>
            <p style={{ fontSize: 13, color: "var(--pb)", fontWeight: 300, lineHeight: 1.7, marginBottom: 14 }}>
              {user.stripeSubscriptionId
                ? "Retrouvez l'historique complet de vos paiements et téléchargez vos factures."
                : "Aucune transaction pour le moment — vos factures d'abonnement apparaîtront ici."}
            </p>
            <BillingPortalButton label="Voir mes factures →" />
          </div>
          <div className="mini-cal-card">
            <div className="activity-title">💳 Mon moyen de paiement</div>
            <p style={{ fontSize: 13, color: "var(--pb)", fontWeight: 300, lineHeight: 1.7, marginBottom: 14 }}>
              Ajoutez ou remplacez votre carte en toute sécurité — géré par Stripe, rien n&apos;est
              stocké sur nos serveurs.
            </p>
            <BillingPortalButton label="Gérer mon moyen de paiement →" />
          </div>
        </div>

        {/* MES FAVORIS */}
        <div className="kicker">Mes favoris</div>
        <div className="h2" style={{ fontSize: 26, marginBottom: 24 }}>
          Partenaires <em>sauvegardés</em>
        </div>
        <div className="favs-grid" style={{ marginBottom: 40 }}>
          {favoris.map((s) => (
            <Link key={s.id} href={`/partenaires/${s.slug}`} className="fav-card">
              <div className="fav-img" style={{ background: s.gradient }} />
              <div className="fav-body">
                <div className="fav-name">{s.name}</div>
                <div className="fav-cat">
                  {s.category} · {s.city}
                </div>
              </div>
            </Link>
          ))}
          <Link href="/partenaires" className="fav-add fav-card">
            <div className="fav-add-icon">＋</div>
            <div className="fav-add-lbl">Explorer les partenaires</div>
          </Link>
        </div>

        {/* MES PUBLICATIONS */}
        <div className="kicker">Mes publications</div>
        <div className="h2" style={{ fontSize: 26, marginBottom: 24 }}>
          Avis & lieux <em>partagés</em>
        </div>
        {publicationCount === 0 ? (
          <p style={{ color: "var(--pb)", fontWeight: 300, marginBottom: 12 }}>
            Vous n&apos;avez encore rien publié.{" "}
            <Link href="/partenaires" style={{ color: "var(--s)" }}>
              Laissez un avis
            </Link>{" "}
            ou{" "}
            <Link href="/lieux/proposer" style={{ color: "var(--s)" }}>
              proposez un lieu sur la carte →
            </Link>
          </p>
        ) : (
          <div className="dash-2col">
            {publications.reviews.map((r) => (
              <div key={r.id} className="rev-card">
                <div className="rev-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                <div className="rev-txt">{r.body}</div>
                <div className="rev-auth">
                  Avis sur{" "}
                  <Link href={`/partenaires/${r.sellerSlug}`} style={{ color: "var(--s)" }}>
                    {r.sellerName}
                  </Link>{" "}
                  · {formatDate(r.createdAt)}
                </div>
              </div>
            ))}
            {publications.places.map((p) => (
              <div key={p.id} className="rev-card">
                <div style={{ fontSize: 12, color: "var(--s)", fontWeight: 500, marginBottom: 6 }}>
                  {kindLabel(p.kind)} · {p.city}
                </div>
                <div className="rev-txt" style={{ fontWeight: 500, color: "var(--f)" }}>{p.name}</div>
                <div className="rev-auth">
                  Publié le {formatDate(p.createdAt)} ·{" "}
                  <Link href="/partenaires#carte" style={{ color: "var(--s)" }}>
                    Voir sur la carte →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

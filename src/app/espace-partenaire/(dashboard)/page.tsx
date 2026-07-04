import Link from "next/link";
import { requireSeller } from "@/lib/auth";
import { FREE_PRODUCT_LIMIT, OFFERS } from "@/lib/constants";
import { getSellerProductCount } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PartnerHomePage() {
  const { seller } = await requireSeller();
  const productCount = await getSellerProductCount(seller.id);
  const offer = OFFERS.find((o) => o.key === seller.offer);
  const isFree = seller.offer === "gratuit";
  const remaining = Math.max(0, FREE_PRODUCT_LIMIT - productCount);

  return (
    <>
      <div className="dash-page-hd">
        <div>
          <div className="dash-page-title">Bonjour, {seller.name}</div>
          <div className="dash-page-date">Votre espace partenaire</div>
        </div>
        <Link href="/espace-partenaire/produits/nouveau" className="btn-add">
          + Ajouter un produit
        </Link>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="kpi-card">
          <div className="kpi-lbl">Offre</div>
          <div className="kpi-val" style={{ fontSize: 22 }}>{offer?.name ?? "Gratuit"}</div>
          <div className="kpi-trend">
            <Link href="/offres" style={{ color: "var(--s)" }}>
              {isFree ? "Passer à Pro →" : "Gérer mon offre →"}
            </Link>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-lbl">Produits publiés</div>
          <div className="kpi-val">{productCount}</div>
          <div className="kpi-trend">{isFree ? `${remaining} restant(s) en gratuit` : "Illimité"}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-lbl">Statut de la fiche</div>
          <div className="kpi-val" style={{ fontSize: 22 }}>
            {seller.verified ? "Vérifiée" : "En cours"}
          </div>
          <div className="kpi-trend">
            <Link href={`/partenaires/${seller.slug}`} style={{ color: "var(--s)" }}>
              Voir ma vitrine →
            </Link>
          </div>
        </div>
      </div>

      {isFree ? (
        <div
          className="chart-card"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}
        >
          <div>
            <div className="chart-card-title">Passez à l&apos;offre Pro</div>
            <p style={{ fontSize: 13, color: "var(--pb)", fontWeight: 300, marginTop: 4 }}>
              Produits illimités, mise en avant dans l&apos;annuaire et badge « Partenaire Pro ».
            </p>
          </div>
          <Link href="/offres" className="btn-cta">
            Découvrir les offres →
          </Link>
        </div>
      ) : null}

      <div className="table-card">
        <div className="table-card-hd">
          <span className="table-card-title">Raccourcis</span>
        </div>
        <div style={{ padding: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/espace-partenaire/produits" className="btn-sm-outline">
            Gérer mes produits
          </Link>
          <Link href="/espace-partenaire/profil" className="btn-sm-outline">
            Modifier ma fiche
          </Link>
          <Link href={`/partenaires/${seller.slug}`} className="btn-sm-outline">
            Voir ma page publique
          </Link>
        </div>
      </div>
    </>
  );
}

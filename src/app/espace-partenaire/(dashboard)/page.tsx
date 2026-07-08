import Link from "next/link";
import { requireSeller } from "@/lib/auth";
import { FREE_PRODUCT_LIMIT, OFFERS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { getPartnerNotifications, getSellerProductCount } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PartnerNotificationsPage() {
  const { seller } = await requireSeller();
  const [notifications, productCount] = await Promise.all([
    getPartnerNotifications(seller),
    getSellerProductCount(seller.id)
  ]);
  const offer = OFFERS.find((o) => o.key === seller.offer);
  const isFree = seller.offer === "gratuit";

  return (
    <>
      <div className="dash-page-hd">
        <div>
          <div className="dash-page-title">Notifications</div>
          <div className="dash-page-date">
            {notifications.length} notification{notifications.length > 1 ? "s" : ""}
          </div>
        </div>
        <Link href="/espace-partenaire/produits/nouveau" className="btn-add">
          + Ajouter un produit
        </Link>
      </div>

      {/* NOTIFICATIONS */}
      <div className="activity-card" style={{ marginBottom: 20 }}>
        {notifications.map((n) => (
          <div key={n.id} className="af-item" style={{ padding: "12px 0" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
            <div style={{ flex: 1 }}>
              <div className="af-txt" style={{ fontWeight: 500, color: "var(--f)" }}>{n.title}</div>
              <div className="af-txt">{n.body}</div>
              <div className="af-time">{formatDate(n.date)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* RACCOURCIS + VUE D'ENSEMBLE INTÉGRÉE */}
      <div className="table-card">
        <div className="table-card-hd">
          <span className="table-card-title">Raccourcis & vue d&apos;ensemble</span>
          <Link href={`/partenaires/${seller.slug}`} className="table-card-link">
            Ma vitrine publique ↗
          </Link>
        </div>
        <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <Link href="/offres" className="mini-cal-card" style={{ display: "block" }}>
            <div className="kpi-lbl">Mon offre</div>
            <div className="kpi-val" style={{ fontSize: 20 }}>{offer?.name ?? "Gratuit"}</div>
            <div className="kpi-trend">{isFree ? "Passer à Pro →" : "Gérer →"}</div>
          </Link>
          <Link href="/espace-partenaire/produits" className="mini-cal-card" style={{ display: "block" }}>
            <div className="kpi-lbl">Mes produits</div>
            <div className="kpi-val" style={{ fontSize: 20 }}>{productCount}</div>
            <div className="kpi-trend">{isFree ? `${Math.max(0, FREE_PRODUCT_LIMIT - productCount)} restant(s) en gratuit` : "Illimité (Pro)"}</div>
          </Link>
          <Link href="/espace-partenaire/profil" className="mini-cal-card" style={{ display: "block" }}>
            <div className="kpi-lbl">Ma fiche</div>
            <div className="kpi-val" style={{ fontSize: 20 }}>{seller.verified ? "Vérifiée ✓" : "En cours"}</div>
            <div className="kpi-trend">Modifier →</div>
          </Link>
          <Link href="/compte" className="mini-cal-card" style={{ display: "block" }}>
            <div className="kpi-lbl">Mon compte</div>
            <div className="kpi-val" style={{ fontSize: 20 }}>Avantages</div>
            <div className="kpi-trend">Factures & paiement →</div>
          </Link>
        </div>
      </div>
    </>
  );
}

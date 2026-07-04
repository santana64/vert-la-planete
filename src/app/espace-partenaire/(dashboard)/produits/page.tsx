import Link from "next/link";
import { deleteProductAction } from "@/app/actions/seller";
import { requireSeller } from "@/lib/auth";
import { FREE_PRODUCT_LIMIT } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { getSellerProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PartnerProductsPage() {
  const { seller } = await requireSeller();
  const products = await getSellerProducts(seller.id);
  const isFree = seller.offer === "gratuit";
  const limitReached = isFree && products.length >= FREE_PRODUCT_LIMIT;

  return (
    <>
      <div className="dash-page-hd">
        <div>
          <div className="dash-page-title">Mes produits</div>
          <div className="dash-page-date">
            {products.length} produit{products.length > 1 ? "s" : ""}
            {isFree ? ` · offre gratuite (max ${FREE_PRODUCT_LIMIT})` : " · illimité (Pro)"}
          </div>
        </div>
        {limitReached ? (
          <Link href="/offres" className="btn-add">
            Passer à Pro pour ajouter
          </Link>
        ) : (
          <Link href="/espace-partenaire/produits/nouveau" className="btn-add">
            + Ajouter un produit
          </Link>
        )}
      </div>

      <div className="table-card">
        {products.length === 0 ? (
          <div style={{ padding: 28, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
            <p style={{ fontSize: 14, color: "var(--pb)", fontWeight: 300, marginBottom: 16 }}>
              Vous n&apos;avez pas encore de produit.
            </p>
            <Link href="/espace-partenaire/produits/nouveau" className="btn-add">
              Créer mon premier produit
            </Link>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Label</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="td-inner">
                      <span className="td-logo" style={{ background: p.gradient }} />
                      {p.name}
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>
                    {formatPrice(p.priceCents)}
                    {p.unit ? ` ${p.unit}` : ""}
                  </td>
                  <td>{p.badge ? <span className="status-badge s-active">{p.badge}</span> : "—"}</td>
                  <td>
                    <div className="tbl-actions">
                      <Link href={`/espace-partenaire/produits/${p.id}/modifier`} className="tbl-action p">
                        Modifier
                      </Link>
                      <form action={deleteProductAction}>
                        <input type="hidden" name="productId" value={p.id} />
                        <button
                          type="submit"
                          className="tbl-action"
                          style={{ color: "#c0392b", borderColor: "rgba(192,57,43,.3)" }}
                        >
                          Suppr.
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

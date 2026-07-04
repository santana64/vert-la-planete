import Link from "next/link";
import { redirect } from "next/navigation";
import { createProductAction } from "@/app/actions/seller";
import { SellerProductForm } from "@/components/SellerProductForm";
import { requireSeller } from "@/lib/auth";
import { FREE_PRODUCT_LIMIT } from "@/lib/constants";
import { getSellerProductCount } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const { seller } = await requireSeller();
  if (seller.offer === "gratuit") {
    const count = await getSellerProductCount(seller.id);
    if (count >= FREE_PRODUCT_LIMIT) redirect("/offres");
  }

  return (
    <>
      <div className="dash-page-hd">
        <div>
          <div className="dash-page-title">Nouveau produit</div>
          <div className="dash-page-date">
            <Link href="/espace-partenaire/produits" style={{ color: "var(--s)" }}>
              ← Retour aux produits
            </Link>
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ maxWidth: 720 }}>
        <SellerProductForm action={createProductAction} submitLabel="Publier le produit" />
      </div>
    </>
  );
}

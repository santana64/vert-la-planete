import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { updateProductAction } from "@/app/actions/seller";
import { SellerProductForm } from "@/components/SellerProductForm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireSeller } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { seller } = await requireSeller();

  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.sellerId, seller.id)))
    .limit(1);
  if (!product) notFound();

  return (
    <>
      <div className="dash-page-hd">
        <div>
          <div className="dash-page-title">Modifier le produit</div>
          <div className="dash-page-date">
            <Link href="/espace-partenaire/produits" style={{ color: "var(--s)" }}>
              ← Retour aux produits
            </Link>
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ maxWidth: 720 }}>
        <SellerProductForm
          action={updateProductAction}
          submitLabel="Enregistrer les modifications"
          defaults={{
            productId: product.id,
            name: product.name,
            description: product.description,
            price: (product.priceCents / 100).toString(),
            unit: product.unit ?? "",
            category: product.category,
            badge: product.badge ?? "",
            gradient: product.gradient,
            isNew: product.isNew
          }}
        />
      </div>
    </>
  );
}

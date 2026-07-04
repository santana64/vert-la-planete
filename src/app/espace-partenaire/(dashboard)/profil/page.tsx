import Link from "next/link";
import { SellerProfileForm } from "@/components/SellerProfileForm";
import { requireSeller } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PartnerProfilePage() {
  const { seller } = await requireSeller();

  return (
    <>
      <div className="dash-page-hd">
        <div>
          <div className="dash-page-title">Ma fiche partenaire</div>
          <div className="dash-page-date">
            Vitrine publique :{" "}
            <Link href={`/partenaires/${seller.slug}`} style={{ color: "var(--s)" }}>
              /partenaires/{seller.slug} ↗
            </Link>
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ maxWidth: 720 }}>
        <SellerProfileForm
          defaults={{
            name: seller.name,
            category: seller.category,
            tagline: seller.tagline,
            description: seller.description,
            city: seller.city,
            region: seller.region,
            websiteUrl: seller.websiteUrl ?? ""
          }}
        />
      </div>
    </>
  );
}

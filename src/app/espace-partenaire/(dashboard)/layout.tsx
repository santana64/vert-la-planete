import { DashNav } from "@/components/DashNav";
import { requireSeller } from "@/lib/auth";
import { OFFERS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function PartnerLayout({ children }: { children: React.ReactNode }) {
  const { user, seller } = await requireSeller();
  const offerLabel = OFFERS.find((o) => o.key === seller.offer)?.name ?? "Gratuit";

  return (
    <div className="page active">
      <div className="dashboard-layout">
        <DashNav
          sellerName={seller.name}
          sellerSlug={seller.slug}
          userName={user.name}
          offerLabel={offerLabel}
        />
        <div className="dash-main">{children}</div>
      </div>
    </div>
  );
}

import { AdminNav } from "@/components/AdminNav";
import { requireAdmin } from "@/lib/auth";
import { getAdminStats } from "@/lib/admin";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false }
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const s = await getAdminStats();

  return (
    <div className="page active">
      <div className="dashboard-layout">
        <AdminNav
          userName={admin.name}
          counts={{
            partenaires: s.sellers,
            membres: s.users,
            avis: s.reviews,
            lieux: s.ecoPlaces,
            messages: s.messages,
            articles: s.articles,
            emplois: s.jobs
          }}
        />
        <div className="dash-main">{children}</div>
      </div>
    </div>
  );
}

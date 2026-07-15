import { redirect } from "next/navigation";
import { EcoPlaceForm } from "@/components/map/EcoPlaceForm";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Proposer un lieu",
  robots: { index: false, follow: false }
};

export default async function ProposerLieuPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/lieux/proposer");

  return (
    <div className="page active">
      <div className="auth-container" style={{ maxWidth: 620 }}>
        <div className="auth-h">Proposer un lieu 📍</div>
        <p className="auth-sub">
          Événement groupé, point de collecte, initiative urbaine — enrichissez la carte
          communautaire pour toute la France.
        </p>
        <EcoPlaceForm />
      </div>
    </div>
  );
}

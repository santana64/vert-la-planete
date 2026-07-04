import { redirect } from "next/navigation";
import { CreateSellerForm } from "@/components/CreateSellerForm";
import { getCurrentUser, getSellerForUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CreatePartnerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/espace-partenaire/creer");
  const seller = await getSellerForUser(user.id);
  if (seller) redirect("/espace-partenaire");

  return (
    <div className="page active">
      <div className="auth-container" style={{ maxWidth: 560 }}>
        <div className="auth-h">Créer ma boutique 🌱</div>
        <p className="auth-sub">
          Présentez votre démarche et rejoignez l&apos;annuaire des partenaires engagés.
        </p>
        <CreateSellerForm />
      </div>
    </div>
  );
}

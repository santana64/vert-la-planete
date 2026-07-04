import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LeafMark } from "@/components/Logo";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function InscriptionPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  if (user) redirect("/compte");

  const sp = await searchParams;
  const initialRole = sp.role === "partenaire" || sp.role === "seller" ? "partenaire" : "membre";

  return (
    <div className="page active">
      <div className="profil-tabs-bar">
        <Link href="/connexion" className="ptab">
          Connexion
        </Link>
        <span className="ptab on">Inscription</span>
      </div>
      <div className="auth-container">
        <div className="auth-logo-wrap">
          <LeafMark size={32} />
          <span>Vert La Planète</span>
        </div>
        <div className="auth-h">Rejoindre la communauté 🌱</div>
        <p className="auth-sub">
          Créez votre compte pour acheter en circuit court — ou ouvrez votre boutique de
          producteur / artisan engagé.
        </p>
        <RegisterForm initialRole={initialRole} />
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { LeafMark } from "@/components/Logo";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Connexion",
  robots: { index: false, follow: false }
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ConnexionPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  if (user) redirect("/compte");

  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;

  return (
    <div className="page active">
      <div className="profil-tabs-bar">
        <span className="ptab on">Connexion</span>
        <Link href="/inscription" className="ptab">
          Inscription
        </Link>
      </div>
      <div className="auth-container">
        <div className="auth-logo-wrap">
          <LeafMark size={32} />
          <span>Vert La Planète</span>
        </div>
        <div className="auth-h">Bon retour 👋</div>
        <p className="auth-sub">
          Connectez-vous pour accéder à votre compte et à votre espace partenaire.
        </p>
        <LoginForm next={next} />
      </div>
    </div>
  );
}

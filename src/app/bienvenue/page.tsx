import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/Logo";
import { getCurrentUser } from "@/lib/auth";
import { ACCESS_GATE, PUBLIC_OFFERS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Rejoignez le réseau",
  description:
    "Créez votre compte gratuit pour accéder à l'annuaire des acteurs de la transition écologique.",
  // Page d'entrée : aucun intérêt dans les résultats de recherche.
  robots: { index: false, follow: false }
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Page d'entrée du site — demande du Client du 13/08/2026.
 *
 * Tout visiteur non connecté y est redirigé par le middleware. Il n'accède au
 * reste du site qu'après création d'un compte gratuit ou connexion.
 *
 * Les pages légales (mentions, CGV, confidentialité, RGPD) restent accessibles
 * sans compte : les rendre inatteignables serait une infraction, pas un choix
 * commercial.
 */
export default async function BienvenuePage({ searchParams }: { searchParams: SearchParams }) {
  const [user, sp] = await Promise.all([getCurrentUser(), searchParams]);
  // Déjà connecté : cette page n'a plus lieu d'être.
  if (user) redirect("/");

  const next = typeof sp.next === "string" && sp.next.startsWith("/") ? sp.next : "/";
  const nextParam = `?next=${encodeURIComponent(next)}`;

  return (
    <div className="page active">
      <section className="welcome">
        <div className="welcome-inner">
          <BrandMark size={72} />
          <h1 className="welcome-title">{ACCESS_GATE.title}</h1>
          <p className="welcome-lead">{ACCESS_GATE.lead}</p>

          <ul className="welcome-list">
            {ACCESS_GATE.bullets.map((b) => (
              <li key={b}>
                <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                  <path
                    d="M4 12.5l5.2 5L20 6.8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {b}
              </li>
            ))}
          </ul>

          <div className="welcome-acts">
            <Link className="btn-cta welcome-cta" href={`/inscription${nextParam}`}>
              Créer mon compte gratuit →
            </Link>
            <Link className="welcome-alt" href={`/connexion${nextParam}`}>
              J&apos;ai déjà un compte
            </Link>
          </div>

          <p className="welcome-fine">
            Gratuit, sans newsletter imposée et sans traceur publicitaire. Vous restez maître de vos
            données — voir notre <Link href="/rgpd">politique RGPD</Link>.
          </p>
        </div>

        <aside className="welcome-offers">
          <div className="kicker">Vous produisez, créez, cultivez ?</div>
          <p className="welcome-offers-lead">
            Référencez votre activité dans l&apos;annuaire et soyez trouvé par celles et ceux qui
            cherchent près de chez eux.
          </p>
          <div className="welcome-offers-grid">
            {PUBLIC_OFFERS.map((o) => (
              <div key={o.key} className="welcome-offer">
                <div className="welcome-offer-name">{o.name}</div>
                <div className="welcome-offer-price">
                  <strong>{o.priceLabel}</strong> <span>{o.periodLabel}</span>
                </div>
                <p className="welcome-offer-tag">{o.tagline}</p>
              </div>
            ))}
          </div>
          {/* Plus de lien vers /offres : la page est désormais fermée aux visiteurs
              sans compte, le lien ne ferait que ramener ici. Les deux formules et
              leurs prix restent affichés ci-dessus — l'objectif du Client, les
              valoriser dès l'arrivée, est tenu sans envoyer dans une impasse. */}
          <p className="welcome-offers-fine">
            Créez votre compte pour découvrir le détail de chaque formule.
          </p>
        </aside>
      </section>
    </div>
  );
}

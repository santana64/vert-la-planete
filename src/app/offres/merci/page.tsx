import Link from "next/link";
import { confirmCheckoutSession } from "@/app/actions/subscription";
import { OFFERS } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Merci — Vert La Planète",
  robots: { index: false, follow: false }
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function MerciPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : null;
  const offerKey = sessionId ? await confirmCheckoutSession(sessionId) : null;
  const offer = OFFERS.find((o) => o.key === offerKey);

  return (
    <div className="page active">
      <div className="section" style={{ maxWidth: 640, textAlign: "center" }}>
        <div className="onboard-success-icon" style={{ margin: "0 auto 20px" }}>
          ✓
        </div>
        <div className="onboard-success-h">
          Bienvenue chez les <em>Pro</em> 🌱
        </div>
        <p className="onboard-success-p" style={{ margin: "10px auto 28px" }}>
          {offer
            ? `Votre offre ${offer.name} est activée. Votre boutique est désormais mise en avant et vous pouvez publier des produits en illimité.`
            : "Votre souscription est prise en compte. Si votre offre n'apparaît pas immédiatement, elle sera activée sous peu."}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/espace-partenaire" className="btn-cta">
            Aller à mon espace →
          </Link>
          <Link href="/offres" className="btn-outline">
            Voir les offres
          </Link>
        </div>
      </div>
    </div>
  );
}

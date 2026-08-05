import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) return { title: "Produit introuvable" };
  return {
    title: `${data.product.name} — ${data.seller.name}`,
    description: data.product.description.slice(0, 155),
    alternates: { canonical: `/produits/${slug}` }
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) notFound();
  const { product: p, seller } = data;

  const labels = (p.labels ?? "")
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);
  const hasImpact = Boolean(p.origin || p.materials || p.impactNote || labels.length);

  return (
    <div className="page active">
      <div className="product-bc">
        <Link href="/partenaires">Partenaires</Link>
        <span>›</span>
        <Link href={`/partenaires/${seller.slug}`}>{seller.name}</Link>
        <span>›</span>
        <span>{p.name}</span>
      </div>

      <div className="product-page-grid">
        {/* Visuel */}
        <div className="product-gallery">
          <div className="product-main-img">
            <div className="product-main-img-bg" style={{ background: p.gradient }} />
            {p.badge ? <span className="prod-badge badge badge-eco" style={{ position: "absolute", top: 14, left: 14 }}>{p.badge}</span> : null}
          </div>
        </div>

        {/* Infos */}
        <div className="product-info">
          <div className="product-info-badges">
            <span className="badge badge-eco">{p.category}</span>
            {p.isNew ? <span className="badge badge-amber">Nouveauté</span> : null}
          </div>

          <Link href={`/partenaires/${seller.slug}`} className="product-seller-row">
            <div className="product-seller-av">{seller.logoInitials}</div>
            <div>
              <div className="product-seller-name">
                {seller.name}
                {seller.verified ? " · ✔ vérifié" : ""}
              </div>
              <div className="product-seller-sub">
                {seller.city} · {seller.category} — Voir la boutique →
              </div>
            </div>
          </Link>

          <h1 className="product-h">{p.name}</h1>

          <div className="product-price-row">
            <span className="product-price-main">{euro.format(p.priceCents / 100)}</span>
            {p.unit ? <span className="product-price-period">{p.unit}</span> : null}
          </div>

          <p className="product-short-desc">{p.description}</p>

          {/* ── Impact & traçabilité — le différenciateur ── */}
          {hasImpact ? (
            <>
              <div className="product-variants-h" style={{ marginTop: 8 }}>🌱 Impact & traçabilité</div>
              <div className="product-guarantee">
                {p.origin ? (
                  <div className="product-guarantee-item" style={{ alignItems: "flex-start" }}>
                    <span className="product-guarantee-icon">📍</span>
                    <span><strong style={{ color: "var(--f)", fontWeight: 500 }}>Provenance :</strong> {p.origin}</span>
                  </div>
                ) : null}
                {p.materials ? (
                  <div className="product-guarantee-item" style={{ alignItems: "flex-start" }}>
                    <span className="product-guarantee-icon">🧵</span>
                    <span><strong style={{ color: "var(--f)", fontWeight: 500 }}>Composition :</strong> {p.materials}</span>
                  </div>
                ) : null}
                {p.impactNote ? (
                  <div className="product-guarantee-item" style={{ alignItems: "flex-start" }}>
                    <span className="product-guarantee-icon">🌍</span>
                    <span><strong style={{ color: "var(--f)", fontWeight: 500 }}>Bénéfice écologique :</strong> {p.impactNote}</span>
                  </div>
                ) : null}
                {labels.length ? (
                  <div className="product-guarantee-item" style={{ alignItems: "center", flexWrap: "wrap" }}>
                    <span className="product-guarantee-icon">🏷️</span>
                    {labels.map((l) => (
                      <span key={l} className="badge badge-eco">{l}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </>
          ) : null}

          <div className="product-buy-row">
            <Link href={`/partenaires/${seller.slug}`} className="btn-buy" style={{ textAlign: "center" }}>
              Contacter {seller.name} →
            </Link>
          </div>
          <p className="product-guarantee-item" style={{ fontSize: 12, color: "var(--sd)" }}>
            <span className="product-guarantee-icon">🤝</span>
            Mise en relation directe avec le partenaire — sans intermédiaire, en circuit court.
          </p>
        </div>
      </div>
    </div>
  );
}

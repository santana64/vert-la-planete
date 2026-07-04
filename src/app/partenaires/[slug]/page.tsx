import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { getSellerBySlug, getSellerProducts, getSellerReviews } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seller = await getSellerBySlug(slug).catch(() => null);
  if (!seller) return { title: "Partenaire introuvable" };
  return {
    title: `${seller.name} · ${seller.category} à ${seller.city}`,
    description: seller.tagline,
    openGraph: { title: seller.name, description: seller.tagline }
  };
}

const AXES = ["Local", "Bio", "Circuit court", "Emballage", "Biodiversité"];

export default async function PartenairePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seller = await getSellerBySlug(slug);
  if (!seller) notFound();

  const [products, reviews] = await Promise.all([
    getSellerProducts(seller.id),
    getSellerReviews(seller.id)
  ]);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: seller.name,
    description: seller.tagline,
    address: {
      "@type": "PostalAddress",
      addressLocality: seller.city,
      addressRegion: seller.region,
      addressCountry: "FR"
    },
    ...(seller.websiteUrl ? { url: seller.websiteUrl } : {}),
    ...(avgRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating,
            reviewCount: reviews.length
          }
        }
      : {})
  };

  return (
    <div className="page active">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="fiche-bc">
        <Link href="/">Accueil</Link>
        <span className="bc-s">/</span>
        <Link href="/partenaires">Partenaires</Link>
        <span className="bc-s">/</span>
        <span style={{ color: "var(--f)", fontWeight: 500 }}>{seller.name}</span>
      </div>

      <div className="fiche-hero">
        <div className="fiche-hero-inner">
          <div className="fiche-top">
            <div className="fiche-logo">
              <div style={{ position: "absolute", inset: 0, background: seller.gradient }} />
              <span style={{ position: "relative", zIndex: 1, color: "#fff", fontSize: 22 }}>
                {seller.logoInitials}
              </span>
            </div>
            <div>
              <div className="fiche-name">{seller.name}</div>
              <div className="fiche-cat">{seller.category}</div>
              <div className="fiche-dets">
                <span className="fiche-det">📍 {seller.city}, {seller.region}</span>
                {avgRating ? (
                  <span className="fiche-det">⭐ {avgRating} · {reviews.length} avis</span>
                ) : (
                  <span className="fiche-det">🌱 Nouveau partenaire</span>
                )}
                {seller.offer !== "gratuit" ? (
                  <span className="fiche-det">✓ Partenaire Pro</span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="eco-band">
            <div className="eco-ico">
              <svg viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 19.82M17 8C19 5 20 3 20 3" />
              </svg>
            </div>
            <div>
              <div className="eco-h">{seller.ecoLabel}</div>
              <div className="eco-s">{seller.tagline}</div>
            </div>
            <div className="eco-vrf">{seller.verified ? "Vérifié ✓" : "En cours"}</div>
          </div>

          <div className="score-section">
            <div className="score-big">
              <div className="score-val">{seller.ecoScore}</div>
              <div className="score-max">/ 100</div>
            </div>
            <div className="score-axes">
              {AXES.map((axis, i) => {
                const pct = Math.max(40, Math.min(100, seller.ecoScore + (i % 2 === 0 ? 4 : -6)));
                return (
                  <div key={axis} className="score-axis">
                    <span className="score-axis-lbl">{axis}</span>
                    <div className="score-bar-bg">
                      <div className="score-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="score-axis-val">{Math.round(pct / 10)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="fiche-body">
        <div className="fiche-grid">
          <div className="fcol">
            <div className="col-h">Présentation</div>
            <p className="fiche-desc">{seller.description}</p>
          </div>
          <div className="fcol">
            <div className="col-h">Informations</div>
            <table className="info-table">
              <tbody>
                <tr className="info-row">
                  <td className="info-lbl">Catégorie</td>
                  <td className="info-val">{seller.category}</td>
                </tr>
                <tr className="info-row">
                  <td className="info-lbl">Localisation</td>
                  <td className="info-val">{seller.city}</td>
                </tr>
                <tr className="info-row">
                  <td className="info-lbl">Région</td>
                  <td className="info-val">{seller.region}</td>
                </tr>
                <tr className="info-row">
                  <td className="info-lbl">Score écologique</td>
                  <td className="info-val">{seller.ecoScore} / 100</td>
                </tr>
                {seller.websiteUrl ? (
                  <tr className="info-row">
                    <td className="info-lbl">Site web</td>
                    <td className="info-val link">
                      <a href={seller.websiteUrl} target="_blank" rel="noreferrer">
                        Visiter ↗
                      </a>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div style={{ padding: "32px 0", borderBottom: ".5px solid rgba(0,0,0,.07)" }}>
            <div className="col-h">
              Avis de la communauté{avgRating ? ` · ⭐ ${avgRating} sur ${reviews.length} avis` : ""}
            </div>
            <div className="rev-grid">
              {reviews.slice(0, 4).map((r) => (
                <div key={r.id} className="rev-card">
                  <div className="rev-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  <div className="rev-txt">{r.body}</div>
                  <div className="rev-auth">— {r.authorName}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div style={{ padding: "32px 0", borderBottom: ".5px solid rgba(0,0,0,.07)" }}>
          <div className="col-h">Produits du partenaire</div>
          {products.length === 0 ? (
            <p style={{ color: "var(--pb)", fontWeight: 300 }}>
              Ce partenaire n&apos;a pas encore publié de produit.
            </p>
          ) : (
            <div className="prods-mini-grid">
              {products.map((p) => (
                <div key={p.id} className="prd-mini" style={{ cursor: "default" }}>
                  <div className="prd-mini-img" style={{ background: p.gradient }} />
                  <div className="prd-mini-info">
                    <div className="prd-mini-name">{p.name}</div>
                    <div className="prd-mini-price">
                      {formatPrice(p.priceCents)}
                      {p.unit ? <span className="prd-mini-period"> {p.unit}</span> : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: "32px 0", borderBottom: ".5px solid rgba(0,0,0,.07)" }}>
          <div className="col-h">Localisation</div>
          <div className="map-mini">
            <div className="mm-grid" />
            <div className="mm-road" style={{ top: "48%", height: 2, left: 0, right: 0 }} />
            <div className="mm-road" style={{ left: "48%", width: 2, top: 0, bottom: 0 }} />
            <div className="mm-pin" style={{ top: `${seller.mapY}%`, left: `${seller.mapX}%` }}>
              <div className="mm-pin-c" />
              <div className="mm-pin-r" />
            </div>
          </div>
          <div style={{ fontSize: 13, color: "var(--pb)", marginTop: 10, fontWeight: 300 }}>
            {seller.city}, {seller.region}
          </div>
        </div>

        <div className="fiche-cta">
          {seller.websiteUrl ? (
            <a
              className="btn-visit"
              href={seller.websiteUrl}
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              Visiter le site du partenaire →
            </a>
          ) : (
            <Link
              className="btn-visit"
              href="/partenaires"
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              Voir tous les partenaires →
            </Link>
          )}
          <Link
            className="btn-contact"
            href="/contact"
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            Contacter
          </Link>
        </div>
      </div>
    </div>
  );
}

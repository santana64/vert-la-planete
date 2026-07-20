import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareButtons } from "@/components/ShareButtons";
import { ReviewForm } from "@/components/ReviewForm";
import { SellerMiniMap } from "@/components/map/SellerMiniMap";
import { getCurrentUser } from "@/lib/auth";
import { sellerToPoint } from "@/lib/map-points";
import { jsonLd } from "@/lib/jsonld";
import { formatPrice } from "@/lib/format";
import {
  getSellerBySlug,
  getSellerProducts,
  getSellerReviews,
  isFavoriteSeller
} from "@/lib/queries";

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

/** Critères d'engagement affichés qualitativement (pas de faux chiffres). */
const CRITERES = [
  "Activité locale et ancrée dans son territoire",
  "Démarche écologique déclarée et vérifiée par nos soins",
  "Transparence sur l'origine et la fabrication",
  "Réduction des emballages et des déchets"
];

export default async function PartenairePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seller = await getSellerBySlug(slug);
  if (!seller) notFound();

  const [products, reviews, user] = await Promise.all([
    getSellerProducts(seller.id),
    getSellerReviews(seller.id),
    getCurrentUser()
  ]);
  const favorited = user ? await isFavoriteSeller(user.id, seller.id) : false;

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const structuredData = {
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
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
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
              <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <FavoriteButton sellerId={seller.id} initial={favorited} isLoggedIn={Boolean(user)} />
                <ShareButtons title={`${seller.name} — ${seller.category}`} />
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
              <div className="score-max">Score éco / 100</div>
            </div>
            <div className="score-axes" style={{ gap: 10 }}>
              <div className="col-h" style={{ marginBottom: 0 }}>Critères d&apos;engagement</div>
              {CRITERES.map((critere) => (
                <div key={critere} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13, color: "var(--st)", fontWeight: 300 }}>
                  <span style={{ color: "var(--s)", fontWeight: 500 }}>✓</span>
                  {critere}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fiche-body">
        <div style={{ padding: "32px 0", borderBottom: ".5px solid rgba(0,0,0,.07)" }}>
          <div className="col-h">Présentation</div>
          <p className="fiche-desc" style={{ maxWidth: 720 }}>{seller.description}</p>
        </div>

        <div style={{ padding: "32px 0", borderBottom: ".5px solid rgba(0,0,0,.07)" }}>
          <div className="col-h">
            Avis de la communauté{avgRating ? ` · ⭐ ${avgRating} sur ${reviews.length} avis` : ""}
          </div>
          {reviews.length > 0 ? (
            <div className="rev-grid">
              {reviews.slice(0, 6).map((r) => (
                <div key={r.id} className="rev-card">
                  <div className="rev-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  <div className="rev-txt">{r.body}</div>
                  <div className="rev-auth">— {r.authorName}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--pb)", fontWeight: 300, fontSize: 14 }}>
              Aucun avis pour le moment — soyez le premier à partager votre expérience.
            </p>
          )}
          <ReviewForm
            sellerId={seller.id}
            isLoggedIn={Boolean(user)}
            isOwner={Boolean(user && seller.userId === user.id)}
          />
        </div>

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

        {seller.lat !== 0 || seller.lng !== 0 ? (
          <div style={{ padding: "32px 0", borderBottom: ".5px solid rgba(0,0,0,.07)" }}>
            <div className="col-h">Localisation</div>
            <SellerMiniMap point={sellerToPoint(seller)} />
            <div style={{ fontSize: 13, color: "var(--pb)", marginTop: 10, fontWeight: 300 }}>
              {seller.city}, {seller.region}
            </div>
          </div>
        ) : null}

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

import Link from "next/link";
import type { Article, Seller } from "@/db/schema";
import { OFFERS } from "@/lib/constants";
import { formatDate } from "@/lib/format";

/** Tête de section : kicker + titre (avec emphase) + lien « voir tout ». */
export function SectionHead({
  kicker,
  title,
  em,
  href,
  linkLabel,
  small = false
}: {
  kicker: string;
  title: string;
  em?: string;
  href?: string;
  linkLabel?: string;
  small?: boolean;
}) {
  return (
    <div className="sec-head" data-reveal>
      <div>
        <div className="kicker">{kicker}</div>
        <div className="h2" style={small ? { fontSize: 26 } : undefined}>
          {title} {em ? <em>{em}</em> : null}
        </div>
      </div>
      {href && linkLabel ? (
        <Link className="see-all" href={href}>
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}

/**
 * Teaser compact des offres (accueil) — prix + accroche seulement,
 * le détail vit sur /offres. Zéro JavaScript client.
 */
export function OffersTeaser() {
  return (
    <div className="audience-grid" style={{ marginTop: 8 }}>
      {OFFERS.map((offer) => (
        <Link
          key={offer.key}
          href="/offres"
          className="audience-card"
          data-reveal
          style={{
            textAlign: "left",
            borderColor: offer.highlight ? "var(--l)" : undefined,
            boxShadow: offer.highlight ? "var(--sh-sm)" : undefined
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="audience-h">{offer.name}</span>
            {offer.highlight ? <span className="badge badge-eco">Populaire</span> : null}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "6px 0" }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: 26, color: "var(--f)", fontWeight: 300 }}>
              {offer.priceLabel}
            </span>
            <span style={{ fontSize: 12, color: "var(--pb)", fontWeight: 300 }}>{offer.periodLabel}</span>
          </div>
          <p className="audience-p">{offer.tagline}</p>
          <span className="see-all" style={{ fontSize: 12, marginTop: 10, display: "inline-flex" }}>
            Découvrir →
          </span>
        </Link>
      ))}
    </div>
  );
}

/** Tuile partenaire (accueil + section « Sélection Pro »). */
export function PartnerChip({ seller }: { seller: Seller }) {
  return (
    <Link href={`/partenaires/${seller.slug}`} className="pchip" data-reveal>
      <div className="pchip-logo" style={{ background: seller.gradient, color: "#fff" }}>
        {seller.logoInitials}
      </div>
      <div className="pchip-name">{seller.name}</div>
      <div className="pchip-cat">
        {seller.category} · {seller.city}
      </div>
      {seller.offer !== "gratuit" ? (
        <span className="badge badge-amber">★ Partenaire Pro</span>
      ) : (
        <span className="badge badge-eco">{seller.region}</span>
      )}
    </Link>
  );
}

/** Carte article (accueil + fil d'actualités). */
export function ArticleCard({ article, tall = false }: { article: Article; tall?: boolean }) {
  return (
    <Link href={`/actualites/${article.slug}`} className="art-card" data-reveal>
      <div className="art-img" style={{ height: tall ? 120 : 80, background: article.gradient }} />
      <div className="art-body">
        <span className="badge badge-eco">{article.category}</span>
        <div className="art-title">{article.title}</div>
        <div className="art-meta">
          {article.readMinutes} min · {article.author} · {formatDate(article.publishedAt)}
        </div>
        <span className="art-read">Lire →</span>
      </div>
    </Link>
  );
}

import Link from "next/link";
import type { Article, Seller } from "@/db/schema";
import { formatDate } from "@/lib/format";

/** Tête de section : kicker + titre (avec emphase) + lien « voir tout ». */
export function SectionHead({
  kicker,
  title,
  em,
  href,
  linkLabel
}: {
  kicker: string;
  title: string;
  em?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="sec-head" data-reveal>
      <div>
        <div className="kicker">{kicker}</div>
        <div className="h2">
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

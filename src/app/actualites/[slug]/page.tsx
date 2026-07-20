import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/format";
import { getArticleBySlug } from "@/lib/queries";
import { jsonLd } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug).catch(() => null);
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, type: "article" }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const paragraphs = article.body.split(/\n\n+/).filter(Boolean);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: { "@type": "Organization", name: article.author },
    datePublished: new Date(article.publishedAt).toISOString(),
    inLanguage: "fr-FR"
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
        <Link href="/actualites">Actualités</Link>
        <span className="bc-s">/</span>
        <span style={{ color: "var(--f)", fontWeight: 500 }}>{article.category}</span>
      </div>

      <div className="section" style={{ maxWidth: 760 }}>
        <span className="badge badge-eco">{article.category}</span>
        <h1
          className="about-h"
          style={{ fontSize: 38, margin: "14px 0 10px", lineHeight: 1.15 }}
        >
          {article.title}
        </h1>
        <div className="art-meta" style={{ marginBottom: 20 }}>
          {article.readMinutes} min de lecture · {article.author} · {formatDate(article.publishedAt)}
        </div>
        <div
          style={{ height: 260, borderRadius: 16, background: article.gradient, marginBottom: 28 }}
        />
        <p style={{ fontSize: 17, color: "var(--st)", fontWeight: 300, lineHeight: 1.7, marginBottom: 20 }}>
          {article.excerpt}
        </p>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            style={{ fontSize: 15, color: "var(--st)", fontWeight: 300, lineHeight: 1.85, marginBottom: 16 }}
          >
            {p}
          </p>
        ))}

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: ".5px solid rgba(0,0,0,.07)" }}>
          <Link href="/actualites" className="see-all">
            ← Toutes les actualités
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArticleCard } from "@/components/cards";
import { listArticles } from "@/lib/queries";
import { str } from "@/lib/search-params";

export const dynamic = "force-dynamic";
export const metadata = { title: "Actualités — Vert La Planète" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ActualitesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const category = str(sp.category);

  const all = await listArticles();
  const categories = [...new Set(all.map((a) => a.category))];
  const articles = category ? all.filter((a) => a.category === category) : all;

  return (
    <div className="page active">
      <div className="explorer-header">
        <div className="explorer-header-inner">
          <h1 className="explorer-h1">Actualités & initiatives</h1>
          <p className="explorer-sub">
            Articles, guides pratiques et initiatives inspirantes — filtrez selon vos centres
            d&apos;intérêt.
          </p>
          <div className="filter-chips" style={{ marginTop: 8 }}>
            <Link className={`fchip${!category ? " on" : ""}`} href="/actualites">
              Tout
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                className={`fchip${category === c ? " on" : ""}`}
                href={`/actualites?category=${encodeURIComponent(c)}`}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        {articles.length === 0 ? (
          <p style={{ color: "var(--pb)", fontWeight: 300 }}>
            Aucun article dans cette catégorie pour le moment.
          </p>
        ) : (
          <div className="articles-grid">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} tall />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

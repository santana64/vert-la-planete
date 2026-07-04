import Link from "next/link";
import { formatDate } from "@/lib/format";
import { listArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Actualités — Vert La Planète" };

export default async function ActualitesPage() {
  const articles = await listArticles();

  return (
    <div className="page active">
      <div className="explorer-header">
        <div className="explorer-header-inner">
          <h1 className="explorer-h1">Actualités & initiatives</h1>
          <p className="explorer-sub">
            Articles, guides pratiques et initiatives inspirantes autour de la transition
            écologique.
          </p>
        </div>
      </div>

      <div className="section">
        {articles.length === 0 ? (
          <p style={{ color: "var(--pb)", fontWeight: 300 }}>Aucun article pour le moment.</p>
        ) : (
          <div className="articles-grid">
            {articles.map((a) => (
              <Link key={a.id} href={`/actualites/${a.slug}`} className="art-card">
                <div className="art-img" style={{ height: 120, background: a.gradient }} />
                <div className="art-body">
                  <span className="badge badge-eco">{a.category}</span>
                  <div className="art-title">{a.title}</div>
                  <div className="art-meta">
                    {a.readMinutes} min · {a.author} · {formatDate(a.publishedAt)}
                  </div>
                  <span className="art-read">Lire →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { adminListArticles } from "@/lib/admin";
import { adminDeleteArticle } from "@/app/actions/admin";
import { ConfirmButton } from "@/components/ConfirmButton";

const fmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

export default async function AdminArticlesPage() {
  const articles = await adminListArticles();

  return (
    <>
      <div className="dash-page-hd">
        <h1 className="dash-page-title">Actualités</h1>
        <Link href="/admin/articles/nouveau" className="btn-add">
          + Nouvel article
        </Link>
      </div>

      <div className="table-card">
        <div className="table-card-hd">
          <span className="table-card-title">Tous les articles</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Auteur</th>
              <th>Publié le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>
                  <span className="badge badge-eco">{article.category}</span>
                </td>
                <td>{article.author}</td>
                <td>{fmt.format(article.publishedAt)}</td>
                <td>
                  <div className="tbl-actions">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="tbl-action"
                    >
                      Modifier
                    </Link>
                    <form action={adminDeleteArticle}>
                      <input type="hidden" name="id" value={article.id} />
                      <ConfirmButton
                        message="Supprimer cet article ?"
                        className="tbl-action danger"
                      >
                        Suppr.
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

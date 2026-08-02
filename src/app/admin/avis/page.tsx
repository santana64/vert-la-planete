import Link from "next/link";
import { adminListReviews } from "@/lib/admin";
import { adminDeleteReview } from "@/app/actions/admin";
import { ConfirmButton } from "@/components/ConfirmButton";

const fmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

function truncate(text: string, max = 120): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export default async function AdminReviewsPage() {
  const reviews = await adminListReviews();

  return (
    <>
      <div className="dash-page-hd">
        <h1 className="dash-page-title">Avis à modérer</h1>
      </div>
      <p className="dash-page-date">{reviews.length} avis</p>

      <div className="table-card">
        <div className="table-card-hd">
          <span className="table-card-title">Tous les avis</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Partenaire</th>
              <th>Note</th>
              <th>Avis</th>
              <th>Auteur</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>
                  {review.sellerSlug ? (
                    <Link href={`/partenaires/${review.sellerSlug}`}>
                      {review.sellerName ?? review.sellerSlug}
                    </Link>
                  ) : (
                    review.sellerName ?? "—"
                  )}
                </td>
                <td>{"★".repeat(review.rating)}</td>
                <td>{truncate(review.body)}</td>
                <td>{review.authorName}</td>
                <td>{fmt.format(review.createdAt)}</td>
                <td>
                  <div className="tbl-actions">
                    <form action={adminDeleteReview}>
                      <input type="hidden" name="id" value={review.id} />
                      <ConfirmButton
                        message="Supprimer cet avis ?"
                        className="tbl-action danger"
                      >
                        Suppr.
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6}>Aucun avis pour le moment.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

import Link from "next/link";
import { adminListJobs } from "@/lib/admin";
import { adminDeleteJob } from "@/app/actions/admin";
import { ConfirmButton } from "@/components/ConfirmButton";

const fmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

export default async function AdminJobsPage() {
  const jobs = await adminListJobs();

  return (
    <>
      <div className="dash-page-hd">
        <h1 className="dash-page-title">Emplois &amp; formations</h1>
        <Link href="/admin/emplois/nouveau" className="btn-add">
          + Nouvelle offre
        </Link>
      </div>

      <div className="table-card">
        <div className="table-card-hd">
          <span className="table-card-title">Toutes les offres ({jobs.length})</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Intitulé</th>
              <th>Type</th>
              <th>Contrat</th>
              <th>Organisation · Lieu</th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id}>
                <td>{j.title}</td>
                <td>
                  <span className={`badge ${j.kind === "Formation" ? "badge-blue" : "badge-amber"}`}>
                    {j.kind}
                  </span>
                </td>
                <td>{j.contractType}</td>
                <td>
                  {j.organisation} · {j.location}
                </td>
                <td>{fmt.format(j.createdAt)}</td>
                <td>
                  <div className="tbl-actions">
                    <Link href={`/admin/emplois/${j.id}`} className="tbl-action p">
                      Modifier
                    </Link>
                    <form action={adminDeleteJob}>
                      <input type="hidden" name="id" value={j.id} />
                      <ConfirmButton
                        message="Supprimer cette offre ?"
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

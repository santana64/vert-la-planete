import Link from "next/link";
import { listJobs } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Emplois & Formations — Vert La Planète" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function EmploisPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const kind = sp.kind === "Emploi" || sp.kind === "Formation" ? sp.kind : undefined;
  const jobs = await listJobs(kind);

  return (
    <div className="page active">
      <div className="explorer-header">
        <div className="explorer-header-inner">
          <h1 className="explorer-h1">Emplois & Formations</h1>
          <p className="explorer-sub">
            Offres d&apos;emploi et formations écoresponsables proposées par notre réseau de
            partenaires engagés.
          </p>
          <div className="filter-chips" style={{ marginTop: 8 }}>
            <Link className={`fchip${!kind ? " on" : ""}`} href="/emplois">
              Tout
            </Link>
            <Link className={`fchip${kind === "Emploi" ? " on" : ""}`} href="/emplois?kind=Emploi">
              Emplois
            </Link>
            <Link className={`fchip${kind === "Formation" ? " on" : ""}`} href="/emplois?kind=Formation">
              Formations
            </Link>
          </div>
        </div>
      </div>

      <div className="section">
        {jobs.length === 0 ? (
          <p style={{ color: "var(--pb)", fontWeight: 300 }}>Aucune offre pour le moment.</p>
        ) : (
          <div className="results-list">
            {jobs.map((job) => (
              <Link key={job.id} href={`/emplois/${job.slug}`} className="rcard">
                <div
                  className="rcard-thumb"
                  style={{
                    background: job.kind === "Formation" ? "var(--fo)" : "var(--pp)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26
                  }}
                >
                  {job.kind === "Formation" ? "🎓" : "💼"}
                </div>
                <div className="rcard-body">
                  <div className="rcard-hd">
                    <div className="rcard-name">{job.title}</div>
                    <div className="rcard-dist">{job.location}</div>
                  </div>
                  <div className="rcard-desc">{job.organisation}</div>
                  <div className="rcard-tags">
                    <span className="rtag">{job.kind}</span>
                    <span className="rtag">{job.contractType}</span>
                  </div>
                </div>
                <div className="rcard-act">
                  <span className="btn-sm-outline">Détails →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

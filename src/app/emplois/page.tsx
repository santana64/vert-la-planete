import Link from "next/link";
import { listJobs } from "@/lib/queries";
import { buildFilterHref, str } from "@/lib/search-params";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Emplois & Formations — Vert La Planète",
  alternates: { canonical: "/emplois" }
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const href = (current: Record<string, string | undefined>, changes: Record<string, string | null>) =>
  buildFilterHref("/emplois", current, changes);

export default async function EmploisPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const current = {
    kind: sp.kind === "Emploi" || sp.kind === "Formation" ? sp.kind : undefined,
    contrat: str(sp.contrat)
  };

  const all = await listJobs();
  const contractTypes = [...new Set(all.map((j) => j.contractType))].sort();
  const jobs = all.filter(
    (j) =>
      (!current.kind || j.kind === current.kind) &&
      (!current.contrat || j.contractType === current.contrat)
  );

  return (
    <div className="page active">
      <div className="explorer-header">
        <div className="explorer-header-inner">
          <h1 className="explorer-h1">Emplois & Formations</h1>
          <p className="explorer-sub">
            Offres d&apos;emploi et formations écoresponsables proposées par notre réseau de
            partenaires engagés.
          </p>

          <div className="filter-title" style={{ marginTop: 6, marginBottom: 8 }}>Type</div>
          <div className="filter-chips">
            <Link className={`fchip${!current.kind ? " on" : ""}`} href={href(current, { kind: null })}>
              Tout
            </Link>
            <Link className={`fchip${current.kind === "Emploi" ? " on" : ""}`} href={href(current, { kind: "Emploi" })}>
              💼 Emplois
            </Link>
            <Link className={`fchip${current.kind === "Formation" ? " on" : ""}`} href={href(current, { kind: "Formation" })}>
              🎓 Formations
            </Link>
          </div>

          <div className="filter-title" style={{ marginTop: 14, marginBottom: 8 }}>Contrat</div>
          <div className="filter-chips">
            <Link className={`fchip${!current.contrat ? " on" : ""}`} href={href(current, { contrat: null })}>
              Tous
            </Link>
            {contractTypes.map((c) => (
              <Link key={c} className={`fchip${current.contrat === c ? " on" : ""}`} href={href(current, { contrat: c })}>
                {c}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="results-topbar">
          <span className="results-count">
            <strong>{jobs.length}</strong> offre{jobs.length > 1 ? "s" : ""}
          </span>
        </div>
        {jobs.length === 0 ? (
          <p style={{ color: "var(--pb)", fontWeight: 300 }}>Aucune offre ne correspond à ces filtres.</p>
        ) : (
          <div className="results-list two-col">
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

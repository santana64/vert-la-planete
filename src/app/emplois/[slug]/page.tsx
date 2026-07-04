import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug).catch(() => null);
  if (!job) return { title: "Offre introuvable" };
  return {
    title: `${job.title} · ${job.organisation}`,
    description: `${job.kind} ${job.contractType} — ${job.location}`
  };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const paragraphs = job.description.split(/\n\n+/).filter(Boolean);

  return (
    <div className="page active">
      <div className="fiche-bc">
        <Link href="/">Accueil</Link>
        <span className="bc-s">/</span>
        <Link href="/emplois">Emplois & Formations</Link>
        <span className="bc-s">/</span>
        <span style={{ color: "var(--f)", fontWeight: 500 }}>{job.title}</span>
      </div>

      <div className="section" style={{ maxWidth: 760 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <span className="badge badge-eco">{job.kind}</span>
          <span className="badge badge-amber">{job.contractType}</span>
        </div>
        <h1 className="about-h" style={{ fontSize: 34, marginBottom: 6 }}>
          {job.title}
        </h1>
        <div className="art-meta" style={{ marginBottom: 24 }}>
          {job.organisation} · 📍 {job.location}
        </div>

        {paragraphs.map((p, i) => (
          <p
            key={i}
            style={{ fontSize: 15, color: "var(--st)", fontWeight: 300, lineHeight: 1.85, marginBottom: 16 }}
          >
            {p}
          </p>
        ))}

        <div className="fiche-cta">
          {job.contactUrl ? (
            <a
              className="btn-visit"
              href={job.contactUrl}
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              Postuler / S&apos;inscrire →
            </a>
          ) : (
            <Link
              className="btn-visit"
              href="/contact"
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              Candidater via le formulaire →
            </Link>
          )}
          <Link
            className="btn-contact"
            href="/emplois"
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            Voir les autres offres
          </Link>
        </div>
      </div>
    </div>
  );
}

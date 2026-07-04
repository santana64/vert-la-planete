import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page active">
      <div className="section" style={{ textAlign: "center", paddingTop: 96, paddingBottom: 96 }}>
        <div style={{ fontFamily: "var(--serif)", fontSize: 96, color: "var(--dw)", lineHeight: 1 }}>
          404
        </div>
        <h1 className="h2" style={{ marginTop: 8 }}>
          Cette page a <em>fané</em>
        </h1>
        <p style={{ color: "var(--pb)", fontWeight: 300, margin: "12px auto 28px", maxWidth: 420 }}>
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/" className="btn-cta">
            Retour à l&apos;accueil →
          </Link>
          <Link href="/partenaires" className="btn-outline">
            Voir les partenaires
          </Link>
        </div>
      </div>
    </div>
  );
}

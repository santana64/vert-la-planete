import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page active">
      <div className="page-404">
        <div className="page-404-wrap">
          <div className="page-404-num">404</div>
          <h1 className="page-404-h">
            Cette page a <em>fané</em>
          </h1>
        </div>
        <p className="page-404-p">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="page-404-actions">
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

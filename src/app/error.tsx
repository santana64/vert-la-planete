"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="page active">
      <div className="section" style={{ textAlign: "center", paddingTop: 96, paddingBottom: 96 }}>
        <div style={{ fontSize: 44, marginBottom: 14 }} aria-hidden>
          🍂
        </div>
        <h1 className="h2">
          Un petit souci de <em>sève</em>
        </h1>
        <p style={{ color: "var(--pb)", fontWeight: 300, margin: "12px auto 28px", maxWidth: 440, lineHeight: 1.7 }}>
          Une erreur inattendue s&apos;est produite. Réessayez dans un instant — si le problème
          persiste, contactez-nous.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-cta" onClick={() => reset()}>
            Réessayer →
          </button>
          <Link href="/" className="btn-outline">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

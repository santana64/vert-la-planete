"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { KIND_META, type MapPoint } from "@/lib/places";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => <div className="skel-hero" style={{ height: 480, marginBottom: 0 }} />
});

const FILTERS: { key: "tous" | MapPoint["kind"]; label: string; color?: string }[] = [
  { key: "tous", label: "Tous" },
  { key: "partenaire", label: "🛍️ Partenaires", color: KIND_META.partenaire.color },
  { key: "ramassage", label: "🤝 Ramassage de déchets", color: KIND_META.ramassage.color },
  { key: "dechetterie", label: "♻️ Déchetteries", color: KIND_META.dechetterie.color },
  { key: "centre", label: "🌱 Centres écologiques", color: KIND_META.centre.color }
];

export function CarteInteractive({
  points,
  isLoggedIn
}: {
  points: MapPoint[];
  isLoggedIn: boolean;
}) {
  const [filter, setFilter] = useState<"tous" | MapPoint["kind"]>("tous");

  const visible = useMemo(
    () => (filter === "tous" ? points : points.filter((p) => p.kind === filter)),
    [points, filter]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of points) c[p.kind] = (c[p.kind] ?? 0) + 1;
    return c;
  }, [points]);

  return (
    <div id="carte">
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`fchip${filter === f.key ? " on" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            {f.key !== "tous" && counts[f.key] ? ` (${counts[f.key]})` : ""}
          </button>
        ))}
        <Link
          href={isLoggedIn ? "/lieux/proposer" : "/connexion?next=/lieux/proposer"}
          className="btn-sm-outline"
          style={{ marginLeft: "auto" }}
        >
          ＋ Proposer un lieu
        </Link>
      </div>

      <div style={{ border: ".5px solid rgba(0,0,0,.08)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--sh-md)" }}>
        <LeafletMap points={visible} height={480} />
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
        {FILTERS.filter((f) => f.color).map((f) => (
          <span key={f.key} className="carte-leg-item" style={{ fontSize: 12 }}>
            <span className="carte-leg-dot" style={{ background: f.color }} />
            {f.label.replace(/^\S+\s/, "")}
          </span>
        ))}
        <span style={{ fontSize: 11, color: "var(--sd)", marginLeft: "auto" }}>
          Carte © OpenStreetMap — sans tracking ni clé propriétaire
        </span>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type CarteSeller = {
  id: string;
  slug: string;
  name: string;
  category: string;
  city: string;
  region: string;
  tagline: string;
  gradient: string;
  mapX: number;
  mapY: number;
  verified: boolean;
};

export function CarteExplorer({ sellers }: { sellers: CarteSeller[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(sellers[0]?.id ?? null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sellers;
    return sellers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }, [sellers, query]);

  const selected = sellers.find((s) => s.id === selectedId) ?? filtered[0] ?? null;
  const pinColor = (s: CarteSeller) => (s.verified ? "#3daa62" : "#7ecb99");

  return (
    <div className="carte-layout">
      <div className="carte-map">
          <div className="carte-grid" />
          <div className="carte-park" style={{ top: "13%", left: "10%", width: "22%", height: "20%" }} />
          <div className="carte-park" style={{ top: "60%", left: "53%", width: "18%", height: "15%" }} />
          <div className="carte-water" style={{ top: "42%", left: "5%", width: "12%", height: "28%" }} />
          <div className="carte-road main" style={{ top: "27%", height: 4, left: 0, right: 0 }} />
          <div className="carte-road main" style={{ top: "55%", height: 4, left: 0, right: 0 }} />
          <div className="carte-road main" style={{ left: "25%", width: 4, top: 0, bottom: 0 }} />
          <div className="carte-road main" style={{ left: "52%", width: 4, top: 0, bottom: 0 }} />

          {filtered.map((s) => (
            <div
              key={s.id}
              className="pin-w"
              style={{ top: `${s.mapY}%`, left: `${s.mapX}%` }}
              onClick={() => setSelectedId(s.id)}
              role="button"
              aria-label={s.name}
            >
              <div
                className="pin-c"
                style={{ width: 14, height: 14, background: pinColor(s) }}
              />
              <div className="pin-r" style={{ position: "absolute", inset: -5, color: pinColor(s) }} />
            </div>
          ))}

          {selected ? (
            <div className="popup-map" style={{ top: `${selected.mapY}%`, left: `${selected.mapX}%` }}>
              <div className="popup-img" style={{ background: selected.gradient }} />
              <div className="popup-name">{selected.name}</div>
              <div className="popup-type">
                {selected.category} · {selected.city}
              </div>
              <div className="popup-sep" />
              <Link className="popup-action" href={`/partenaires/${selected.slug}`} style={{ pointerEvents: "auto" }}>
                Voir le profil →
              </Link>
            </div>
          ) : null}

          <div className="carte-ui-top">
            <div className="carte-search-w">
              <span className="carte-search-ico">⌕</span>
              <input
                className="carte-search"
                placeholder="Rechercher un vendeur, une ville…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="carte-legend">
            <div className="carte-leg-item">
              <div className="carte-leg-dot" style={{ background: "#3daa62" }} />
              Vendeurs vérifiés
            </div>
            <div className="carte-leg-item">
              <div className="carte-leg-dot" style={{ background: "#7ecb99" }} />
              Nouveaux vendeurs
            </div>
          </div>
          <div className="carte-zone">France · © OpenStreetMap</div>
        </div>

        <div className="carte-sidebar">
          <div className="sb-hd">
            <div className="sb-title">{filtered.length} vendeurs visibles</div>
          </div>

          {selected ? (
            <div className="sb-preview">
              <div className="sb-preview-img" style={{ background: selected.gradient }} />
              <div className="sb-preview-body">
                <div className="sb-preview-name">{selected.name}</div>
                <div className="sb-preview-cat">
                  {selected.category} · {selected.city}
                </div>
                <Link className="sb-preview-btn" href={`/partenaires/${selected.slug}`}>
                  Voir le profil →
                </Link>
              </div>
            </div>
          ) : null}

          <div className="sb-list">
            {filtered.map((s) => (
              <div
                key={s.id}
                className={`sb-item${s.id === selectedId ? " on" : ""}`}
                onClick={() => setSelectedId(s.id)}
                role="button"
              >
                <div className="sb-dot" style={{ background: pinColor(s) }} />
                <div>
                  <div className="sb-name">{s.name}</div>
                  <div className="sb-type">{s.category}</div>
                  <div className="sb-dist">
                    {s.city}, {s.region}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}

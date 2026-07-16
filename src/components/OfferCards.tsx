"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { startSubscriptionAction } from "@/app/actions/subscription";
import { OFFERS, type OfferKey } from "@/lib/constants";

export function OfferCards({
  currentOffer,
  showFeatures = true
}: {
  currentOffer: OfferKey | null;
  showFeatures?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [loadingKey, setLoadingKey] = useState<OfferKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  function subscribe(key: OfferKey) {
    setError(null);
    setLoadingKey(key);
    startTransition(async () => {
      const res = await startSubscriptionAction(key);
      if (res?.url) {
        window.location.href = res.url;
        return;
      }
      if (res?.error) setError(res.error);
      setLoadingKey(null);
    });
  }

  return (
    <>
      <div className="audience-grid" style={{ alignItems: "stretch", marginTop: 8 }}>
        {OFFERS.map((offer) => {
          const isCurrent = currentOffer === offer.key;
          return (
            <div
              key={offer.key}
              className="audience-card"
              style={{
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                borderColor: offer.highlight ? "var(--l)" : undefined,
                boxShadow: offer.highlight ? "var(--sh-md)" : undefined,
                position: "relative"
              }}
            >
              {offer.highlight ? (
                <span
                  className="badge badge-eco"
                  style={{ position: "absolute", top: 14, right: 14 }}
                >
                  Populaire
                </span>
              ) : null}

              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--f)" }}>{offer.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: 30, color: "var(--f)", fontWeight: 300 }}>
                  {offer.priceLabel}
                </span>
                <span style={{ fontSize: 12, color: "var(--pb)", fontWeight: 300 }}>
                  {offer.periodLabel}
                </span>
              </div>
              <p style={{ fontSize: 12, color: "var(--pb)", fontWeight: 300, lineHeight: 1.5, minHeight: 34 }}>
                {offer.tagline}
              </p>

              {showFeatures ? (
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, margin: "12px 0", flex: 1 }}>
                  {offer.features.map((f) => (
                    <li key={f} style={{ fontSize: 12.5, color: "var(--st)", fontWeight: 300, display: "flex", gap: 8 }}>
                      <span style={{ color: "var(--s)" }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ flex: 1, minHeight: 8 }} />
              )}

              {offer.key === "gratuit" ? (
                isCurrent ? (
                  <span className="btn-outline" style={{ textAlign: "center" }}>
                    Votre offre actuelle
                  </span>
                ) : (
                  <Link href="/devenir-partenaire" className="btn-outline" style={{ textAlign: "center" }}>
                    Commencer gratuitement
                  </Link>
                )
              ) : isCurrent ? (
                <span className="btn-outline" style={{ textAlign: "center" }}>
                  Offre actuelle ✓
                </span>
              ) : (
                <button
                  type="button"
                  className={offer.highlight ? "btn-cta" : "btn-primary"}
                  style={{ justifyContent: "center", width: "100%" }}
                  disabled={pending}
                  onClick={() => subscribe(offer.key)}
                >
                  {loadingKey === offer.key ? "Redirection…" : "Souscrire"}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {error ? (
        <p className="field-error" style={{ marginTop: 14 }}>
          {error}
        </p>
      ) : null}
    </>
  );
}

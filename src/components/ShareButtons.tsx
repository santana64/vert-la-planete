"use client";

import { useEffect, useState } from "react";

/** Boutons de partage réseaux + copier le lien (retour client). */
export function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const enc = encodeURIComponent;
  const links = url
    ? [
        { label: "WhatsApp", color: "#25d366", href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
        { label: "Facebook", color: "#1877f2", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
        { label: "X", color: "#0f1419", href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}` },
        { label: "LinkedIn", color: "#0a66c2", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` }
      ]
    : [];

  async function nativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      /* partage annulé */
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible */
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontSize: 12, color: "var(--pb)", fontWeight: 500, marginRight: 2 }}>Partager</span>
      {canNativeShare ? (
        <button type="button" className="btn-sm-outline" onClick={nativeShare}>
          Partager…
        </button>
      ) : null}
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className="btn-sm-outline"
          aria-label={`Partager sur ${l.label}`}
          style={{ borderColor: `${l.color}55`, color: l.color }}
        >
          {l.label}
        </a>
      ))}
      <button type="button" className="btn-sm-outline" onClick={copy} aria-label="Copier le lien">
        {copied ? "Lien copié ✓" : "Copier le lien"}
      </button>
    </div>
  );
}

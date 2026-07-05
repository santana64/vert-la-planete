import Link from "next/link";

/**
 * Logo officiel Vert La Planète — mains enlaçant la planète (palette sarcelle),
 * recréé en vectoriel d'après le logo fourni par le client.
 */
export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      role="img"
      aria-label="Logo Vert La Planète"
      style={{ borderRadius: "6px 0 6px 0", display: "block", flexShrink: 0 }}
    >
      <rect width="96" height="96" fill="#1a7671" />
      <clipPath id="vlp-globe">
        <circle cx="48" cy="48" r="21" />
      </clipPath>
      <circle cx="48" cy="48" r="21" fill="#f0faf9" />
      <g clipPath="url(#vlp-globe)" fill="#b9dfdc">
        <path d="M22 48q3-15 17-13 9 2 7 11-2 7-10 9-12 3-14-7z" />
        <path d="M50 22q11-3 16 6 3 7-5 9-9 2-12-4-3-7 1-11z" />
        <path d="M60 46q10-2 11 6 1 7-7 9-8 2-10-5-2-7 6-10z" />
        <path d="M40 61q6-2 8 3 1 5-5 6-6 1-7-3-1-4 4-6z" />
      </g>
      <g stroke="#b9dfdc" strokeWidth="7" fill="none" strokeLinecap="round">
        <path d="M62 17.5A34 34 0 0 0 22 21.5A34 34 0 0 0 20 66" />
        <path d="M34 78.5A34 34 0 0 0 74 74.5A34 34 0 0 0 76 30" />
      </g>
      <g fill="#b9dfdc">
        <path d="M60 14q9-1 14 2-4 3-9 3.5-5 .5-7-2 0-3 2-3.5z" />
        <path d="M36 82q-9 1-14-2 4-3 9-3.5 5-.5 7 2 0 3-2 3.5z" />
      </g>
    </svg>
  );
}

export function NavLogo() {
  return (
    <Link href="/" className="nav-logo" aria-label="Vert La Planète — accueil">
      <BrandMark size={36} />
      <span className="nav-logo-text">Vert La Planète</span>
    </Link>
  );
}

/** Alias conservé pour compatibilité avec les usages existants. */
export const LeafMark = BrandMark;

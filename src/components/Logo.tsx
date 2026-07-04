import Link from "next/link";

/** Leaf brand mark — rounded square in forest green with a white leaf glyph. */
export function LeafMark({ size = 36 }: { size?: number }) {
  return (
    <span
      className="nav-logo-img"
      style={{
        height: size,
        width: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      aria-hidden
    >
      <svg
        width={Math.round(size * 0.55)}
        height={Math.round(size * 0.55)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6" />
      </svg>
    </span>
  );
}

export function NavLogo() {
  return (
    <Link href="/" className="nav-logo" aria-label="Vert La Planète — accueil">
      <LeafMark size={36} />
      <span className="nav-logo-text">Vert La Planète</span>
    </Link>
  );
}

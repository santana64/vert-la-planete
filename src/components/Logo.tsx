import Image from "next/image";
import Link from "next/link";

/** Logo officiel Vert La Planète (fichier original fourni par le client). */
export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/logo-officiel.jpg"
      alt=""
      width={size}
      height={size}
      className="nav-logo-img"
      style={{ height: size, width: size }}
      priority
    />
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

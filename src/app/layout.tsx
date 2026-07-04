import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { getCurrentUser } from "@/lib/auth";
import { COMPANY } from "@/lib/constants";

const serif = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  style: ["normal", "italic"],
  weight: ["300", "400"]
});

const sans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500"]
});

const siteUrl = process.env.APP_URL ?? "http://localhost:3000";
const siteDescription =
  "L'annuaire des producteurs, artisans et marques engagés : partenaires écologiques, locaux et vérifiés, au plus près de chez vous.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vert La Planète — Annuaire des acteurs de la transition écologique",
    template: "%s — Vert La Planète"
  },
  description: siteDescription,
  applicationName: "Vert La Planète",
  keywords: [
    "écologie",
    "transition écologique",
    "annuaire écologique",
    "producteurs locaux",
    "circuit court",
    "artisans engagés",
    "consommation responsable"
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Vert La Planète",
    title: "Vert La Planète — Annuaire des acteurs de la transition écologique",
    description: siteDescription,
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: "Vert La Planète",
    description: siteDescription
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: "#091f12",
  width: "device-width",
  initialScale: 1
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.name,
  legalName: `${COMPANY.name} SAS`,
  url: siteUrl,
  email: COMPANY.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "225 rue Evariste Galois",
    postalCode: "77350",
    addressLocality: "Le Mée-sur-Seine",
    addressCountry: "FR"
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a href="#contenu" className="skip-link">
          Aller au contenu principal
        </a>
        <Nav user={user ? { name: user.name, role: user.role } : null} />
        <main id="contenu">{children}</main>
        <Footer />
        <BottomNav />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}

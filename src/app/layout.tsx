import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { getCurrentUser } from "@/lib/auth";

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

export const metadata: Metadata = {
  title: "Vert La Planète — Marketplace écologique",
  description:
    "La marketplace des producteurs, artisans et marques engagés : produits écologiques, locaux et vérifiés, au plus près de chez vous.",
  applicationName: "Vert La Planète"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Nav user={user ? { name: user.name, role: user.role } : null} />
        <main>{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}

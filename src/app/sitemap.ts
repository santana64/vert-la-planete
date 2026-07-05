import type { MetadataRoute } from "next";
import { listArticles, listJobs, listSellers } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

const base = getSiteUrl();

const STATIC_ROUTES = [
  "",
  "/partenaires",
  "/actualites",
  "/emplois",
  "/offres",
  "/devenir-partenaire",
  "/a-propos",
  "/contact",
  "/mentions-legales",
  "/cgv",
  "/confidentialite",
  "/rgpd"
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));

  // Contenus dynamiques — tolérant à une base injoignable (le sitemap statique reste servi).
  try {
    const [sellers, articles, jobs] = await Promise.all([
      listSellers(),
      listArticles(),
      listJobs()
    ]);
    for (const s of sellers) {
      entries.push({ url: `${base}/partenaires/${s.slug}`, changeFrequency: "weekly", priority: 0.8 });
    }
    for (const a of articles) {
      entries.push({ url: `${base}/actualites/${a.slug}`, changeFrequency: "monthly", priority: 0.6 });
    }
    for (const j of jobs) {
      entries.push({ url: `${base}/emplois/${j.slug}`, changeFrequency: "weekly", priority: 0.6 });
    }
  } catch {
    // Base indisponible : on sert uniquement les routes statiques.
  }

  return entries;
}

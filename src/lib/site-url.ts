/**
 * URL publique du site, résolue dans cet ordre :
 * 1. APP_URL (explicite, ex. domaine client) — ignorée si elle pointe vers
 *    localhost alors qu'on tourne sur Vercel (mauvaise config importée du .env)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (domaine de prod stable, fourni par Vercel)
 * 3. VERCEL_URL (URL du déploiement courant)
 * 4. localhost (dev)
 */
export function getSiteUrl(): string {
  const appUrl = process.env.APP_URL;
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const vercelUrl = process.env.VERCEL_URL;

  const isLocalhost = (u: string) => u.includes("localhost") || u.includes("127.0.0.1");

  if (appUrl && !(isLocalhost(appUrl) && (vercelProd || vercelUrl))) return appUrl;
  if (vercelProd) return `https://${vercelProd}`;
  if (vercelUrl) return `https://${vercelUrl}`;
  return "http://localhost:3000";
}

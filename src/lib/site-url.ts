/**
 * URL publique du site, résolue dans cet ordre :
 * 1. APP_URL (explicite, ex. domaine client)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (domaine de prod stable, fourni par Vercel)
 * 3. VERCEL_URL (URL du déploiement courant)
 * 4. localhost (dev)
 */
export function getSiteUrl(): string {
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

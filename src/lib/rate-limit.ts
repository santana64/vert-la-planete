import "server-only";

/**
 * Limiteur de débit en mémoire (fenêtre glissante simple).
 * Suffisant à l'échelle du lancement : protège le login/l'inscription du
 * brute-force basique. En serverless, la mémoire est par instance (la limite
 * se réinitialise à froid) — pour durcir au-delà, brancher un store partagé
 * (Upstash/Redis) derrière la même interface.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  bucket.count += 1;
  if (bucket.count > max) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfterSec: 0 };
}

/** Réinitialise une clé (ex. après une connexion réussie). */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

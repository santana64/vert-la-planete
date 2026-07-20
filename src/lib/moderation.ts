/**
 * Modération légère des contenus publiés par les utilisateurs (avis, lieux,
 * fiches, produits). Refuse à la source les contenus manifestement non conformes :
 * insultes, spam, liens en masse, tout en majuscules. C'est une première ligne
 * automatique — la liste est volontairement conservatrice et facilement extensible.
 */

// Termes bloqués (insultes / haine). Liste courte et tunable.
const BLOCKED_WORDS = [
  "connard",
  "connasse",
  "salope",
  "enculé",
  "encule",
  "pute",
  "putain",
  "ntm",
  "fdp",
  "batard",
  "bâtard",
  "nègre",
  "negre",
  "bougnoule",
  "pédé",
  "pede",
  "tapette",
  "youpin"
];

// Motifs de spam fréquents (arnaques, contenus hors-sujet).
const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|porn|xxx|escort)\b/i,
  /\b(bitcoin|crypto|forex|trading)\s+(gratuit|profit|gains?)/i,
  /\b(pr[êe]t|credit|loan)\s+(rapide|immédiat|garanti|sans\s+refus)/i,
  /\bgagnez?\s+de\s+l'?argent\b/i
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export type ModerationResult = { ok: true } | { ok: false; reason: string };

export function checkContent(raw: string): ModerationResult {
  const text = raw.trim();
  const norm = normalize(text);

  // Trop de liens = spam
  const urlCount = (text.match(/https?:\/\//gi) || []).length;
  if (urlCount >= 3) {
    return { ok: false, reason: "Contenu refusé : trop de liens (spam suspecté)." };
  }

  // Insultes / haine (correspondance sur mots entiers)
  for (const word of BLOCKED_WORDS) {
    const re = new RegExp(`(^|[^a-z0-9])${word}([^a-z0-9]|$)`, "i");
    if (re.test(norm)) {
      return { ok: false, reason: "Contenu refusé : il contient des termes non autorisés." };
    }
  }

  // Spam / hors-sujet
  for (const re of SPAM_PATTERNS) {
    if (re.test(text)) {
      return { ok: false, reason: "Contenu refusé : il ressemble à du spam ou du hors-sujet." };
    }
  }

  // Tout en majuscules (au-delà d'une certaine longueur)
  const letters = text.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (letters.length > 25) {
    const caps = (letters.match(/[A-ZÀ-Þ]/g) || []).length;
    if (caps / letters.length > 0.75) {
      return { ok: false, reason: "Contenu refusé : évitez d'écrire entièrement en majuscules." };
    }
  }

  return { ok: true };
}

/** Vérifie plusieurs champs d'un coup ; renvoie la première raison de rejet. */
export function checkContentFields(...fields: (string | null | undefined)[]): ModerationResult {
  for (const f of fields) {
    if (!f) continue;
    const res = checkContent(f);
    if (!res.ok) return res;
  }
  return { ok: true };
}

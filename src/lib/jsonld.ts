/**
 * Sérialise un objet JSON-LD pour insertion dans <script type="application/ld+json">.
 * `JSON.stringify` n'échappe PAS `<`, `>` ni `&` : un contenu utilisateur (nom de
 * partenaire, titre d'article…) contenant `</script>` pourrait fermer la balise et
 * injecter du HTML (XSS stocké). On échappe ces trois caractères en séquences
 * unicode, ce qui reste du JSON valide et neutralise toute évasion de balise.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

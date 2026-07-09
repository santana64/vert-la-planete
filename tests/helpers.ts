/** Construit un FormData à partir d'un objet — utilisé par tous les tests d'actions. */
export function fd(entries: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) f.set(k, v);
  return f;
}

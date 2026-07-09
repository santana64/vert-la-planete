/** Helpers communs pour les pages filtrées par querystring. */

export function str(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/** Construit un lien de filtre en fusionnant les paramètres courants et les changements. */
export function buildFilterHref(
  basePath: string,
  current: Record<string, string | undefined>,
  changes: Record<string, string | null>
): string {
  const sp = new URLSearchParams();
  const merged = { ...current };
  for (const [k, v] of Object.entries(changes)) {
    if (v === null) delete merged[k];
    else merged[k] = v;
  }
  for (const [k, v] of Object.entries(merged)) if (v) sp.set(k, v);
  const qs = sp.toString();
  return `${basePath}${qs ? `?${qs}` : ""}`;
}

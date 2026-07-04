const EUR = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2
});

/** 1250 -> "12,50 EUR" */
export function formatPrice(cents: number): string {
  return EUR.format(cents / 100);
}

/** "12,50" without the currency symbol (for split display: price + unit). */
export function formatAmount(cents: number): string {
  return new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2 }).format(cents / 100);
}

const DATE = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric"
});

export function formatDate(date: Date | string): string {
  return DATE.format(typeof date === "string" ? new Date(date) : date);
}

/** Generates a URL-safe slug from a French label. */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
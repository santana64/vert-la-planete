import "server-only";
import Stripe from "stripe";
import { OFFERS } from "@/lib/constants";

let cached: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY n'est pas configuré.");
  if (!cached) cached = new Stripe(key);
  return cached;
}

/**
 * Returns the Stripe Price id for an offer's lookup key, creating the Product +
 * recurring Price on the fly if it doesn't exist yet (idempotent). Avoids any
 * manual dashboard setup — the offers in src/lib/constants are the source of truth.
 */
export async function ensurePriceId(lookupKey: string): Promise<string> {
  const stripe = getStripe();
  const existing = await stripe.prices.list({
    lookup_keys: [lookupKey],
    active: true,
    limit: 1
  });
  if (existing.data[0]) return existing.data[0].id;

  const offer = OFFERS.find((o) => o.stripeLookupKey === lookupKey);
  if (!offer || !offer.interval) throw new Error(`Offre inconnue: ${lookupKey}`);

  const product = await stripe.products.create({
    name: `Vert La Planète — Offre ${offer.name}`,
    metadata: { offerKey: offer.key }
  });
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: offer.priceCents,
    currency: "eur",
    recurring: { interval: offer.interval },
    lookup_key: lookupKey
  });
  return price.id;
}

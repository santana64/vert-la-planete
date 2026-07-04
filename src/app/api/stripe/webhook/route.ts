import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sellers, users } from "@/db/schema";
import { OFFERS, type OfferKey } from "@/lib/constants";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function applyOffer(userId: string, offer: OfferKey, status: string, subscriptionId?: string) {
  await db
    .update(users)
    .set({ offer, subscriptionStatus: status, stripeSubscriptionId: subscriptionId })
    .where(eq(users.id, userId));
  await db.update(sellers).set({ offer }).where(eq(sellers.userId, userId));
}

function offerFromPriceLookup(lookupKey?: string | null): OfferKey | null {
  const offer = OFFERS.find((o) => o.stripeLookupKey === lookupKey);
  return offer?.key ?? null;
}

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret manquant" }, { status: 503 });
  }

  const stripe = getStripe();
  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature ?? "", secret);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const offer = session.metadata?.offer as OfferKey | undefined;
      if (userId && offer) {
        await applyOffer(
          userId,
          offer,
          "active",
          typeof session.subscription === "string" ? session.subscription : undefined
        );
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object;
      const userId = sub.metadata?.userId;
      const lookupKey = sub.items.data[0]?.price?.lookup_key;
      const offer = offerFromPriceLookup(lookupKey);
      if (userId && offer) {
        const active = sub.status === "active" || sub.status === "trialing";
        await applyOffer(userId, active ? offer : "gratuit", sub.status, sub.id);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const userId = sub.metadata?.userId;
      if (userId) await applyOffer(userId, "gratuit", "canceled", undefined);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

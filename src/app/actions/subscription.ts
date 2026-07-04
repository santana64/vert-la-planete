"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sellers, users } from "@/db/schema";
import { getCurrentUser, getSellerForUser } from "@/lib/auth";
import { OFFERS, type OfferKey } from "@/lib/constants";
import { ensurePriceId, getStripe, isStripeConfigured } from "@/lib/stripe";

export type SubscriptionState = { url?: string; error?: string };

export async function startSubscriptionAction(offerKey: OfferKey): Promise<SubscriptionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/offres");

  // Souscrire implique d'être partenaire — sinon on oriente vers la création de fiche.
  const seller = await getSellerForUser(user.id);
  if (!seller) redirect("/espace-partenaire/creer");

  const offer = OFFERS.find((o) => o.key === offerKey);
  if (!offer || !offer.stripeLookupKey) {
    // Offre gratuite : rien à payer.
    redirect("/espace-partenaire");
  }

  if (!isStripeConfigured()) {
    return {
      error:
        "Le paiement Stripe n'est pas encore configuré (clé API manquante). Réessayez après configuration."
    };
  }

  const stripe = getStripe();

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id }
    });
    customerId = customer.id;
    await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, user.id));
  }

  const priceId = await ensurePriceId(offer!.stripeLookupKey!);
  const base = process.env.APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/offres/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/offres`,
    metadata: { userId: user.id, offer: offer!.key },
    subscription_data: { metadata: { userId: user.id, offer: offer!.key } }
  });

  if (!session.url) return { error: "Impossible de créer la session de paiement." };
  return { url: session.url };
}

/**
 * Confirme une session après retour de Stripe (filet de sécurité si le webhook
 * n'est pas branché en local) : applique l'offre au compte + à la fiche partenaire.
 */
export async function confirmCheckoutSession(sessionId: string): Promise<OfferKey | null> {
  if (!isStripeConfigured()) return null;
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid" && session.status !== "complete") return null;

  const userId = session.metadata?.userId;
  const offer = session.metadata?.offer as OfferKey | undefined;
  if (!userId || !offer) return null;

  await db
    .update(users)
    .set({
      offer,
      subscriptionStatus: "active",
      stripeSubscriptionId:
        typeof session.subscription === "string" ? session.subscription : undefined
    })
    .where(eq(users.id, userId));
  await db.update(sellers).set({ offer }).where(eq(sellers.userId, userId));
  return offer;
}

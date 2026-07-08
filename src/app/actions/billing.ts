"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getSiteUrl } from "@/lib/site-url";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export type BillingState = { url?: string; error?: string };

/**
 * Ouvre le portail client Stripe : factures, moyens de paiement, résiliation.
 * Nécessite un abonnement Pro (donc un customer Stripe existant).
 */
export async function openBillingPortalAction(): Promise<BillingState> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/compte");

  if (!isStripeConfigured()) {
    return {
      error: "Le paiement n'est pas encore activé — vos factures apparaîtront ici dès l'activation."
    };
  }
  if (!user.stripeCustomerId) {
    return {
      error: "Aucune transaction pour le moment. Souscrivez une offre Pro pour retrouver ici vos factures et votre moyen de paiement."
    };
  }

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${getSiteUrl()}/compte`
  });
  return { url: session.url };
}

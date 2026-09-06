import "server-only";
import Stripe from "stripe";
import type { Order, Subscription } from "@/types/database";
import { packages } from "@/lib/packages";
import { plans, type PlanId } from "@/lib/services";
import { stripeConfigured } from "@/lib/env";

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeConfigured) throw new Error("Stripe is not configured (STRIPE_SECRET_KEY missing)");
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY!);
  return client;
}

/**
 * Server-created Checkout Session. The price comes from the package catalog, never from
 * the client. The order id travels in client_reference_id and metadata so the webhook
 * and the success page can find it.
 */
export async function createCheckoutSession(order: Order, origin: string, businessName: string) {
  const pkg = packages[order.package];
  const stripe = getStripe();
  return stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: order.customer_email,
    client_reference_id: order.id,
    metadata: { order_id: order.id, package: order.package, business_id: order.business_id ?? "" },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: pkg.price,
          product_data: {
            name: `Maprizz ${pkg.name}`,
            description: `${pkg.tagline} For ${businessName}.`,
          },
        },
      },
    ],
    shipping_address_collection: { allowed_countries: ["US"] },
    success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/order?canceled=1&package=${order.package}`,
  });
}

/** Payment link for field sales: same session, but returned as a URL to text/show the customer. */
export async function createFieldSalesSession(order: Order, origin: string, businessName: string) {
  const pkg = packages[order.package];
  const stripe = getStripe();
  return stripe.checkout.sessions.create({
    mode: "payment",
    ...(order.customer_email ? { customer_email: order.customer_email } : {}),
    client_reference_id: order.id,
    metadata: { order_id: order.id, package: order.package, business_id: order.business_id ?? "", source: "field_sales" },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: pkg.price,
          product_data: { name: `Maprizz ${pkg.name}`, description: `For ${businessName}.` },
        },
      },
    ],
    success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/admin/sell?canceled=1`,
  });
}

export async function createSubscriptionCheckout(sub: Subscription, origin: string, businessName: string, planId: PlanId) {
  const plan = plans[planId];
  const stripe = getStripe();
  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: sub.customer_email,
    client_reference_id: sub.id,
    metadata: {
      kind: "subscription",
      subscription_id: sub.id,
      plan: plan.id,
      business_id: sub.business_id,
    },
    subscription_data: {
      description: `Maprizz ${plan.name} for ${businessName}`,
      metadata: {
        subscription_id: sub.id,
        plan: plan.id,
        business_id: sub.business_id,
        minimum_term_months: String(plan.minimumMonths),
      },
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: plan.monthly,
          recurring: { interval: "month" },
          product_data: {
            name: `Maprizz ${plan.name}`,
            description: `${plan.tagline} Billed monthly for ${businessName}.`,
          },
        },
      },
    ],
    success_url: `${origin}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/subscribe?canceled=1&plan=${plan.id}`,
  });
}

export function paymentIntentId(session: Stripe.Checkout.Session): string | null {
  const pi = session.payment_intent;
  if (!pi) return null;
  return typeof pi === "string" ? pi : pi.id;
}

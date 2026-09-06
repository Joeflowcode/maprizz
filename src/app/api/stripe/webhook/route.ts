import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getDb } from "@/lib/db";
import { stripeConfigured, stripeWebhookConfigured } from "@/lib/env";
import { paymentIntentId } from "@/lib/stripe";
import { fulfillPaidOrder } from "@/lib/tap";
import { activatePaidSubscription, mapStripeStatus } from "@/lib/subscriptions";

function stripeId(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value && "id" in value && typeof value.id === "string") return value.id;
  return null;
}

function unixSeconds(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}

function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const fromParent = invoice.parent?.subscription_details?.subscription;
  if (fromParent) return stripeId(fromParent);
  return stripeId((invoice as unknown as { subscription?: unknown }).subscription);
}

/**
 * Stripe → Maprizz. Card orders stay one-time. Monthly plans are Checkout in
 * subscription mode, then invoice.paid / customer.subscription.* keep status in sync.
 */
export async function POST(request: Request) {
  if (!stripeConfigured || !stripeWebhookConfigured) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 503 });
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const { getStripe } = await import("@/lib/stripe");
  const stripe = getStripe();
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    console.error("[stripe] signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object;
      if (session.mode === "subscription" || session.metadata?.kind === "subscription") {
        await handleSubscriptionCheckout(session, stripe);
      } else if (session.payment_status === "paid") {
        await handleOrderCheckout(session);
      }
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      await syncStripeSubscription(event.data.object);
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object;
      const stripeSubId = invoiceSubscriptionId(invoice);
      if (stripeSubId) {
        const db = await getDb();
        const sub = await db.getSubscriptionByStripeId(stripeSubId);
        if (sub && sub.status !== "canceled") {
          const periodEnd = unixSeconds(invoice.lines?.data?.[0]?.period?.end);
          await db.updateSubscription(sub.id, {
            status: "active",
            current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : sub.current_period_end,
          });
        }
      }
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object;
      const stripeSubId = invoiceSubscriptionId(invoice);
      if (stripeSubId) {
        const db = await getDb();
        const sub = await db.getSubscriptionByStripeId(stripeSubId);
        if (sub && sub.status === "active") {
          await db.updateSubscription(sub.id, { status: "past_due" });
        }
      }
    }
  } catch (error) {
    console.error("[stripe] webhook handler failed", error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleOrderCheckout(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id ?? session.client_reference_id;
  if (!orderId) return;
  const db = await getDb();
  const order = await db.getOrder(orderId);
  if (!order) return;
  await fulfillPaidOrder(order, { sessionId: session.id, paymentIntentId: paymentIntentId(session), status: "paid" });
}

async function handleSubscriptionCheckout(session: Stripe.Checkout.Session, stripe: Stripe) {
  const db = await getDb();
  const localId = session.metadata?.subscription_id ?? session.client_reference_id;
  const sub = localId
    ? await db.getSubscription(localId)
    : session.id
      ? await db.getSubscriptionByCheckoutSession(session.id)
      : null;
  if (!sub) return;

  const stripeSubId = stripeId(session.subscription);
  let periodEnd: number | null = null;
  let stripeStatus: string | null = null;
  let cancelAtPeriodEnd = false;
  if (stripeSubId) {
    const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);
    periodEnd = unixSeconds((stripeSub as unknown as { current_period_end?: number }).current_period_end);
    stripeStatus = stripeSub.status;
    cancelAtPeriodEnd = Boolean(stripeSub.cancel_at_period_end);
  }

  await activatePaidSubscription(sub, {
    sessionId: session.id,
    customerId: stripeId(session.customer),
    stripeSubscriptionId: stripeSubId,
    status: mapStripeStatus(stripeStatus) === "incomplete" ? "active" : mapStripeStatus(stripeStatus),
    periodEnd,
    cancelAtPeriodEnd,
  });
}

async function syncStripeSubscription(stripeSub: Stripe.Subscription) {
  const db = await getDb();
  const sub =
    (await db.getSubscriptionByStripeId(stripeSub.id)) ??
    (stripeSub.metadata?.subscription_id ? await db.getSubscription(stripeSub.metadata.subscription_id) : null);
  if (!sub) return;
  const periodEnd = unixSeconds((stripeSub as unknown as { current_period_end?: number }).current_period_end);
  await db.updateSubscription(sub.id, {
    status: mapStripeStatus(stripeSub.status),
    stripe_customer_id: stripeId(stripeSub.customer) ?? sub.stripe_customer_id,
    stripe_subscription_id: stripeSub.id,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : sub.current_period_end,
    cancel_at_period_end: Boolean(stripeSub.cancel_at_period_end),
  });
}

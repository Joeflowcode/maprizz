import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isProduction, stripeConfigured, useMockPayments } from "@/lib/env";
import { plans } from "@/lib/services";
import { uniqueSlug } from "@/lib/tap";
import { subscribeSchema, flattenErrors } from "@/lib/validation";

/**
 * Creates the business + incomplete subscription, then Stripe Checkout in subscription
 * mode (or the mock checkout when Stripe isn't configured). First charge is today;
 * Stripe bills the same amount every month after that.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Please check the highlighted fields.", errors: flattenErrors(parsed.error) }, { status: 400 });
  }
  const input = parsed.data;
  if (input.company) {
    return NextResponse.json({ ok: true, url: "/subscribe/success" });
  }

  const plan = plans[input.plan];

  if (!stripeConfigured && !useMockPayments) {
    return NextResponse.json(
      { ok: false, message: "Online billing isn't available right now. Email hello@maprizz.com and we'll set you up directly." },
      { status: 503 },
    );
  }

  const db = await getDb();
  const business = await db.createBusiness({
    owner_user_id: null,
    name: input.business_name,
    slug: await uniqueSlug(db, input.business_name),
    logo_url: null,
    contact_name: input.contact_name,
    phone: input.phone,
    email: input.email,
    website_url: input.website_url,
    address: input.city,
    instagram_url: null,
    facebook_url: null,
    booking_url: null,
    google_business_url: input.google_business_url,
    google_review_url: null,
  });

  const subscription = await db.createSubscription({
    business_id: business.id,
    plan: plan.id,
    status: "incomplete",
    monthly_amount: plan.monthly,
    customer_email: input.email,
    stripe_customer_id: null,
    stripe_subscription_id: null,
    stripe_checkout_session_id: null,
    current_period_end: null,
    cancel_at_period_end: false,
    notes: input.notes,
  });

  const origin = new URL(request.url).origin;

  if (stripeConfigured) {
    try {
      const { createSubscriptionCheckout } = await import("@/lib/stripe");
      const session = await createSubscriptionCheckout(subscription, origin, business.name, plan.id);
      await db.updateSubscription(subscription.id, { stripe_checkout_session_id: session.id });
      return NextResponse.json({ ok: true, url: session.url });
    } catch (error) {
      console.error("[subscribe] stripe session failed", error);
      return NextResponse.json({ ok: false, message: "We couldn't start checkout. Please try again in a moment." }, { status: 502 });
    }
  }

  const mockSession = `mock_sub_${subscription.id}`;
  await db.updateSubscription(subscription.id, { stripe_checkout_session_id: mockSession });
  return NextResponse.json({ ok: true, url: `${origin}/subscribe/mock-checkout?subscription=${subscription.id}`, mock: !isProduction });
}

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isProduction, stripeConfigured, useMockPayments } from "@/lib/env";
import { packages } from "@/lib/packages";
import { uniqueSlug } from "@/lib/tap";
import { checkoutSchema, flattenErrors } from "@/lib/validation";

/**
 * Creates the business + unpaid order, then hands off to Stripe Checkout (or the
 * development mock checkout when Stripe isn't configured). Provisioning of profile and
 * tap links happens only after payment (see lib/tap fulfillPaidOrder).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Please check the highlighted fields.", errors: flattenErrors(parsed.error) }, { status: 400 });
  }
  const input = parsed.data;
  const pkg = packages[input.package];

  if (!stripeConfigured && !useMockPayments) {
    return NextResponse.json(
      { ok: false, message: "Online checkout isn't available right now. Email hello@maprizz.com and we'll set you up directly." },
      { status: 503 },
    );
  }

  const db = await getDb();
  const business = await db.createBusiness({
    owner_user_id: null,
    name: input.business.name,
    slug: await uniqueSlug(db, input.business.name),
    logo_url: input.logo_url,
    contact_name: input.business.contact_name,
    phone: input.business.phone,
    email: input.business.email,
    website_url: input.business.website_url,
    address: input.business.address,
    instagram_url: input.business.instagram_url,
    facebook_url: input.business.facebook_url,
    booking_url: input.business.booking_url,
    google_business_url: input.business.google_business_url,
    google_review_url: input.business.google_review_url,
  });

  const order = await db.createOrder({
    business_id: business.id,
    customer_email: input.business.email,
    package: pkg.id,
    amount: pkg.price,
    stripe_checkout_session_id: null,
    stripe_payment_intent_id: null,
    payment_status: "unpaid",
    fulfillment_status: "new",
    destination_type: input.destination.destination_type,
    destination_url: input.destination.destination_url,
    notes: input.notes,
    source: "web",
  });

  const origin = new URL(request.url).origin;

  if (stripeConfigured) {
    try {
      const { createCheckoutSession } = await import("@/lib/stripe");
      const session = await createCheckoutSession(order, origin, business.name);
      await db.updateOrder(order.id, { stripe_checkout_session_id: session.id });
      return NextResponse.json({ ok: true, url: session.url });
    } catch (error) {
      console.error("[checkout] stripe session failed", error);
      return NextResponse.json({ ok: false, message: "We couldn't start checkout. Please try again in a moment." }, { status: 502 });
    }
  }

  // Development only: mock checkout page.
  const mockSession = `mock_${order.id}`;
  await db.updateOrder(order.id, { stripe_checkout_session_id: mockSession });
  return NextResponse.json({ ok: true, url: `${origin}/order/mock-checkout?order=${order.id}`, mock: !isProduction });
}

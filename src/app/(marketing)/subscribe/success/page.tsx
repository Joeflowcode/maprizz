import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getDb } from "@/lib/db";
import { stripeConfigured } from "@/lib/env";
import { plans } from "@/lib/services";
import { activatePaidSubscription } from "@/lib/subscriptions";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "You're on a monthly plan",
  description: "Your Maprizz subscription is active. We'll follow up about setup.",
  path: "/subscribe/success",
  noIndex: true,
});

export default async function SubscribeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; subscription?: string }>;
}) {
  const { session_id: sessionId, subscription: subscriptionId } = await searchParams;
  const db = await getDb();

  let sub = sessionId ? await db.getSubscriptionByCheckoutSession(sessionId) : null;
  if (!sub && subscriptionId) sub = await db.getSubscription(subscriptionId);

  if (stripeConfigured && sessionId && !sub) {
    try {
      const { getStripe } = await import("@/lib/stripe");
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      const id = session.metadata?.subscription_id ?? session.client_reference_id;
      if (id) sub = await db.getSubscription(id);
    } catch {
      /* fall through */
    }
  }

  if (!sub) notFound();

  if (sub.status === "incomplete") {
    await activatePaidSubscription(sub, {
      sessionId: sessionId ?? sub.stripe_checkout_session_id,
      customerId: sub.stripe_customer_id,
      stripeSubscriptionId: sub.stripe_subscription_id,
      status: "active",
    });
  }

  const plan = plans[sub.plan];
  const business = await db.getBusiness(sub.business_id);

  return (
    <div className="bg-cream">
      <Container size="narrow" className="py-16 sm:py-24">
        <CheckCircle2 className="h-12 w-12 text-brand" aria-hidden="true" />
        <p className="label mt-6 text-brand">Monthly plan active</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
          {plan.priceLabel} a month, on the calendar.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-stone">
          {business?.name ?? "Your business"} is on {plan.name}. Stripe will charge {plan.priceLabel} automatically each month. Receipts go
          to {sub.customer_email}.
        </p>
        <ol className="mt-10 grid gap-3 text-[15px]">
          <li className="rounded-2xl bg-white px-5 py-4">
            <span className="font-semibold">1. We start setup.</span> {plan.setupNote}
          </li>
          <li className="rounded-2xl bg-white px-5 py-4">
            <span className="font-semibold">2. You get access.</span> We&apos;ll email you for Google / domain access if we need it.
          </li>
          <li className="rounded-2xl bg-white px-5 py-4">
            <span className="font-semibold">3. Every month, the work gets done.</span> One person to text. One short report.
          </li>
        </ol>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/login" size="lg">
            Open your dashboard
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/" variant="secondary" size="lg">
            Back to Maprizz
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}

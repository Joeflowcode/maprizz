import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getDb } from "@/lib/db";
import { useMockPayments } from "@/lib/env";
import { formatCents } from "@/lib/packages";
import { plans } from "@/lib/services";
import { activatePaidSubscription } from "@/lib/subscriptions";

export const metadata: Metadata = { title: "Test subscription checkout", robots: { index: false, follow: false } };

async function simulateSubscription(formData: FormData) {
  "use server";
  if (!useMockPayments) redirect("/subscribe");
  const id = String(formData.get("subscription") ?? "");
  const db = await getDb();
  const sub = await db.getSubscription(id);
  if (!sub) notFound();
  await activatePaidSubscription(sub, {
    sessionId: `mock_sub_${sub.id}`,
    customerId: `mock_cus_${sub.id.slice(0, 8)}`,
    stripeSubscriptionId: `mock_substripe_${sub.id.slice(0, 8)}`,
    status: "active",
    periodEnd: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
  });
  redirect(`/subscribe/success?subscription=${sub.id}`);
}

export default async function MockSubscribeCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ subscription?: string }>;
}) {
  if (!useMockPayments) redirect("/subscribe");
  const { subscription: id } = await searchParams;
  if (!id) notFound();
  const db = await getDb();
  const sub = await db.getSubscription(id);
  if (!sub) notFound();
  if (sub.status !== "incomplete") redirect(`/subscribe/success?subscription=${sub.id}`);
  const business = await db.getBusiness(sub.business_id);
  const plan = plans[sub.plan];

  return (
    <div className="bg-cream">
      <Container size="narrow" className="py-14 sm:py-20">
        <div className="rounded-3xl border-2 border-dashed border-accent bg-white p-6 sm:p-10">
          <p className="label inline-block rounded-full bg-accent/15 px-3 py-1.5 text-ink">Development only · mock subscription</p>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-[-0.03em]">Simulated monthly Stripe billing</h1>
          <p className="mt-3 text-stone">
            Stripe isn&apos;t configured, so this page stands in for a subscription Checkout. Nothing is charged. In production Stripe bills{" "}
            {plan.priceLabel} today and every month after.
          </p>
          <dl className="mt-8 divide-y divide-ink/10 rounded-2xl bg-cream px-5">
            <div className="flex justify-between py-3 text-sm">
              <dt className="text-stone">Business</dt>
              <dd className="font-semibold">{business?.name}</dd>
            </div>
            <div className="flex justify-between py-3 text-sm">
              <dt className="text-stone">Plan</dt>
              <dd className="font-semibold">{plan.name}</dd>
            </div>
            <div className="flex justify-between py-3 text-sm">
              <dt className="text-stone">Email</dt>
              <dd className="font-semibold">{sub.customer_email}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-stone">Every month</dt>
              <dd className="font-display text-2xl font-semibold">{formatCents(sub.monthly_amount)}</dd>
            </div>
          </dl>
          <form action={simulateSubscription} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input type="hidden" name="subscription" value={sub.id} />
            <Button type="submit" size="lg">
              Simulate first monthly payment
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <ButtonLink href={`/subscribe?canceled=1&plan=${sub.plan}`} variant="secondary" size="lg">
              Cancel
            </ButtonLink>
          </form>
        </div>
      </Container>
    </div>
  );
}

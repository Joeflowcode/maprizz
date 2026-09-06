import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getDb } from "@/lib/db";
import { useMockPayments } from "@/lib/env";
import { formatCents, packages } from "@/lib/packages";
import { fulfillPaidOrder } from "@/lib/tap";

export const metadata: Metadata = { title: "Test checkout", robots: { index: false, follow: false } };

async function simulatePayment(formData: FormData) {
  "use server";
  if (!useMockPayments) redirect("/order");
  const orderId = String(formData.get("order") ?? "");
  const db = await getDb();
  const order = await db.getOrder(orderId);
  if (!order) notFound();
  await fulfillPaidOrder(order, { sessionId: `mock_${order.id}`, paymentIntentId: `mock_pi_${order.id.slice(0, 8)}`, status: "paid" });
  redirect(`/order/success?order=${order.id}`);
}

export default async function MockCheckoutPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  if (!useMockPayments) redirect("/order");
  const { order: orderId } = await searchParams;
  if (!orderId) notFound();
  const db = await getDb();
  const order = await db.getOrder(orderId);
  if (!order || !order.business_id) notFound();
  if (order.payment_status !== "unpaid") redirect(`/order/success?order=${order.id}`);
  const business = await db.getBusiness(order.business_id);
  const pkg = packages[order.package];

  return (
    <div className="bg-cream">
      <Container size="narrow" className="py-14 sm:py-20">
        <div className="rounded-3xl border-2 border-dashed border-accent bg-white p-6 sm:p-10">
          <p className="label rounded-full bg-accent/15 px-3 py-1.5 text-ink inline-block">Development only · mock payment</p>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-[-0.03em]">Simulated Stripe Checkout</h1>
          <p className="mt-3 text-stone">
            Stripe isn&apos;t configured, so this page stands in for Stripe. Nothing is charged. In production this step is Stripe&apos;s hosted checkout.
          </p>
          <dl className="mt-8 divide-y divide-ink/10 rounded-2xl bg-cream px-5">
            <div className="flex justify-between py-3 text-sm">
              <dt className="text-stone">Business</dt>
              <dd className="font-semibold">{business?.name}</dd>
            </div>
            <div className="flex justify-between py-3 text-sm">
              <dt className="text-stone">Package</dt>
              <dd className="font-semibold">{pkg.name}</dd>
            </div>
            <div className="flex justify-between py-3 text-sm">
              <dt className="text-stone">Email</dt>
              <dd className="font-semibold">{order.customer_email}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-stone">Total</dt>
              <dd className="font-display text-2xl font-semibold">{formatCents(order.amount)}</dd>
            </div>
          </dl>
          <form action={simulatePayment} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input type="hidden" name="order" value={order.id} />
            <Button type="submit" size="lg">
              Simulate successful payment
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <ButtonLink href={`/order?canceled=1&package=${order.package}`} variant="secondary" size="lg">
              Cancel
            </ButtonLink>
          </form>
        </div>
      </Container>
    </div>
  );
}

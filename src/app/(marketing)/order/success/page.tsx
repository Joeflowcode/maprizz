import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { QrPanel } from "@/components/qr-panel";
import { getDb } from "@/lib/db";
import { stripeConfigured } from "@/lib/env";
import { packages } from "@/lib/packages";
import { describeDestination, fulfillPaidOrder, resolveDestinationAbsolute, shortUrlFor } from "@/lib/tap";
import type { Order } from "@/types/database";

export const metadata: Metadata = { title: "Order complete", robots: { index: false, follow: false } };

export const dynamic = "force-dynamic";

/**
 * Lands here from Stripe (session_id) or the mock checkout (order). If the webhook hasn't
 * fired yet we verify the session with Stripe and provision right away.
 */
async function resolveOrder(sessionId?: string, orderId?: string): Promise<Order | null> {
  const db = await getDb();
  if (orderId) return db.getOrder(orderId);
  if (!sessionId) return null;

  const existing = await db.getOrderByCheckoutSession(sessionId);
  if (existing && existing.payment_status !== "unpaid") return existing;
  if (!stripeConfigured) return existing;

  const { getStripe, paymentIntentId } = await import("@/lib/stripe");
  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  const id = session.metadata?.order_id ?? session.client_reference_id;
  const order = existing ?? (id ? await db.getOrder(id) : null);
  if (!order) return null;
  if (session.payment_status === "paid") {
    const result = await fulfillPaidOrder(order, { sessionId: session.id, paymentIntentId: paymentIntentId(session), status: "paid" });
    return result.order;
  }
  return order;
}

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string; order?: string }> }) {
  const { session_id, order: orderId } = await searchParams;
  const order = await resolveOrder(session_id, orderId);
  if (!order || !order.business_id) notFound();

  const db = await getDb();
  const [business, profile, links] = await Promise.all([db.getBusiness(order.business_id), db.getProfile(order.business_id), db.listTapLinks(order.business_id)]);
  if (!business) notFound();
  const pkg = packages[order.package];
  const paid = order.payment_status !== "unpaid";

  return (
    <div className="bg-cream">
      <Container size="default" className="py-12 sm:py-16">
        <div className="max-w-2xl">
          <p className="label flex items-center gap-2 text-brand">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {paid ? "Payment received" : "Payment pending"}
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            {paid ? <>Tap. Done. {business.name} is live.</> : <>Almost there.</>}
          </h1>
          <p className="mt-4 text-lg text-stone">
            {paid ? (
              <>
                Your {pkg.name} is in the queue. Your permanent Maprizz URL{links.length > 1 ? "s are" : " is"} ready below; the printed card will arrive in a few business days. A receipt went to{" "}
                <strong className="text-ink">{order.customer_email}</strong>.
              </>
            ) : (
              <>We&apos;re waiting for payment confirmation. Refresh in a moment, or check your email for a receipt from Stripe.</>
            )}
          </p>
        </div>

        {paid ? (
          <>
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {links.map((link) => (
                <QrPanel
                  key={link.id}
                  link={link}
                  shortUrl={shortUrlFor(link)}
                  destinationLabel={describeDestination(link, business)}
                  destinationUrl={resolveDestinationAbsolute(link, business, profile)}
                />
              ))}
            </div>

            <div className="mt-10 grid gap-6 rounded-3xl bg-ink p-6 text-cream sm:p-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Your dashboard is ready.</h2>
                <p className="mt-2 text-mist">
                  Log in with <strong className="text-cream">{order.customer_email}</strong> to edit your {profile?.enabled ? "profile, " : ""}links and destination, and to watch taps come in. No password; we email you a sign-in link.
                </p>
              </div>
              <div className="lg:col-span-4 lg:justify-self-end">
                <ButtonLink href="/login?next=/dashboard" size="lg">
                  Open my dashboard
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>

            {profile?.enabled ? (
              <p className="mt-6 text-sm text-stone">
                Preview your profile at{" "}
                <Link href={`/p/${business.slug}`} className="font-mono text-ink underline underline-offset-4">
                  /p/{business.slug}
                </Link>
                .
              </p>
            ) : null}
          </>
        ) : null}
      </Container>
    </div>
  );
}

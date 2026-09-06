import "server-only";
import type { Subscription, SubscriptionStatus } from "@/types/database";
import { getDb } from "@/lib/db";
import { plans } from "@/lib/services";
import { provisionBusiness } from "@/lib/tap";
import { getMailConfig, sendSubmissionEmail } from "@/lib/mail";

function periodEndIso(unixSeconds: number | null | undefined) {
  if (!unixSeconds) return null;
  return new Date(unixSeconds * 1000).toISOString();
}

export function mapStripeStatus(status: string | null | undefined): SubscriptionStatus {
  if (status === "active" || status === "trialing") return "active";
  if (status === "past_due") return "past_due";
  if (status === "canceled" || status === "incomplete_expired") return "canceled";
  if (status === "unpaid") return "unpaid";
  return "incomplete";
}

/**
 * Mark a retainer paid and kick off setup. Safe to call from the webhook and the success page.
 */
export async function activatePaidSubscription(
  sub: Subscription,
  payment: {
    sessionId: string | null;
    customerId: string | null;
    stripeSubscriptionId: string | null;
    status?: SubscriptionStatus;
    periodEnd?: number | null;
    cancelAtPeriodEnd?: boolean;
  },
) {
  const db = await getDb();
  const nextStatus = payment.status ?? "active";
  const updated =
    sub.status === "incomplete" || sub.status !== nextStatus || !sub.stripe_subscription_id
      ? await db.updateSubscription(sub.id, {
          status: nextStatus,
          stripe_checkout_session_id: payment.sessionId ?? sub.stripe_checkout_session_id,
          stripe_customer_id: payment.customerId ?? sub.stripe_customer_id,
          stripe_subscription_id: payment.stripeSubscriptionId ?? sub.stripe_subscription_id,
          current_period_end: periodEndIso(payment.periodEnd) ?? sub.current_period_end,
          cancel_at_period_end: payment.cancelAtPeriodEnd ?? sub.cancel_at_period_end,
        })
      : sub;

  const business = await db.getBusiness(sub.business_id);
  if (business && (sub.plan === "gbp" || sub.plan === "growth")) {
    const hardware = sub.plan === "growth" ? "business_kit" : "tap_card";
    await provisionBusiness(business, hardware, {
      type: sub.plan === "growth" ? "profile" : "google_review",
      url: null,
    }).catch((error) => console.error("[subscribe] provision failed", error));
  }

  if (sub.status === "incomplete" && nextStatus === "active" && getMailConfig().ok) {
    const plan = plans[sub.plan];
    await sendSubmissionEmail({
      subject: `New monthly plan: ${plan.name} — ${business?.name ?? sub.customer_email}`,
      replyTo: sub.customer_email,
      rows: [
        ["Plan", `${plan.name} (${plan.priceLabel}/mo)`],
        ["Business", business?.name],
        ["Contact", business?.contact_name ?? undefined],
        ["Email", sub.customer_email],
        ["Phone", business?.phone ?? undefined],
        ["City / address", business?.address ?? undefined],
        ["Website", business?.website_url ?? undefined],
        ["Google listing", business?.google_business_url ?? undefined],
        ["Setup", plan.setupNote],
      ],
    }).catch((error) => console.error("[subscribe] notify failed", error));
  }

  return updated;
}

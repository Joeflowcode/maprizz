"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { siteOrigin, stripeConfigured, useMockPayments } from "@/lib/env";
import { packages } from "@/lib/packages";
import { fulfillPaidOrder, provisionBusiness, uniqueCode, uniqueSlug } from "@/lib/tap";
import { fieldSaleSchema, flattenErrors, formDataToObject, fulfillmentStatusSchema, paymentStatusSchema, type FieldErrors } from "@/lib/validation";
import type { TapLinkType } from "@/types/database";

export type AdminActionState = { ok: boolean; message?: string; errors?: FieldErrors };

const idle: AdminActionState = { ok: false };

/**
 * Field sales: create business + order + profile + tap links in one go, standing in the
 * customer's shop. Redirects to the CUSTOMER READY screen.
 */
export async function createCustomerAction(_prev: AdminActionState = idle, formData: FormData): Promise<AdminActionState> {
  await requireAdmin("/admin/sell");
  const parsed = fieldSaleSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", errors: flattenErrors(parsed.error) };
  const input = parsed.data;
  const pkg = packages[input.package];

  const db = await getDb();
  const business = await db.createBusiness({
    owner_user_id: null,
    name: input.name,
    slug: await uniqueSlug(db, input.name),
    logo_url: null,
    contact_name: input.contact_name,
    phone: input.phone,
    email: input.email,
    website_url: input.website_url,
    address: null,
    instagram_url: null,
    facebook_url: null,
    booking_url: null,
    google_business_url: null,
    google_review_url: input.google_review_url,
  });

  const order = await db.createOrder({
    business_id: business.id,
    customer_email: input.email ?? "",
    package: pkg.id,
    amount: pkg.price,
    stripe_checkout_session_id: null,
    stripe_payment_intent_id: null,
    payment_status: input.payment_status,
    fulfillment_status: "new",
    destination_type: pkg.hasProfile ? "profile" : "website",
    destination_url: null,
    notes: null,
    source: "field_sales",
  });

  await provisionBusiness(business, pkg.id, { type: pkg.hasProfile ? "profile" : "website", url: null });
  revalidatePath("/admin/orders");
  revalidatePath("/admin/businesses");
  redirect(`/admin/sell/ready/${order.id}`);
}

export async function setFulfillmentStatusAction(orderId: string, formData: FormData) {
  await requireAdmin();
  const status = fulfillmentStatusSchema.safeParse(formData.get("status"));
  if (!status.success) return;
  const db = await getDb();
  await db.updateOrder(orderId, { fulfillment_status: status.data });
  revalidatePath("/admin/orders", "layout");
}

export async function setPaymentStatusAction(orderId: string, formData: FormData) {
  await requireAdmin();
  const status = paymentStatusSchema.safeParse(formData.get("status"));
  if (!status.success) return;
  const db = await getDb();
  const order = await db.getOrder(orderId);
  if (!order) return;
  // Marking an unpaid web order as paid/cash/complimentary provisions it exactly like a
  // Stripe payment would (idempotent if links already exist).
  if (order.payment_status === "unpaid" && status.data !== "unpaid" && order.business_id) {
    await fulfillPaidOrder(order, { sessionId: null, paymentIntentId: null, status: status.data });
  } else {
    await db.updateOrder(orderId, { payment_status: status.data });
  }
  revalidatePath("/admin/orders", "layout");
  revalidatePath(`/admin/sell/ready/${orderId}`);
  if (order.business_id) revalidatePath(`/admin/businesses/${order.business_id}`);
}

export async function saveOrderNotesAction(orderId: string, formData: FormData) {
  await requireAdmin();
  const notes = String(formData.get("notes") ?? "").trim().slice(0, 4000) || null;
  const db = await getDb();
  await db.updateOrder(orderId, { notes });
  revalidatePath(`/admin/orders/${orderId}`);
}

/** Take payment in the field: Stripe Checkout link the customer can open on their phone. */
export async function createPaymentLinkAction(orderId: string): Promise<{ url: string } | { error: string }> {
  await requireAdmin();
  const db = await getDb();
  const order = await db.getOrder(orderId);
  if (!order || !order.business_id) return { error: "Order not found." };
  const business = await db.getBusiness(order.business_id);
  if (!business) return { error: "Business not found." };

  if (stripeConfigured) {
    const { createFieldSalesSession } = await import("@/lib/stripe");
    const session = await createFieldSalesSession(order, siteOrigin(), business.name);
    await db.updateOrder(order.id, { stripe_checkout_session_id: session.id });
    return session.url ? { url: session.url } : { error: "Stripe didn't return a checkout URL." };
  }
  if (useMockPayments) {
    await db.updateOrder(order.id, { stripe_checkout_session_id: `mock_${order.id}` });
    return { url: `${siteOrigin()}/order/mock-checkout?order=${order.id}` };
  }
  return { error: "Stripe isn't configured. Mark the order as cash or complimentary instead." };
}

/** Admin: add a tap link of a given type to a business (e.g. a second card or a review stand). */
export async function createTapLinkAction(businessId: string, formData: FormData) {
  await requireAdmin();
  const type = formData.get("type");
  const allowed: TapLinkType[] = ["business_card", "review_stand", "qr", "other"];
  if (typeof type !== "string" || !allowed.includes(type as TapLinkType)) return;
  const db = await getDb();
  const business = await db.getBusiness(businessId);
  if (!business) return;
  const profile = await db.getProfile(business.id);
  const isReview = type === "review_stand";
  await db.createTapLink({
    business_id: business.id,
    code: await uniqueCode(db),
    type: type as TapLinkType,
    destination_type: isReview ? "google_review" : profile?.enabled ? "profile" : "website",
    destination_url: null,
    enabled: true,
  });
  revalidatePath(`/admin/businesses/${businessId}`);
  revalidatePath(`/dashboard/${businessId}`);
}

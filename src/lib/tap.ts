import "server-only";
import type { Business, DestinationType, Order, Profile, TapLink } from "@/types/database";
import type { PackageId } from "@/lib/packages";
import { packages } from "@/lib/packages";
import { getDb, type Db } from "@/lib/db";
import { siteOrigin } from "@/lib/env";

/**
 * Tap links are the heart of Maprizz: a permanent short code on the NFC chip that we
 * resolve to whatever destination the customer wants today.
 */

// No 0/O/1/I so codes read cleanly when printed on a card.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const CODE_PATTERN = /^[A-Z0-9]{4,12}$/;

export function randomCode(length = 6) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let out = "";
  for (const byte of bytes) out += ALPHABET[byte % ALPHABET.length];
  return out;
}

export async function uniqueCode(db: Db) {
  for (let i = 0; i < 20; i++) {
    const code = randomCode();
    if (!(await db.codeExists(code))) return code;
  }
  throw new Error("Could not allocate a unique tap code");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "business";
}

export async function uniqueSlug(db: Db, name: string) {
  const base = slugify(name);
  if (!(await db.slugExists(base))) return base;
  for (let i = 2; i < 500; i++) {
    const candidate = `${base}-${i}`;
    if (!(await db.slugExists(candidate))) return candidate;
  }
  return `${base}-${randomCode(4).toLowerCase()}`;
}

export const tapUrl = (code: string) => `${siteOrigin()}/t/${code}`;
export const reviewUrl = (code: string) => `${siteOrigin()}/r/${code}`;
export const profileUrl = (slug: string) => `${siteOrigin()}/p/${slug}`;
export const shortUrlFor = (link: TapLink) => (link.type === "review_stand" ? reviewUrl(link.code) : tapUrl(link.code));

/** Where a tap should go right now. Null means "nothing configured yet". */
export function resolveDestination(link: TapLink, business: Business, profile: Profile | null): string | null {
  switch (link.destination_type) {
    case "profile":
      return profile && profile.enabled ? `/p/${business.slug}` : business.website_url ?? null;
    case "website":
      return business.website_url ?? (profile?.enabled ? `/p/${business.slug}` : null);
    case "google_review":
      return business.google_review_url ?? null;
    case "custom_url":
      return link.destination_url ?? null;
  }
}

/** Same as resolveDestination but always absolute (profile paths get the site origin). */
export function resolveDestinationAbsolute(link: TapLink, business: Business, profile: Profile | null): string | null {
  const destination = resolveDestination(link, business, profile);
  if (!destination) return null;
  return destination.startsWith("/") ? `${siteOrigin()}${destination}` : destination;
}

/** Human label for the dashboard. */
export function describeDestination(link: TapLink, business: Business): string {
  switch (link.destination_type) {
    case "profile":
      return `Maprizz profile (/p/${business.slug})`;
    case "website":
      return business.website_url ? `Website (${business.website_url})` : "Website (not set yet)";
    case "google_review":
      return business.google_review_url ? "Google review link" : "Google review link (not set yet)";
    case "custom_url":
      return link.destination_url ?? "Custom URL (not set yet)";
  }
}

/**
 * Create the profile and tap links a package ships with. Idempotent: if the business
 * already has a business_card link nothing is duplicated.
 */
export async function provisionBusiness(
  business: Business,
  packageId: PackageId,
  destination: { type: DestinationType; url: string | null },
) {
  const db = await getDb();
  const pkg = packages[packageId];

  let profile = await db.getProfile(business.id);
  if (!profile) {
    profile = await db.createProfile({
      business_id: business.id,
      enabled: pkg.hasProfile,
      headline: null,
      description: null,
      theme: "dark",
    });
  } else if (pkg.hasProfile && !profile.enabled) {
    profile = await db.updateProfile(business.id, { enabled: true });
  }

  const existing = await db.listTapLinks(business.id);
  const links: TapLink[] = [...existing];

  if (!existing.some((l) => l.type === "business_card")) {
    // Tap Card has no profile; default it to the website unless the customer chose a custom URL.
    const type: DestinationType =
      !pkg.hasProfile && destination.type === "profile" ? "website" : destination.type;
    links.push(
      await db.createTapLink({
        business_id: business.id,
        code: await uniqueCode(db),
        type: "business_card",
        destination_type: type,
        destination_url: type === "custom_url" ? destination.url : null,
        enabled: true,
      }),
    );
  }

  if (pkg.hasReviewStand && !existing.some((l) => l.type === "review_stand")) {
    links.push(
      await db.createTapLink({
        business_id: business.id,
        code: await uniqueCode(db),
        type: "review_stand",
        destination_type: "google_review",
        destination_url: null,
        enabled: true,
      }),
    );
  }

  return { profile, links };
}

/**
 * Mark an order paid and provision it. Safe to call from both the Stripe webhook and the
 * success page; whichever arrives first does the work.
 */
export async function fulfillPaidOrder(
  order: Order,
  payment: { sessionId: string | null; paymentIntentId: string | null; status: Order["payment_status"] },
) {
  const db = await getDb();
  if (!order.business_id) throw new Error("Order has no business");
  const business = await db.getBusiness(order.business_id);
  if (!business) throw new Error("Business not found for order");

  const updated =
    order.payment_status === "unpaid"
      ? await db.updateOrder(order.id, {
          payment_status: payment.status,
          stripe_checkout_session_id: payment.sessionId ?? order.stripe_checkout_session_id,
          stripe_payment_intent_id: payment.paymentIntentId ?? order.stripe_payment_intent_id,
        })
      : order;

  const provisioned = await provisionBusiness(business, order.package, {
    type: order.destination_type,
    url: order.destination_url,
  });
  return { order: updated, business, ...provisioned };
}

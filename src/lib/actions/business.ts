"use server";

import { revalidatePath } from "next/cache";
import { authorizeBusiness, requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { uniqueCode } from "@/lib/tap";
import {
  businessInfoSchema,
  flattenErrors,
  formDataToObject,
  logoUrlSchema,
  profileSchema,
  tapLinkUpdateSchema,
  type FieldErrors,
} from "@/lib/validation";

export type ActionState = { ok: boolean; message?: string; errors?: FieldErrors };

const idle: ActionState = { ok: false };

function revalidateBusiness(businessId: string, slug?: string) {
  revalidatePath(`/dashboard/${businessId}`, "layout");
  revalidatePath(`/admin/businesses/${businessId}`, "layout");
  if (slug) revalidatePath(`/p/${slug}`);
}

/** Owners and admins: edit business information (name, contact, links, logo, Google URLs). */
export async function updateBusinessAction(businessId: string, _prev: ActionState = idle, formData: FormData): Promise<ActionState> {
  const session = await requireUser();
  const business = await authorizeBusiness(session, businessId);
  if (!business) return { ok: false, message: "You don't have access to this business." };

  const raw = formDataToObject(formData);
  const parsed = businessInfoSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", errors: flattenErrors(parsed.error) };

  const logo = logoUrlSchema.safeParse(raw.logo_url);
  if (!logo.success) return { ok: false, errors: { logo_url: "That logo URL isn't valid." } };

  const db = await getDb();
  await db.updateBusiness(business.id, { ...parsed.data, logo_url: logo.data });
  revalidateBusiness(business.id, business.slug);
  return { ok: true, message: "Saved." };
}

/** Owners and admins: profile page content and visibility. */
export async function updateProfileAction(businessId: string, _prev: ActionState = idle, formData: FormData): Promise<ActionState> {
  const session = await requireUser();
  const business = await authorizeBusiness(session, businessId);
  if (!business) return { ok: false, message: "You don't have access to this business." };

  const raw = formDataToObject(formData);
  const parsed = profileSchema.safeParse({ ...raw, enabled: formData.get("enabled") === "on" });
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", errors: flattenErrors(parsed.error) };

  const db = await getDb();
  const existing = await db.getProfile(business.id);
  if (existing) await db.updateProfile(business.id, parsed.data);
  else await db.createProfile({ business_id: business.id, ...parsed.data });
  revalidateBusiness(business.id, business.slug);
  return { ok: true, message: "Profile saved." };
}

/** Owners and admins: change where a tap link goes, or pause it. */
export async function updateTapLinkAction(businessId: string, linkId: string, _prev: ActionState = idle, formData: FormData): Promise<ActionState> {
  const session = await requireUser();
  const business = await authorizeBusiness(session, businessId);
  if (!business) return { ok: false, message: "You don't have access to this business." };

  const db = await getDb();
  const link = await db.getTapLink(linkId);
  if (!link || link.business_id !== business.id) return { ok: false, message: "Link not found." };

  const raw = formDataToObject(formData);
  const parsed = tapLinkUpdateSchema.safeParse({ ...raw, enabled: formData.get("enabled") === "on" });
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", errors: flattenErrors(parsed.error) };

  if (parsed.data.destination_type === "custom_url" && !parsed.data.destination_url) {
    return { ok: false, errors: { destination_url: "Enter the URL to open." } };
  }
  if (parsed.data.destination_type === "website" && !business.website_url) {
    return { ok: false, errors: { destination_type: "Add a website to the business first." } };
  }

  // A review link may also carry an updated Google review URL in the same form.
  const reviewUrl = raw.google_review_url;
  if (typeof reviewUrl === "string" || reviewUrl === null) {
    const check = businessInfoSchema.shape.google_review_url.safeParse(reviewUrl);
    if (!check.success) return { ok: false, errors: { google_review_url: "Enter a valid web address." } };
    if (check.data !== business.google_review_url) await db.updateBusiness(business.id, { google_review_url: check.data });
  }

  await db.updateTapLink(link.id, {
    destination_type: parsed.data.destination_type,
    destination_url: parsed.data.destination_type === "custom_url" ? parsed.data.destination_url : null,
    enabled: parsed.data.enabled,
  });
  revalidateBusiness(business.id, business.slug);
  return { ok: true, message: "Link updated. The card keeps the same URL." };
}

/** Owners and admins: add a Google review link (for a stand or a QR) if the business has none. */
export async function createReviewLinkAction(businessId: string): Promise<ActionState> {
  const session = await requireUser();
  const business = await authorizeBusiness(session, businessId);
  if (!business) return { ok: false, message: "You don't have access to this business." };
  const db = await getDb();
  const links = await db.listTapLinks(business.id);
  if (links.some((l) => l.type === "review_stand")) return { ok: true };
  await db.createTapLink({
    business_id: business.id,
    code: await uniqueCode(db),
    type: "review_stand",
    destination_type: "google_review",
    destination_url: null,
    enabled: true,
  });
  revalidateBusiness(business.id, business.slug);
  return { ok: true, message: "Review link created." };
}

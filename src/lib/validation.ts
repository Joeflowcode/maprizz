import { z } from "zod";
import { packageIds } from "@/lib/packages";
import { leadInterestIds, planIds } from "@/lib/services";

/**
 * Shared Zod schemas. Everything user-submitted passes through one of these on the
 * server before it touches the database or a redirect.
 */

/** Normalize to an absolute http(s) URL or return null. Rejects javascript:, data:, etc. */
export function normalizeUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".") && url.hostname !== "localhost") return null;
    return url.toString();
  } catch {
    return null;
  }
}

const optionalString = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .optional()
    .nullable()
    .transform((value) => (value ? value : null));

export const optionalUrl = optionalString(500).transform((value, ctx) => {
  if (!value) return null;
  const normalized = normalizeUrl(value);
  if (!normalized) {
    ctx.addIssue({ code: "custom", message: "Enter a valid web address (https://…)." });
    return z.NEVER;
  }
  return normalized;
});

export const requiredUrl = z
  .string({ error: "Enter a web address." })
  .trim()
  .min(1, "Enter a web address.")
  .max(500)
  .transform((value, ctx) => {
    const normalized = normalizeUrl(value);
    if (!normalized) {
      ctx.addIssue({ code: "custom", message: "Enter a valid web address (https://…)." });
      return z.NEVER;
    }
    return normalized;
  });

/** Logo URLs come from our own upload endpoint: absolute (Supabase Storage) or /api/dev-files in mock mode. */
export const logoUrlSchema = optionalString(600).refine((value) => !value || value.startsWith("/api/dev-files/") || Boolean(normalizeUrl(value)), {
  message: "Invalid logo URL.",
});

export const optionalPhone = optionalString(40).refine((value) => !value || /^[\d\s()+.-]{7,}$/.test(value), {
  message: "Enter a valid phone number.",
});

export const requiredText = (message: string, max: number) =>
  z.string({ error: message }).trim().min(2, message).max(max, `Keep this under ${max} characters.`);

export const email = z
  .string({ error: "Enter a valid email address." })
  .trim()
  .max(200)
  .pipe(z.email({ error: "Enter a valid email address." }));

export const optionalEmail = optionalString(200).refine((value) => !value || z.email().safeParse(value).success, {
  message: "Enter a valid email address.",
});

/** Honeypot: hidden field that real people never fill in. Checked by the handler. */
export const honeypot = z.string().max(200).optional().nullable();

export const packageSchema = z.enum(packageIds, { error: "Choose a package." });

export const destinationTypeSchema = z.enum(["profile", "website", "custom_url", "google_review"]);

/** Step 2 + 3 of checkout, also used by admin/dashboard edit forms. */
export const businessInfoSchema = z.object({
  name: requiredText("Enter the business name.", 120),
  contact_name: requiredText("Enter a contact name.", 120),
  phone: optionalPhone,
  email,
  website_url: optionalUrl,
  address: optionalString(240),
  instagram_url: optionalUrl,
  facebook_url: optionalUrl,
  booking_url: optionalUrl,
  google_business_url: optionalUrl,
  google_review_url: optionalUrl,
});

export const profileSchema = z.object({
  enabled: z.boolean().default(true),
  headline: optionalString(120),
  description: optionalString(400),
  theme: z.enum(["dark", "light"]).default("dark"),
});

export const destinationSchema = z
  .object({
    destination_type: destinationTypeSchema,
    destination_url: optionalUrl,
  })
  .refine((value) => value.destination_type !== "custom_url" || Boolean(value.destination_url), {
    message: "Enter the URL the card should open.",
    path: ["destination_url"],
  });

/** Full checkout payload posted to /api/checkout. */
export const checkoutSchema = z.object({
  package: packageSchema,
  business: businessInfoSchema,
  logo_url: logoUrlSchema,
  destination: destinationSchema,
  notes: optionalString(1000),
});

export const planSchema = z.enum(planIds, { error: "Choose a monthly plan." });

/** Monthly retainer checkout posted to /api/subscribe. */
export const subscribeSchema = z.object({
  plan: planSchema,
  business_name: requiredText("Enter the business name.", 120),
  contact_name: requiredText("Enter a contact name.", 120),
  city: requiredText("Enter your city or service area.", 160),
  email,
  phone: optionalPhone,
  website_url: optionalUrl,
  google_business_url: optionalUrl,
  notes: optionalString(1000),
  agree: z.literal(true, { error: "Confirm monthly billing to continue." }),
  company: honeypot,
});

export const leadSchema = z.object({
  business_name: requiredText("Enter your business name.", 160),
  contact_name: requiredText("Enter your name.", 120),
  city: requiredText("Enter your city or service area.", 160),
  phone: optionalPhone,
  email,
  website: optionalUrl,
  google_business_url: optionalUrl,
  interest: z.enum(leadInterestIds).nullable().default("not_sure"),
  notes: optionalString(2000),
  referral_slug: optionalString(40),
  company: honeypot,
});

/** Field-sales quick create (/admin/sell). */
export const fieldSaleSchema = z.object({
  name: requiredText("Enter the business name.", 120),
  contact_name: requiredText("Enter the owner or contact name.", 120),
  phone: optionalPhone,
  email: optionalEmail,
  website_url: optionalUrl,
  google_review_url: optionalUrl,
  package: packageSchema,
  payment_status: z.enum(["unpaid", "paid", "cash", "complimentary"]).default("unpaid"),
});

export const tapLinkUpdateSchema = z.object({
  destination_type: destinationTypeSchema,
  destination_url: optionalUrl,
  enabled: z.boolean(),
});

export const fulfillmentStatusSchema = z.enum(["new", "design", "production", "ready", "delivered"]);
export const paymentStatusSchema = z.enum(["unpaid", "paid", "cash", "complimentary"]);

export type BusinessInfoInput = z.infer<typeof businessInfoSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type LeadInput = z.infer<typeof leadSchema>;
export type FieldSaleInput = z.infer<typeof fieldSaleSchema>;

export type FieldErrors = Record<string, string>;

export function flattenErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Turn FormData into a plain object; empty strings become null, "on" checkboxes become true. */
export function formDataToObject(formData: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") continue;
    out[key] = value === "" ? null : value;
  }
  return out;
}

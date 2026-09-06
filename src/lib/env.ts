/**
 * Environment detection. Everything that can be "not configured yet" is decided here
 * so the rest of the app can ask simple questions.
 *
 * Dev/mock mode (no Supabase, no Stripe) exists so the project runs locally with zero
 * setup. It is never allowed in production unless MAPRIZZ_ALLOW_DEV_MODE=true is set
 * explicitly, because mock auth would let anyone act as an admin.
 */

export const isProduction = process.env.NODE_ENV === "production";

export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

export const stripeWebhookConfigured = Boolean(process.env.STRIPE_WEBHOOK_SECRET);

/** Mock auth + mock payments + file-backed database. */
export const devModeAllowed = !isProduction || process.env.MAPRIZZ_ALLOW_DEV_MODE === "true";

export const useMockDb = !supabaseConfigured;
export const useMockAuth = !supabaseConfigured && devModeAllowed;
export const useMockPayments = !stripeConfigured && devModeAllowed;

/** Public site origin, used for short URLs, QR codes, Stripe redirects and vCards. */
export function siteOrigin() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.URL) return process.env.URL.replace(/\/$/, ""); // Netlify
  return isProduction ? "https://maprizz.com" : "http://localhost:3000";
}

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

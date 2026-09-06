/**
 * Row types for the Maprizz database. Kept by hand so they read well and so the mock
 * database and the Supabase client share one vocabulary. Mirror any change here in
 * supabase/migrations.
 */

import type { PackageId } from "@/lib/packages";
import type { PlanId } from "@/lib/services";

export type TapLinkType = "business_card" | "review_stand" | "qr" | "other";
export type DestinationType = "profile" | "website" | "custom_url" | "google_review";
export type PaymentStatus = "unpaid" | "paid" | "cash" | "complimentary";
export type FulfillmentStatus = "new" | "design" | "production" | "ready" | "delivered";
export type UserRole = "customer" | "admin";
export type SubscriptionStatus = "incomplete" | "active" | "past_due" | "canceled" | "unpaid";

export type Business = {
  id: string;
  owner_user_id: string | null;
  name: string;
  slug: string;
  logo_url: string | null;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  website_url: string | null;
  address: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  booking_url: string | null;
  google_business_url: string | null;
  google_review_url: string | null;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  business_id: string;
  enabled: boolean;
  headline: string | null;
  description: string | null;
  theme: "dark" | "light";
  created_at: string;
  updated_at: string;
};

export type TapLink = {
  id: string;
  business_id: string;
  code: string;
  type: TapLinkType;
  destination_type: DestinationType;
  destination_url: string | null;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type TapEvent = {
  id: string;
  tap_link_id: string;
  created_at: string;
  referrer: string | null;
  user_agent: string | null;
};

export type Order = {
  id: string;
  business_id: string | null;
  customer_email: string;
  package: PackageId;
  amount: number;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  payment_status: PaymentStatus;
  fulfillment_status: FulfillmentStatus;
  /** Destination the customer chose at checkout; applied when the order is provisioned. */
  destination_type: DestinationType;
  destination_url: string | null;
  notes: string | null;
  source: "web" | "field_sales";
  created_at: string;
  updated_at: string;
};

export type LeadRequest = {
  id: string;
  business_name: string;
  contact_name: string;
  phone: string | null;
  email: string;
  website: string | null;
  google_business_url: string | null;
  /** City or service area, e.g. Bend, Oregon. */
  city: string | null;
  /** not_sure | cards | gbp | website | growth (see lib/services leadInterests). */
  interest: string | null;
  notes: string | null;
  /** Referral card slug when the lead came from /c/[slug] or /audit?ref=. */
  referral_slug: string | null;
  created_at: string;
};

export type UserRoleRow = {
  user_id: string;
  email: string;
  role: UserRole;
  created_at: string;
};

export type BusinessInsert = Omit<Business, "id" | "created_at" | "updated_at" | "is_demo"> & {
  is_demo?: boolean;
};
export type BusinessUpdate = Partial<Omit<Business, "id" | "created_at" | "updated_at">>;
export type ProfileInsert = Omit<Profile, "id" | "created_at" | "updated_at">;
export type ProfileUpdate = Partial<Omit<Profile, "id" | "business_id" | "created_at" | "updated_at">>;
export type TapLinkInsert = Omit<TapLink, "id" | "created_at" | "updated_at">;
export type TapLinkUpdate = Partial<Pick<TapLink, "destination_type" | "destination_url" | "enabled" | "type">>;
export type OrderInsert = Omit<Order, "id" | "created_at" | "updated_at">;
export type OrderUpdate = Partial<Omit<Order, "id" | "created_at" | "updated_at">>;
export type LeadRequestInsert = Omit<LeadRequest, "id" | "created_at">;

export type Subscription = {
  id: string;
  business_id: string;
  plan: PlanId;
  status: SubscriptionStatus;
  monthly_amount: number;
  customer_email: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_checkout_session_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SubscriptionInsert = Omit<Subscription, "id" | "created_at" | "updated_at">;
export type SubscriptionUpdate = Partial<Omit<Subscription, "id" | "created_at" | "updated_at">>;

/** Everything the dashboard/admin needs about one business, in one fetch. */
export type BusinessBundle = {
  business: Business;
  profile: Profile | null;
  tapLinks: TapLink[];
  orders: Order[];
};

/** Daily counts for the analytics chart. */
export type DailyCount = { day: string; count: number };

export type TapStats = {
  total: number;
  last7: number;
  last30: number;
  daily: DailyCount[]; // last 30 days, oldest first
};

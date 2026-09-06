/**
 * Demo data: Cascade Auto Detail is a fictional business used for the interactive demo.
 * It is flagged is_demo so it never shows up as a customer anywhere. The same values
 * are in supabase/seed.sql for hosted databases.
 */

export const DEMO_BUSINESS_ID = "00000000-0000-4000-8000-000000000001";
export const DEMO_PROFILE_ID = "00000000-0000-4000-8000-000000000002";
export const DEMO_CARD_LINK_ID = "00000000-0000-4000-8000-000000000003";
export const DEMO_REVIEW_LINK_ID = "00000000-0000-4000-8000-000000000004";
export const DEMO_SLUG = "cascade-auto-detail";
export const DEMO_CARD_CODE = "DEMO01";
export const DEMO_REVIEW_CODE = "DEMO02";

const now = "2026-01-01T00:00:00.000Z";

export const demoBusiness = {
  id: DEMO_BUSINESS_ID,
  owner_user_id: null,
  name: "Cascade Auto Detail",
  slug: DEMO_SLUG,
  logo_url: null,
  contact_name: "Jordan Reyes",
  phone: "+1 (541) 555-0148",
  email: "hello@cascadeautodetail.example",
  website_url: "https://cascadeautodetail.example",
  address: "1250 NE 3rd St, Bend, OR 97701",
  instagram_url: "https://instagram.com/cascadeautodetail",
  facebook_url: null,
  booking_url: "https://cascadeautodetail.example/book",
  google_business_url: "https://maps.google.com/?cid=0000000000000000000",
  google_review_url: "https://search.google.com/local/writereview?placeid=DEMO_PLACE_ID",
  is_demo: true,
  created_at: now,
  updated_at: now,
};

export const demoProfile = {
  id: DEMO_PROFILE_ID,
  business_id: DEMO_BUSINESS_ID,
  enabled: true,
  headline: "Premium mobile detailing in Bend, Oregon.",
  description:
    "Interior, exterior, ceramic coatings and paint correction. We come to your driveway or office.",
  theme: "dark" as const,
  created_at: now,
  updated_at: now,
};

export const demoTapLinks = [
  {
    id: DEMO_CARD_LINK_ID,
    business_id: DEMO_BUSINESS_ID,
    code: DEMO_CARD_CODE,
    type: "business_card" as const,
    destination_type: "profile" as const,
    destination_url: null,
    enabled: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: DEMO_REVIEW_LINK_ID,
    business_id: DEMO_BUSINESS_ID,
    code: DEMO_REVIEW_CODE,
    type: "review_stand" as const,
    destination_type: "google_review" as const,
    destination_url: null,
    enabled: true,
    created_at: now,
    updated_at: now,
  },
];

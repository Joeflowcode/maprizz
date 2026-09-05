export type ProfileTheme = "dark" | "light";

export type ProfileData = {
  id: string;
  slug: string;
  name: string;
  headline: string;
  description?: string;
  theme: ProfileTheme;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  address?: string;
  bookingUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  logoUrl?: string;
  reviewHref?: string;
  vcardHref: string;
  tapCode: string;
  reviewCode: string;
};

export const cascadeAutoDetail: ProfileData = {
  id: "00000000-0000-4000-8000-000000000001",
  slug: "cascade-auto-detail",
  name: "Cascade Auto Detail",
  headline: "Premium mobile detailing in Bend, Oregon.",
  description:
    "Interior, exterior, ceramic coatings and paint correction. We come to your driveway or office.",
  theme: "dark",
  phone: "+1 (541) 555-0148",
  email: "hello@cascadeautodetail.example",
  websiteUrl: "https://cascadeautodetail.example",
  address: "1250 NE 3rd St, Bend, OR 97701",
  bookingUrl: "https://cascadeautodetail.example/book",
  instagramUrl: "https://instagram.com/cascadeautodetail",
  reviewHref: "/r/DEMO02",
  vcardHref: "/api/vcard/00000000-0000-4000-8000-000000000001",
  tapCode: "DEMO01",
  reviewCode: "DEMO02",
};

const profilesBySlug: Record<string, ProfileData> = {
  [cascadeAutoDetail.slug]: cascadeAutoDetail,
};

const profilesByTapCode: Record<string, ProfileData> = {
  DEMO01: cascadeAutoDetail,
  demo01: cascadeAutoDetail,
};

const profilesByReviewCode: Record<string, ProfileData> = {
  DEMO02: cascadeAutoDetail,
  demo02: cascadeAutoDetail,
};

export function getProfileBySlug(slug: string) {
  return profilesBySlug[slug.toLowerCase()] ?? null;
}

export function getProfileByTapCode(code: string) {
  return profilesByTapCode[code.toUpperCase()] ?? null;
}

export function getProfileByReviewCode(code: string) {
  return profilesByReviewCode[code.toUpperCase()] ?? null;
}

export function getGoogleReviewUrl(code: string) {
  const profile = getProfileByReviewCode(code);
  if (!profile) return null;
  return "https://search.google.com/local/writereview?placeid=DEMO_PLACE_ID";
}

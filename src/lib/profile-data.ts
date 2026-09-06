import type { Business, Profile, TapLink } from "@/types/database";
import type { ProfileData } from "@/components/profile/profile-card";
import { demoBusiness, demoProfile, demoTapLinks } from "@/lib/db/seed";

/** Map database rows to what the ProfileCard renders. Safe for client components. */
export function toProfileData(business: Business, profile: Profile | null, tapLinks: TapLink[]): ProfileData {
  const reviewLink = tapLinks.find((l) => l.type === "review_stand" && l.enabled);
  return {
    businessId: business.id,
    name: business.name,
    logoUrl: business.logo_url,
    headline: profile?.headline ?? null,
    description: profile?.description ?? null,
    theme: profile?.theme ?? "dark",
    phone: business.phone,
    email: business.email,
    websiteUrl: business.website_url,
    address: business.address,
    bookingUrl: business.booking_url,
    instagramUrl: business.instagram_url,
    facebookUrl: business.facebook_url,
    reviewHref: reviewLink ? `/r/${reviewLink.code}` : business.google_review_url,
    vcardHref: `/api/vcard/${business.id}`,
  };
}

/** Cascade Auto Detail, for demos. Static so the marketing pages never hit the database. */
export const demoProfileData: ProfileData = toProfileData(demoBusiness, demoProfile, demoTapLinks);

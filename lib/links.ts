import {
  getGoogleReviewUrl,
  getProfileByReviewCode,
  getProfileByTapCode,
} from "@/lib/demo-profile";

export type LinkUnavailableReason = "missing" | "inactive";

export function resolveTapRedirect(code: string) {
  const normalized = code.trim();
  if (!normalized) {
    return {
      type: "unavailable" as const,
      reason: "missing" as LinkUnavailableReason,
      code: normalized,
    };
  }

  const profile = getProfileByTapCode(normalized);
  if (profile) {
    return { type: "profile" as const, slug: profile.slug };
  }

  if (normalized.toUpperCase() === "DEMO") {
    return {
      type: "unavailable" as const,
      reason: "missing" as LinkUnavailableReason,
      code: normalized,
    };
  }

  return {
    type: "unavailable" as const,
    reason: "missing" as LinkUnavailableReason,
    code: normalized,
  };
}

export function resolveReviewRedirect(code: string) {
  const normalized = code.trim();
  if (!normalized) {
    return {
      type: "unavailable" as const,
      reason: "missing" as LinkUnavailableReason,
      code: normalized,
    };
  }

  const profile = getProfileByReviewCode(normalized);
  if (profile) {
    const url = getGoogleReviewUrl(normalized);
    if (url) return { type: "external" as const, url };
    return { type: "profile" as const, slug: profile.slug };
  }

  return {
    type: "unavailable" as const,
    reason: "missing" as LinkUnavailableReason,
    code: normalized,
  };
}

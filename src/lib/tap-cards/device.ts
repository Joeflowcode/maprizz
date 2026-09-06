import type { DeviceKind } from "./types";

export function deviceFromUserAgent(userAgent: string | null | undefined): DeviceKind {
  const ua = userAgent ?? "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

export function shouldRecordVisit(userAgent: string | null | undefined) {
  const ua = userAgent ?? "";
  return !/bot|crawler|spider|preview|facebookexternalhit|slurp|bingpreview/i.test(ua);
}

export function normalizeSlug(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}

export function isValidSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length >= 2 && value.length <= 40;
}

import { siteConfig } from "@/lib/site-config";

export const joeyContact = {
  firstName: "Joey",
  fullName: "Joey McVeigh",
  email: process.env.NEXT_PUBLIC_JOEY_EMAIL?.trim() || siteConfig.email,
  phone: process.env.NEXT_PUBLIC_JOEY_PHONE?.trim() || siteConfig.phone,
  instagram: process.env.NEXT_PUBLIC_JOEY_INSTAGRAM?.trim() || siteConfig.social.instagram,
};

export function digitsPhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export function telHref(phone: string) {
  return `tel:${digitsPhone(phone)}`;
}

export function smsHref(phone: string) {
  return `sms:${digitsPhone(phone)}`;
}

export function instagramHref(handleOrUrl: string) {
  if (/^https?:\/\//i.test(handleOrUrl)) return handleOrUrl;
  const handle = handleOrUrl.replace(/^@/, "");
  return `https://instagram.com/${handle}`;
}

import type { Metadata } from "next";
import { renderReferralCard } from "../c/[slug]/page";
import { JOEY_CARD_SLUG } from "@/lib/tap-cards";
import { referralMetadata } from "@/lib/tap-cards/seo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function generateMetadata(): Metadata {
  return referralMetadata;
}

export default async function JoeyCardPage() {
  return renderReferralCard(JOEY_CARD_SLUG, "/card");
}

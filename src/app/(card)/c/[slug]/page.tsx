import type { Metadata } from "next";
import { headers } from "next/headers";
import { CardUnavailable, ReferralLanding } from "@/components/card/referral-landing";
import { referralMetadata } from "@/lib/tap-cards/seo";
import {
  deviceFromUserAgent,
  getCardBySlug,
  normalizeSlug,
  recordVisit,
  shouldRecordVisit,
} from "@/lib/tap-cards";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function generateMetadata(): Metadata {
  return referralMetadata;
}

export default async function ReferralCardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return renderReferralCard(slug, `/c/${normalizeSlug(slug)}`);
}

export async function renderReferralCard(slug: string, landingPage: string) {
  const card = await getCardBySlug(slug);

  if (!card) {
    return <CardUnavailable reason="missing" />;
  }

  if (!card.active) {
    return <CardUnavailable reason="inactive" />;
  }

  const headerList = await headers();
  const userAgent = headerList.get("user-agent");
  if (shouldRecordVisit(userAgent)) {
    try {
      await recordVisit({
        card,
        landing_page: landingPage,
        device: deviceFromUserAgent(userAgent),
        source: "tap-or-scan",
      });
    } catch {
      // Never block the landing page on analytics.
    }
  }

  return <ReferralLanding card={card} />;
}

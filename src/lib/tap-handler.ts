import "server-only";
import { after, NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { CODE_PATTERN, resolveDestination } from "@/lib/tap";
import type { TapLinkType } from "@/types/database";

/**
 * Shared by /t/[code] and /r/[code]. One lookup, one redirect; the tap event is written
 * after the response is sent so the visitor never waits on analytics.
 */
export async function handleTap(request: NextRequest, rawCode: string, expected: TapLinkType | null) {
  const code = rawCode.toUpperCase();
  const origin = new URL(request.url).origin;
  const unavailable = (reason: string) =>
    NextResponse.redirect(`${origin}/link-unavailable?code=${encodeURIComponent(code)}&reason=${reason}`, 302);

  if (!CODE_PATTERN.test(code)) return unavailable("invalid");

  const db = await getDb();
  const link = await db.getTapLinkByCode(code);
  if (!link) return unavailable("missing");
  if (!link.enabled) return unavailable("disabled");
  // A review-stand code typed into /t (or vice versa) still works; the code is what matters.
  void expected;

  const [business, profile] = await Promise.all([db.getBusiness(link.business_id), db.getProfile(link.business_id)]);
  if (!business) return unavailable("missing");

  const destination = resolveDestination(link, business, profile);
  if (!destination) return unavailable("unset");

  const referrer = request.headers.get("referer");
  const userAgent = request.headers.get("user-agent");
  after(async () => {
    try {
      await db.recordTap(link.id, {
        referrer: referrer ? referrer.slice(0, 500) : null,
        userAgent: userAgent ? userAgent.slice(0, 300) : null,
      });
    } catch (error) {
      console.error("[tap] failed to record event", error);
    }
  });

  const target = destination.startsWith("/") ? `${origin}${destination}` : destination;
  const response = NextResponse.redirect(target, 302);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

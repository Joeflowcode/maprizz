import { NextResponse } from "next/server";
import { getSession, isAdminSession } from "@/lib/auth";
import { cardUrl, getCardBySlug } from "@/lib/tap-cards";
import { qrPng } from "@/lib/tap-cards/qr";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const session = await getSession();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;
  const card = await getCardBySlug(slug);
  if (!card) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const png = await qrPng(cardUrl(card.slug));
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${card.slug}-maprizz-card.png"`,
      "Cache-Control": "no-store",
    },
  });
}

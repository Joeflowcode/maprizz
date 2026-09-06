import { NextResponse, type NextRequest } from "next/server";
import QRCode from "qrcode";
import { getSession } from "@/lib/auth";

/**
 * QR for an arbitrary URL. Admin-only (used to show a Stripe payment link to a customer
 * in person). Public tap-link QRs live at /api/qr/[code].
 */
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (session?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const target = new URL(request.url).searchParams.get("u") ?? "";
  let url: URL;
  try {
    url = new URL(target);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  const png = await QRCode.toBuffer(url.toString(), { type: "png", errorCorrectionLevel: "M", margin: 2, width: 512 });
  return new NextResponse(new Uint8Array(png), { headers: { "Content-Type": "image/png", "Cache-Control": "private, no-store" } });
}

import { NextResponse, type NextRequest } from "next/server";
import QRCode from "qrcode";
import { getDb } from "@/lib/db";
import { CODE_PATTERN, shortUrlFor } from "@/lib/tap";

/**
 * QR code for a tap link. Always encodes the Maprizz short URL (never the destination),
 * so the printed code keeps working when the destination changes.
 *
 * /api/qr/ABC123            -> PNG
 * /api/qr/ABC123?format=svg -> SVG
 * ?download=1 adds a Content-Disposition so browsers save the file.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const code = raw.toUpperCase();
  if (!CODE_PATTERN.test(code)) return NextResponse.json({ error: "Invalid code" }, { status: 400 });

  const db = await getDb();
  const link = await db.getTapLinkByCode(code);
  if (!link) return NextResponse.json({ error: "Unknown code" }, { status: 404 });

  const url = new URL(request.url);
  const format = url.searchParams.get("format") === "svg" ? "svg" : "png";
  const download = url.searchParams.get("download") === "1";
  const size = Math.min(2048, Math.max(128, Number(url.searchParams.get("size")) || 1024));
  const target = shortUrlFor(link);
  const filename = `maprizz-${link.type === "review_stand" ? "review" : "tap"}-${code}.${format}`;

  const headers: Record<string, string> = {
    "Cache-Control": "public, max-age=3600",
    ...(download ? { "Content-Disposition": `attachment; filename="${filename}"` } : {}),
  };

  if (format === "svg") {
    const svg = await QRCode.toString(target, { type: "svg", errorCorrectionLevel: "M", margin: 2, color: { dark: "#16120e", light: "#ffffff" } });
    return new NextResponse(svg, { headers: { ...headers, "Content-Type": "image/svg+xml" } });
  }

  const png = await QRCode.toBuffer(target, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 2,
    width: size,
    color: { dark: "#16120e", light: "#ffffff" },
  });
  return new NextResponse(new Uint8Array(png), { headers: { ...headers, "Content-Type": "image/png" } });
}

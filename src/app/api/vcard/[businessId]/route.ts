import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";
import { joeyContact } from "@/lib/tap-cards";
import { profileUrl } from "@/lib/tap";

/** Escape per RFC 6350: backslash, comma, semicolon, newline. */
function esc(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/**
 * "Save Contact" on a digital profile. Only public business fields are included; the
 * profile page is public so this endpoint is too.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;
  if (businessId === "joey") {
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${esc(joeyContact.fullName)}`,
      "N:McVeigh;Joey;;;",
      `ORG:${esc(siteConfig.name)}`,
      `TITLE:${esc("Local visibility for businesses")}`,
    ];
    if (joeyContact.phone) {
      lines.push(`TEL;TYPE=CELL,VOICE:${esc(joeyContact.phone.replace(/[^\d+() -]/g, ""))}`);
    }
    lines.push(`EMAIL;TYPE=WORK:${esc(joeyContact.email)}`);
    lines.push(`URL:${esc(siteConfig.url)}`);
    lines.push(`NOTE:${esc("Websites, Google Business Profile, reviews, and local SEO.")}`);
    lines.push(`REV:${new Date().toISOString()}`, "END:VCARD");

    return new NextResponse(lines.join("\r\n") + "\r\n", {
      headers: {
        "Content-Type": "text/vcard; charset=utf-8",
        "Content-Disposition": 'attachment; filename="joey-maprizz.vcf"',
        "Cache-Control": "no-store",
      },
    });
  }

  const db = await getDb();
  const business = await db.getBusiness(businessId);
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${esc(business.name)}`,
    `ORG:${esc(business.name)}`,
    "KIND:org",
  ];
  if (business.phone) lines.push(`TEL;TYPE=WORK,VOICE:${esc(business.phone)}`);
  if (business.email) lines.push(`EMAIL;TYPE=WORK:${esc(business.email)}`);
  if (business.website_url) lines.push(`URL:${esc(business.website_url)}`);
  if (business.address) lines.push(`ADR;TYPE=WORK:;;${esc(business.address)};;;;`);
  const profile = await db.getProfile(business.id);
  if (profile?.enabled) lines.push(`URL;TYPE=Maprizz:${esc(profileUrl(business.slug))}`);
  if (business.logo_url) lines.push(`PHOTO;VALUE=URI:${esc(business.logo_url)}`);
  lines.push(`REV:${new Date().toISOString()}`, "END:VCARD");

  const filename = `${business.slug}.vcf`;
  return new NextResponse(lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

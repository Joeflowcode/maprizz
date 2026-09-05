import { NextResponse } from "next/server";
import { cascadeAutoDetail, getProfileBySlug } from "@/lib/demo-profile";
import { site } from "@/lib/site";

function escapeVcard(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export async function GET(
  _request: Request,
  context: RouteContext<"/api/vcard/[id]">,
) {
  const { id } = await context.params;
  const profile =
    id === cascadeAutoDetail.id
      ? cascadeAutoDetail
      : getProfileBySlug(id) ?? cascadeAutoDetail;

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVcard(profile.name)}`,
    `ORG:${escapeVcard(profile.name)}`,
    "KIND:org",
  ];

  if (profile.phone) {
    lines.push(
      `TEL;TYPE=WORK,VOICE:${escapeVcard(profile.phone.replace(/[^\d+() -]/g, ""))}`,
    );
  }
  if (profile.email) {
    lines.push(`EMAIL;TYPE=WORK:${escapeVcard(profile.email)}`);
  }
  if (profile.websiteUrl) {
    lines.push(`URL:${profile.websiteUrl}`);
  }
  if (profile.address) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVcard(profile.address)};;;;`);
  }

  lines.push(`URL;TYPE=Maprizz:${site.url}/p/${profile.slug}`);
  lines.push(`REV:${new Date().toISOString()}`);
  lines.push("END:VCARD");

  return new NextResponse(`${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${profile.slug}.vcf"`,
      "Cache-Control": "no-store",
    },
  });
}

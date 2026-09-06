import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getMailConfig, sendSubmissionEmail } from "@/lib/mail";
import { createLead } from "@/lib/tap-cards";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const lead = await createLead({
      name: String(body.name ?? ""),
      business_name: String(body.business_name ?? ""),
      phone: String(body.phone ?? ""),
      email: String(body.email ?? ""),
      website: String(body.website ?? ""),
      city: String(body.city ?? ""),
      message: String(body.message ?? ""),
      company: String(body.company ?? ""),
      referral_slug: String(body.referral_slug ?? ""),
    });

    try {
      const db = await getDb();
      await db.createLead({
        business_name: lead.business_name,
        contact_name: lead.name,
        phone: lead.phone || null,
        email: lead.email,
        website: lead.website || null,
        google_business_url: null,
        city: lead.city || null,
        interest: "cards",
        notes: lead.message || null,
        referral_slug: lead.referral_slug,
      });
    } catch (error) {
      console.error("[card-lead] mirror to lead_requests failed", error);
    }

    const mail = getMailConfig();
    if (mail.ok) {
      try {
        await sendSubmissionEmail({
          subject: `Tap card lead (${lead.referral_slug}): ${lead.business_name}`,
          replyTo: lead.email,
          rows: [
            ["Name", lead.name],
            ["Business", lead.business_name],
            ["City", lead.city || undefined],
            ["Email", lead.email],
            ["Phone", lead.phone || undefined],
            ["Website", lead.website || undefined],
            ["Help with", lead.message || undefined],
            ["Referred by", lead.referral_slug],
          ],
        });
      } catch (error) {
        console.error("[card-lead] email failed", error);
      }
    }

    return NextResponse.json({
      ok: true,
      id: lead.id,
      referral_slug: lead.referral_slug,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save that lead.";
    if (message === "Ignored.") {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

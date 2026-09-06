import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isProduction, useMockDb } from "@/lib/env";
import { getMailConfig, sendSubmissionEmail } from "@/lib/mail";
import { interestLabel } from "@/lib/services";
import { siteConfig } from "@/lib/site-config";
import { flattenErrors, leadSchema } from "@/lib/validation";

/** Free business audit form → lead_requests (+ optional email notification). */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Please fix the highlighted fields.", errors: flattenErrors(parsed.error) }, { status: 400 });
  }

  const { company, ...lead } = parsed.data;
  if (company) return NextResponse.json({ ok: true }); // bot filled the honeypot

  const mail = getMailConfig();
  // In production the mock database is memory-only; without email too, the lead would vanish.
  if (isProduction && useMockDb && !mail.ok) {
    return NextResponse.json(
      { ok: false, message: `We couldn't save your request right now. Email ${siteConfig.email} and we'll start your audit.` },
      { status: 503 },
    );
  }

  const db = await getDb();
  await db.createLead(lead);

  if (mail.ok) {
    try {
      await sendSubmissionEmail({
        subject: `Free audit request: ${lead.business_name}`,
        replyTo: lead.email,
        rows: [
          ["Business", lead.business_name],
          ["City", lead.city],
          ["Contact", lead.contact_name],
          ["Email", lead.email],
          ["Phone", lead.phone ?? undefined],
          ["Website", lead.website ?? undefined],
          ["Google Business Profile", lead.google_business_url ?? undefined],
          ["Interested in", interestLabel(lead.interest) ?? undefined],
          ["Notes", lead.notes ?? undefined],
          ["Referred by", lead.referral_slug ?? undefined],
        ],
      });
    } catch (error) {
      console.error("[lead] email failed", error);
    }
  }

  return NextResponse.json({ ok: true });
}

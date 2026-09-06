import "server-only";
import { Resend } from "resend";

/**
 * Email delivery via Resend.
 *
 * Required environment variables (see .env.example):
 *   RESEND_API_KEY      – API key from https://resend.com
 *   CONTACT_TO_EMAIL    – where submissions are delivered
 *   CONTACT_FROM_EMAIL  – verified sender, e.g. "MapRizz <hello@maprizz.com>"
 */

export type MailConfigStatus =
  | { ok: true; to: string; from: string; apiKey: string }
  | { ok: false; missing: string[] };

export function getMailConfig(): MailConfigStatus {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  const missing = [
    !apiKey && "RESEND_API_KEY",
    !to && "CONTACT_TO_EMAIL",
    !from && "CONTACT_FROM_EMAIL",
  ].filter((value): value is string => Boolean(value));

  if (missing.length > 0) return { ok: false, missing };
  return { ok: true, to: to!, from: from!, apiKey: apiKey! };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendSubmissionEmail({
  subject,
  replyTo,
  rows,
}: {
  subject: string;
  replyTo: string;
  rows: Array<[label: string, value: string | undefined]>;
}) {
  const config = getMailConfig();
  if (!config.ok) {
    throw new Error(`Email is not configured. Missing: ${config.missing.join(", ")}`);
  }

  const resend = new Resend(config.apiKey);
  const filled = rows.filter(([, value]) => value && value.trim().length > 0) as Array<
    [string, string]
  >;

  const text = filled.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;color:#16120e;line-height:1.5">
  <h2 style="margin:0 0 16px">${escapeHtml(subject)}</h2>
  <table style="border-collapse:collapse">
    ${filled
      .map(
        ([label, value]) =>
          `<tr><td style="padding:6px 12px 6px 0;font-weight:700;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 0;vertical-align:top">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`,
      )
      .join("")}
  </table>
  </body></html>`;

  const { error } = await resend.emails.send({
    from: config.from,
    to: [config.to],
    replyTo,
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}

import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { AppPageHeader, Card } from "@/components/app/page-header";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { interestLabel } from "@/lib/services";

export const metadata: Metadata = { title: "Audit requests", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

export default async function AdminLeadsPage() {
  await requireAdmin("/admin/leads");
  const db = await getDb();
  const leads = await db.listLeads();

  return (
    <Container size="wide" className="py-8 sm:py-12">
      <AppPageHeader eyebrow="Leads" title="Free audit requests" lead="Submissions from /audit. Reply within a day; these are warm." />
      {leads.length === 0 ? (
        <Card className="mt-6">
          <p className="text-stone">No audit requests yet.</p>
        </Card>
      ) : (
        <ul className="mt-6 grid gap-3">
          {leads.map((lead) => (
            <li key={lead.id} className="rounded-3xl border border-ink/10 bg-white p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="font-semibold">{lead.business_name}</h2>
                <span className="text-sm text-stone">{dateFormat.format(new Date(lead.created_at))}</span>
              </div>
              <p className="mt-1 text-sm text-stone">
                {lead.contact_name}
                {lead.city ? ` · ${lead.city}` : ""}
              </p>
              {lead.referral_slug ? (
                <p className="mt-2">
                  <span className="label rounded-full bg-accent/20 px-2.5 py-1 text-ink">Referred by /c/{lead.referral_slug}</span>
                </p>
              ) : null}
              {interestLabel(lead.interest) ? (
                <p className="mt-2">
                  <span className={`label rounded-full px-2.5 py-1 ${lead.interest && lead.interest !== "not_sure" && lead.interest !== "cards" ? "bg-accent/20 text-ink" : "bg-ink/5 text-stone"}`}>
                    {interestLabel(lead.interest)}
                  </span>
                </p>
              ) : null}
              <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                <div>
                  <dt className="sr-only">Email</dt>
                  <dd>
                    <a href={`mailto:${lead.email}`} className="underline underline-offset-4">
                      {lead.email}
                    </a>
                  </dd>
                </div>
                {lead.phone ? (
                  <div>
                    <dt className="sr-only">Phone</dt>
                    <dd>
                      <a href={`tel:${lead.phone}`} className="underline underline-offset-4">
                        {lead.phone}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {lead.website ? (
                  <div className="min-w-0">
                    <dt className="sr-only">Website</dt>
                    <dd className="truncate">
                      <a href={lead.website} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                        {lead.website}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {lead.google_business_url ? (
                  <div className="min-w-0">
                    <dt className="sr-only">Google Business Profile</dt>
                    <dd className="truncate">
                      <a href={lead.google_business_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                        Google Business Profile
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
              {lead.notes ? <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-cream p-3 text-sm">{lead.notes}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

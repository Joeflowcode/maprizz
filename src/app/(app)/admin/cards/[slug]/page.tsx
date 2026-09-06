import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { getCardDetail } from "@/lib/tap-cards";
import { qrSvg } from "@/lib/tap-cards/qr";
import { toggleReferralCard } from "../actions";
import { CopyUrlButton } from "./copy-url-button";

export const metadata: Metadata = { title: "Tap card", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminCardDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin("/admin/cards");

  const { slug } = await params;
  const detail = await getCardDetail(slug);
  if (!detail) notFound();

  const { card, stats, leads } = detail;
  const svg = await qrSvg(stats.url);

  return (
    <Container size="wide" className="py-8 sm:py-12">
      <p>
        <Link href="/admin/cards" className="text-sm font-semibold text-brand hover:underline">
          ← All tap cards
        </Link>
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em]">{card.referrer_name}</h1>
      <p className="mt-2 text-stone">{card.label}</p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <MiniStat label="Taps" value={String(stats.visits)} />
        <MiniStat label="Leads" value={String(stats.leads)} />
        <MiniStat label="Conv." value={`${stats.conversion_rate}%`} />
      </div>

      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-5 sm:p-6">
        <p className="label text-stone">Card URL</p>
        <p className="mt-2 break-all font-mono text-sm">{stats.url}</p>
        <p className="mt-2 text-sm text-stone">Program the NFC chip or print the QR with this exact link.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <CopyUrlButton url={stats.url} />
          <a
            href={`/api/admin/cards/${card.slug}/qr`}
            className="inline-flex min-h-12 items-center rounded-xl border border-ink/20 px-5 text-sm font-semibold"
          >
            Download QR
          </a>
        </div>
        <div
          className="mt-6 max-w-[220px] overflow-hidden rounded-2xl border border-ink/10 bg-cream p-3"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </section>

      <form action={toggleReferralCard} className="mt-6">
        <input type="hidden" name="slug" value={card.slug} />
        <input type="hidden" name="active" value={card.active ? "false" : "true"} />
        <Button type="submit" variant={card.active ? "danger" : "secondary"}>
          {card.active ? "Disable card" : "Re-enable card"}
        </Button>
      </form>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Leads from this card</h2>
        {leads.length === 0 ? (
          <p className="mt-3 text-[15px] text-stone">No leads yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {leads.map((lead) => (
              <li key={lead.id} className="rounded-2xl border border-ink/10 bg-white px-4 py-4">
                <p className="font-semibold">{lead.name}</p>
                <p className="text-sm text-stone">
                  {lead.business_name}
                  {lead.city ? ` · ${lead.city}` : ""}
                </p>
                <p className="mt-2 text-sm">
                  {lead.phone ? (
                    <a className="text-brand hover:underline" href={`tel:${lead.phone}`}>
                      {lead.phone}
                    </a>
                  ) : (
                    <span className="text-stone">No phone</span>
                  )}
                  {" · "}
                  <a className="text-brand hover:underline" href={`mailto:${lead.email}`}>
                    {lead.email}
                  </a>
                </p>
                {lead.website ? <p className="mt-1 break-all text-sm text-stone">{lead.website}</p> : null}
                {lead.message ? <p className="mt-2 text-sm text-stone">{lead.message}</p> : null}
                <p className="mt-2 text-xs text-stone">{new Date(lead.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Container>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white px-4 py-4">
      <p className="label text-stone">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}

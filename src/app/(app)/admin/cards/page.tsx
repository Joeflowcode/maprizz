import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { AppPageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { getCardStatsList } from "@/lib/tap-cards";
import { createReferralCard } from "./actions";

export const metadata: Metadata = { title: "Tap Cards", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminTapCardsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin("/admin/cards");
  const params = await searchParams;
  const error = params.error ? params.error : "";

  const stats = await getCardStatsList();
  const totals = stats.reduce(
    (acc, item) => {
      acc.visits += item.visits;
      acc.leads += item.leads;
      return acc;
    },
    { visits: 0, leads: 0 },
  );

  return (
    <Container size="wide" className="py-8 sm:py-12">
      <AppPageHeader
        eyebrow="Referrals"
        title="Tap Cards"
        lead="Each slug is a unique referral URL. A tap on Jacqueline's card still shows Joey's landing page, and any lead is attributed to her."
      />

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="Cards" value={String(stats.length)} />
        <Stat label="Taps" value={String(totals.visits)} />
        <Stat label="Leads" value={String(totals.leads)} />
      </div>

      {error ? (
        <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <section className="mt-8 overflow-hidden rounded-3xl border border-ink/10 bg-white">
        <div className="hidden grid-cols-[1.2fr_0.7fr_0.5fr_0.5fr_0.6fr] gap-3 border-b border-ink/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-stone sm:grid">
          <span>Referrer</span>
          <span>Slug</span>
          <span>Taps</span>
          <span>Leads</span>
          <span>Conv.</span>
        </div>
        <ul>
          {stats.map((item) => (
            <li key={item.card.id} className="border-b border-ink/5 last:border-b-0">
              <Link
                href={`/admin/cards/${item.card.slug}`}
                className="grid gap-1 px-5 py-4 hover:bg-cream/70 sm:grid-cols-[1.2fr_0.7fr_0.5fr_0.5fr_0.6fr] sm:items-center sm:gap-3"
              >
                <span className="font-semibold">
                  {item.card.referrer_name}
                  {!item.card.active ? (
                    <span className="ml-2 text-xs font-medium text-stone">Inactive</span>
                  ) : null}
                </span>
                <span className="font-mono text-sm text-stone">/c/{item.card.slug}</span>
                <span className="text-sm text-stone sm:text-ink">{item.visits} taps</span>
                <span className="text-sm text-stone sm:text-ink">{item.leads} leads</span>
                <span className="text-sm text-stone sm:text-ink">{item.conversion_rate}%</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-5 sm:p-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight">New referral card</h2>
        <p className="mt-2 text-sm text-stone">Creates a unique URL like maprizz.com/c/jacqueline.</p>
        <form action={createReferralCard} className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="referrer_name" className="field-label">
              Referrer name
            </label>
            <input
              id="referrer_name"
              name="referrer_name"
              required
              className="field-input"
              placeholder="Jacqueline"
            />
          </div>
          <div>
            <label htmlFor="slug" className="field-label">
              URL slug
            </label>
            <input id="slug" name="slug" required className="field-input" placeholder="jacqueline" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="label" className="field-label">
              Label (optional)
            </label>
            <input id="label" name="label" className="field-input" placeholder="Downtown barber" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">Create card</Button>
          </div>
        </form>
      </section>
    </Container>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white px-4 py-4">
      <p className="label text-stone">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

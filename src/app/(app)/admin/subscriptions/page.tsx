import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { AppPageHeader, Card } from "@/components/app/page-header";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatCents } from "@/lib/packages";
import { plans } from "@/lib/services";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Subscriptions", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

const statusTone: Record<string, string> = {
  active: "bg-accent/20 text-ink",
  past_due: "bg-red-100 text-red-800",
  incomplete: "bg-ink/5 text-stone",
  canceled: "bg-ink/5 text-stone",
  unpaid: "bg-red-100 text-red-800",
};

export default async function AdminSubscriptionsPage() {
  await requireAdmin("/admin/subscriptions");
  const db = await getDb();
  const [subs, businesses] = await Promise.all([db.listSubscriptions(), db.listBusinesses()]);
  const names = new Map(businesses.map((b) => [b.id, b.name]));
  const recurring = subs.filter((s) => s.status === "active" || s.status === "past_due");
  const mrr = recurring.reduce((sum, s) => sum + s.monthly_amount, 0);
  const toTenK = Math.max(0, 1000000 - mrr);

  return (
    <Container size="wide" className="py-8 sm:py-12">
      <AppPageHeader
        eyebrow="Recurring"
        title="Monthly subscriptions"
        lead="Stripe bills these automatically. Active + past due count toward monthly recurring revenue."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="label text-stone">Monthly recurring</p>
          <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">{formatCents(mrr)}</p>
          <p className="mt-2 text-sm text-stone">{recurring.length} paying plan{recurring.length === 1 ? "" : "s"}</p>
        </Card>
        <Card>
          <p className="label text-stone">To $10k / month</p>
          <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">{formatCents(toTenK)}</p>
          <p className="mt-2 text-sm text-stone">
            {toTenK === 0 ? "You're there on paper. Keep delivery tight." : "More active plans, not more one-time cards."}
          </p>
        </Card>
        <Card>
          <p className="label text-stone">All records</p>
          <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">{subs.length}</p>
          <p className="mt-2 text-sm text-stone">Including incomplete checkouts</p>
        </Card>
      </div>

      {subs.length === 0 ? (
        <Card className="mt-6">
          <p className="text-stone">No subscriptions yet. Share /subscribe — the first payment is today, then every month.</p>
        </Card>
      ) : (
        <ul className="mt-6 grid gap-3">
          {subs.map((sub) => {
            const plan = plans[sub.plan];
            return (
              <li key={sub.id} className="rounded-3xl border border-ink/10 bg-white p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <h2 className="font-semibold">{names.get(sub.business_id) ?? "Business"}</h2>
                  <span className={cn("label w-fit rounded-full px-2.5 py-1", statusTone[sub.status] ?? "bg-ink/5")}>{sub.status.replace("_", " ")}</span>
                </div>
                <p className="mt-1 text-sm text-stone">
                  {plan.name} · {formatCents(sub.monthly_amount)}/mo
                  {sub.current_period_end ? ` · next ${dateFormat.format(new Date(sub.current_period_end))}` : ""}
                </p>
                <p className="mt-2 text-sm">
                  <a href={`mailto:${sub.customer_email}`} className="underline underline-offset-4">
                    {sub.customer_email}
                  </a>
                </p>
                <p className="mt-2 text-sm text-stone">{plan.setupNote}</p>
                <p className="mt-3">
                  <Link href={`/admin/businesses/${sub.business_id}`} className="text-sm font-semibold underline-offset-4 hover:underline">
                    Open business
                  </Link>
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}

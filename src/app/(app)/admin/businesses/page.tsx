import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AppPageHeader, Card } from "@/components/app/page-header";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const metadata: Metadata = { title: "Businesses", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export default async function AdminBusinessesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin("/admin/businesses");
  const { q } = await searchParams;
  const db = await getDb();
  const all = await db.listBusinesses();
  const query = (q ?? "").trim().toLowerCase();
  const businesses = query
    ? all.filter((b) => [b.name, b.slug, b.email, b.contact_name, b.phone].some((v) => v?.toLowerCase().includes(query)))
    : all;

  return (
    <Container size="wide" className="py-8 sm:py-12">
      <AppPageHeader
        eyebrow="Admin"
        title="Businesses"
        lead="Every customer, including the demo business. Open one to edit its information, profile and tap links."
        actions={
          <ButtonLink href="/admin/sell" size="sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New customer
          </ButtonLink>
        }
      />

      <form className="mt-6" role="search">
        <label htmlFor="q" className="sr-only">
          Search businesses
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q ?? ""}
          placeholder="Search by name, email, phone or slug"
          className="min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-[15px] outline-none focus:border-ink"
        />
      </form>

      {businesses.length === 0 ? (
        <Card className="mt-6">
          <p className="text-stone">{query ? "No businesses match that search." : "No businesses yet."}</p>
        </Card>
      ) : (
        <ul className="mt-6 grid gap-3">
          {businesses.map((business) => (
            <li key={business.id}>
              <Link href={`/admin/businesses/${business.id}`} className="flex items-center gap-4 rounded-3xl border border-ink/10 bg-white p-4 transition-colors hover:border-ink sm:p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream">
                  {business.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- customer upload, arbitrary host
                    <img src={business.logo_url} alt="" className="h-full w-full object-contain p-1.5" />
                  ) : (
                    <span className="font-display text-lg font-semibold">{business.name.slice(0, 1)}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-semibold">{business.name}</span>
                    {business.is_demo ? <span className="label rounded-full bg-ink/10 px-2 py-0.5 text-stone">demo</span> : null}
                    {!business.owner_user_id && !business.is_demo ? <span className="label rounded-full bg-accent/20 px-2 py-0.5 text-ink">not claimed</span> : null}
                  </div>
                  <p className="mt-1 truncate text-sm text-stone">
                    /p/{business.slug} · {business.email ?? "no email"} · {dateFormat.format(new Date(business.created_at))}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-stone" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

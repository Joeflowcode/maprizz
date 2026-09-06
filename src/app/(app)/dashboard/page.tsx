import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AppPageHeader, Card, Notice } from "@/components/app/page-header";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function DashboardIndex({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const session = await requireUser();
  const { denied } = await searchParams;
  const db = await getDb();
  const businesses = await db.listBusinessesForUser(session.userId, session.email);

  if (businesses.length === 1 && !denied) redirect(`/dashboard/${businesses[0].id}`);

  return (
    <Container className="py-10 sm:py-14">
      <AppPageHeader eyebrow="Dashboard" title={businesses.length ? "Your businesses" : "Welcome to Maprizz"} />
      {denied === "admin" ? <div className="mt-6"><Notice tone="warning">That page is for Maprizz admins.</Notice></div> : null}

      {businesses.length === 0 ? (
        <Card className="mt-8 max-w-2xl">
          <h2 className="font-display text-xl font-semibold tracking-[-0.02em]">No business on this email yet</h2>
          <p className="mt-2 text-stone">
            You&apos;re signed in as <strong className="text-ink">{session.email}</strong>. Businesses are attached to the email used at checkout or when we set you up in person. If you used a different address, sign out and try that one; otherwise order a card and it&apos;ll appear here.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/order" size="lg">
              Build My Tap Card
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="mailto:hello@maprizz.com" variant="secondary" size="lg">
              Email support
            </ButtonLink>
          </div>
        </Card>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {businesses.map((b) => (
            <li key={b.id}>
              <Link href={`/dashboard/${b.id}`} className="group flex items-center justify-between rounded-3xl border border-ink/10 bg-white p-5 transition-colors hover:border-ink">
                <span>
                  <span className="block font-display text-lg font-semibold tracking-[-0.02em]">{b.name}</span>
                  <span className="block font-mono text-xs text-stone">/p/{b.slug}</span>
                </span>
                <ArrowRight className="h-5 w-5 text-stone transition-transform group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Pencil, Smartphone, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AppPageHeader, Card } from "@/components/app/page-header";
import { StatCards, TapChart } from "@/components/app/stats";
import { QrPanel } from "@/components/qr-panel";
import { CreateReviewLinkButton } from "@/components/app/create-review-link-button";
import { authorizeBusiness, requireUser } from "@/lib/auth";
import { getDb, type StatsScope } from "@/lib/db";
import { describeDestination, resolveDestinationAbsolute, shortUrlFor } from "@/lib/tap";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function parseScope(value: string | undefined): StatsScope {
  return value === "business_card" || value === "review_stand" ? value : "all";
}

export default async function BusinessDashboard({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ scope?: string }>;
}) {
  const session = await requireUser();
  const { businessId } = await params;
  const { scope: rawScope } = await searchParams;
  const business = await authorizeBusiness(session, businessId);
  if (!business) notFound();
  const scope = parseScope(rawScope);

  const db = await getDb();
  const [profile, links, cardStats, reviewStats, chartStats] = await Promise.all([
    db.getProfile(business.id),
    db.listTapLinks(business.id),
    db.getTapStats(business.id, "business_card"),
    db.getTapStats(business.id, "review_stand"),
    db.getTapStats(business.id, scope),
  ]);
  const hasReview = links.some((l) => l.type === "review_stand");
  const basePath = `/dashboard/${business.id}`;

  return (
    <Container size="wide" className="py-8 sm:py-12">
      <AppPageHeader
        eyebrow="Dashboard"
        title={business.name}
        lead={profile?.enabled ? <>Profile live at <span className="font-mono text-ink">/p/{business.slug}</span></> : "No profile page on this business (Tap Card)."}
        actions={
          <>
            {profile?.enabled ? (
              <ButtonLink href={`/p/${business.slug}`} variant="secondary" size="sm" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Open profile
              </ButtonLink>
            ) : null}
            <ButtonLink href={`${basePath}/edit`} variant="dark" size="sm">
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Edit business
            </ButtonLink>
          </>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <StatCards title="Card taps" stats={cardStats} />
        <StatCards title="Review link taps" stats={reviewStats} hint="Taps on your review link, not reviews written" />
      </div>

      <div className="mt-6">
        <TapChart stats={chartStats} scope={scope} basePath={basePath} />
      </div>

      <section className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Your links and QR codes</h2>
            <p className="mt-1 text-sm text-stone">Encode the short URL on your NFC products. Change where it goes any time; the URL stays the same.</p>
          </div>
          {!hasReview ? <CreateReviewLinkButton businessId={business.id} /> : null}
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {links.map((link) => (
            <div key={link.id} className="grid gap-3">
              <QrPanel link={link} shortUrl={shortUrlFor(link)} destinationLabel={describeDestination(link, business)} destinationUrl={resolveDestinationAbsolute(link, business, profile)} />
              <ButtonLink href={`${basePath}/links/${link.id}`} variant="secondary" size="md" className="justify-self-start">
                {link.type === "review_stand" ? <Star className="h-4 w-4" aria-hidden="true" /> : <Smartphone className="h-4 w-4" aria-hidden="true" />}
                {link.type === "review_stand" ? "Change Google review link" : "Change card destination"}
              </ButtonLink>
            </div>
          ))}
          {links.length === 0 ? (
            <Card>
              <p className="text-stone">No tap links yet. They&apos;re created when an order is paid or when Maprizz sets you up.</p>
            </Card>
          ) : null}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: `${basePath}/profile`, title: "Edit profile", body: "Headline, description, theme, on/off." },
          { href: `${basePath}/edit`, title: "Change website & phone", body: "Also address, email and logo." },
          { href: `${basePath}/edit#instagram_url`, title: "Change social links", body: "Instagram, Facebook, booking." },
          { href: `${basePath}/edit#google_review_url`, title: "Change Google review link", body: "Used by the review stand and profile." },
        ].map((item) => (
          <Link key={item.title} href={item.href} className="rounded-3xl border border-ink/10 bg-white p-5 transition-colors hover:border-ink">
            <span className="block font-semibold">{item.title}</span>
            <span className="mt-1 block text-sm text-stone">{item.body}</span>
          </Link>
        ))}
      </section>
    </Container>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, ExternalLink, Smartphone, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AppPageHeader, Card } from "@/components/app/page-header";
import { CopyButton } from "@/components/copy-button";
import { QrPanel } from "@/components/qr-panel";
import { StatCards } from "@/components/app/stats";
import { BusinessForm } from "@/components/app/business-form";
import { ProfileForm } from "@/components/app/profile-form";
import { TapLinkForm } from "@/components/app/tap-link-form";
import { AddTapLink } from "@/components/admin/add-tap-link";
import { FulfillmentBadge, PaymentBadge } from "@/components/admin/order-status";
import { PhoneFrame } from "@/components/profile/phone-frame";
import { ProfileCard } from "@/components/profile/profile-card";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { packages } from "@/lib/packages";
import { toProfileData } from "@/lib/profile-data";
import { describeDestination, profileUrl, resolveDestinationAbsolute, shortUrlFor } from "@/lib/tap";

export const metadata: Metadata = { title: "Edit business", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export default async function AdminBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("/admin/businesses");
  const { id } = await params;
  const db = await getDb();
  const business = await db.getBusiness(id);
  if (!business) notFound();
  const [profile, links, orders, cardStats, reviewStats] = await Promise.all([
    db.getProfile(business.id),
    db.listTapLinks(business.id),
    db.listOrdersForBusiness(business.id),
    db.getTapStats(business.id, "business_card"),
    db.getTapStats(business.id, "review_stand"),
  ]);
  const card = links.find((l) => l.type === "business_card");
  const review = links.find((l) => l.type === "review_stand");

  return (
    <Container size="wide" className="py-8 sm:py-12">
      <AppPageHeader
        back={{ href: "/admin/businesses", label: "Businesses" }}
        eyebrow={business.is_demo ? "Demo business" : "Business"}
        title={business.name}
        lead={
          <>
            <span className="font-mono">/p/{business.slug}</span> · created {dateFormat.format(new Date(business.created_at))}
            {business.owner_user_id ? " · claimed by customer" : business.is_demo ? "" : " · not claimed yet"}
          </>
        }
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {profile?.enabled ? (
          <ButtonLink href={profileUrl(business.slug)} variant="dark" size="sm" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Open Profile
          </ButtonLink>
        ) : null}
        {card ? (
          <ButtonLink href={shortUrlFor(card)} variant="secondary" size="sm" target="_blank" rel="noopener noreferrer">
            <Smartphone className="h-4 w-4" aria-hidden="true" />
            Test Card Link
          </ButtonLink>
        ) : null}
        {review ? (
          <ButtonLink href={shortUrlFor(review)} variant="secondary" size="sm" target="_blank" rel="noopener noreferrer">
            <Star className="h-4 w-4" aria-hidden="true" />
            Test Review Link
          </ButtonLink>
        ) : null}
        {card ? (
          <ButtonLink href={`/api/qr/${card.code}?download=1&size=1024`} variant="secondary" size="sm">
            <Download className="h-4 w-4" aria-hidden="true" />
            Download QR
          </ButtonLink>
        ) : null}
        {card ? <CopyButton value={shortUrlFor(card)} label="Copy NFC URL" copiedLabel="NFC URL copied" size="sm" /> : null}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <StatCards title="Card taps" stats={cardStats} />
        <StatCards title="Review link taps" stats={reviewStats} hint="Taps on the review link, not reviews written" />
      </div>

      <section className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Tap links</h2>
            <p className="mt-1 text-sm text-stone">The short URL is what goes on the chip. Change the destination here without touching the card.</p>
          </div>
          <AddTapLink businessId={business.id} links={links} />
        </div>
        <div className="mt-5 grid gap-6">
          {links.map((link) => (
            <div key={link.id} className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <QrPanel link={link} shortUrl={shortUrlFor(link)} destinationLabel={describeDestination(link, business)} destinationUrl={resolveDestinationAbsolute(link, business, profile)} compact className="h-full" />
              </div>
              <Card className="lg:col-span-7">
                <TapLinkForm business={business} profile={profile} link={link} />
              </Card>
            </div>
          ))}
          {links.length === 0 ? (
            <Card>
              <p className="text-stone">No tap links yet. Add one above; a code and QR are generated instantly.</p>
            </Card>
          ) : null}
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Business information</h2>
          <Card className="mt-5">
            <BusinessForm business={business} />
          </Card>
        </div>
        <div className="lg:col-span-5">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Orders</h2>
          {orders.length === 0 ? (
            <Card className="mt-5">
              <p className="text-sm text-stone">No orders for this business.</p>
            </Card>
          ) : (
            <ul className="mt-5 grid gap-3">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link href={`/admin/orders/${order.id}`} className="block rounded-3xl border border-ink/10 bg-white p-4 transition-colors hover:border-ink">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{packages[order.package].name}</span>
                      <span className="text-sm text-stone">{dateFormat.format(new Date(order.created_at))}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <FulfillmentBadge status={order.fulfillment_status} />
                      <PaymentBadge status={order.payment_status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Digital profile</h2>
          <Card className="mt-5">
            <ProfileForm businessId={business.id} profile={profile} />
          </Card>
        </div>
        <div className="flex justify-center lg:col-span-5 lg:pt-14">
          <PhoneFrame className="max-w-[280px]" screenClassName="overflow-y-auto [scrollbar-width:none]">
            <ProfileCard data={toProfileData(business, profile, links)} interactive={false} compact />
          </PhoneFrame>
        </div>
      </section>
    </Container>
  );
}

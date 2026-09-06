import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, QrCode, Settings2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CopyButton } from "@/components/copy-button";
import { QrPanel } from "@/components/qr-panel";
import { PaymentControls } from "@/components/admin/payment-controls";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { packages } from "@/lib/packages";
import { describeDestination, profileUrl, resolveDestinationAbsolute, shortUrlFor } from "@/lib/tap";

export const metadata: Metadata = { title: "Customer ready", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function CustomerReadyPage({ params }: { params: Promise<{ orderId: string }> }) {
  await requireAdmin();
  const { orderId } = await params;
  const db = await getDb();
  const order = await db.getOrder(orderId);
  if (!order || !order.business_id) notFound();
  const [business, profile, links] = await Promise.all([db.getBusiness(order.business_id), db.getProfile(order.business_id), db.listTapLinks(order.business_id)]);
  if (!business) notFound();
  const card = links.find((l) => l.type === "business_card");
  const review = links.find((l) => l.type === "review_stand");
  const pkg = packages[order.package];

  return (
    <Container size="narrow" className="py-6 sm:py-10">
      <div className="rounded-3xl bg-ink p-6 text-cream sm:p-8">
        <p className="label text-accent">Customer ready</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{business.name}</h1>
        <p className="mt-2 text-mist">
          {pkg.name} · {pkg.priceLabel} · <span className="capitalize">{order.payment_status}</span>
        </p>
        <div className="mt-6 grid gap-3">
          {profile?.enabled ? (
            <ButtonLink href={profileUrl(business.slug)} size="xl" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-5 w-5" aria-hidden="true" />
              Open Profile
            </ButtonLink>
          ) : null}
          {card ? <CopyButton value={shortUrlFor(card)} label="Copy Tap URL" copiedLabel="Tap URL copied" variant="light" size="xl" /> : null}
          {review ? <CopyButton value={shortUrlFor(review)} label="Copy Review URL" copiedLabel="Review URL copied" variant="light" size="xl" /> : null}
          <ButtonLink href="#qr" variant="light" size="xl">
            <QrCode className="h-5 w-5" aria-hidden="true" />
            View QR
          </ButtonLink>
        </div>
      </div>

      <div className="mt-6">
        <PaymentControls order={order} />
      </div>

      <section id="qr" className="mt-8 grid gap-5">
        {links.map((link) => (
          <QrPanel key={link.id} link={link} shortUrl={shortUrlFor(link)} destinationLabel={describeDestination(link, business)} destinationUrl={resolveDestinationAbsolute(link, business, profile)} compact />
        ))}
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={`/admin/businesses/${business.id}`} variant="dark" size="lg">
          <Settings2 className="h-4 w-4" aria-hidden="true" />
          Edit business & links
        </ButtonLink>
        <ButtonLink href="/admin/sell" variant="secondary" size="lg">
          Next customer
        </ButtonLink>
      </div>
      <p className="mt-6 text-sm text-stone">
        Order <Link href={`/admin/orders/${order.id}`} className="font-mono underline underline-offset-4">{order.id.slice(0, 8)}</Link> is in fulfillment as <strong>new</strong>.
        {business.email ? <> The customer can log in at maprizz.com/login with {business.email}.</> : <> No email given, so the customer can&apos;t log in yet; add one under Edit business.</>}
      </p>
    </Container>
  );
}

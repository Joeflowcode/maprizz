import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Settings2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { TextareaField } from "@/components/forms/field";
import { AppPageHeader, Card, Notice } from "@/components/app/page-header";
import { CopyButton } from "@/components/copy-button";
import { QrPanel } from "@/components/qr-panel";
import { FulfillmentBadge, FulfillmentControls, PaymentBadge } from "@/components/admin/order-status";
import { PaymentControls } from "@/components/admin/payment-controls";
import { PrintButton } from "@/components/admin/print-button";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { saveOrderNotesAction } from "@/lib/actions/admin";
import { packages } from "@/lib/packages";
import { describeDestination, profileUrl, resolveDestinationAbsolute, shortUrlFor } from "@/lib/tap";

export const metadata: Metadata = { title: "Fulfillment sheet", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

function Row({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="grid gap-1 border-b border-ink/10 py-3 last:border-b-0 sm:grid-cols-[160px_1fr] sm:gap-4">
      <dt className="label text-stone">{label}</dt>
      <dd className={mono ? "break-all font-mono text-sm" : "break-words text-[15px]"}>{value ?? <span className="text-stone">—</span>}</dd>
    </div>
  );
}

export default async function FulfillmentSheetPage({ params }: { params: Promise<{ orderId: string }> }) {
  await requireAdmin("/admin/orders");
  const { orderId } = await params;
  const db = await getDb();
  const order = await db.getOrder(orderId);
  if (!order) notFound();
  const business = order.business_id ? await db.getBusiness(order.business_id) : null;
  const [profile, links] = business ? await Promise.all([db.getProfile(business.id), db.listTapLinks(business.id)]) : [null, []];
  const pkg = packages[order.package];
  const card = links.find((l) => l.type === "business_card");
  const review = links.find((l) => l.type === "review_stand");
  const notesAction = saveOrderNotesAction.bind(null, order.id);
  const awaitingProvision = order.payment_status === "unpaid" && links.length === 0;

  return (
    <Container size="wide" className="py-8 sm:py-12">
      <AppPageHeader
        back={{ href: "/admin/orders", label: "Orders" }}
        eyebrow={`Order ${order.id.slice(0, 8)}`}
        title={business?.name ?? "Order"}
        lead={
          <>
            {pkg.name} · {pkg.priceLabel} · {order.source === "field_sales" ? "Field sale" : "Web order"} · {dateFormat.format(new Date(order.created_at))}
          </>
        }
        actions={
          <>
            <PrintButton />
            {business ? (
              <ButtonLink href={`/admin/businesses/${business.id}`} variant="dark" size="sm" className="print:hidden">
                <Settings2 className="h-4 w-4" aria-hidden="true" />
                Edit business
              </ButtonLink>
            ) : null}
          </>
        }
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <FulfillmentBadge status={order.fulfillment_status} />
        <PaymentBadge status={order.payment_status} />
      </div>

      {awaitingProvision ? (
        <div className="mt-6 print:hidden">
          <Notice tone="warning">This web order hasn&apos;t been paid yet, so no tap links exist. They&apos;re created automatically when Stripe confirms payment, or mark it paid below to provision now.</Notice>
        </div>
      ) : null}

      <section className="mt-8 print:hidden">
        <h2 className="font-display text-xl font-semibold tracking-[-0.02em]">Fulfillment status</h2>
        <div className="mt-3">
          <FulfillmentControls orderId={order.id} current={order.fulfillment_status} />
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <h2 className="font-display text-xl font-semibold tracking-[-0.02em]">Fulfillment sheet</h2>
          <dl className="mt-4">
            <Row label="Business" value={business?.name} />
            <Row label="Package" value={`${pkg.name} (${pkg.priceLabel})`} />
            <Row label="Contact" value={business?.contact_name} />
            <Row label="Phone" value={business?.phone ? <a href={`tel:${business.phone}`} className="underline underline-offset-4">{business.phone}</a> : null} />
            <Row label="Email" value={order.customer_email || business?.email ? <a href={`mailto:${order.customer_email || business?.email}`} className="underline underline-offset-4">{order.customer_email || business?.email}</a> : null} />
            <Row label="Website" value={business?.website_url ? <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="break-all underline underline-offset-4">{business.website_url}</a> : null} />
            <Row label="Address" value={business?.address} />
            <Row label="Card code" value={card?.code} mono />
            <Row label="Tap URL" value={card ? shortUrlFor(card) : null} mono />
            <Row label="Card opens" value={card && business ? describeDestination(card, business) : null} />
            {pkg.hasReviewStand || review ? (
              <>
                <Row label="Stand code" value={review?.code} mono />
                <Row label="Review URL" value={review ? shortUrlFor(review) : null} mono />
                <Row label="Google review link" value={business?.google_review_url ? <span className="break-all">{business.google_review_url}</span> : <span className="text-red-800">Not set. Ask the customer or find it in their Google Business Profile.</span>} />
              </>
            ) : null}
            {pkg.hasProfile ? <Row label="Profile" value={business && profile?.enabled ? profileUrl(business.slug) : "Profile disabled"} mono /> : null}
            <Row label="Stripe session" value={order.stripe_checkout_session_id} mono />
            <Row label="Stripe payment" value={order.stripe_payment_intent_id} mono />
          </dl>
          {business ? (
            <div className="mt-5 flex flex-wrap gap-2 print:hidden">
              {card ? <CopyButton value={shortUrlFor(card)} label="Copy tap URL" size="sm" /> : null}
              {review ? <CopyButton value={shortUrlFor(review)} label="Copy review URL" size="sm" /> : null}
              {profile?.enabled ? (
                <ButtonLink href={profileUrl(business.slug)} variant="secondary" size="sm" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Open profile
                </ButtonLink>
              ) : null}
            </div>
          ) : null}
        </Card>

        <div className="grid gap-6 lg:col-span-5">
          <Card>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em]">Logo</h2>
            {business?.logo_url ? (
              <div className="mt-4 grid gap-3">
                <div className="flex min-h-40 items-center justify-center rounded-2xl bg-[repeating-conic-gradient(#f3efe8_0%_25%,#ffffff_0%_50%)] bg-[length:24px_24px] p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element -- customer upload, arbitrary host */}
                  <img src={business.logo_url} alt={`${business.name} logo`} className="max-h-40 max-w-full object-contain" />
                </div>
                <div className="flex flex-wrap gap-2 print:hidden">
                  <ButtonLink href={business.logo_url} variant="secondary" size="sm" target="_blank" rel="noopener noreferrer" download>
                    Download original
                  </ButtonLink>
                  <CopyButton value={business.logo_url} label="Copy URL" size="sm" />
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-stone">
                No logo uploaded. Add one under{" "}
                {business ? (
                  <Link href={`/admin/businesses/${business.id}`} className="underline underline-offset-4">
                    Edit business
                  </Link>
                ) : (
                  "Edit business"
                )}
                , or print the card with the business name in type.
              </p>
            )}
          </Card>

          <Card className="print:hidden">
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em]">Production notes</h2>
            <form action={notesAction} className="mt-4 grid gap-3">
              <TextareaField id="notes" label="Notes" optional rows={4} defaultValue={order.notes ?? ""} placeholder="Card colour, quantity, special requests, delivery plan…" />
              <div>
                <Button type="submit" variant="dark" size="md">
                  Save notes
                </Button>
              </div>
            </form>
          </Card>
          {order.notes ? (
            <Card className="hidden print:block">
              <h2 className="font-display text-xl font-semibold tracking-[-0.02em]">Notes</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm">{order.notes}</p>
            </Card>
          ) : null}
        </div>
      </div>

      <div className="mt-6 print:hidden">
        <PaymentControls order={order} />
      </div>

      {links.length > 0 && business ? (
        <section className="mt-10 break-inside-avoid">
          <h2 className="font-display text-xl font-semibold tracking-[-0.02em]">QR codes to print</h2>
          <p className="mt-1 text-sm text-stone">Each QR opens the same short URL as the NFC chip. Download the SVG for print.</p>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {links.map((link) => (
              <QrPanel key={link.id} link={link} shortUrl={shortUrlFor(link)} destinationLabel={describeDestination(link, business)} destinationUrl={resolveDestinationAbsolute(link, business, profile)} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}

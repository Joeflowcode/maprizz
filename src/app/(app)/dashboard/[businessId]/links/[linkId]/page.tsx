import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { AppPageHeader, Card } from "@/components/app/page-header";
import { TapLinkForm } from "@/components/app/tap-link-form";
import { QrPanel } from "@/components/qr-panel";
import { authorizeBusiness, requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { describeDestination, resolveDestinationAbsolute, shortUrlFor } from "@/lib/tap";

export const metadata: Metadata = { title: "Change destination", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditLinkPage({ params }: { params: Promise<{ businessId: string; linkId: string }> }) {
  const session = await requireUser();
  const { businessId, linkId } = await params;
  const business = await authorizeBusiness(session, businessId);
  if (!business) notFound();
  const db = await getDb();
  const link = await db.getTapLink(linkId);
  if (!link || link.business_id !== business.id) notFound();
  const profile = await db.getProfile(business.id);
  const isReview = link.type === "review_stand";

  return (
    <Container size="wide" className="py-8 sm:py-12">
      <AppPageHeader
        back={{ href: `/dashboard/${business.id}`, label: "Dashboard" }}
        eyebrow={isReview ? "Review stand" : "Business card"}
        title={<>Code <span className="font-mono">{link.code}</span></>}
        lead="This short URL is printed and programmed on your product. Change the destination below; the code stays the same."
      />
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <TapLinkForm business={business} profile={profile} link={link} />
        </Card>
        <div className="lg:col-span-5">
          <QrPanel link={link} shortUrl={shortUrlFor(link)} destinationLabel={describeDestination(link, business)} destinationUrl={resolveDestinationAbsolute(link, business, profile)} compact />
        </div>
      </div>
    </Container>
  );
}

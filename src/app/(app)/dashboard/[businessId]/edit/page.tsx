import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { AppPageHeader, Card } from "@/components/app/page-header";
import { BusinessForm } from "@/components/app/business-form";
import { authorizeBusiness, requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Edit business", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditBusinessPage({ params }: { params: Promise<{ businessId: string }> }) {
  const session = await requireUser();
  const { businessId } = await params;
  const business = await authorizeBusiness(session, businessId);
  if (!business) notFound();

  return (
    <Container className="py-8 sm:py-12">
      <AppPageHeader back={{ href: `/dashboard/${business.id}`, label: "Dashboard" }} eyebrow="Business" title="Edit business information" lead="Changes apply to your profile and vCard immediately. Your card URL never changes." />
      <Card className="mt-8">
        <BusinessForm business={business} />
      </Card>
    </Container>
  );
}

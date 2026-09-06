import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AppPageHeader, Card } from "@/components/app/page-header";
import { ProfileForm } from "@/components/app/profile-form";
import { PhoneFrame } from "@/components/profile/phone-frame";
import { ProfileCard } from "@/components/profile/profile-card";
import { authorizeBusiness, requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { toProfileData } from "@/lib/profile-data";

export const metadata: Metadata = { title: "Edit profile", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditProfilePage({ params }: { params: Promise<{ businessId: string }> }) {
  const session = await requireUser();
  const { businessId } = await params;
  const business = await authorizeBusiness(session, businessId);
  if (!business) notFound();
  const db = await getDb();
  const [profile, links] = await Promise.all([db.getProfile(business.id), db.listTapLinks(business.id)]);

  return (
    <Container size="wide" className="py-8 sm:py-12">
      <AppPageHeader
        back={{ href: `/dashboard/${business.id}`, label: "Dashboard" }}
        eyebrow="Profile"
        title="Edit your digital profile"
        lead="Buttons appear automatically for the information you've added under Edit business."
        actions={
          profile?.enabled ? (
            <ButtonLink href={`/p/${business.slug}`} variant="secondary" size="sm" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Open live profile
            </ButtonLink>
          ) : null
        }
      />
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <ProfileForm businessId={business.id} profile={profile} />
        </Card>
        <div className="flex justify-center lg:col-span-5">
          <PhoneFrame className="max-w-[280px]" screenClassName="overflow-y-auto [scrollbar-width:none]">
            <ProfileCard data={toProfileData(business, profile, links)} interactive={false} compact />
          </PhoneFrame>
        </div>
      </div>
    </Container>
  );
}

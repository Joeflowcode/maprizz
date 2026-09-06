import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileCard } from "@/components/profile/profile-card";
import { getDb } from "@/lib/db";
import { toProfileData } from "@/lib/profile-data";

export const dynamic = "force-dynamic";

async function load(slug: string) {
  const db = await getDb();
  const business = await db.getBusinessBySlug(slug);
  if (!business) return null;
  const [profile, tapLinks] = await Promise.all([db.getProfile(business.id), db.listTapLinks(business.id)]);
  if (!profile || !profile.enabled) return null;
  return { business, profile, tapLinks };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) return { title: "Profile not found", robots: { index: false } };
  const title = data.business.name;
  const description = data.profile.headline ?? `Contact ${data.business.name}: call, text, directions and more.`;
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, type: "profile" },
    ...(data.business.logo_url ? { icons: { icon: data.business.logo_url } } : {}),
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) notFound();
  const profileData = toProfileData(data.business, data.profile, data.tapLinks);
  const dark = profileData.theme === "dark";
  return (
    <div className={dark ? "flex flex-1 flex-col bg-ink" : "flex flex-1 flex-col bg-cream"}>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <ProfileCard data={profileData} className="flex-1" />
      </div>
    </div>
  );
}

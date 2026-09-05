import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileScreen } from "@/components/profile/profile-parts";
import { getProfileBySlug } from "@/lib/demo-profile";

export async function generateMetadata({
  params,
}: PageProps<"/p/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);
  if (!profile) return { title: "Profile not found" };
  return {
    title: profile.name,
    description: profile.headline,
  };
}

export default async function ProfilePage({ params }: PageProps<"/p/[slug]">) {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);
  if (!profile) notFound();

  return (
    <div className="min-h-svh bg-ink">
      <ProfileScreen data={profile} />
    </div>
  );
}

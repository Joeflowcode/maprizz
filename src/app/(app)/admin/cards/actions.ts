"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createCard, setCardActive } from "@/lib/tap-cards";

export async function createReferralCard(formData: FormData) {
  await requireAdmin("/admin/cards");

  let slug = "";
  try {
    const card = await createCard({
      slug: String(formData.get("slug") ?? ""),
      referrer_name: String(formData.get("referrer_name") ?? ""),
      label: String(formData.get("label") ?? ""),
    });
    slug = card.slug;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create card.";
    redirect(`/admin/cards?error=${encodeURIComponent(message)}`);
  }
  revalidatePath("/admin/cards");
  redirect(`/admin/cards/${slug}`);
}

export async function toggleReferralCard(formData: FormData) {
  await requireAdmin("/admin/cards");
  const slug = String(formData.get("slug") ?? "");
  const active = String(formData.get("active") ?? "") === "true";
  await setCardActive(slug, active);
  revalidatePath("/admin/cards");
  revalidatePath(`/admin/cards/${slug}`);
}

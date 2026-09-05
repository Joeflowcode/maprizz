import { redirect } from "next/navigation";
import { resolveReviewRedirect } from "@/lib/links";

export default async function ReviewRedirectPage({
  params,
}: PageProps<"/r/[code]">) {
  const { code } = await params;
  const result = resolveReviewRedirect(code);

  if (result.type === "external") {
    redirect(result.url);
  }

  if (result.type === "profile") {
    redirect(`/p/${result.slug}`);
  }

  const query = new URLSearchParams({
    reason: result.reason,
    ...(result.code ? { code: result.code } : {}),
  });
  redirect(`/link-unavailable?${query.toString()}`);
}

import { redirect } from "next/navigation";
import { resolveReviewRedirect, resolveTapRedirect } from "@/lib/links";

export default async function TapRedirectPage({
  params,
}: PageProps<"/t/[code]">) {
  const { code } = await params;
  const result = resolveTapRedirect(code);

  if (result.type === "profile") {
    redirect(`/p/${result.slug}`);
  }

  const query = new URLSearchParams({
    reason: result.reason,
    ...(result.code ? { code: result.code } : {}),
  });
  redirect(`/link-unavailable?${query.toString()}`);
}

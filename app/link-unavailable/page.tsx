import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { MinimalShell } from "@/components/layout/marketing-shell";

export default async function LinkUnavailablePage({
  searchParams,
}: PageProps<"/link-unavailable">) {
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code : undefined;

  return (
    <MinimalShell>
      <div className="min-h-svh bg-cream px-5 py-16 sm:px-8">
        <Logo />
        <div className="mx-auto mt-16 max-w-lg">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">
            This link isn&apos;t set up yet.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-stone">
            The code on this card or stand doesn&apos;t match anything in Maprizz.
            {code ? ` (${code})` : null} If you just received it, give it a few
            minutes and try again.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center rounded-xl bg-ink px-6 font-semibold text-cream"
            >
              Visit Maprizz
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center rounded-xl border border-ink/20 px-6 font-semibold text-ink"
            >
              Business owner? Log in
            </Link>
          </div>
        </div>
      </div>
    </MinimalShell>
  );
}

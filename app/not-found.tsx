import Link from "next/link";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <p className="label text-stone">404</p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.04em]">
          Page not found
        </h1>
        <p className="mt-4 text-lg text-stone">
          That URL isn&apos;t part of Maprizz yet.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/">Back home</ButtonLink>
          <Link href="/order" className="inline-flex min-h-12 items-center px-4 font-semibold text-brand">
            Build My Tap Card
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}

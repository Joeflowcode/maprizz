import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { MinimalShell } from "@/components/layout/marketing-shell";
import { site } from "@/lib/site";

export default function LoginPage() {
  return (
    <MinimalShell>
      <div className="min-h-svh bg-cream">
        <header className="border-b border-ink/10 px-5 py-5 sm:px-8">
          <Logo />
        </header>
        <div className="mx-auto max-w-lg px-5 py-16 sm:px-8">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">
            Log in to Maprizz
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-stone">
            Manage your card, links, review stand and taps. We&apos;ll email you a
            sign-in link; no password to remember.
          </p>
          <div className="mt-8 rounded-3xl border border-ink/10 bg-white/70 p-6 text-[15px] leading-relaxed text-stone">
            <p>
              Customer login isn&apos;t switched on yet. If you ordered a card, email{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-brand hover:underline"
              >
                {site.email}
              </a>{" "}
              and we&apos;ll make any change for you.
            </p>
            <p className="mt-4">
              New here? Log in with the email you used when you ordered, and your
              business will be waiting.
            </p>
          </div>
          <p className="mt-6 text-sm text-stone">
            <Link href="/" className="font-semibold text-brand hover:underline">
              Back to Maprizz
            </Link>
          </p>
        </div>
      </div>
    </MinimalShell>
  );
}

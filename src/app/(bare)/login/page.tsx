import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { getSession } from "@/lib/auth";
import { supabaseConfigured, useMockAuth } from "@/lib/env";
import { siteConfig } from "@/lib/site-config";
import { MagicLinkForm } from "./magic-link-form";
import { DevLoginForm } from "./dev-login-form";

export const metadata: Metadata = { title: "Log in", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const session = await getSession();
  if (session) redirect(next && next.startsWith("/") ? next : "/dashboard");
  const nextPath = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  return (
    <div className="grain flex flex-1 flex-col items-center px-5 py-12 text-cream sm:justify-center">
      <Logo tone="light" />
      <div className="mt-10 w-full max-w-md rounded-3xl bg-cream p-6 text-ink shadow-lift sm:p-8">
        <h1 className="font-display text-2xl font-semibold tracking-[-0.03em]">Log in to Maprizz</h1>
        <p className="mt-2 text-[15px] text-stone">
          Manage your card, links, review stand and taps. We&apos;ll email you a sign-in link; no password to remember.
        </p>
        {error === "auth" ? (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            That sign-in link didn&apos;t work. It may have expired; request a new one.
          </p>
        ) : null}
        {useMockAuth ? (
          <DevLoginForm next={nextPath} />
        ) : supabaseConfigured ? (
          <MagicLinkForm next={nextPath} />
        ) : (
          <p role="status" className="mt-6 rounded-xl bg-ink/5 px-4 py-3 text-sm text-ink">
            Customer login isn&apos;t switched on yet. If you ordered a card, email{" "}
            <a href={`mailto:${siteConfig.email}`} className="font-semibold underline underline-offset-4">
              {siteConfig.email}
            </a>{" "}
            and we&apos;ll make any change for you.
          </p>
        )}
      </div>
      <p className="mt-8 max-w-sm text-center text-xs text-mist">
        New here? Log in with the email you used when you ordered, and your business will be waiting.
      </p>
    </div>
  );
}

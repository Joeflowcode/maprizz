import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader({ signedIn = false }: { signedIn?: boolean }) {
  const accountHref = signedIn ? "/dashboard" : "/login";
  const accountLabel = signedIn ? "Dashboard" : "Log in";

  return (
    <header className="sticky top-0 z-40 site-header border-b border-ink/10 bg-white text-ink">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-medium text-stone transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={accountHref}
            className="px-2 text-[15px] font-medium text-stone transition-colors hover:text-ink"
          >
            {accountLabel}
          </Link>
          <ButtonLink href="/audit" size="sm">
            Get my free audit
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>

        <details className="relative lg:hidden">
          <summary className="inline-flex h-11 cursor-pointer list-none items-center gap-2 rounded-xl border border-ink/20 px-3 text-ink [&::-webkit-details-marker]:hidden">
            <span className="label text-xs">Menu</span>
            <Menu className="h-4 w-4 menu-open:hidden" aria-hidden="true" />
            <X className="hidden h-4 w-4 menu-open:block" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(100vw-2.5rem,22rem)] rounded-2xl border border-cream/10 bg-ink p-4 shadow-lift">
            <nav aria-label="Mobile" className="flex flex-col">
              {[...navLinks, { href: accountHref, label: accountLabel }].map(
                (item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="border-b border-cream/10 py-4 font-display text-2xl font-semibold tracking-[-0.03em] text-cream last:border-b-0"
                  >
                    {item.label}
                  </Link>
                ),
              )}
              <div className="mt-4 grid gap-3">
                <ButtonLink href="/audit" size="lg">
                  Get my free audit
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="/demo" variant="secondary" size="lg">
                  Try the card demo
                </ButtonLink>
              </div>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}

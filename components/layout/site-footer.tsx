import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { products, servicePlans } from "@/lib/catalog";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-cream text-ink">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="label text-stone">{site.tagline}</p>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-stone">
              A stronger Google presence, a better website, and a local partner who knows your name.
            </p>
            <ButtonLink href="/audit" className="mt-6" size="md">
              Get my free audit
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <p className="mt-4 text-sm text-stone">Based in Bend. Working with local businesses.</p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Products & plans
            </h2>
            <ul className="mt-4 space-y-2 text-[15px] text-stone">
              {products.map((product) => (
                <li key={product.id}>
                  <Link href={product.href} className="hover:text-ink">
                    {product.name} — {product.priceLabel}
                  </Link>
                </li>
              ))}
              {servicePlans.map((plan) => (
                <li key={plan.id}>
                  <Link href={plan.href} className="hover:text-ink">
                    {plan.name} — {plan.priceLabel}
                    {plan.cadence}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Maprizz
            </h2>
            <ul className="mt-4 space-y-2 text-[15px] text-stone">
              <li>
                <Link href="/demo" className="hover:text-ink">
                  Interactive demo
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-ink">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/audit" className="hover:text-ink">
                  Free business audit
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-ink">
                  Customer login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Contact
            </h2>
            <ul className="mt-4 space-y-2 text-[15px] text-stone">
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-ink">
                  {site.email}
                </a>
              </li>
              <li>Based in Bend, Oregon. Shipping nationwide.</li>
            </ul>
          </div>
        </div>

        <div className="rule mt-12 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Logo />
            <p className="text-sm text-stone">
              © {new Date().getFullYear()} {site.legalName}. All rights reserved.
            </p>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-stone">
            {site.disclaimer}
          </p>
          <ul className="mt-4 flex flex-wrap gap-4 text-sm text-stone">
            <li>
              <Link href="/privacy" className="hover:text-ink">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-ink">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

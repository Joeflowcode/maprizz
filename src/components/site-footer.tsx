import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { footerLinks, siteConfig } from "@/lib/site-config";

const columnHeading = "label text-mist";
const link = "text-[15px] text-cream/80 transition-colors hover:text-accent";

export function SiteFooter() {
  return (
    <footer className="grain bg-ink text-cream">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 border-b border-cream/10 py-16 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="label text-accent">{siteConfig.tagline}</p>
            <p className="mt-5 max-w-lg font-display text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
              A stronger Google presence, a better website,{" "}
              <span className="text-mist">and a local partner who knows your name.</span>
            </p>
          </div>
          <div className="lg:justify-self-end">
            <Link
              href={siteConfig.cta.primaryHref}
              className="group inline-flex items-center gap-3 font-display text-2xl font-semibold tracking-tight text-cream"
            >
              <span className="underline decoration-accent decoration-2 underline-offset-[8px]">{siteConfig.cta.primary}</span>
              <ArrowRight className="h-6 w-6 text-accent transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <p className="mt-3 text-sm text-mist">Based in {siteConfig.location.city}. Working with local businesses.</p>
          </div>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-3">
          <div>
            <h2 className={columnHeading}>Products &amp; plans</h2>
            <ul className="mt-5 space-y-3">
              {footerLinks.products.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={columnHeading}>Maprizz</h2>
            <ul className="mt-5 space-y-3">
              {footerLinks.company.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={columnHeading}>Contact</h2>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li>
                <a href={`mailto:${siteConfig.email}`} className={link}>
                  {siteConfig.email}
                </a>
              </li>
              {siteConfig.phone ? (
                <li>
                  <a href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`} className={link}>
                    {siteConfig.phone}
                  </a>
                </li>
              ) : null}
              <li className="text-mist">Based in Bend, Oregon. Shipping nationwide.</li>
            </ul>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="select-none overflow-hidden border-t border-cream/10 pt-6 font-display text-[clamp(4rem,19vw,17rem)] font-semibold leading-[0.85] tracking-[-0.05em] text-cream/[0.07]"
        >
          Maprizz
        </p>

        <div className="flex flex-col gap-4 border-t border-cream/10 py-8 text-sm text-mist sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p>
              © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
            </p>
            <p className="max-w-2xl">{siteConfig.disclaimer}</p>
          </div>
          <ul className="flex gap-5">
            {footerLinks.legal.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

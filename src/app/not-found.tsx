import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page couldn't be found. Head back to the Maprizz homepage or try the demo.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="grain relative overflow-hidden bg-ink text-cream">
          <div className="surface-glow absolute inset-0" aria-hidden="true" />
          <Container size="wide" className="relative flex min-h-[70svh] flex-col justify-center py-24">
            <p className="label flex items-center gap-3 text-accent">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              Error 404
            </p>
            <h1 className="mt-8 font-display text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-balance sm:text-7xl lg:text-8xl">
              This pin isn&apos;t <span className="text-accent">on the map.</span>
            </h1>
            <p className="mt-8 max-w-md text-lg text-mist text-pretty">The page you&apos;re looking for moved or never existed. Let&apos;s get you somewhere useful.</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/audit" size="lg">
                {siteConfig.cta.primary}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/" variant="light" size="lg">
                Back to home
              </ButtonLink>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

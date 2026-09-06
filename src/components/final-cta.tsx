import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

type Cta = { href: string; label: string };

export function FinalCta({
  eyebrow = "Get found. Build trust. Grow locally.",
  title = "You handle the work. We'll help you get noticed.",
  body = "Start with a free review of your Google profile and website.",
  primary = { href: siteConfig.cta.primaryHref, label: siteConfig.cta.primary },
  secondary = { href: "/services", label: "See monthly plans" },
  note = "No obligation. Just a useful place to start.",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  primary?: Cta;
  secondary?: Cta | null;
  note?: string | null;
}) {
  return (
    <section className="grain relative overflow-hidden bg-ink py-24 text-cream sm:py-36">
      <div className="surface-glow absolute inset-0" aria-hidden="true" />
      <Container size="wide" className="relative">
        <p className="label flex items-center gap-3 text-accent">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          {eyebrow}
        </p>
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h2 className="font-display text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-balance sm:text-6xl lg:col-span-8 lg:text-7xl">
            {title}
          </h2>
          <div className="lg:col-span-4 lg:pb-2">
            <p className="text-lg leading-relaxed text-mist text-pretty">{body}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <ButtonLink href={primary.href} size="lg">
                {primary.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              {secondary ? (
                <ButtonLink href={secondary.href} variant="light" size="lg">
                  {secondary.label}
                </ButtonLink>
              ) : null}
            </div>
            {note ? <p className="mt-5 font-mono text-xs text-mist">{note}</p> : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

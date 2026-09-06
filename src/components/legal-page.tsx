import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <section className="grain bg-ink text-cream">
        <Container size="narrow" className="py-14 sm:py-20">
          <p className="label text-accent">Legal</p>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">{title}</h1>
          <p className="mt-4 text-mist">Last updated {updated}</p>
        </Container>
      </section>
      <Section tone="cream" containerSize="narrow" padding="tight">
        <div className="space-y-8 text-[17px] leading-relaxed text-stone [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:border-t [&_h2]:border-ink/15 [&_h2]:pt-6 [&_h2]:text-ink [&_a]:font-semibold [&_a]:text-brand [&_a]:underline-offset-4 hover:[&_a]:underline [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_p+p]:mt-4">
          {children}
        </div>
      </Section>
    </>
  );
}

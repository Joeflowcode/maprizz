import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { JsonLd } from "@/components/json-ld";
import { organizationJsonLd } from "@/lib/seo";
import { getSession } from "@/lib/auth";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession().catch(() => null);
  return (
    <>
      <SiteHeader signedIn={Boolean(session)} />
      <main id="main" className="flex-1 bg-cream pb-24 lg:pb-0">
        {children}
      </main>
      <SiteFooter />
      <StickyCta />
      <JsonLd data={organizationJsonLd} />
    </>
  );
}

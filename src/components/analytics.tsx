import Script from "next/script";
import { siteConfig } from "@/lib/site-config";

/** Loads Google Analytics 4 only when NEXT_PUBLIC_ANALYTICS_ID is configured. */
export function Analytics() {
  const id = siteConfig.analyticsId;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id.replace(/'/g, "")}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}

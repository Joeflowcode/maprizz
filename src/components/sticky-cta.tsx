"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

const HIDDEN = new Set(["/audit", "/order", "/order/success", "/subscribe", "/subscribe/success", "/login", "/contact"]);

/** Mobile conversion bar. Hidden on pages that already have a form in view. */
export function StickyCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (HIDDEN.has(pathname) || pathname.startsWith("/order") || pathname.startsWith("/subscribe")) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-cream/10 bg-ink/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={{ transition: "transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      <ButtonLink href={siteConfig.cta.primaryHref} size="lg" className="w-full">
        {siteConfig.cta.primary}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </ButtonLink>
    </div>
  );
}

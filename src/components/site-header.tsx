"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
import { navLinks, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function SiteHeader({ signedIn = false }: { signedIn?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const [menuPath, setMenuPath] = useState(pathname);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const accountHref = signedIn ? "/dashboard" : "/login";
  const accountLabel = signedIn ? "Dashboard" : "Log in";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b text-cream transition-colors duration-300",
        // No backdrop-filter while open: it would become the containing block for the
        // fixed menu panel and collapse it.
        open ? "border-cream/10 bg-ink" : scrolled ? "border-cream/10 bg-ink/85 backdrop-blur-md" : "border-transparent bg-ink",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Logo tone="light" />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const href: string = link.href;
            const active = !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-[15px] font-medium transition-colors",
                  active ? "text-cream" : "text-cream/70 hover:text-cream",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href={accountHref} className="px-2 text-[15px] font-medium text-cream/70 transition-colors hover:text-cream">
            {accountLabel}
          </Link>
          <ButtonLink href={siteConfig.cta.primaryHref} size="sm">
            {siteConfig.cta.primary}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-cream/20 px-3 text-cream lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="label text-[10px]">{open ? "Close" : "Menu"}</span>
          {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto border-t border-cream/10 bg-ink text-cream lg:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col px-5 py-4 sm:px-8">
          {[...navLinks, { href: accountHref, label: accountLabel }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 border-b border-cream/10 py-5 font-display text-3xl font-semibold tracking-[-0.03em] text-cream"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-8 grid gap-3">
            <ButtonLink href={siteConfig.cta.primaryHref} size="lg" onClick={() => setOpen(false)}>
              {siteConfig.cta.primary}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/demo" variant="light" size="lg" onClick={() => setOpen(false)}>
              Try the card demo
            </ButtonLink>
          </div>
          <p className="label mt-10 text-mist">{siteConfig.tagline}</p>
        </nav>
      </div>
    </header>
  );
}

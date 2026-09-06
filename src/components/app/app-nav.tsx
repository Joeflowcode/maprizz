"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const customerLinks = [{ href: "/dashboard", label: "Dashboard" }];
const adminLinks = [
  { href: "/admin/sell", label: "Sell" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/businesses", label: "Businesses" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/cards", label: "Tap Cards" },
];

export function AppNav({ isAdmin, mobile = false }: { isAdmin: boolean; mobile?: boolean }) {
  const pathname = usePathname();
  const links = isAdmin ? [...customerLinks, ...adminLinks] : customerLinks;
  return (
    <nav
      aria-label={mobile ? "App (mobile)" : "App"}
      className={cn(mobile ? "flex gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none]" : "hidden items-center gap-1 md:flex")}
    >
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-cream text-ink" : "text-cream/75 hover:bg-cream/10 hover:text-cream",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

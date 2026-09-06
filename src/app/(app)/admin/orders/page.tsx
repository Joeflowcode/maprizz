import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AppPageHeader, Card } from "@/components/app/page-header";
import { FulfillmentBadge, PaymentBadge } from "@/components/admin/order-status";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { packages } from "@/lib/packages";
import type { Business, Order } from "@/types/database";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Filter = "open" | "new" | "paid" | "production" | "ready" | "delivered" | "all";

const filters: Array<{ id: Filter; label: string; test: (o: Order) => boolean }> = [
  { id: "open", label: "Open", test: (o) => o.fulfillment_status !== "delivered" },
  { id: "new", label: "New", test: (o) => o.fulfillment_status === "new" },
  { id: "paid", label: "Paid", test: (o) => o.payment_status !== "unpaid" && o.fulfillment_status !== "delivered" },
  { id: "production", label: "In production", test: (o) => o.fulfillment_status === "design" || o.fulfillment_status === "production" },
  { id: "ready", label: "Ready", test: (o) => o.fulfillment_status === "ready" },
  { id: "delivered", label: "Delivered", test: (o) => o.fulfillment_status === "delivered" },
  { id: "all", label: "All", test: () => true },
];

function parseFilter(value: string | undefined): Filter {
  return filters.some((f) => f.id === value) ? (value as Filter) : "open";
}

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin("/admin/orders");
  const { status } = await searchParams;
  const filter = parseFilter(status);

  const db = await getDb();
  const [orders, businesses] = await Promise.all([db.listOrders(), db.listBusinesses()]);
  const byId = new Map<string, Business>(businesses.map((b) => [b.id, b]));
  const active = filters.find((f) => f.id === filter)!;
  const visible = orders.filter(active.test);

  return (
    <Container size="wide" className="py-8 sm:py-12">
      <AppPageHeader eyebrow="Fulfillment" title="Orders" lead="Every order has a fulfillment sheet with the logo, URLs, QR codes and card code you need to produce it." />

      <nav aria-label="Order filters" className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {filters.map((f) => {
          const count = orders.filter(f.test).length;
          const isActive = f.id === filter;
          return (
            <Link
              key={f.id}
              href={f.id === "open" ? "/admin/orders" : `/admin/orders?status=${f.id}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                isActive ? "border-ink bg-ink text-cream" : "border-ink/15 bg-white text-ink hover:border-ink",
              )}
            >
              {f.label}
              <span className={cn("rounded-full px-1.5 text-xs", isActive ? "bg-cream/20" : "bg-ink/5 text-stone")}>{count}</span>
            </Link>
          );
        })}
      </nav>

      {visible.length === 0 ? (
        <Card className="mt-6">
          <p className="text-stone">Nothing here. Orders appear when a customer checks out or you create one under Sell.</p>
        </Card>
      ) : (
        <ul className="mt-6 grid gap-3">
          {visible.map((order) => {
            const business = order.business_id ? byId.get(order.business_id) : undefined;
            const pkg = packages[order.package];
            return (
              <li key={order.id}>
                <Link href={`/admin/orders/${order.id}`} className="flex items-center gap-4 rounded-3xl border border-ink/10 bg-white p-4 transition-colors hover:border-ink sm:p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-semibold">{business?.name ?? "Unknown business"}</span>
                      {business?.is_demo ? <span className="label rounded-full bg-ink/10 px-2 py-0.5 text-stone">demo</span> : null}
                    </div>
                    <p className="mt-1 text-sm text-stone">
                      {pkg.name} · {pkg.priceLabel} · {order.source === "field_sales" ? "Field sale" : "Web"} · {dateFormat.format(new Date(order.created_at))}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <FulfillmentBadge status={order.fulfillment_status} />
                      <PaymentBadge status={order.payment_status} />
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-stone" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}

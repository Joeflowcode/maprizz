import type { FulfillmentStatus, PaymentStatus } from "@/types/database";
import { setFulfillmentStatusAction } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

export const fulfillmentSteps: Array<{ id: FulfillmentStatus; label: string; hint: string }> = [
  { id: "new", label: "New", hint: "Order received" },
  { id: "design", label: "Design", hint: "Artwork being prepared" },
  { id: "production", label: "Production", hint: "Printing / encoding" },
  { id: "ready", label: "Ready", hint: "Packed, waiting for hand-off" },
  { id: "delivered", label: "Delivered", hint: "In the customer's hands" },
];

const fulfillmentTone: Record<FulfillmentStatus, string> = {
  new: "bg-accent/20 text-ink",
  design: "bg-sky-100 text-sky-900",
  production: "bg-violet-100 text-violet-900",
  ready: "bg-emerald-100 text-emerald-900",
  delivered: "bg-ink/10 text-stone",
};

const paymentTone: Record<PaymentStatus, string> = {
  unpaid: "bg-red-50 text-red-800",
  paid: "bg-emerald-100 text-emerald-900",
  cash: "bg-emerald-100 text-emerald-900",
  complimentary: "bg-ink/10 text-stone",
};

export function FulfillmentBadge({ status }: { status: FulfillmentStatus }) {
  return <span className={cn("label rounded-full px-2.5 py-1", fulfillmentTone[status])}>{status}</span>;
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return <span className={cn("label rounded-full px-2.5 py-1", paymentTone[status])}>{status === "unpaid" ? "awaiting payment" : status}</span>;
}

/**
 * Fulfillment status control: one plain form, each button submits its own status. No
 * client JavaScript needed, which keeps it snappy on a phone in the workshop.
 */
export function FulfillmentControls({ orderId, current }: { orderId: string; current: FulfillmentStatus }) {
  const action = setFulfillmentStatusAction.bind(null, orderId);
  const currentIndex = fulfillmentSteps.findIndex((s) => s.id === current);
  return (
    <form action={action} className="grid gap-2 sm:grid-cols-5">
      {fulfillmentSteps.map((step, index) => {
        const active = step.id === current;
        const done = index < currentIndex;
        return (
          <button
            key={step.id}
            type="submit"
            name="status"
            value={step.id}
            aria-pressed={active}
            className={cn(
              "flex min-h-14 flex-col items-start justify-center rounded-2xl border px-4 py-2 text-left transition-colors active:scale-[0.985]",
              active ? "border-ink bg-ink text-cream" : done ? "border-ink/10 bg-ink/5 text-stone hover:border-ink" : "border-ink/15 bg-white hover:border-ink",
            )}
          >
            <span className="text-sm font-semibold">{step.label}</span>
            <span className={cn("text-xs", active ? "text-mist" : "text-stone")}>{step.hint}</span>
          </button>
        );
      })}
    </form>
  );
}

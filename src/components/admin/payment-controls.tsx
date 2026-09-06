"use client";

import { useState, useTransition } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { Notice } from "@/components/app/page-header";
import { createPaymentLinkAction, setPaymentStatusAction } from "@/lib/actions/admin";
import type { Order, PaymentStatus } from "@/types/database";
import { cn } from "@/lib/utils";

const statuses: Array<{ id: PaymentStatus; label: string }> = [
  { id: "unpaid", label: "Unpaid" },
  { id: "paid", label: "Paid" },
  { id: "cash", label: "Cash" },
  { id: "complimentary", label: "Complimentary" },
];

/** TAKE PAYMENT + manual payment status. Admin only (enforced server-side). */
export function PaymentControls({ order }: { order: Order }) {
  const [pending, start] = useTransition();
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function takePayment() {
    setError(null);
    start(async () => {
      const result = await createPaymentLinkAction(order.id);
      if ("url" in result) setLink(result.url);
      else setError(result.error);
    });
  }

  function setStatus(status: PaymentStatus) {
    const form = new FormData();
    form.set("status", status);
    start(() => setPaymentStatusAction(order.id, form));
  }

  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">Payment</h2>
        <span className={cn("label rounded-full px-2.5 py-1", order.payment_status === "unpaid" ? "bg-accent/20 text-ink" : "bg-emerald-100 text-emerald-900")}>{order.payment_status}</span>
      </div>

      {order.payment_status === "unpaid" ? (
        <div className="mt-4 grid gap-3">
          <Button type="button" size="xl" onClick={takePayment} disabled={pending}>
            <CreditCard className="h-5 w-5" aria-hidden="true" />
            {pending && !link ? "Creating checkout…" : "Take Payment"}
          </Button>
          {link ? (
            <div className="grid gap-3 rounded-2xl bg-cream p-4">
              <p className="text-sm text-stone">Hand them your phone, text them the link, or let them scan it.</p>
              <a href={link} target="_blank" rel="noopener noreferrer" className="break-all font-mono text-sm underline underline-offset-4">
                {link}
              </a>
              <div className="flex flex-wrap gap-2">
                <CopyButton value={link} label="Copy payment link" size="sm" />
                <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center rounded-xl bg-ink px-4 text-sm font-semibold text-cream">
                  Open checkout
                </a>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element -- QR from our own API */}
              <img src={`/api/qr-url?u=${encodeURIComponent(link)}`} alt="Payment link QR" width={220} height={220} className="mx-auto rounded-xl bg-white p-2" />
            </div>
          ) : null}
          {error ? <Notice tone="error">{error}</Notice> : null}
        </div>
      ) : null}

      <div className="mt-5">
        <p className="label text-stone">Set payment status</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {statuses.map((s) => (
            <Button key={s.id} type="button" variant={order.payment_status === s.id ? "dark" : "secondary"} size="md" disabled={pending} onClick={() => setStatus(s.id)}>
              {s.label}
            </Button>
          ))}
        </div>
        <p className="mt-2 text-xs text-stone">Cash and complimentary can only be set by admins.</p>
      </div>
    </div>
  );
}

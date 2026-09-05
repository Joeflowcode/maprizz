import { Suspense } from "react";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { PageHero } from "@/components/marketing/sections";
import { OrderWizard } from "@/components/forms/order-wizard";

export default function OrderPage() {
  return (
    <MarketingShell>
      <PageHero
        label="Order"
        title="Build your card."
        description="About three minutes. You can change every link later from your dashboard."
      />
      <Suspense fallback={<div className="px-5 py-10 text-stone">Loading order form…</div>}>
        <OrderWizard />
      </Suspense>
    </MarketingShell>
  );
}

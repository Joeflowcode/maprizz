import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { OrderWizard } from "@/components/order/order-wizard";
import { isPackageId } from "@/lib/packages";
import { stripeConfigured, useMockPayments } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Order",
  description: "Order a Maprizz Tap Card, Smart Business Card or Business Kit. Add your logo and links; we program the card and set up your permanent Maprizz URL.",
  path: "/order",
});

export default async function OrderPage({ searchParams }: { searchParams: Promise<{ package?: string; canceled?: string }> }) {
  const { package: pkg, canceled } = await searchParams;
  return (
    <div className="bg-cream">
      <Container size="default" className="py-10 sm:py-14">
        <OrderWizard
          initialPackage={isPackageId(pkg) ? pkg : null}
          canceled={canceled === "1"}
          paymentMode={stripeConfigured ? "stripe" : useMockPayments ? "mock" : "unavailable"}
        />
      </Container>
    </div>
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { AppPageHeader, Notice } from "@/components/app/page-header";
import { FieldSaleForm } from "@/components/admin/field-sale-form";

export const metadata: Metadata = { title: "Sell", robots: { index: false, follow: false } };

export default async function SellPage({ searchParams }: { searchParams: Promise<{ canceled?: string }> }) {
  const { canceled } = await searchParams;
  return (
    <Container size="narrow" className="py-6 sm:py-10">
      <AppPageHeader eyebrow="Field sales" title="New customer" lead="Fill this in while you're standing in their shop. Profile, tap URL and QR are generated instantly." />
      {canceled ? <div className="mt-4"><Notice tone="warning">Payment was canceled. The customer is still set up; you can take payment again from their ready screen.</Notice></div> : null}
      <div className="mt-6">
        <FieldSaleForm />
      </div>
    </Container>
  );
}

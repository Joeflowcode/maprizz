"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  getProduct,
  products,
  type ProductPackage,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";

const steps = [
  "Package",
  "Business",
  "Google",
  "Branding",
  "Destination",
  "Review",
  "Pay",
];

export function OrderWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPackage =
    (searchParams.get("package") as ProductPackage | null) ?? "smart_card";
  const [selected, setSelected] = useState<ProductPackage>(
    products.some((p) => p.id === initialPackage) ? initialPackage : "smart_card",
  );

  const product = useMemo(() => getProduct(selected), [selected]);

  return (
    <section className="bg-cream pb-20 pt-10">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <ol className="flex flex-wrap gap-2 text-xs font-medium text-stone">
          {steps.map((step, index) => (
            <li
              key={step}
              className={cn(
                "rounded-full border px-3 py-1",
                index === 0
                  ? "border-ink bg-ink text-cream"
                  : "border-ink/15 bg-white/70",
              )}
            >
              {index + 1} {step}
            </li>
          ))}
        </ol>

        <p className="label mt-8 text-stone">Step 1 of 7 · Package</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">
          Choose your package
        </h2>

        <div className="mt-8 space-y-4">
          {products.map((item) => {
            const active = selected === item.id;
            return (
              <label
                key={item.id}
                className={cn(
                  "block cursor-pointer rounded-3xl border p-5 transition-colors",
                  active
                    ? "border-ink bg-white shadow-sm"
                    : "border-ink/15 bg-white/60 hover:border-ink/30",
                )}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="package"
                    value={item.id}
                    checked={active}
                    onChange={() => setSelected(item.id)}
                    className="mt-1.5 h-4 w-4 accent-[#16120e]"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-xl font-semibold tracking-tight">
                        {item.name}
                      </span>
                      {item.badge ? (
                        <span className="label rounded-full bg-accent px-2 py-0.5 text-ink">
                          {item.badge}
                        </span>
                      ) : null}
                      <span className="font-display text-xl font-semibold">
                        {item.priceLabel}
                      </span>
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-stone">
                      {item.description} {item.features.join(" · ")}.
                    </p>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        <Button
          className="mt-8 min-w-48"
          onClick={() => router.push(`/order?package=${selected}&step=2`)}
        >
          Continue
        </Button>

        <p className="mt-6 text-sm text-stone">
          Selected: <strong className="text-ink">{product.name}</strong>. Checkout
          with Stripe will be wired when payments are configured for this repo.
        </p>
      </div>
    </section>
  );
}

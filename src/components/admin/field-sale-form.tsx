"use client";

import { useActionState, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField, SelectField } from "@/components/forms/field";
import { Notice } from "@/components/app/page-header";
import { createCustomerAction, type AdminActionState } from "@/lib/actions/admin";
import { packageList, type PackageId } from "@/lib/packages";
import { cn } from "@/lib/utils";

export function FieldSaleForm() {
  const [state, action, pending] = useActionState<AdminActionState, FormData>(createCustomerAction, { ok: false });
  const [pkg, setPkg] = useState<PackageId>("smart_card");
  const errors = state.errors ?? {};

  return (
    <form action={action} className="grid gap-5 rounded-3xl border border-ink/10 bg-white p-5 sm:p-7">
      <InputField id="name" label="Business name" error={errors.name} autoComplete="off" required autoFocus />
      <InputField id="contact_name" label="Owner / contact name" error={errors.contact_name} autoComplete="off" required />
      <div className="grid gap-5 sm:grid-cols-2">
        <InputField id="phone" label="Phone" type="tel" optional error={errors.phone} inputMode="tel" autoComplete="off" />
        <InputField id="email" label="Email" type="email" optional error={errors.email} inputMode="email" autoComplete="off" hint="Their dashboard login." />
      </div>
      <InputField id="website_url" label="Website" optional error={errors.website_url} inputMode="url" placeholder="theirbusiness.com" autoComplete="off" />
      <InputField id="google_review_url" label="Google review URL" optional error={errors.google_review_url} inputMode="url" placeholder="https://g.page/r/…/review" autoComplete="off" />

      <fieldset>
        <legend className="text-sm font-medium">Package</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {packageList.map((option) => (
            <label
              key={option.id}
              className={cn(
                "flex min-h-20 cursor-pointer flex-col items-center justify-center rounded-2xl border p-3 text-center transition-colors",
                pkg === option.id ? "border-ink bg-ink text-cream" : "border-ink/15 hover:border-ink/40",
              )}
            >
              <input type="radio" name="package" value={option.id} checked={pkg === option.id} onChange={() => setPkg(option.id)} className="sr-only" />
              <span className="font-display text-xl font-semibold tracking-[-0.03em]">{option.priceLabel}</span>
              <span className={cn("mt-0.5 text-xs leading-tight", pkg === option.id ? "text-mist" : "text-stone")}>{option.name.replace("Business Card", "Card")}</span>
            </label>
          ))}
        </div>
        {errors.package ? <p className="mt-2 text-sm font-medium text-red-700">{errors.package}</p> : null}
      </fieldset>

      <SelectField id="payment_status" label="Payment" defaultValue="unpaid" hint="You can take card payment on the next screen.">
        <option value="unpaid">Unpaid (take payment next)</option>
        <option value="cash">Paid cash</option>
        <option value="paid">Already paid (card)</option>
        <option value="complimentary">Complimentary</option>
      </SelectField>

      {state.message ? <Notice tone="error">{state.message}</Notice> : null}

      <Button type="submit" size="xl" disabled={pending}>
        {pending ? "Creating…" : "Create Customer"}
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </Button>
    </form>
  );
}

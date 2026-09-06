"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField, SelectField, TextareaField } from "@/components/forms/field";
import { plans, planList, isPlanId, type PlanId } from "@/lib/services";
import type { FieldErrors } from "@/lib/validation";

export function SubscribeForm({ initialPlan }: { initialPlan: PlanId }) {
  const [planId, setPlanId] = useState<PlanId>(initialPlan);
  const plan = plans[planId];
  const [values, setValues] = useState({
    business_name: "",
    contact_name: "",
    city: "",
    email: "",
    phone: "",
    website_url: "",
    google_business_url: "",
    notes: "",
    company: "",
  });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(key: keyof typeof values) {
    return (event: { target: { value: string } }) => setValues((v) => ({ ...v, [key]: event.target.value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    setMessage("");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, plan: planId, agree }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        url?: string;
        message?: string;
        errors?: FieldErrors;
      };
      if (!response.ok || !data.ok || !data.url) {
        setErrors(data.errors ?? {});
        setMessage(data.message ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      window.location.assign(data.url);
    } catch {
      setMessage("We couldn't reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-5 rounded-3xl border border-ink/10 bg-white p-5 sm:p-7">
      <SelectField
        id="plan"
        label="Monthly plan"
        value={planId}
        onChange={(event) => {
          const next = event.target.value;
          if (isPlanId(next)) setPlanId(next);
        }}
        hint={`${plan.priceLabel} billed every month. First charge today.`}
      >
        {planList.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name} — {item.priceLabel}/mo
          </option>
        ))}
      </SelectField>

      <div className="rounded-2xl bg-cream px-4 py-3 text-sm text-stone">
        <p className="font-semibold text-ink">{plan.name}</p>
        <p className="mt-1">{plan.terms}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <InputField id="business_name" label="Business name" value={values.business_name} onChange={update("business_name")} error={errors.business_name} autoComplete="organization" required />
        <InputField id="city" label="City or service area" placeholder="Bend, Oregon" value={values.city} onChange={update("city")} error={errors.city} autoComplete="address-level2" required />
        <InputField id="contact_name" label="Your name" value={values.contact_name} onChange={update("contact_name")} error={errors.contact_name} autoComplete="name" required />
        <InputField id="email" label="Email" type="email" value={values.email} onChange={update("email")} error={errors.email} autoComplete="email" inputMode="email" required />
      </div>
      <InputField id="phone" label="Phone" type="tel" optional value={values.phone} onChange={update("phone")} error={errors.phone} autoComplete="tel" inputMode="tel" />
      <InputField id="website_url" label="Website" optional placeholder="yourbusiness.com" value={values.website_url} onChange={update("website_url")} error={errors.website_url} inputMode="url" />
      <InputField
        id="google_business_url"
        label="Google Business Profile URL"
        optional
        placeholder="https://maps.app.goo.gl/…"
        value={values.google_business_url}
        onChange={update("google_business_url")}
        error={errors.google_business_url}
        inputMode="url"
      />
      <TextareaField id="notes" label="Anything we should know?" optional rows={3} value={values.notes} onChange={update("notes")} error={errors.notes} />

      <div className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={update("company")} />
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-ink">
        <input
          type="checkbox"
          checked={agree}
          onChange={(event) => setAgree(event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-ink/30 text-accent focus:ring-accent"
        />
        <span>
          Charge {plan.priceLabel} today, then automatically every month. {plan.minimumMonths === 6 ? "This plan has a 6-month initial term. " : "Month to month. "}
          I agree to the{" "}
          <Link href="/terms" className="font-semibold underline underline-offset-4">
            terms
          </Link>
          .
          {errors.agree ? (
            <span role="alert" className="mt-1 block font-medium text-red-700">
              {errors.agree}
            </span>
          ) : null}
        </span>
      </label>

      {message ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {message}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={submitting} className="sm:shrink-0">
          {submitting ? "Starting checkout…" : `Pay ${plan.priceLabel} and start`}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
        <p className="text-xs text-stone">
          Prefer a look first?{" "}
          <Link href={`/audit?plan=${planId}`} className="underline underline-offset-4">
            Request a free audit
          </Link>
        </p>
      </div>
    </form>
  );
}

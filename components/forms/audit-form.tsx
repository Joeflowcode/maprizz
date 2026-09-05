"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auditInterests } from "@/lib/catalog";
import { site } from "@/lib/site";

type AuditFormProps = {
  defaultInterest?: string;
};

export function AuditForm({ defaultInterest = "unsure" }: AuditFormProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="rounded-3xl border border-ink/10 bg-white/70 p-6 shadow-sm sm:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      {submitted ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-emerald-900">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Request received
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed">
            Thanks — we&apos;ll review your Google Business Profile and website and
            reply with the fixes that matter most.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          <Field id="business_name" label="Business name" required />
          <Field id="contact_name" label="Your name" required />
          <Field id="email" label="Email" type="email" required />
          <Field id="phone" label="Phone (optional)" />
          <Field id="website" label="Website (optional)" />
          <div>
            <label htmlFor="google_business_url" className="field-label">
              Google Business Profile URL (optional)
            </label>
            <input
              id="google_business_url"
              name="google_business_url"
              className="field-input"
              placeholder="https://maps.google.com/..."
            />
            <p id="google_business_url-hint" className="mt-2 text-sm text-stone">
              Search your business on Google Maps and paste the link.
            </p>
          </div>
          <div>
            <label htmlFor="interest" className="field-label">
              What are you looking for?
            </label>
            <select
              id="interest"
              name="interest"
              defaultValue={defaultInterest}
              className="field-input"
            >
              {auditInterests.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p id="interest-hint" className="mt-2 text-sm text-stone">
              Helps us focus the audit. You can change your mind.
            </p>
          </div>
          <div>
            <label htmlFor="notes" className="field-label">
              Anything we should know? (optional)
            </label>
            <textarea id="notes" name="notes" rows={4} className="field-input resize-y" />
          </div>
          <input
            id="company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="-left-[9999px] absolute h-px w-px opacity-0"
            aria-hidden="true"
          />
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Get My Free Audit
          </Button>
          <p className="text-sm text-stone">
            We only use this to reply to you.{" "}
            <Link href="/privacy" className="font-semibold text-brand hover:underline">
              Privacy
            </Link>
          </p>
        </div>
      )}
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  required = false,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="field-input"
      />
    </div>
  );
}

export function AuditBullets() {
  const bullets = [
    "A real person looks at your Google Business Profile and website.",
    "You get a short list of the fixes that matter most, in plain language.",
    "No automated score. No pressure. No obligation to buy anything.",
  ];

  return (
    <ul className="space-y-3 text-[15px] leading-relaxed text-stone">
      {bullets.map((bullet) => (
        <li key={bullet} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>{bullet}</span>
        </li>
      ))}
      <li className="text-sm text-stone">
        Questions? Email{" "}
        <a href={`mailto:${site.email}`} className="font-semibold text-brand hover:underline">
          {site.email}
        </a>
        .
      </li>
    </ul>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField, TextareaField } from "@/components/forms/field";
import { LogoUpload } from "@/components/order/logo-upload";
import { packageList, packages, type PackageId } from "@/lib/packages";
import { businessInfoSchema, destinationSchema, flattenErrors, type FieldErrors } from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { DestinationType } from "@/types/database";

type PaymentMode = "stripe" | "mock" | "unavailable";

const steps = ["Package", "Business", "Google", "Branding", "Destination", "Review", "Pay"] as const;

type BusinessForm = {
  name: string;
  contact_name: string;
  phone: string;
  email: string;
  website_url: string;
  address: string;
  instagram_url: string;
  facebook_url: string;
  booking_url: string;
  google_business_url: string;
  google_review_url: string;
};

const emptyBusiness: BusinessForm = {
  name: "",
  contact_name: "",
  phone: "",
  email: "",
  website_url: "",
  address: "",
  instagram_url: "",
  facebook_url: "",
  booking_url: "",
  google_business_url: "",
  google_review_url: "",
};

const step2Keys: Array<keyof BusinessForm> = ["name", "contact_name", "phone", "email", "website_url", "address", "instagram_url", "facebook_url", "booking_url"];
const step3Keys: Array<keyof BusinessForm> = ["google_business_url", "google_review_url"];

export function OrderWizard({
  initialPackage,
  canceled,
  paymentMode,
}: {
  initialPackage: PackageId | null;
  canceled: boolean;
  paymentMode: PaymentMode;
}) {
  const [step, setStep] = useState(initialPackage ? 1 : 0);
  const [pkgId, setPkgId] = useState<PackageId | null>(initialPackage);
  const [business, setBusiness] = useState<BusinessForm>(emptyBusiness);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [destination, setDestination] = useState<DestinationType | null>(null);
  const [customUrl, setCustomUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const pkg = pkgId ? packages[pkgId] : null;

  // Tap Card has no profile, so its default is the website.
  const effectiveDestination: DestinationType | null = useMemo(() => {
    if (destination) return destination;
    if (!pkg) return null;
    return pkg.hasProfile ? "profile" : "website";
  }, [destination, pkg]);

  function update(key: keyof BusinessForm) {
    return (event: { target: { value: string } }) => {
      setBusiness((b) => ({ ...b, [key]: event.target.value }));
      if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
    };
  }

  function validateBusinessKeys(keys: Array<keyof BusinessForm>) {
    const result = businessInfoSchema.safeParse(business);
    if (result.success) return true;
    const all = flattenErrors(result.error);
    const relevant: FieldErrors = {};
    for (const key of keys) if (all[key]) relevant[key] = all[key];
    setErrors(relevant);
    return Object.keys(relevant).length === 0;
  }

  function next() {
    setSubmitError(null);
    if (step === 0 && !pkgId) return setErrors({ package: "Choose a package to continue." });
    if (step === 1 && !validateBusinessKeys(step2Keys)) return;
    if (step === 2) {
      if (!validateBusinessKeys(step3Keys)) return;
      if (pkg?.hasReviewStand && !business.google_review_url.trim() && !business.google_business_url.trim()) {
        return setErrors({ google_review_url: "The Business Kit includes a review stand, so we need your Google review link or your Google Maps link." });
      }
    }
    if (step === 4) {
      const result = destinationSchema.safeParse({ destination_type: effectiveDestination, destination_url: customUrl || null });
      if (!result.success) return setErrors(flattenErrors(result.error));
      if (effectiveDestination === "website" && !business.website_url.trim()) {
        return setErrors({ destination_url: "You chose \"Open my website\" but didn't enter a website in step 2. Go back and add it, or pick another option." });
      }
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function back() {
    setErrors({});
    setSubmitError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function pay() {
    if (!pkgId || !effectiveDestination) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package: pkgId,
          business,
          logo_url: logoUrl,
          destination: { destination_type: effectiveDestination, destination_url: effectiveDestination === "custom_url" ? customUrl : null },
          notes: notes || null,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; url?: string; message?: string; errors?: FieldErrors };
      if (!response.ok || !data.ok || !data.url) {
        setErrors(data.errors ?? {});
        setSubmitError(data.message ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      window.location.assign(data.url);
    } catch {
      setSubmitError("We couldn't reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Progress */}
      <aside className="lg:col-span-4">
        <p className="label text-brand">Order</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Build your card.</h1>
        <p className="mt-3 text-[15px] text-stone">About three minutes. You can change every link later from your dashboard.</p>
        {canceled ? (
          <p className="mt-4 rounded-xl bg-accent/15 px-4 py-3 text-sm">Checkout was canceled. Your details are still here whenever you&apos;re ready.</p>
        ) : null}
        <ol className="mt-8 hidden gap-1 lg:grid">
          {steps.map((label, index) => {
            const done = index < step;
            const current = index === step;
            return (
              <li key={label} className={cn("flex items-center gap-3 rounded-xl px-3 py-2 text-[15px]", current && "bg-white font-semibold")}>
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px]",
                    done ? "bg-ink text-cream" : current ? "bg-accent text-ink" : "border border-ink/20 text-stone",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : index + 1}
                </span>
                <span className={cn(!current && !done && "text-stone")}>{label}</span>
              </li>
            );
          })}
        </ol>
        {pkg ? (
          <div className="mt-8 hidden rounded-2xl border border-ink/10 bg-white p-5 lg:block">
            <p className="label text-stone">Your package</p>
            <p className="mt-2 flex items-baseline justify-between font-semibold">
              <span>{pkg.name}</span>
              <span className="font-display text-xl">{pkg.priceLabel}</span>
            </p>
            <button type="button" onClick={() => setStep(0)} className="mt-2 text-sm text-brand underline underline-offset-4">
              Change
            </button>
          </div>
        ) : null}
      </aside>

      {/* Step body */}
      <div className="lg:col-span-8">
        <div className="mb-5 flex items-center justify-between text-sm text-stone lg:hidden">
          <span>
            Step {step + 1} of {steps.length} · <span className="font-semibold text-ink">{steps[step]}</span>
          </span>
          {pkg ? (
            <span>
              {pkg.name} · {pkg.priceLabel}
            </span>
          ) : null}
        </div>
        <div className="mb-6 h-1 overflow-hidden rounded-full bg-ink/10 lg:hidden">
          <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>

        <div className="rounded-3xl border border-ink/10 bg-white p-5 sm:p-8">
          {step === 0 ? (
            <fieldset>
              <legend className="font-display text-2xl font-semibold tracking-[-0.02em]">Choose your package</legend>
              <div className="mt-6 grid gap-3">
                {packageList.map((option) => {
                  const selected = pkgId === option.id;
                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors sm:p-5",
                        selected ? "border-ink bg-cream" : "border-ink/15 hover:border-ink/40",
                      )}
                    >
                      <input
                        type="radio"
                        name="package"
                        value={option.id}
                        checked={selected}
                        onChange={() => {
                          setPkgId(option.id);
                          setDestination(null);
                          setErrors({});
                        }}
                        className="mt-1.5 h-4 w-4 accent-[#16120e]"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                          <span className="font-semibold">
                            {option.name}
                            {option.popular ? <span className="label ml-2 rounded-full bg-accent px-2 py-0.5 text-ink">Most popular</span> : null}
                          </span>
                          <span className="font-display text-xl font-semibold">{option.priceLabel}</span>
                        </span>
                        <span className="mt-1 block text-sm text-stone">{option.tagline}</span>
                        <span className="mt-2 block text-sm text-ink/80">{option.includes.join(" · ")}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.package ? (
                <p role="alert" className="mt-3 text-sm font-medium text-red-700">
                  {errors.package}
                </p>
              ) : null}
            </fieldset>
          ) : null}

          {step === 1 ? (
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Business information</h2>
              <p className="mt-2 text-sm text-stone">This is what goes on your card and profile. Only name, contact and email are required.</p>
              <div className="mt-6 grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField id="name" label="Business name" value={business.name} onChange={update("name")} error={errors.name} autoComplete="organization" required />
                  <InputField id="contact_name" label="Contact person's name" value={business.contact_name} onChange={update("contact_name")} error={errors.contact_name} autoComplete="name" required />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField id="phone" label="Phone" type="tel" optional value={business.phone} onChange={update("phone")} error={errors.phone} autoComplete="tel" inputMode="tel" hint="Powers the Call and Text buttons." />
                  <InputField id="email" label="Email" type="email" value={business.email} onChange={update("email")} error={errors.email} autoComplete="email" inputMode="email" required hint="Your receipt and dashboard login." />
                </div>
                <InputField id="website_url" label="Website" optional placeholder="yourbusiness.com" value={business.website_url} onChange={update("website_url")} error={errors.website_url} inputMode="url" />
                <InputField id="address" label="Business address" optional value={business.address} onChange={update("address")} error={errors.address} autoComplete="street-address" hint="Powers the Directions button. Leave blank if you're mobile-only." />
                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField id="instagram_url" label="Instagram" optional placeholder="instagram.com/yourbusiness" value={business.instagram_url} onChange={update("instagram_url")} error={errors.instagram_url} inputMode="url" />
                  <InputField id="facebook_url" label="Facebook" optional placeholder="facebook.com/yourbusiness" value={business.facebook_url} onChange={update("facebook_url")} error={errors.facebook_url} inputMode="url" />
                </div>
                <InputField id="booking_url" label="Booking URL" optional placeholder="Square, Calendly, Booksy…" value={business.booking_url} onChange={update("booking_url")} error={errors.booking_url} inputMode="url" />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Google information</h2>
              <p className="mt-2 text-sm text-stone">
                {pkg?.hasReviewStand
                  ? "Your Business Kit includes a Google review stand, so we need one of these. If you only have the Maps link, we'll set up the review link for you."
                  : "Optional. Add these if you want a Leave a Google Review button on your profile."}
              </p>
              <div className="mt-6 grid gap-5">
                <InputField
                  id="google_business_url"
                  label="Google Business Profile URL"
                  optional={!pkg?.hasReviewStand}
                  placeholder="https://maps.app.goo.gl/…"
                  hint="Find your business on Google Maps → Share → copy link."
                  value={business.google_business_url}
                  onChange={update("google_business_url")}
                  error={errors.google_business_url}
                  inputMode="url"
                />
                <InputField
                  id="google_review_url"
                  label="Google Review URL"
                  optional={!pkg?.hasReviewStand}
                  placeholder="https://g.page/r/…/review"
                  hint="In your Google Business Profile: Ask for reviews → copy the link."
                  value={business.google_review_url}
                  onChange={update("google_review_url")}
                  error={errors.google_review_url}
                  inputMode="url"
                />
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Branding</h2>
              <p className="mt-2 text-sm text-stone">Your logo is printed on the card and shown on your profile. You can skip this and email it to us later.</p>
              <div className="mt-6">
                <LogoUpload value={logoUrl} onChange={setLogoUrl} />
              </div>
            </div>
          ) : null}

          {step === 4 && pkg ? (
            <fieldset>
              <legend className="font-display text-2xl font-semibold tracking-[-0.02em]">Where should a tap go?</legend>
              <p className="mt-2 text-sm text-stone">The card always opens your permanent Maprizz URL first, then sends people here. Change it any time.</p>
              <div className="mt-6 grid gap-3">
                {(
                  [
                    { id: "website" as const, title: "Open my website directly", body: business.website_url ? business.website_url : "Add a website in step 2 to use this.", disabled: false },
                    {
                      id: "profile" as const,
                      title: "Open my Maprizz smart profile",
                      body: pkg.hasProfile ? "Call, Text, Website, Directions, socials and Save Contact on one screen." : "Included with the Smart Business Card and Business Kit.",
                      disabled: !pkg.hasProfile,
                    },
                    { id: "custom_url" as const, title: "Open another URL", body: "A booking page, a Linktree, a menu, a Google Form…", disabled: false },
                  ] as const
                ).map((option) => {
                  const selected = effectiveDestination === option.id;
                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "flex items-start gap-4 rounded-2xl border p-4 transition-colors sm:p-5",
                        option.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                        selected ? "border-ink bg-cream" : "border-ink/15 hover:border-ink/40",
                      )}
                    >
                      <input
                        type="radio"
                        name="destination"
                        value={option.id}
                        checked={selected}
                        disabled={option.disabled}
                        onChange={() => {
                          setDestination(option.id);
                          setErrors({});
                        }}
                        className="mt-1.5 h-4 w-4 accent-[#16120e]"
                      />
                      <span>
                        <span className="block font-semibold">{option.title}</span>
                        <span className="mt-1 block break-all text-sm text-stone">{option.body}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {effectiveDestination === "custom_url" ? (
                <div className="mt-5">
                  <InputField id="destination_url" label="URL to open" placeholder="https://…" value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} error={errors.destination_url} inputMode="url" required />
                </div>
              ) : errors.destination_url ? (
                <p role="alert" className="mt-3 text-sm font-medium text-red-700">
                  {errors.destination_url}
                </p>
              ) : null}
            </fieldset>
          ) : null}

          {step === 5 && pkg ? (
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Review your order</h2>
              <dl className="mt-6 divide-y divide-ink/10 text-[15px]">
                <Row label="Package" onEdit={() => setStep(0)}>
                  {pkg.name} · {pkg.priceLabel} one time
                </Row>
                <Row label="Business" onEdit={() => setStep(1)}>
                  <span className="block font-semibold">{business.name}</span>
                  <span className="block text-stone">
                    {business.contact_name} · {business.email}
                    {business.phone ? ` · ${business.phone}` : ""}
                  </span>
                  {business.website_url ? <span className="block break-all text-stone">{business.website_url}</span> : null}
                  {business.address ? <span className="block text-stone">{business.address}</span> : null}
                </Row>
                <Row label="Links" onEdit={() => setStep(1)}>
                  {[business.instagram_url && "Instagram", business.facebook_url && "Facebook", business.booking_url && "Booking"].filter(Boolean).join(", ") || <span className="text-stone">None added</span>}
                </Row>
                <Row label="Google" onEdit={() => setStep(2)}>
                  {business.google_review_url || business.google_business_url ? (
                    <>
                      {business.google_business_url ? <span className="block break-all">{business.google_business_url}</span> : null}
                      {business.google_review_url ? <span className="block break-all">{business.google_review_url}</span> : null}
                    </>
                  ) : (
                    <span className="text-stone">Not added</span>
                  )}
                </Row>
                <Row label="Logo" onEdit={() => setStep(3)}>
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- just-uploaded preview
                    <img src={logoUrl} alt="Your logo" className="h-12 w-12 rounded-lg bg-cream object-contain p-1" />
                  ) : (
                    <span className="text-stone">We&apos;ll ask for it after checkout</span>
                  )}
                </Row>
                <Row label="Card opens" onEdit={() => setStep(4)}>
                  {effectiveDestination === "profile" ? "Your Maprizz smart profile" : effectiveDestination === "website" ? business.website_url : customUrl}
                </Row>
                {pkg.hasReviewStand ? (
                  <Row label="Review stand opens" onEdit={() => setStep(2)}>
                    {business.google_review_url || "Your Google review form (we'll set the link up)"}
                  </Row>
                ) : null}
              </dl>
              <div className="mt-6">
                <TextareaField id="notes" label="Anything else we should know?" optional rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Colors, spelling, a second card, delivery notes…" />
              </div>
            </div>
          ) : null}

          {step === 6 && pkg ? (
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Payment</h2>
              <div className="mt-6 flex items-baseline justify-between rounded-2xl bg-cream p-5">
                <span className="font-semibold">
                  {pkg.name}
                  <span className="block text-sm font-normal text-stone">for {business.name}</span>
                </span>
                <span className="font-display text-3xl font-semibold tracking-[-0.03em]">{pkg.priceLabel}</span>
              </div>
              {paymentMode === "stripe" ? (
                <p className="mt-4 flex items-start gap-2 text-sm text-stone">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  You&apos;ll finish on Stripe&apos;s secure checkout. Cards, Apple Pay and Google Pay accepted. We never see your card number.
                </p>
              ) : paymentMode === "mock" ? (
                <p className="mt-4 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
                  <strong>Development mode.</strong> Stripe isn&apos;t configured, so the next screen simulates a successful payment. No money moves.
                </p>
              ) : (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                  Online checkout isn&apos;t available right now. Email{" "}
                  <a href="mailto:hello@maprizz.com" className="font-semibold underline">
                    hello@maprizz.com
                  </a>{" "}
                  and we&apos;ll set you up directly.
                </p>
              )}
              {submitError ? (
                <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                  {submitError}
                </p>
              ) : null}
              <p className="mt-6 text-xs text-stone">
                By paying you agree to the{" "}
                <Link href="/terms" className="underline underline-offset-4">
                  terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-4">
                  privacy policy
                </Link>
                .
              </p>
            </div>
          ) : null}

          {/* Nav */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            {step > 0 ? (
              <Button type="button" variant="ghost" onClick={back} disabled={submitting}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </Button>
            ) : (
              <span />
            )}
            {step < steps.length - 1 ? (
              <Button type="button" size="lg" onClick={next}>
                {step === 3 && !logoUrl ? "Skip for now" : "Continue"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button type="button" size="lg" onClick={pay} disabled={submitting || paymentMode === "unavailable"}>
                {submitting ? "Starting checkout…" : paymentMode === "mock" ? "Continue to test checkout" : `Pay ${pkg?.priceLabel ?? ""}`}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children, onEdit }: { label: string; children: React.ReactNode; onEdit: () => void }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[140px_1fr_auto] sm:gap-4">
      <dt className="label pt-1 text-stone">{label}</dt>
      <dd className="min-w-0">{children}</dd>
      <dd>
        <button type="button" onClick={onEdit} className="text-sm text-brand underline underline-offset-4">
          Edit
        </button>
      </dd>
    </div>
  );
}

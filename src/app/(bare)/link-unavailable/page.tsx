import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Link unavailable", robots: { index: false, follow: false } };

const reasons: Record<string, { title: string; body: string }> = {
  missing: { title: "This link isn't set up yet.", body: "The code on this card or stand doesn't match anything in Maprizz. If you just received it, give it a few minutes and try again." },
  disabled: { title: "This link is paused.", body: "The business has turned this card or stand off for now." },
  unset: { title: "Almost there.", body: "This card is active but the business hasn't chosen where it should go yet." },
  invalid: { title: "That doesn't look like a Maprizz code.", body: "Codes are short, like ABC123. Check the printed code and try again." },
};

export default async function LinkUnavailablePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; reason?: string }>;
}) {
  const { code, reason } = await searchParams;
  const copy = reasons[reason ?? ""] ?? reasons.missing;
  return (
    <div className="grain flex flex-1 flex-col items-center justify-center px-6 py-16 text-center text-cream">
      <Logo tone="light" />
      <h1 className="mt-10 font-display text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">{copy.title}</h1>
      <p className="mt-4 max-w-md text-mist text-pretty">{copy.body}</p>
      {code ? <p className="mt-6 font-mono text-sm text-mist">Code: {code.replace(/[^A-Z0-9]/gi, "").slice(0, 12).toUpperCase()}</p> : null}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" variant="light" size="lg">
          Visit Maprizz
        </ButtonLink>
        <ButtonLink href="/login" size="lg">
          Business owner? Log in
        </ButtonLink>
      </div>
    </div>
  );
}

import { Download, ExternalLink } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TapLink } from "@/types/database";

/**
 * QR + short URL + downloads for one tap link. Server component; the QR is an <img>
 * from /api/qr so it works everywhere (including print).
 */
export function QrPanel({
  link,
  shortUrl,
  destinationLabel,
  destinationUrl,
  compact = false,
  className,
}: {
  link: TapLink;
  shortUrl: string;
  destinationLabel: string;
  destinationUrl?: string | null;
  compact?: boolean;
  className?: string;
}) {
  const isReview = link.type === "review_stand";
  return (
    <div className={cn("rounded-3xl border border-ink/10 bg-white p-5 sm:p-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label text-stone">{isReview ? "Review stand" : "Business card"}</p>
          <p className="mt-1 font-mono text-lg font-semibold tracking-tight">{link.code}</p>
        </div>
        <span
          className={cn(
            "label rounded-full px-2.5 py-1",
            link.enabled ? "bg-emerald-100 text-emerald-900" : "bg-ink/10 text-stone",
          )}
        >
          {link.enabled ? "Active" : "Paused"}
        </span>
      </div>

      <div className={cn("mt-5 grid gap-5", !compact && "sm:grid-cols-[176px_1fr]")}>
        <div className="mx-auto w-44 rounded-2xl border border-ink/10 bg-white p-2 sm:mx-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- generated on the fly by our own API */}
          <img src={`/api/qr/${link.code}?size=512`} alt={`QR code for ${shortUrl}`} width={160} height={160} className="h-auto w-full" />
        </div>
        <div className="min-w-0">
          <p className="label text-stone">Encode this on the NFC chip</p>
          <p className="mt-1 break-all font-mono text-sm text-ink">{shortUrl}</p>
          <p className="label mt-4 text-stone">Currently opens</p>
          <p className="mt-1 break-all text-sm text-ink">
            {destinationLabel}
            {destinationUrl && destinationUrl !== destinationLabel ? <span className="block text-stone">{destinationUrl}</span> : null}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <CopyButton value={shortUrl} label="Copy tap URL" size="sm" />
            {destinationUrl ? <CopyButton value={destinationUrl} label="Copy destination" size="sm" /> : null}
            <ButtonLink href={`/api/qr/${link.code}?download=1&size=1024`} variant="secondary" size="sm">
              <Download className="h-4 w-4" aria-hidden="true" />
              PNG
            </ButtonLink>
            <ButtonLink href={`/api/qr/${link.code}?format=svg&download=1`} variant="secondary" size="sm">
              <Download className="h-4 w-4" aria-hidden="true" />
              SVG
            </ButtonLink>
            <ButtonLink href={shortUrl} variant="secondary" size="sm" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Test
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}

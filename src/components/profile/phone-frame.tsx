import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A restrained phone silhouette for demos. Pure CSS, scales with its container.
 * Children render inside the screen; use `screenClassName` to control scroll/overflow.
 */
export function PhoneFrame({
  children,
  className,
  screenClassName,
  urlLabel,
}: {
  children: ReactNode;
  className?: string;
  screenClassName?: string;
  urlLabel?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19] w-full max-w-[300px] rounded-[2.6rem] bg-[#0b0908] p-[9px] shadow-[0_40px_90px_-30px_rgb(0_0_0/0.7),0_0_0_1px_rgb(255_255_255/0.08)_inset]",
        className,
      )}
    >
      <div className="absolute left-1/2 top-[18px] z-20 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-[#0b0908]" aria-hidden="true" />
      <div className={cn("relative h-full w-full overflow-hidden rounded-[2.1rem] bg-ink", screenClassName)}>
        {urlLabel ? (
          <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-[48px]">
            <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[10px] text-cream/80 backdrop-blur">{urlLabel}</span>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

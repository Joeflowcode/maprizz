"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";
import {
  NfcCard,
  PhoneFrame,
  ProfileScreen,
} from "@/components/profile/profile-parts";
import type { ProfileData } from "@/lib/demo-profile";
import { cn } from "@/lib/utils";

type DemoState = "idle" | "tapping" | "loading" | "open";

export function TapDemo(props: {
  data: ProfileData;
  code: string;
  compact?: boolean;
  className?: string;
}) {
  return <TapDemoInner {...props} />;
}

function TapDemoInner({
  data,
  code,
  compact = false,
  className,
}: {
  data: ProfileData;
  code: string;
  compact?: boolean;
  className?: string;
}) {
  const [state, setState] = useState<DemoState>("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const open = state === "open";
  const busy = state !== "idle";

  function reset() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setState("idle");
  }

  function startTap() {
    if (state !== "idle") return;
    timers.current.forEach((timer) => window.clearTimeout(timer));
    setState("tapping");
    timers.current = [
      window.setTimeout(() => setState("loading"), 650),
      window.setTimeout(() => setState("open"), 1350),
    ];
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className={cn(
          "relative w-full",
          compact ? "max-w-[420px]" : "max-w-[560px]",
        )}
      >
        <div className="flex justify-center py-6 sm:py-8">
          <PhoneFrame
            className={cn(
              compact ? "max-w-[240px]" : "max-w-[290px]",
              "transition-transform duration-500",
              state === "tapping" && "scale-[1.01]",
            )}
            urlLabel={state === "loading" ? `maprizz.com/t/${code}` : undefined}
          >
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(90%_70%_at_50%_10%,rgb(255_139_61/0.35),transparent_60%),#16120e] px-6 text-center text-cream transition-opacity duration-500",
                open ? "pointer-events-none opacity-0" : "opacity-100",
              )}
              aria-hidden={open}
            >
              {state === "loading" ? (
                <div className="flex flex-col items-center gap-4">
                  <LogoMark className="h-10 w-10 animate-pulse text-accent" />
                  <p className="text-sm text-mist">Opening…</p>
                </div>
              ) : (
                <>
                  <p className="font-display text-5xl font-semibold tracking-[-0.04em]">
                    9:41
                  </p>
                  <p className="mt-1 text-sm text-mist">
                    Hold card near the top of the phone
                  </p>
                  <div
                    className={cn(
                      "mt-8 flex items-center gap-2 rounded-full border border-cream/20 px-4 py-2 text-xs text-cream/80 transition-all duration-500",
                      state === "tapping" && "border-accent bg-accent/20 text-accent",
                    )}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        state === "tapping" ? "bg-accent" : "bg-cream/40",
                      )}
                    />
                    {state === "tapping" ? "Reading tag…" : "NFC ready"}
                  </div>
                </>
              )}
            </div>

            <div
              className={cn(
                "absolute inset-0 overflow-y-auto transition-[opacity,transform] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] [scrollbar-width:none]",
                open
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-6 opacity-0",
              )}
              aria-hidden={!open}
            >
              <ProfileScreen data={data} interactive={false} compact />
            </div>
          </PhoneFrame>
        </div>

        <div
          className={cn(
            "absolute bottom-2 left-0 w-[46%] max-w-[240px] origin-bottom-left transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:bottom-6 sm:w-[44%]",
            state === "idle" && "-rotate-6",
            state === "tapping" &&
              "translate-x-[70%] -translate-y-[110%] rotate-3 scale-95 sm:-translate-y-[150%]",
            (state === "loading" || open) &&
              "translate-x-[70%] -translate-y-[110%] rotate-3 scale-90 opacity-0 sm:-translate-y-[150%]",
          )}
          aria-hidden={busy}
        >
          <NfcCard
            businessName={data.name}
            code={code}
            size={compact ? "sm" : "md"}
          />
        </div>
      </div>

      <div className="mt-2 flex flex-col items-center gap-3">
        {open ? (
          <Button variant="secondary" size={compact ? "md" : "lg"} onClick={reset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset demo
          </Button>
        ) : (
          <Button
            size={compact ? "md" : "lg"}
            onClick={startTap}
            disabled={busy}
            className="min-w-48"
          >
            {busy ? "Reading…" : "Tap the card"}
          </Button>
        )}
        <p className="label text-stone">
          Demo · {data.name} is a fictional business
        </p>
      </div>
    </div>
  );
}

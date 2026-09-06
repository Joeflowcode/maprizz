import { ArrowDown, Globe, Star } from "lucide-react";
import { NfcCard } from "@/components/profile/nfc-card";
import { PhoneFrame } from "@/components/profile/phone-frame";
import { ProfileCard } from "@/components/profile/profile-card";
import { demoProfileData } from "@/lib/profile-data";
import { DEMO_CARD_CODE } from "@/lib/db/seed";

/**
 * Hero visual: CARD → tap → PHONE → website/profile. Static, server-rendered.
 */
export function TapFlow() {
  return (
    <div className="relative mx-auto grid w-full max-w-[520px] items-center gap-4 sm:grid-cols-[1fr_auto] sm:gap-6">
      <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
        <div className="rise">
          <NfcCard businessName={demoProfileData.name} code={DEMO_CARD_CODE} className="max-w-[320px] sm:max-w-none" />
        </div>
        <div className="rise-2 flex items-center gap-3 pl-2 text-cream/80">
          <ArrowDown className="h-5 w-5 text-accent" aria-hidden="true" />
          <span className="label text-accent">Tap</span>
          <span className="text-sm text-mist">or scan the QR</span>
        </div>
        <div className="rise-3 grid gap-2.5">
          <div className="flex items-center gap-3 rounded-2xl border border-cream/15 bg-white/[0.04] px-4 py-3 text-sm text-cream">
            <Globe className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>
              Website or <span className="text-mist">Maprizz profile</span>
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-cream/15 bg-white/[0.04] px-4 py-3 text-sm text-cream">
            <Star className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>
              Google review form <span className="text-mist">(review stand)</span>
            </span>
          </div>
        </div>
      </div>
      <div className="rise-2 hidden w-[220px] sm:block">
        <PhoneFrame className="max-w-none">
          <div className="h-full overflow-hidden">
            <ProfileCard data={demoProfileData} interactive={false} compact />
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}

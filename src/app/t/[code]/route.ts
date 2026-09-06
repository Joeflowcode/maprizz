import type { NextRequest } from "next/server";
import { handleTap } from "@/lib/tap-handler";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return handleTap(request, code, "business_card");
}

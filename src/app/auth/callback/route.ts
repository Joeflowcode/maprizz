import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfigured } from "@/lib/env";

/** Supabase magic-link landing: exchanges the code for a session cookie, then redirects. */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next") ?? "/dashboard";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/dashboard";

  if (!supabaseConfigured || !code) return NextResponse.redirect(`${url.origin}/login?error=auth`);

  const { supabaseAuthClient } = await import("@/lib/supabase/server");
  const supabase = await supabaseAuthClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${url.origin}/login?error=auth`);
  return NextResponse.redirect(`${url.origin}${next}`);
}

import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { useMockDb } from "@/lib/env";

const types: Record<string, string> = { png: "image/png", jpg: "image/jpeg", webp: "image/webp", svg: "image/svg+xml" };

/** Serves logos uploaded in mock mode from .dev-data/uploads. Disabled when Supabase is configured. */
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!useMockDb) return new NextResponse("Not found", { status: 404 });
  const { name } = await params;
  if (!/^[a-f0-9-]{36}\.(png|jpg|webp|svg)$/.test(name)) return new NextResponse("Not found", { status: 404 });
  try {
    const bytes = await readFile(path.join(process.cwd(), ".dev-data", "uploads", name));
    const ext = name.split(".").pop()!;
    return new NextResponse(new Uint8Array(bytes), {
      headers: { "Content-Type": types[ext], "Cache-Control": "public, max-age=3600", "Content-Security-Policy": "script-src 'none'" },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

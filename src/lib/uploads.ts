import "server-only";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { useMockDb } from "@/lib/env";

export const LOGO_MAX_BYTES = 4 * 1024 * 1024;

const allowed: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

export const LOGO_ACCEPT = Object.keys(allowed).join(",");

export class UploadError extends Error {}

/** SVG is allowed only when it carries no script, event handlers or external references. */
function svgIsSafe(source: string) {
  const lower = source.toLowerCase();
  return !(
    lower.includes("<script") ||
    /\son[a-z]+\s*=/.test(lower) ||
    lower.includes("javascript:") ||
    lower.includes("<foreignobject") ||
    lower.includes("<iframe") ||
    /xlink:href\s*=\s*["']\s*(?!#|data:image)/.test(lower) ||
    /\shref\s*=\s*["']\s*(?!#|data:image)/.test(lower)
  );
}

function sniff(bytes: Uint8Array, declared: string): string | null {
  const head = Array.from(bytes.slice(0, 12));
  if (head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47) return "image/png";
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return "image/jpeg";
  if (head[0] === 0x52 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x46 && head[8] === 0x57 && head[9] === 0x45) return "image/webp";
  if (declared === "image/svg+xml") {
    const text = new TextDecoder().decode(bytes.slice(0, 512)).trimStart().toLowerCase();
    if (text.startsWith("<svg") || text.startsWith("<?xml")) return "image/svg+xml";
  }
  return null;
}

/**
 * Validate and store a logo. Returns a public URL. Supabase Storage in production; a
 * local folder (.dev-data/uploads) served by /api/dev-files in mock mode.
 */
export async function storeLogo(file: File): Promise<string> {
  if (file.size === 0) throw new UploadError("That file is empty.");
  if (file.size > LOGO_MAX_BYTES) throw new UploadError("Logo must be under 4 MB.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniff(bytes, file.type);
  if (!type || !allowed[type]) throw new UploadError("Upload a PNG, JPG, WEBP or SVG.");
  if (type === "image/svg+xml" && !svgIsSafe(new TextDecoder().decode(bytes))) {
    throw new UploadError("That SVG contains scripts or external references. Export a plain SVG or use PNG.");
  }

  const name = `${crypto.randomUUID()}.${allowed[type]}`;

  if (useMockDb) {
    const dir = path.join(process.cwd(), ".dev-data", "uploads");
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, name), bytes);
    return `/api/dev-files/${name}`;
  }

  const { serviceClient } = await import("@/lib/db/supabase");
  const sb = serviceClient();
  const { error } = await sb.storage.from("logos").upload(name, bytes, { contentType: type, upsert: false, cacheControl: "31536000" });
  if (error) throw new Error(`Logo upload failed: ${error.message}`);
  return sb.storage.from("logos").getPublicUrl(name).data.publicUrl;
}

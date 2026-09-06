"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACCEPT = "image/png,image/jpeg,image/webp,image/svg+xml";

/** Uploads to /api/upload immediately and reports the stored URL. */
export function LogoUpload({ value, onChange }: { value: string | null; onChange: (url: string | null) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: form });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; url?: string; message?: string };
      if (!response.ok || !data.ok || !data.url) throw new Error(data.message ?? "Upload failed.");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-ink/25 bg-white p-5 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- just-uploaded file preview
            <img src={value} alt="Logo preview" className="h-full w-full object-contain p-2" />
          ) : (
            <ImagePlus className="h-8 w-8 text-stone" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{value ? "Logo uploaded" : "Upload your logo"}</p>
          <p className="mt-1 text-sm text-stone">PNG, JPG, WEBP or SVG. Up to 4 MB. A square or wide logo on a transparent background works best.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" variant="dark" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
              {busy ? "Uploading…" : value ? "Replace" : "Choose file"}
            </Button>
            {value ? (
              <Button type="button" variant="secondary" size="sm" onClick={() => onChange(null)}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Remove
              </Button>
            ) : null}
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          aria-label="Logo file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

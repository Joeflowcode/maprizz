import { NextResponse } from "next/server";
import { storeLogo, UploadError } from "@/lib/uploads";

/** Logo upload for checkout, dashboard and admin. Multipart field: `file`. */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid upload." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, message: "Choose a file." }, { status: 400 });

  try {
    const url = await storeLogo(file);
    return NextResponse.json({ ok: true, url });
  } catch (error) {
    if (error instanceof UploadError) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
    console.error("[upload]", error);
    return NextResponse.json({ ok: false, message: "Upload failed. Try again." }, { status: 500 });
  }
}

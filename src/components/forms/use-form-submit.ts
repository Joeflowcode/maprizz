"use client";

import { useState } from "react";
import type { FieldErrors } from "@/lib/validation";

export type SubmitState = "idle" | "submitting" | "success" | "error";

export function useFormSubmit(endpoint: string) {
  const [state, setState] = useState<SubmitState>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string>("");

  async function submit(payload: Record<string, unknown>) {
    setState("submitting");
    setErrors({});
    setMessage("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        errors?: FieldErrors;
      };

      if (response.ok && data.ok) {
        setState("success");
        return true;
      }

      setErrors(data.errors ?? {});
      setMessage(data.message ?? "Something went wrong. Please try again.");
      setState("error");
      return false;
    } catch {
      setMessage("We couldn't reach the server. Check your connection and try again.");
      setState("error");
      return false;
    }
  }

  return { state, errors, message, submit, setErrors };
}

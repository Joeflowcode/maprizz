"use client";

import { useTransition } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createReviewLinkAction } from "@/lib/actions/business";

export function CreateReviewLinkButton({ businessId }: { businessId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button type="button" variant="secondary" size="md" disabled={pending} onClick={() => start(() => void createReviewLinkAction(businessId))}>
      <Star className="h-4 w-4" aria-hidden="true" />
      {pending ? "Creating…" : "Add a Google review link"}
    </Button>
  );
}

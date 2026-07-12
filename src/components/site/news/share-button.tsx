"use client";

import * as React from "react";
import { Share2, Link, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ShareButton({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = React.useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // user cancelled
      }
      return;
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link.");
    }
  }

  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
      {copied ? <Check className="size-4 text-green-500" /> : <Share2 className="size-4" />}
      {copied ? "Copied!" : "Share"}
    </Button>
  );
}

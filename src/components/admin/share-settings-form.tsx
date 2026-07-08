"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { saveShareSettingsAction } from "@/app/admin/(dashboard)/settings/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, MessageCircle, Share2 } from "lucide-react";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="gap-2">
      <Save className="size-4" />
      {pending ? "Saving…" : "Save Settings"}
    </Button>
  );
}

export function ShareSettingsForm({
  whatsappTemplate,
  instagramCaption,
}: {
  whatsappTemplate: string;
  instagramCaption: string;
}) {

  async function handleAction(formData: FormData) {
    await saveShareSettingsAction(formData);
    toast.success("Share settings saved successfully");
  }

  return (
    <form action={handleAction} className="space-y-6">
      {/* WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#25D366]">
              <MessageCircle className="size-4" />
            </span>
            WhatsApp Share Text
          </CardTitle>
          <CardDescription>
            This text is sent along with the poster image when sharing to WhatsApp.
            Use <code className="rounded bg-muted px-1 font-mono text-xs">*text*</code> for bold in WhatsApp.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            name="whatsappTemplate"
            defaultValue={whatsappTemplate}
            rows={10}
            className="w-full rounded-lg border bg-background px-3 py-2 font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary/50 resize-y"
            placeholder="Enter WhatsApp message template…"
          />
          <LivePreviewNote platform="WhatsApp" />
        </CardContent>
      </Card>

      {/* Instagram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="flex size-8 items-center justify-center rounded-lg bg-pink-500/15 text-pink-500">
              <Share2 className="size-4" />
            </span>
            Instagram Caption
          </CardTitle>
          <CardDescription>
            This caption is copied to clipboard when a user taps Instagram share,
            so they can paste it into their post or story.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            name="instagramCaption"
            defaultValue={instagramCaption}
            rows={10}
            className="w-full rounded-lg border bg-background px-3 py-2 font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary/50 resize-y"
            placeholder="Enter Instagram caption template…"
          />
          <LivePreviewNote platform="Instagram" />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <SaveButton />
      </div>
    </form>
  );
}

function LivePreviewNote({ platform }: { platform: string }) {
  return (
    <p className="text-xs text-muted-foreground">
      Variables like <code className="rounded bg-muted px-1 font-mono">{"{competition}"}</code> are automatically replaced with real data when a result is shared on {platform}.
    </p>
  );
}

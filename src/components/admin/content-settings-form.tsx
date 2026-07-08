"use client";

import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="gap-2">
      <Save className="size-4" />
      {pending ? "Saving…" : "Save Changes"}
    </Button>
  );
}

interface Props {
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  footerTagline: string;
  footerPhone: string;
  footerEmail: string;
  footerAddress: string;
  footerOrganization: string;
  footerFacebook: string;
  footerInstagram: string;
  footerWhatsapp: string;
  action: (formData: FormData) => Promise<void>;
}

export function ContentSettingsForm({
  heroBadge,
  heroTitle,
  heroHighlight,
  heroDescription,
  footerTagline,
  footerPhone,
  footerEmail,
  footerAddress,
  footerOrganization,
  footerFacebook,
  footerInstagram,
  footerWhatsapp,
  action,
}: Props) {
  return (
    <form action={action} className="space-y-8">
      {/* Homepage Hero */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold">Homepage Hero</h2>
          <p className="text-sm text-muted-foreground">
            Text shown in the hero banner at the top of the homepage.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="heroBadge">Badge Text</Label>
            <Input id="heroBadge" name="heroBadge" defaultValue={heroBadge} placeholder="West Sahityotsav 2026" />
            <p className="text-xs text-muted-foreground">Small label shown above the title (e.g. "West Sahityotsav 2026")</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="heroHighlight">Highlighted Word(s)</Label>
            <Input id="heroHighlight" name="heroHighlight" defaultValue={heroHighlight} placeholder="Sahityotsav 2026" />
            <p className="text-xs text-muted-foreground">Part of the title shown in amber/gold color</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="heroTitle">Hero Title</Label>
          <Input id="heroTitle" name="heroTitle" defaultValue={heroTitle} placeholder="SSF Malappuram West Sahityotsav 2026" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="heroDescription">Hero Description</Label>
          <Textarea id="heroDescription" name="heroDescription" defaultValue={heroDescription} rows={3} placeholder="A platform for young minds to express, compete and excel…" />
        </div>
      </div>

      {/* Footer */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold">Footer</h2>
          <p className="text-sm text-muted-foreground">
            Contact information and social links shown in the site footer.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="footerTagline">Tagline</Label>
          <Input id="footerTagline" name="footerTagline" defaultValue={footerTagline} placeholder="Empowering Through Knowledge, Literature & Culture" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="footerOrganization">Organizing Body</Label>
          <Input id="footerOrganization" name="footerOrganization" defaultValue={footerOrganization} placeholder="SSF Malappuram West Committee" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="footerPhone">Phone</Label>
            <Input id="footerPhone" name="footerPhone" defaultValue={footerPhone} placeholder="+91 1234 567 890" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="footerEmail">Email</Label>
            <Input id="footerEmail" name="footerEmail" type="email" defaultValue={footerEmail} placeholder="info@example.in" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="footerAddress">Address</Label>
            <Input id="footerAddress" name="footerAddress" defaultValue={footerAddress} placeholder="Malappuram, Kerala, India" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="footerFacebook">Facebook URL</Label>
            <Input id="footerFacebook" name="footerFacebook" defaultValue={footerFacebook} placeholder="https://facebook.com/…" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="footerInstagram">Instagram URL</Label>
            <Input id="footerInstagram" name="footerInstagram" defaultValue={footerInstagram} placeholder="https://instagram.com/…" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="footerWhatsapp">WhatsApp URL</Label>
            <Input id="footerWhatsapp" name="footerWhatsapp" defaultValue={footerWhatsapp} placeholder="https://wa.me/91…" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}

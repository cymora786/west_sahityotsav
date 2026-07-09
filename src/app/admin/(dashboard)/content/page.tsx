import { revalidatePath } from "next/cache";
import { getEventSettings, upsertEventSettings } from "@/lib/queries";
import { ContentSettingsForm } from "@/components/admin/content-settings-form";

export const metadata = { title: "Content Settings — Admin" };

const DEFAULTS = {
  heroBadge: "West Sahityotsav 2026",
  heroTitle: "SSF Malappuram West",
  heroHighlight: "Sahityotsav 2026",
  heroDescription:
    "A platform for young minds to express, compete and excel in literature and culture. 10 divisions, 5 categories, 90+ items and 2000+ participants competing for district glory.",
  footerTagline: "Empowering Through Knowledge, Literature & Culture",
  footerPhone: "+91 1234 567 890",
  footerEmail: "info@ssfmalappuramsahityotsav.in",
  footerAddress: "Malappuram, Kerala, India",
  footerOrganization: "SSF Malappuram West Committee",
  footerFacebook: "",
  footerInstagram: "",
  footerWhatsapp: "",
};

async function saveContentSettings(formData: FormData) {
  "use server";
  await upsertEventSettings({
    heroBadge: (formData.get("heroBadge") as string) || undefined,
    heroTitle: (formData.get("heroTitle") as string) || undefined,
    heroHighlight: (formData.get("heroHighlight") as string) || undefined,
    heroDescription: (formData.get("heroDescription") as string) || undefined,
    footerTagline: (formData.get("footerTagline") as string) || undefined,
    footerPhone: (formData.get("footerPhone") as string) || undefined,
    footerEmail: (formData.get("footerEmail") as string) || undefined,
    footerAddress: (formData.get("footerAddress") as string) || undefined,
    footerOrganization: (formData.get("footerOrganization") as string) || undefined,
    footerFacebook: (formData.get("footerFacebook") as string) || undefined,
    footerInstagram: (formData.get("footerInstagram") as string) || undefined,
    footerWhatsapp: (formData.get("footerWhatsapp") as string) || undefined,
  });
  revalidatePath("/");
  revalidatePath("/admin/content");
}

export default async function ContentSettingsPage() {
  const settings = await getEventSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Content Settings</h1>
        <p className="text-sm text-muted-foreground">
          Update the homepage hero text and footer contact / social information.
        </p>
      </div>
      <ContentSettingsForm
        heroBadge={settings?.heroBadge ?? DEFAULTS.heroBadge}
        heroTitle={settings?.heroTitle ?? DEFAULTS.heroTitle}
        heroHighlight={settings?.heroHighlight ?? DEFAULTS.heroHighlight}
        heroDescription={settings?.heroDescription ?? DEFAULTS.heroDescription}
        footerTagline={settings?.footerTagline ?? DEFAULTS.footerTagline}
        footerPhone={settings?.footerPhone ?? DEFAULTS.footerPhone}
        footerEmail={settings?.footerEmail ?? DEFAULTS.footerEmail}
        footerAddress={settings?.footerAddress ?? DEFAULTS.footerAddress}
        footerOrganization={settings?.footerOrganization ?? DEFAULTS.footerOrganization}
        footerFacebook={settings?.footerFacebook ?? DEFAULTS.footerFacebook}
        footerInstagram={settings?.footerInstagram ?? DEFAULTS.footerInstagram}
        footerWhatsapp={settings?.footerWhatsapp ?? DEFAULTS.footerWhatsapp}
        action={saveContentSettings}
      />
    </div>
  );
}

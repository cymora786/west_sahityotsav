"use server";

import { revalidatePath } from "next/cache";
import { upsertEventSettings } from "@/lib/queries";

export async function saveShareSettingsAction(formData: FormData) {
  const whatsappTemplate = formData.get("whatsappTemplate")?.toString() ?? "";
  const instagramCaption = formData.get("instagramCaption")?.toString() ?? "";

  await upsertEventSettings({ whatsappTemplate, instagramCaption });
  revalidatePath("/admin/settings");
}

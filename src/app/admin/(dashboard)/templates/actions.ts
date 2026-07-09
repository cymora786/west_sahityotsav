"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export type ActionState = { error?: string; success?: boolean };

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #1f2937")
  .optional()
  .or(z.literal(""));

const templateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  backgroundImage: z.string().min(1, "Background image is required"),
  primaryColor: hexColor,
  accentColor: hexColor,
  textColor: hexColor,
  customCss: z.string().optional(),
  layout: z.string().optional(),
});

function emptyToUndefined(value: FormDataEntryValue | null) {
  const str = value?.toString() ?? "";
  return str.trim() === "" ? undefined : str;
}

function revalidateAll() {
  revalidatePath("/admin/templates");
  revalidatePath("/results");
}

export async function createTemplate(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = templateSchema.safeParse({
    name: formData.get("name"),
    thumbnail: formData.get("thumbnail"),
    backgroundImage: formData.get("backgroundImage"),
    primaryColor: emptyToUndefined(formData.get("primaryColor")),
    accentColor: emptyToUndefined(formData.get("accentColor")),
    textColor: emptyToUndefined(formData.get("textColor")),
    customCss: emptyToUndefined(formData.get("customCss")),
    layout: emptyToUndefined(formData.get("layout")),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.posterTemplate.create({
    data: {
      ...parsed.data,
      primaryColor: parsed.data.primaryColor || null,
      accentColor: parsed.data.accentColor || null,
      textColor: parsed.data.textColor || null,
      customCss: parsed.data.customCss || null,
      layout: parsed.data.layout || null,
    },
  });
  revalidateAll();
  redirect("/admin/templates");
}

export async function updateTemplate(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = templateSchema.safeParse({
    name: formData.get("name"),
    thumbnail: formData.get("thumbnail"),
    backgroundImage: formData.get("backgroundImage"),
    primaryColor: emptyToUndefined(formData.get("primaryColor")),
    accentColor: emptyToUndefined(formData.get("accentColor")),
    textColor: emptyToUndefined(formData.get("textColor")),
    customCss: emptyToUndefined(formData.get("customCss")),
    layout: emptyToUndefined(formData.get("layout")),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.posterTemplate.update({
    where: { id },
    data: {
      ...parsed.data,
      primaryColor: parsed.data.primaryColor || null,
      accentColor: parsed.data.accentColor || null,
      textColor: parsed.data.textColor || null,
      customCss: parsed.data.customCss || null,
      layout: parsed.data.layout || null,
    },
  });
  revalidateAll();
  redirect("/admin/templates");
}

export async function deleteTemplate(id: string) {
  await requireAdmin();
  await prisma.posterTemplate.delete({ where: { id } });
  revalidateAll();
}

"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export type ActionState = { error?: string; success?: boolean };

const mediaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  videoId: z.string().min(1, "YouTube Video ID is required"),
  year: z.coerce.number().int().min(2000).max(2100),
  description: z.string().optional(),
});

function revalidateAll() {
  revalidatePath("/admin/media");
  revalidatePath("/media");
  revalidatePath("/");
}

export async function createMedia(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = mediaSchema.safeParse({
    title: formData.get("title"),
    videoId: formData.get("videoId"),
    year: formData.get("year"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await prisma.media.create({ data: parsed.data });
  revalidateAll();
  return { success: true };
}

export async function updateMedia(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = mediaSchema.safeParse({
    title: formData.get("title"),
    videoId: formData.get("videoId"),
    year: formData.get("year"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await prisma.media.update({ where: { id }, data: parsed.data });
  revalidateAll();
  return { success: true };
}

export async function deleteMedia(id: string) {
  await requireAdmin();
  await prisma.media.delete({ where: { id } });
  revalidateAll();
}

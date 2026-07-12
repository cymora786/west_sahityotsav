"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export type ActionState = { error?: string; success?: boolean };

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Short description is required"),
  body: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  priority: z.enum(["HIGH", "NORMAL", "LOW"]),
});

function revalidateAll() {
  revalidatePath("/admin/announcements");
  revalidatePath("/news");
  revalidatePath("/");
}

export async function createAnnouncement(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = announcementSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    body: formData.get("body") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    priority: formData.get("priority"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await prisma.announcement.create({
      data: {
        ...parsed.data,
        body: parsed.data.body || null,
        imageUrl: parsed.data.imageUrl || null,
      },
    });
  } catch {
    return { error: "Database error. Please try again in a moment." };
  }
  revalidateAll();
  redirect("/admin/announcements");
}

export async function updateAnnouncement(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = announcementSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    body: formData.get("body") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    priority: formData.get("priority"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await prisma.announcement.update({
      where: { id },
      data: {
        ...parsed.data,
        body: parsed.data.body || null,
        imageUrl: parsed.data.imageUrl || null,
      },
    });
  } catch {
    return { error: "Database error. Please try again in a moment." };
  }
  revalidateAll();
  redirect("/admin/announcements");
}

export async function deleteAnnouncement(id: string) {
  await requireAdmin();
  await prisma.announcement.delete({ where: { id } });
  revalidateAll();
}

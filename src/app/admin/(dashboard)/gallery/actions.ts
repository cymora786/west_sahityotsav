"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export type ActionState = { error?: string; success?: boolean };

const gallerySchema = z.object({
  imageUrl: z.string().min(1, "Image is required"),
  caption: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
});

function emptyToUndefined(value: FormDataEntryValue | null) {
  const str = value?.toString() ?? "";
  return str.trim() === "" ? undefined : str;
}

function revalidateAll() {
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function createGalleryImage(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = gallerySchema.safeParse({
    imageUrl: formData.get("imageUrl"),
    caption: emptyToUndefined(formData.get("caption")),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.gallery.create({ data: parsed.data });
  revalidateAll();
  return { success: true };
}

export async function createGalleryImages(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const categoryId = formData.get("categoryId")?.toString() ?? "";
  const imageUrls = formData.getAll("imageUrls").map((value) => value.toString());
  const caption = emptyToUndefined(formData.get("caption"));

  if (!categoryId) return { error: "Category is required" };
  if (imageUrls.length === 0) return { error: "At least one image is required" };

  await prisma.gallery.createMany({
    data: imageUrls.map((imageUrl) => ({
      imageUrl,
      caption,
      categoryId,
    })),
  });

  revalidateAll();
  return { success: true };
}

export async function updateGalleryImage(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = gallerySchema.safeParse({
    imageUrl: formData.get("imageUrl"),
    caption: emptyToUndefined(formData.get("caption")),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.gallery.update({ where: { id }, data: parsed.data });
  revalidateAll();
  return { success: true };
}

export async function deleteGalleryImage(id: string) {
  await requireAdmin();
  await prisma.gallery.delete({ where: { id } });
  revalidateAll();
}

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens"),
});

export async function createGalleryCategory(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await prisma.galleryCategory.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) return { error: "A category with this slug already exists" };

  await prisma.galleryCategory.create({ data: parsed.data });
  revalidateAll();
  return { success: true };
}

export async function updateGalleryCategory(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await prisma.galleryCategory.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing && existing.id !== id) {
    return { error: "A category with this slug already exists" };
  }

  await prisma.galleryCategory.update({ where: { id }, data: parsed.data });
  revalidateAll();
  return { success: true };
}

export async function deleteGalleryCategory(id: string) {
  await requireAdmin();
  await prisma.galleryCategory.delete({ where: { id } });
  revalidateAll();
}

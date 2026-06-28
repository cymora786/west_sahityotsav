"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export type ActionState = { error?: string; success?: boolean };

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
  description: z.string().optional(),
});

function revalidateAll() {
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
}

export async function createCategory(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: (formData.get("description") as string) || undefined,
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await prisma.category.create({ data: parsed.data });
  } catch {
    return { error: "A category with this slug already exists." };
  }

  revalidateAll();
  return { success: true };
}

export async function updateCategory(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: (formData.get("description") as string) || undefined,
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await prisma.category.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "A category with this slug already exists." };
  }

  revalidateAll();
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidateAll();
}

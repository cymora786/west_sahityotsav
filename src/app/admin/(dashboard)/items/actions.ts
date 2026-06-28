"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export type ActionState = { error?: string; success?: boolean };

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.string().min(1, "Category is required"),
  venue: z.string().optional(),
  status: z.enum(["PUBLISHED", "DRAFT"]),
});

function revalidateAll() {
  revalidatePath("/admin/items");
  revalidatePath("/items");
  revalidatePath("/categories");
  revalidatePath("/");
}

export async function createItem(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = itemSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    venue: (formData.get("venue") as string) || undefined,
    status: formData.get("status"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.item.create({ data: parsed.data });
  revalidateAll();
  return { success: true };
}

export async function updateItem(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = itemSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    venue: (formData.get("venue") as string) || undefined,
    status: formData.get("status"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.item.update({ where: { id }, data: parsed.data });
  revalidateAll();
  return { success: true };
}

export async function deleteItem(id: string) {
  await requireAdmin();
  await prisma.item.delete({ where: { id } });
  revalidateAll();
}

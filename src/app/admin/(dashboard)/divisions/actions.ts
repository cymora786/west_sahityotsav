"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export type ActionState = { error?: string; success?: boolean };

const divisionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
  code: z.string().min(1, "Code is required").max(10),
  logo: z.string().optional(),
});

export async function createDivision(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = divisionSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    code: formData.get("code"),
    logo: (formData.get("logo") as string) || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await prisma.division.create({
      data: {
        ...parsed.data,
        points: { create: { currentPoints: 0 } },
      },
    });
  } catch {
    return { error: "A division with this slug or code already exists." };
  }

  revalidatePath("/admin/divisions");
  revalidatePath("/standings");
  revalidatePath("/");
  return { success: true };
}

export async function updateDivision(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = divisionSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    code: formData.get("code"),
    logo: (formData.get("logo") as string) || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await prisma.division.update({
      where: { id },
      data: parsed.data,
    });
  } catch {
    return { error: "A division with this slug or code already exists." };
  }

  revalidatePath("/admin/divisions");
  revalidatePath("/standings");
  revalidatePath("/");
  return { success: true };
}

export async function deleteDivision(id: string) {
  await requireAdmin();
  await prisma.division.delete({ where: { id } });
  revalidatePath("/admin/divisions");
  revalidatePath("/standings");
  revalidatePath("/");
}

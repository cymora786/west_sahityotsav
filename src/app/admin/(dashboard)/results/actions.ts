"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export type ActionState = { error?: string; success?: boolean };

const resultSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  itemId: z.string().min(1, "Item is required"),
  divisionId: z.string().min(1, "Division is required"),
  venue: z.string().optional(),
  firstPlaceName: z.string().optional(),
  secondPlaceName: z.string().optional(),
  secondPlaceDivisionId: z.string().optional(),
  thirdPlaceName: z.string().optional(),
  thirdPlaceDivisionId: z.string().optional(),
  templateId: z.string().optional(),
  status: z.enum(["PUBLISHED", "DRAFT"]),
});

function emptyToUndefined(value: FormDataEntryValue | null) {
  const str = value?.toString() ?? "";
  return str.trim() === "" ? undefined : str;
}

function parseResultForm(formData: FormData) {
  return resultSchema.safeParse({
    categoryId: formData.get("categoryId"),
    itemId: formData.get("itemId"),
    divisionId: formData.get("divisionId"),
    venue: emptyToUndefined(formData.get("venue")),
    firstPlaceName: emptyToUndefined(formData.get("firstPlaceName")),
    secondPlaceName: emptyToUndefined(formData.get("secondPlaceName")),
    secondPlaceDivisionId: emptyToUndefined(formData.get("secondPlaceDivisionId")),
    thirdPlaceName: emptyToUndefined(formData.get("thirdPlaceName")),
    thirdPlaceDivisionId: emptyToUndefined(formData.get("thirdPlaceDivisionId")),
    templateId: emptyToUndefined(formData.get("templateId")),
    status: formData.get("status"),
  });
}

function revalidateAll(id?: string) {
  revalidatePath("/admin/results");
  revalidatePath("/results");
  revalidatePath("/standings");
  if (id) revalidatePath(`/results/${id}`);
}

export async function createResult(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseResultForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { status, ...data } = parsed.data;

  const result = await prisma.result.create({
    data: {
      ...data,
      status,
      publishedDate: status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidateAll(result.id);
  return { success: true };
}

export async function updateResult(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseResultForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { status, ...data } = parsed.data;

  const existing = await prisma.result.findUnique({ where: { id } });

  const result = await prisma.result.update({
    where: { id },
    data: {
      ...data,
      status,
      publishedDate:
        status === "PUBLISHED"
          ? existing?.publishedDate ?? new Date()
          : null,
    },
  });

  revalidateAll(result.id);
  return { success: true };
}

export async function deleteResult(id: string) {
  await requireAdmin();
  await prisma.result.delete({ where: { id } });
  revalidateAll(id);
}

export async function togglePublishResult(id: string) {
  await requireAdmin();

  const existing = await prisma.result.findUnique({ where: { id } });
  if (!existing) return;

  const nextStatus = existing.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

  await prisma.result.update({
    where: { id },
    data: {
      status: nextStatus,
      publishedDate: nextStatus === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidateAll(id);
}

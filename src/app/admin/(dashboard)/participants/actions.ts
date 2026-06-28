"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export type ActionState = { error?: string; success?: boolean };

const participantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  divisionId: z.string().min(1, "Division is required"),
  categoryId: z.string().min(1, "Category is required"),
  itemId: z.string().min(1, "Item is required"),
});

function revalidateAll(divisionSlug?: string) {
  revalidatePath("/admin/participants");
  if (divisionSlug) revalidatePath(`/division/${divisionSlug}`);
}

export async function createParticipant(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = participantSchema.safeParse({
    name: formData.get("name"),
    divisionId: formData.get("divisionId"),
    categoryId: formData.get("categoryId"),
    itemId: formData.get("itemId"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const division = await prisma.participant.create({
    data: parsed.data,
    include: { division: true },
  });

  revalidateAll(division.division.slug);
  return { success: true };
}

export async function updateParticipant(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = participantSchema.safeParse({
    name: formData.get("name"),
    divisionId: formData.get("divisionId"),
    categoryId: formData.get("categoryId"),
    itemId: formData.get("itemId"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const division = await prisma.participant.update({
    where: { id },
    data: parsed.data,
    include: { division: true },
  });

  revalidateAll(division.division.slug);
  return { success: true };
}

export async function deleteParticipant(id: string) {
  await requireAdmin();
  const participant = await prisma.participant.delete({
    where: { id },
    include: { division: true },
  });
  revalidateAll(participant.division.slug);
}

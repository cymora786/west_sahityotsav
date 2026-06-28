"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export type ActionState = { error?: string; success?: boolean };

const pointsSchema = z.object({
  points: z.coerce.number(),
  reason: z.string().min(1, "Reason is required"),
});

export async function updateDivisionPoints(
  divisionId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = pointsSchema.safeParse({
    points: formData.get("points"),
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const existing = await prisma.divisionPoints.findUnique({
    where: { divisionId },
  });

  const previousPoints = existing?.currentPoints ?? 0;
  const newPoints = parsed.data.points;

  await prisma.$transaction([
    prisma.divisionPoints.upsert({
      where: { divisionId },
      create: {
        divisionId,
        currentPoints: newPoints,
        updatedBy: session.user.id,
      },
      update: {
        currentPoints: newPoints,
        lastUpdated: new Date(),
        updatedBy: session.user.id,
      },
    }),
    prisma.pointLog.create({
      data: {
        divisionId,
        previousPoints,
        newPoints,
        reason: parsed.data.reason,
        updatedById: session.user.id,
      },
    }),
  ]);

  revalidatePath("/admin/division-points");
  revalidatePath("/admin");
  revalidatePath("/standings");
  revalidatePath("/");
  return { success: true };
}

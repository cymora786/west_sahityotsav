"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export type ActionState = { error?: string; success?: boolean };

const scheduleSchema = z.object({
  day: z.string().min(1, "Day is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  title: z.string().min(1, "Title is required"),
  venue: z.string().min(1, "Venue is required"),
  categoryId: z.string().optional(),
  description: z.string().optional(),
});

function emptyToUndefined(value: FormDataEntryValue | null) {
  const str = value?.toString() ?? "";
  return str.trim() === "" ? undefined : str;
}

function parseScheduleForm(formData: FormData) {
  return scheduleSchema.safeParse({
    day: formData.get("day"),
    date: formData.get("date"),
    time: formData.get("time"),
    title: formData.get("title"),
    venue: formData.get("venue"),
    categoryId: emptyToUndefined(formData.get("categoryId")),
    description: emptyToUndefined(formData.get("description")),
  });
}

function revalidateAll() {
  revalidatePath("/admin/schedule");
  revalidatePath("/schedule");
}

export async function createSchedule(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseScheduleForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { date, ...data } = parsed.data;

  await prisma.schedule.create({ data: { ...data, date: new Date(date) } });
  revalidateAll();
  return { success: true };
}

export async function updateSchedule(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseScheduleForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { date, ...data } = parsed.data;

  await prisma.schedule.update({
    where: { id },
    data: { ...data, date: new Date(date) },
  });
  revalidateAll();
  return { success: true };
}

export async function deleteSchedule(id: string) {
  await requireAdmin();
  await prisma.schedule.delete({ where: { id } });
  revalidateAll();
}

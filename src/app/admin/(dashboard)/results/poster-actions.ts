"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { upsertCompetitionPoster, deleteCompetitionPoster } from "@/lib/queries";

export async function savePoster(competitionId: string, posterImage: string) {
  await requireAdmin();
  await upsertCompetitionPoster(competitionId, posterImage);
  revalidatePath("/admin/results");
  revalidatePath(`/results/${competitionId}`);
}

export async function removePoster(competitionId: string) {
  await requireAdmin();
  await deleteCompetitionPoster(competitionId);
  revalidatePath("/admin/results");
  revalidatePath(`/results/${competitionId}`);
}

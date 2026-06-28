import { getParticipants, getDivisionsList, getCategories, getItems } from "@/lib/queries";
import { ParticipantDialog } from "./participant-dialog";
import { ParticipantsTable } from "./participants-table";

export const metadata = {
  title: "Participants",
};

export default async function AdminParticipantsPage() {
  const [participants, divisions, categories, items] = await Promise.all([
    getParticipants(),
    getDivisionsList(),
    getCategories(),
    getItems(),
  ]);

  const divisionOptions = divisions.map((d) => ({ id: d.id, name: d.name }));
  const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name }));
  const itemOptions = items.map((i) => ({
    id: i.id,
    name: i.name,
    categoryId: i.categoryId,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Participants</h1>
          <p className="text-sm text-muted-foreground">
            Manage participants registered for each item across divisions.
          </p>
        </div>
        <ParticipantDialog
          divisions={divisionOptions}
          categories={categoryOptions}
          items={itemOptions}
        />
      </div>

      <ParticipantsTable
        participants={participants}
        divisions={divisionOptions}
        categories={categoryOptions}
        items={itemOptions}
      />
    </div>
  );
}

import {
  getAllResultsAdmin,
  getDivisionsList,
  getCategories,
  getItems,
  getPosterTemplates,
} from "@/lib/queries";
import { ResultDialog } from "./result-dialog";
import { ResultsTable } from "./results-table";

export const metadata = {
  title: "Results",
};

export default async function AdminResultsPage() {
  const [results, divisions, categories, items, templates] = await Promise.all([
    getAllResultsAdmin(),
    getDivisionsList(),
    getCategories(),
    getItems(),
    getPosterTemplates(),
  ]);

  const divisionOptions = divisions.map((d) => ({ id: d.id, name: d.name }));
  const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name }));
  const itemOptions = items.map((i) => ({
    id: i.id,
    name: i.name,
    categoryId: i.categoryId,
  }));
  const templateOptions = templates.map((t) => ({ id: t.id, name: t.name }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Results</h1>
          <p className="text-sm text-muted-foreground">
            Manage competition results and publish posters for the public site.
          </p>
        </div>
        <ResultDialog
          divisions={divisionOptions}
          categories={categoryOptions}
          items={itemOptions}
          templates={templateOptions}
        />
      </div>

      <ResultsTable
        results={results}
        divisions={divisionOptions}
        categories={categoryOptions}
        items={itemOptions}
        templates={templateOptions}
      />
    </div>
  );
}

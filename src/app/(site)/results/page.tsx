import { getAllResults, getCategories, getDivisionsList, getGallery } from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { ResultsExplorer } from "@/components/site/results/results-explorer";
import { format } from "date-fns";
import { Trophy, CalendarCheck, ListChecks } from "lucide-react";

export const metadata = {
  title: "Results",
  description:
    "Browse all published results for SSF Malappuram West Sahityotsav 2026.",
};

export default async function ResultsPage() {
  const [results, categories, divisions, [bannerImage]] = await Promise.all([
    getAllResults(),
    getCategories(),
    getDivisionsList(),
    getGallery(1),
  ]);

  const lastPublished = results.reduce<Date | null>((latest, result) => {
    if (!result.publishedDate) return latest;
    if (!latest || result.publishedDate > latest) return result.publishedDate;
    return latest;
  }, null);

  return (
    <>
      <PageBanner
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Results" }]}
        title="Results"
        description="View all competition results and winners."
        imageUrl={bannerImage?.imageUrl}
        stats={[
          {
            icon: Trophy,
            value: String(results.length),
            label: "Total Results",
          },
          {
            icon: CalendarCheck,
            value: lastPublished ? format(lastPublished, "dd MMM yyyy") : "—",
            label: "Last Published",
          },
          {
            icon: ListChecks,
            value: "All Updates",
            label: "Stay informed",
            href: "/announcements",
          },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ResultsExplorer
          results={results}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          divisions={divisions}
        />
      </div>
    </>
  );
}

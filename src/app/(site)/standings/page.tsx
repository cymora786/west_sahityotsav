import {
  getStandingsWithStats,
  getDivisionsList,
  getCategories,
  getGallery,
  getPublishedResultsCount,
} from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { StandingsTable } from "@/components/site/standings/standings-table";
import { FilterStandings } from "@/components/site/standings/filter-standings";
import { StandingsByCategory } from "@/components/site/standings/standings-by-category";
import { Info, Trophy, Building2 } from "lucide-react";

export const metadata = {
  title: "Standings",
  description:
    "Live division standings for SSF Malappuram West Sahityotsav 2026.",
};

export default async function StandingsPage() {
  const [standings, divisions, categories, [bannerImage], publishedResultsCount] = await Promise.all([
    getStandingsWithStats(),
    getDivisionsList(),
    getCategories(),
    getGallery(1),
    getPublishedResultsCount(),
  ]);

  const rows = standings.map((division) => ({
    id: division.id,
    name: division.name,
    code: division.code,
    slug: division.slug,
    points: division.points?.currentPoints ?? 0,
    itemsParticipated: division.itemsParticipated,
  }));

  return (
    <>
      <PageBanner
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Standings" }]}
        title="Division Standings"
        description="Live points and rankings across all 10 divisions, updated as results are published."
        imageUrl={bannerImage?.imageUrl}
        stats={[
          {
            icon: Trophy,
            value: String(publishedResultsCount),
            label: "Results Published",
            href: "/results",
          },
          {
            icon: Building2,
            value: String(divisions.length),
            label: "Divisions",
          },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StandingsTable rows={rows} />
          </div>
          <div className="space-y-6">
            <FilterStandings
              divisions={divisions.map((d) => ({ value: d.slug, label: d.name }))}
              categories={categories.map((c) => ({ value: c.slug, label: c.name }))}
            />
          </div>
        </div>

        <div className="mt-12">
          <StandingsByCategory />
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          <Info className="size-4 shrink-0 text-primary" />
          Click on a division name to view its detailed profile, results, and participants.
        </div>
      </section>
    </>
  );
}

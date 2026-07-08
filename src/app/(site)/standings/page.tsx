import { getDivisionsList, getGallery } from "@/lib/queries";
import { getTeamPoints, getPublishedCompetitions } from "@/lib/sahityotsav-api";
import { PageBanner } from "@/components/site/page-banner";
import { StandingsTable } from "@/components/site/standings/standings-table";
import { StandingsByCategory } from "@/components/site/standings/standings-by-category";
import { Info, Trophy, Building2 } from "lucide-react";

export const metadata = {
  title: "Standings",
  description:
    "Live division standings for SSF Malappuram West Sahityotsav 2026.",
};

export default async function StandingsPage() {
  const [apiPoints, competitions, divisions, [bannerImage]] = await Promise.all([
    getTeamPoints(0),
    getPublishedCompetitions(),
    getDivisionsList(),
    getGallery(1),
  ]);

  const divisionMap = new Map(divisions.map((d) => [d.name.toLowerCase(), d]));

  const rows = (apiPoints ?? []).map((entry, i) => {
    const local = divisionMap.get(entry.name.toLowerCase());
    return {
      id: local?.id ?? `api-${i}`,
      name: entry.name,
      code: local?.code ?? entry.name.slice(0, 3).toUpperCase(),
      slug: local?.slug ?? entry.name.toLowerCase().replace(/\s+/g, "-"),
      points: entry.point,
      itemsParticipated: 0,
    };
  });

  const publishedCount = competitions?.length ?? 0;

  return (
    <>
      <PageBanner
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Standings" }]}
        title="Division Standings"
        description="Live points and rankings across all divisions, updated as results are published."
        imageUrl={bannerImage?.imageUrl}
        stats={[
          {
            icon: Trophy,
            value: String(publishedCount),
            label: "Results Published",
            href: "/results",
          },
          {
            icon: Building2,
            value: String(rows.length || divisions.length),
            label: "Divisions",
          },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <StandingsTable rows={rows} />

        <div className="mt-12">
          <StandingsByCategory />
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          <Info className="size-4 shrink-0 text-primary" />
          Click on a division name to view its detailed profile and results.
        </div>
      </section>
    </>
  );
}

import { getDivisionsList, getGallery } from "@/lib/queries";
import { getTeamPoints, getPublishedCompetitions } from "@/lib/sahityotsav-api";
import { PageBanner } from "@/components/site/page-banner";
import { StandingsTable } from "@/components/site/standings/standings-table";
import { StandingsByCategory } from "@/components/site/standings/standings-by-category";
import { Trophy, Building2 } from "lucide-react";
import { CelebrationEffect } from "@/components/site/standings/celebration-effect";

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

  const localMap = new Map(divisions.map((d) => [d.name.toLowerCase(), d]));

  // Use API team list as primary source; merge with local DB for slug/code
  // Fall back to local DB list if API returns nothing
  const teamList = apiPoints && apiPoints.length > 0
    ? apiPoints.map((e, i) => {
        const local = localMap.get(e.name.toLowerCase());
        return {
          id: local?.id ?? `api-${i}`,
          name: e.name,
          code: local?.code ?? e.name.slice(0, 3).toUpperCase(),
          slug: local?.slug ?? e.name.toLowerCase().replace(/\s+/g, "-"),
          points: e.point,
          itemsParticipated: 0,
        };
      })
    : divisions.map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
        slug: d.slug,
        points: 0,
        itemsParticipated: 0,
      }));

  const rows = teamList;

  const publishedCount = competitions?.length ?? 0;

  return (
    <>
      <CelebrationEffect />
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
      </section>
    </>
  );
}

export const dynamic = "force-dynamic";

import { getDivisionsList, getGallery } from "@/lib/queries";
import { getTeamPoints, getPublishedCompetitions } from "@/lib/sahityotsav-api";
import { PageBanner } from "@/components/site/page-banner";
import { StandingsTable } from "@/components/site/standings/standings-table";
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

  const STATIC_STANDINGS = [
    { name: "Tirurangadi Division",    points: 822 },
    { name: "Vengara Division",        points: 702 },
    { name: "Kottakkal Division",      points: 542 },
    { name: "Thenhippalam Division",   points: 542 },
    { name: "Parappanangadi Division", points: 523 },
    { name: "Vailathur Division",      points: 444 },
    { name: "Tanur Division",          points: 438 },
    { name: "Valanchery Division",     points: 430 },
    { name: "Puthanathani Division",   points: 419 },
    { name: "Edappal Division",        points: 412 },
    { name: "Ponnani Division",        points: 343 },
    { name: "Tirur Division",          points: 241 },
  ];

  // Always use static standings
  const source = STATIC_STANDINGS;

  const teamList = source.map((e, i) => {
    const local = localMap.get(e.name.toLowerCase());
    return {
      id: local?.id ?? `static-${i}`,
      name: e.name,
      code: local?.code ?? e.name.slice(0, 3).toUpperCase(),
      slug: local?.slug ?? e.name.toLowerCase().replace(/\s+/g, "-"),
      points: e.points,
      itemsParticipated: 0,
    };
  });

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

      </section>
    </>
  );
}

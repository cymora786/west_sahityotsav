export const revalidate = 60;

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPublishedCompetitions,
  getCompetitionResults,
} from "@/lib/sahityotsav-api";
import { competitionSlug } from "@/lib/competition-utils";
import { getPosterTemplates, getGallery, getEventSettings, getCompetitionPoster } from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { SectionHeading } from "@/components/site/section-heading";
import { PosterView } from "@/components/site/results/poster-view";
import { WinnersTable } from "@/components/site/results/winners-table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Medal, User, Users } from "lucide-react";
import type { ResultDetail } from "@/components/site/results/poster-templates";
import { ApiResultMiniCard } from "@/components/site/results/api-result-mini-card";
import { ResultPopper } from "@/components/site/results/result-popper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const competitions = await getPublishedCompetitions();
  const comp = competitions?.find((c) => competitionSlug(c) === slug);
  if (!comp) return { title: "Result Not Found" };
  return {
    title: `${comp.name} — ${comp.category}`,
    description: `Result for ${comp.name} (${comp.category}) at SSF Malappuram West Sahityotsav 2026.`,
  };
}

function makeDivision(teamName: string) {
  return {
    id: teamName,
    name: teamName,
    code: teamName.slice(0, 3).toUpperCase(),
    slug: teamName.toLowerCase().replace(/\s+/g, "-"),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export default async function ResultDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const competitions = await getPublishedCompetitions();
  const comp = competitions?.find((c) => competitionSlug(c) === slug);
  if (!comp) notFound();

  const [apiResults, templates, galleryImages, shareSettings, competitionPoster] = await Promise.all([
    getCompetitionResults(comp.id),
    getPosterTemplates().catch(() => []),
    getGallery(1).catch(() => []),
    getEventSettings().catch(() => null),
    getCompetitionPoster(comp.id).catch(() => null),
  ]);
  const [bannerImage] = galleryImages;

  if (!apiResults) notFound();

  const first = apiResults[0] ?? null;
  const second = apiResults[1] ?? null;
  const third = apiResults[2] ?? null;

  // Pick a template based on result number, cycling through available templates
  const templateIndex = ((comp.resultNumber ?? 1) - 1) % (templates.length || 1);
  const template = templates[templateIndex] ?? templates[0] ?? null;

  // Build a ResultDetail-compatible object from API data
  const result = {
    id: comp.id,
    categoryId: "",
    itemId: "",
    divisionId: first?.teamName ?? "",
    secondPlaceDivisionId: second?.teamName ?? null,
    thirdPlaceDivisionId: third?.teamName ?? null,
    templateId: template?.id ?? null,
    firstPlaceName: first?.participantName ?? first?.groupName ?? null,
    secondPlaceName: second?.participantName ?? second?.groupName ?? null,
    thirdPlaceName: third?.participantName ?? third?.groupName ?? null,
    venue: comp.stage ?? null,
    status: "PUBLISHED" as const,
    publishedDate: comp.publishedAt ? new Date(comp.publishedAt) : new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: comp.category,
      name: comp.category,
      slug: comp.category.toLowerCase().replace(/\s+/g, "-"),
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    item: {
      id: comp.id,
      name: comp.name,
      categoryId: comp.category,
      venue: comp.stage ?? null,
      status: "PUBLISHED" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    division: first ? makeDivision(first.teamName) : makeDivision("TBD"),
    secondPlaceDivision: second ? makeDivision(second.teamName) : null,
    thirdPlaceDivision: third ? makeDivision(third.teamName) : null,
    template: template ?? null,
    resultNumber: comp.resultNumber ?? null,
  } as unknown as ResultDetail;

  // Related results: same category, excluding this one
  const related = (competitions ?? [])
    .filter((c) => c.id !== comp.id && c.category === comp.category)
    .slice(0, 3);

  return (
    <>
      <ResultPopper />
      <PageBanner
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Results", href: "/results" },
          { label: comp.name },
        ]}
        title={comp.name}
        description={`Result details for ${comp.name} — ${comp.category}.`}
        imageUrl={bannerImage?.imageUrl}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          nativeButton={false}
          render={
            <Link href="/results">
              <ArrowLeft className="size-4" />
              Back to Results
            </Link>
          }
        />

        <div className={competitionPoster?.posterImage ? "grid gap-10 lg:grid-cols-[1fr_380px]" : "max-w-xl"}>
          {competitionPoster?.posterImage && (
            <PosterView
              result={result}
              templates={templates}
              shareSettings={shareSettings ?? undefined}
              customPosterImage={competitionPoster.posterImage}
            />
          )}

          {/* Info panel */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
                {comp.category}
              </p>
              <h1 className="text-2xl font-black tracking-tight">{comp.name}</h1>
              {comp.stage && (
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" /> {comp.stage}
                </p>
              )}
            </div>

            <WinnersTable result={result} />

            {/* Participant details */}
            {apiResults.length > 0 && (
              <div className="rounded-2xl border bg-card">
                <div className="flex items-center gap-2 border-b px-4 py-3">
                  <Medal className="size-4 text-primary" />
                  <span className="text-sm font-semibold">Participant Details</span>
                </div>
                <div className="divide-y">
                  {apiResults.filter((entry) => entry.rank <= 3).map((entry) => {
                    const rankLabel =
                      entry.rank === 1 ? "🥇 1st" :
                      entry.rank === 2 ? "🥈 2nd" :
                      entry.rank === 3 ? "🥉 3rd" :
                      `#${entry.rank}`;
                    const name = entry.participantName ?? entry.groupName ?? "—";
                    const isGroup = Boolean(entry.groupName);
                    return (
                      <div key={entry.rank} className="flex items-start gap-3 px-4 py-3">
                        <span className="mt-0.5 w-10 shrink-0 text-xs font-bold text-muted-foreground">
                          {rankLabel}
                        </span>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            {isGroup
                              ? <Users className="size-3.5 shrink-0 text-muted-foreground" />
                              : <User className="size-3.5 shrink-0 text-muted-foreground" />
                            }
                            <p className="truncate text-sm font-semibold">{name}</p>
                          </div>
                          {entry.leaderName && (
                            <p className="text-xs text-muted-foreground">Leader: {entry.leaderName}</p>
                          )}
                          <p className="text-xs text-muted-foreground">{entry.teamName}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          {entry.grade && (
                            <span className="block text-xs font-semibold text-primary">{entry.grade}</span>
                          )}
                          {entry.point > 0 && (
                            <span className="block text-xs text-muted-foreground">{entry.point} pts</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <SectionHeading
              eyebrow="More"
              title={`Other Results from ${comp.category}`}
              description={`Other results in ${comp.category}.`}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ApiResultMiniCard key={item.id} competition={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

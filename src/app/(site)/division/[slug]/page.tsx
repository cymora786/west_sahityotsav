import { notFound } from "next/navigation";
import Link from "next/link";
import { getDivisionBySlug, getGallery } from "@/lib/queries";
import { getTeamPoints, getApiDivisionResults } from "@/lib/sahityotsav-api";
import { PageBanner } from "@/components/site/page-banner";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Sparkles, Medal, Users, User } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const division = await getDivisionBySlug(slug);
  if (!division) return { title: "Division Not Found" };
  return {
    title: division.name,
    description: `Profile, points and results for ${division.name} at SSF Malappuram West Sahityotsav 2026.`,
  };
}

const RANK_CONFIG = {
  1: { label: "1st Place", icon: Trophy, className: "text-amber-500" },
  2: { label: "2nd Place", icon: Medal, className: "text-slate-400" },
  3: { label: "3rd Place", icon: Medal, className: "text-amber-700" },
};

export default async function DivisionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [division, [bannerImage], allTeamPoints] = await Promise.all([
    getDivisionBySlug(slug),
    getGallery(1),
    getTeamPoints(0),
  ]);

  if (!division) notFound();

  // Find live points from API, fall back to local DB
  const apiTeam = allTeamPoints?.find(
    (t) => t.name.toLowerCase() === division.name.toLowerCase()
  );
  const livePoints = apiTeam?.point ?? division.points?.currentPoints ?? 0;

  // Find rank from API standings
  const sorted = [...(allTeamPoints ?? [])].sort((a, b) => b.point - a.point);
  const rank = sorted.findIndex(
    (t) => t.name.toLowerCase() === division.name.toLowerCase()
  ) + 1;

  // Results where this division placed (from API)
  const divisionResults = await getApiDivisionResults(division.name);

  const stats = [
    { label: "Current Points", value: livePoints, icon: Trophy },
    { label: "Overall Rank", value: rank > 0 ? `#${rank}` : "—", icon: Award },
    { label: "Results", value: divisionResults.length, icon: Sparkles },
  ];

  return (
    <>
      <PageBanner
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standings", href: "/standings" },
          { label: division.name },
        ]}
        title={division.name}
        description={
          rank > 0
            ? `Currently ranked #${rank} with ${livePoints} points.`
            : `Profile, points and results for ${division.name}.`
        }
        imageUrl={bannerImage?.imageUrl}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 py-6">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <stat.icon className="size-6" />
                </span>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-12">
          <SectionHeading
            eyebrow="Achievements"
            title="Results"
            description={`Published results featuring ${division.name}.`}
          />
          {divisionResults.length === 0 ? (
            <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
              <Sparkles className="mx-auto mb-2 size-8" />
              No results published yet for this division.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {divisionResults.map(({ competition, rank: compRank, participantName }) => {
                const cfg = RANK_CONFIG[compRank as keyof typeof RANK_CONFIG];
                return (
                  <Link
                    key={competition.id}
                    href={`/results/${competition.id}`}
                    className="group block rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <Badge variant="secondary">{competition.category}</Badge>
                      <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {competition.type === "Group" ? (
                          <Users className="size-3" />
                        ) : (
                          <User className="size-3" />
                        )}
                        {competition.type}
                      </span>
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {competition.name}
                    </h3>
                    {participantName && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {participantName}
                      </p>
                    )}
                    {cfg && (
                      <div className={`mt-2 flex items-center gap-1.5 text-sm font-semibold ${cfg.className}`}>
                        <cfg.icon className="size-4" />
                        {cfg.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

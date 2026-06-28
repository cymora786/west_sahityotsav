import { notFound } from "next/navigation";
import { getDivisionBySlug, getGallery } from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { SectionHeading } from "@/components/site/section-heading";
import { ResultCard } from "@/components/site/result-card";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Award, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
    description: `Profile, points, results and participants for ${division.name} at SSF Malappuram West Sahityotsav 2026.`,
  };
}

export default async function DivisionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [division, [bannerImage]] = await Promise.all([
    getDivisionBySlug(slug),
    getGallery(1),
  ]);

  if (!division) notFound();

  const stats = [
    {
      label: "Current Points",
      value: division.points?.currentPoints ?? 0,
      icon: Trophy,
    },
    {
      label: "Results",
      value: division.results.length,
      icon: Award,
    },
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
          division.points
            ? `Last updated ${formatDistanceToNow(division.points.lastUpdated, { addSuffix: true })}.`
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
          title="Recent Results"
          description={`Published results for ${division.name}.`}
        />
        {division.results.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            <Sparkles className="mx-auto mb-2 size-8" />
            No results published yet for this division.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {division.results.map((result) => (
              <ResultCard
                key={result.id}
                result={{ ...result, division }}
              />
            ))}
          </div>
        )}
      </section>
      </div>
    </>
  );
}

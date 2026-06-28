import { notFound } from "next/navigation";
import Link from "next/link";
import { getResultById, getRelatedResults, getGallery, getPosterTemplates } from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { ResultCard } from "@/components/site/result-card";
import { SectionHeading } from "@/components/site/section-heading";
import { PosterView } from "@/components/site/results/poster-view";
import { WinnersTable } from "@/components/site/results/winners-table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResultById(id);

  if (!result) return { title: "Result Not Found" };

  return {
    title: `${result.item.name} — ${result.category.name}`,
    description: `Result for ${result.item.name} (${result.category.name}) at SSF Malappuram West Sahityotsav 2026.`,
  };
}

export default async function ResultDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResultById(id);

  if (!result || result.status !== "PUBLISHED") notFound();

  const [related, [bannerImage], templates] = await Promise.all([
    getRelatedResults(result.id, result.categoryId, 3),
    getGallery(1),
    getPosterTemplates(),
  ]);

  return (
    <>
      <PageBanner
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Results", href: "/results" },
          { label: result.item.name },
        ]}
        title={result.item.name}
        description={`Result details for ${result.item.name} — ${result.category.name}.`}
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

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Poster — primary */}
        <PosterView result={result} templates={templates} />

        {/* Info panel */}
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
              {result.category.name}
            </p>
            <h1 className="text-2xl font-black tracking-tight">{result.item.name}</h1>
            {result.venue && (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5" /> {result.venue}
              </p>
            )}
          </div>

          <WinnersTable result={result} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeading
            eyebrow="More"
            title={`Other Results from ${result.category.name}`}
            description={`Other results in ${result.category.name}.`}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ResultCard key={item.id} result={item} />
            ))}
          </div>
        </section>
      )}
    </div>
    </>
  );
}

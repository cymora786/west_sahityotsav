import { getPublishedCompetitions } from "@/lib/sahityotsav-api";
import { getGallery } from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { ApiResultsGrid } from "@/components/site/results/api-results-grid";
import { Trophy, ListChecks } from "lucide-react";

export const metadata = {
  title: "Results",
  description:
    "Browse all published results for SSF Malappuram West Sahityotsav 2026.",
};

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [competitions, galleryImages] = await Promise.all([
    getPublishedCompetitions(),
    getGallery(1).catch(() => []),
  ]);
  const [bannerImage] = galleryImages;

  const results = competitions ?? [];

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
            icon: ListChecks,
            value: "All Updates",
            label: "Stay informed",
            href: "/announcements",
          },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ApiResultsGrid results={results} initialQuery={q ?? ""} />
      </div>
    </>
  );
}

import Link from "next/link";
import { getLatestResults } from "@/lib/queries";
import { SectionHeading } from "@/components/site/section-heading";
import { ResultCard } from "@/components/site/result-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export async function LatestResults() {
  const results = await getLatestResults(6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Fresh Off the Stage"
          title="Latest Results"
          description="Recently published results and winner posters."
          className="mb-0"
        />
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <Link href="/results">
              All Results <ArrowRight className="size-4" />
            </Link>
          }
        />
      </div>

      {results.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          Results will be published here soon.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}
        </div>
      )}
    </section>
  );
}

import Link from "next/link";
import { getLatestResults } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowRight } from "lucide-react";

export async function LatestResultsCompact() {
  const results = await getLatestResults(4);

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg">Latest Results</CardTitle>
        <Link
          href="/results"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View All Results <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Results will be published here soon.
          </p>
        ) : (
          <ul className="space-y-3">
            {results.map((result) => (
              <li key={result.id}>
                <Link
                  href={`/results/${result.id}`}
                  className="flex items-start justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Trophy className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold leading-tight">
                        {result.item.name} ({result.category.name})
                      </p>
                      {result.firstPlaceName && (
                        <p className="text-xs text-muted-foreground">
                          🏆 1st {result.firstPlaceName} ({result.division.name})
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-emerald-600">
                    Completed
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

import Link from "next/link";
import { getPublishedCompetitions } from "@/lib/sahityotsav-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowRight, Users, User } from "lucide-react";

export async function LatestResultsCompact() {
  const competitions = await getPublishedCompetitions();
  // Show latest 4 by highest resultNumber
  const latest = [...(competitions ?? [])]
    .sort((a, b) => b.resultNumber - a.resultNumber)
    .slice(0, 4);

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
        {latest.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Results will be published here soon.
          </p>
        ) : (
          <ul className="space-y-3">
            {latest.map((comp) => (
              <li key={comp.id}>
                <Link
                  href={`/results/${comp.id}`}
                  className="flex items-start justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Trophy className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold leading-tight">
                        {comp.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {comp.category} ·{" "}
                        {comp.type === "Group" ? (
                          <span className="inline-flex items-center gap-0.5"><Users className="size-3" /> Group</span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5"><User className="size-3" /> Individual</span>
                        )}
                      </p>
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

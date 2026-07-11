import { getPublishedCompetitions, getCompetitionResults } from "@/lib/sahityotsav-api";
import { getAllCompetitionPosters } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Medal, ImageIcon } from "lucide-react";
import { PosterUploadDialog } from "./poster-upload-dialog";

export const metadata = { title: "Results" };

const RANK_EMOJI = ["🥇", "🥈", "🥉"] as const;

export default async function AdminResultsPage() {
  const [competitions, existingPosters] = await Promise.all([
    getPublishedCompetitions(),
    getAllCompetitionPosters(),
  ]);
  const items = competitions ?? [];

  const resultsList = await Promise.all(
    items.map(async (comp) => {
      const results = await getCompetitionResults(comp.id);
      return { comp, results: results ?? [] };
    })
  );

  const posterMap = new Map(existingPosters.map((p) => [p.competitionId, p.posterImage]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Results</h1>
        <p className="text-sm text-muted-foreground">
          {resultsList.length} competitions · Upload a custom poster per result to display it publicly.
        </p>
      </div>

      {resultsList.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
          No results found from API.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resultsList.map(({ comp, results }, i) => {
            const existingPoster = posterMap.get(comp.id) ?? null;
            const top3 = results.slice(0, 3);

            return (
              <div
                key={comp.id}
                className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm"
              >
                {/* Header */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-mono text-muted-foreground">#{i + 1}</span>
                    {existingPoster && (
                      <ImageIcon className="size-3 text-primary shrink-0" />
                    )}
                  </div>
                  <p className="font-semibold text-sm leading-snug" title={comp.name}>
                    {comp.name}
                  </p>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {comp.category}
                  </Badge>
                </div>

                {/* Winners */}
                {top3.length > 0 ? (
                  <div className="space-y-1 border-t pt-3">
                    {top3.map((entry, rank) => {
                      const name = entry.participantName ?? entry.groupName ?? null;
                      return (
                        <div key={rank} className="flex items-center gap-2 text-xs">
                          <span className="w-5 shrink-0 text-center">{RANK_EMOJI[rank]}</span>
                          <span className="font-medium text-foreground truncate">{entry.teamName}</span>
                          {name && (
                            <span className="truncate text-muted-foreground">— {name}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="border-t pt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Medal className="size-3" />
                    No results yet
                  </div>
                )}

                {/* Poster button */}
                <div className="border-t pt-3">
                  <PosterUploadDialog
                    competitionId={comp.id}
                    competitionName={comp.name}
                    currentPoster={existingPoster}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

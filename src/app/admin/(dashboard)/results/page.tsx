import { getPublishedCompetitions, getCompetitionResults } from "@/lib/sahityotsav-api";
import { getAllCompetitionPosters } from "@/lib/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Info, ImageIcon } from "lucide-react";
import { PosterUploadDialog } from "./poster-upload-dialog";

export const metadata = { title: "Results" };

export default async function AdminResultsPage() {
  const [competitions, existingPosters] = await Promise.all([
    getPublishedCompetitions(),
    getAllCompetitionPosters(),
  ]);
  const items = competitions ?? [];

  // Fetch results for all competitions in parallel
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
          Competition results synced from the sahityotsav.com API. Upload a custom poster per result.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          Result data is loaded live from the external API. Click <strong>Upload Poster</strong> on any row to add a custom poster image — it will override the auto-generated poster on the result page.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Competition</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>1st Place</TableHead>
                <TableHead>2nd Place</TableHead>
                <TableHead>3rd Place</TableHead>
                <TableHead className="text-right">Poster</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultsList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No results found from API.
                  </TableCell>
                </TableRow>
              )}
              {resultsList.map(({ comp, results }, i) => {
                const first = results[0];
                const second = results[1];
                const third = results[2];
                const existingPoster = posterMap.get(comp.id) ?? null;
                return (
                  <TableRow key={comp.id}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {existingPoster && (
                          <ImageIcon className="size-3.5 shrink-0 text-primary" />
                        )}
                        {comp.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{comp.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {first ? (
                        <span className="text-sm">
                          <span className="font-medium">{first.teamName}</span>
                          {first.participantName && (
                            <span className="ml-1 text-muted-foreground">
                              — {first.participantName}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {second ? (
                        <span className="text-sm">
                          <span className="font-medium">{second.teamName}</span>
                          {second.participantName && (
                            <span className="ml-1 text-muted-foreground">
                              — {second.participantName}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {third ? (
                        <span className="text-sm">
                          <span className="font-medium">{third.teamName}</span>
                          {third.participantName && (
                            <span className="ml-1 text-muted-foreground">
                              — {third.participantName}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <PosterUploadDialog
                        competitionId={comp.id}
                        competitionName={comp.name}
                        currentPoster={existingPoster}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

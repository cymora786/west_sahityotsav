import Link from "next/link";
import { getPublishedCompetitions, getCompetitionResults } from "@/lib/sahityotsav-api";
import { getCertificateSettings } from "@/lib/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Printer, Award, Settings2 } from "lucide-react";

export const metadata = { title: "Certificates — Admin" };

export default async function AdminCertificatesPage() {
  const [competitions, certSettings] = await Promise.all([
    getPublishedCompetitions(),
    getCertificateSettings(),
  ]);

  // Show all competitions returned by the API (demo key omits publishedAt but results are still there)
  const all = competitions ?? [];
  const hasStyles = !!(certSettings?.firstBg || certSettings?.secondBg || certSettings?.thirdBg);

  const resultsList = await Promise.all(
    all.map(async (comp) => {
      const results = await getCompetitionResults(comp.id);
      return { comp, results: results ?? [] };
    })
  );

  const withResults = resultsList.filter(({ results }) => results.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Certificates</h1>
          <p className="text-sm text-muted-foreground">
            Generate and print certificates for competition results.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
            <Award className="size-4 shrink-0" />
            {withResults.length} competitions · {hasStyles ? "Custom styles set" : "Default style"}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            nativeButton={false}
            render={
              <Link href="/admin/certificates/settings">
                <Settings2 className="size-4" />
                Manage Styles
              </Link>
            }
          />
        </div>
      </div>

      {withResults.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          <Award className="mx-auto mb-2 size-8" />
          <p>No results available yet. Certificates will appear here once results are added.</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Competition</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Winners</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withResults.map(({ comp, results }, i) => (
                  <TableRow key={comp.id}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{comp.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{comp.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5 text-sm">
                        {results.slice(0, 3).map((r) => (
                          <p key={r.rank} className="text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : "🥉"}
                            </span>{" "}
                            {r.participantName ?? r.groupName ?? "—"} · {r.teamName}
                          </p>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        nativeButton={false}
                        render={
                          <Link href={`/admin/certificates/${comp.id}`} target="_blank">
                            <Printer className="size-3.5" />
                            Print
                          </Link>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

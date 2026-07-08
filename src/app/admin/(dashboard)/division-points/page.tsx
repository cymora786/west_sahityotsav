import { getTeamPoints } from "@/lib/sahityotsav-api";
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
import { Info } from "lucide-react";

export const metadata = { title: "Division Points" };

export default async function AdminDivisionPointsPage() {
  const teams = await getTeamPoints();
  const divisions = teams ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Division Points</h1>
        <p className="text-sm text-muted-foreground">
          Live team points synced from the sahityotsav.com API.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          Points are loaded live from the external API. Changes must be made on{" "}
          <strong>sahityotsav.com</strong> and will reflect here automatically.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Rank</TableHead>
                <TableHead>Division / Team</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {divisions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No points data found from API.
                  </TableCell>
                </TableRow>
              )}
              {divisions.map((team, i) => (
                <TableRow key={team.name}>
                  <TableCell>
                    <Badge variant={i === 0 ? "default" : "outline"}>{i + 1}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell className="text-right text-lg font-bold text-primary">
                    {team.point}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

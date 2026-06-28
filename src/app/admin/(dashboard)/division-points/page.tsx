import { getStandings, getRecentPointLogs } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PointsDialog } from "./points-dialog";
import { formatDistanceToNow } from "date-fns";

export const metadata = {
  title: "Division Points",
};

export default async function AdminDivisionPointsPage() {
  const [divisions, pointLogs] = await Promise.all([
    getStandings(),
    getRecentPointLogs(20),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Division Points</h1>
        <p className="text-sm text-muted-foreground">
          Manually update division standings. Points are not auto-calculated
          from results.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Division</TableHead>
                <TableHead className="text-right">Current Points</TableHead>
                <TableHead className="hidden text-right sm:table-cell">
                  Last Updated
                </TableHead>
                <TableHead className="w-44 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {divisions.map((division) => (
                <TableRow key={division.id}>
                  <TableCell className="font-medium">
                    {division.name}{" "}
                    <Badge variant="secondary" className="ml-2">
                      {division.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-lg font-bold text-primary">
                    {division.points?.currentPoints ?? 0}
                  </TableCell>
                  <TableCell className="hidden text-right text-sm text-muted-foreground sm:table-cell">
                    {division.points
                      ? formatDistanceToNow(division.points.lastUpdated, {
                          addSuffix: true,
                        })
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <PointsDialog
                      divisionId={division.id}
                      divisionName={division.name}
                      currentPoints={division.points?.currentPoints ?? 0}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Audit Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Division</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>By</TableHead>
                <TableHead className="text-right">When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pointLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No point changes recorded yet.
                  </TableCell>
                </TableRow>
              )}
              {pointLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    {log.division.name}
                  </TableCell>
                  <TableCell>
                    {log.previousPoints} &rarr; {log.newPoints}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.reason}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.updatedBy?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatDistanceToNow(log.createdAt, { addSuffix: true })}
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

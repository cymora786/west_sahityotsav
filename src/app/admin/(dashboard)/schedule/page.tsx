import { getApiSchedule } from "@/lib/sahityotsav-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = { title: "Schedule" };

const STATUS_STYLES: Record<string, string> = {
  Completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "In Progress": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Upcoming: "bg-muted text-muted-foreground",
};

export default async function AdminSchedulePage() {
  const apiSchedule = await getApiSchedule();
  const entries = apiSchedule?.schedule ?? [];

  // Group by date
  const grouped = entries.reduce<Record<string, typeof entries>>((acc, entry) => {
    acc[entry.date] = acc[entry.date] ? [...acc[entry.date], entry] : [entry];
    return acc;
  }, {});
  const days = Object.keys(grouped).sort();

  function formatDate(dateStr: string) {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
        <p className="text-sm text-muted-foreground">
          Event schedule synced from the sahityotsav.com API.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          This data is loaded live from the external API. Changes must be made on{" "}
          <strong>sahityotsav.com</strong> and will reflect here automatically.
        </p>
      </div>

      {days.length === 0 ? (
        <Card>
          <CardContent className="h-24 flex items-center justify-center text-muted-foreground">
            No schedule data found from API.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {days.map((day, dayIndex) => (
            <div key={day}>
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Day {dayIndex + 1} — {formatDate(day)}
              </h2>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Competition</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Venue</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grouped[day].map((entry) => (
                        <TableRow key={`${entry.competitionId}-${entry.startTime}`}>
                          <TableCell className="text-sm font-medium whitespace-nowrap">
                            {entry.startTime}
                            {entry.endTime && (
                              <span className="text-muted-foreground"> – {entry.endTime}</span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{entry.competitionName}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{entry.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{entry.type}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{entry.stageName}</TableCell>
                          <TableCell>
                            <span className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                              STATUS_STYLES[entry.status] ?? STATUS_STYLES.Upcoming
                            )}>
                              {entry.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

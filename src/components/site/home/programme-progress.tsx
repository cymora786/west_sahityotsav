import Link from "next/link";
import { getApiProgrammeProgress } from "@/lib/sahityotsav-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgrammeProgressChart } from "./programme-progress-chart";
import { ArrowRight, CalendarDays } from "lucide-react";

export async function ProgrammeProgress() {
  const progress = await getApiProgrammeProgress();

  const legend = [
    { label: "Completed", value: progress.completed, dotClassName: "bg-chart-1" },
    { label: "Ongoing", value: progress.ongoing, dotClassName: "bg-chart-2" },
    { label: "Pending", value: progress.pending, dotClassName: "bg-chart-3" },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg">Programme Progress</CardTitle>
        <Link
          href="/schedule"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View Schedule <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        {progress.total === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
            <CalendarDays className="size-8" />
            <p className="text-sm">Schedule not published yet.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-around">
            <ProgrammeProgressChart {...progress} />
            <ul className="flex flex-col gap-2">
              {legend.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm">
                  <span className={`size-2.5 rounded-full ${item.dotClassName}`} />
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold">
                    {item.value}{" "}
                    ({progress.total > 0
                      ? Math.round((item.value / progress.total) * 100)
                      : 0}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

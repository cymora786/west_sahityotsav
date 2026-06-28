import Link from "next/link";
import { getProgrammeProgress } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgrammeProgressChart } from "./programme-progress-chart";
import { ArrowRight } from "lucide-react";

export async function ProgrammeProgress() {
  const progress = await getProgrammeProgress();

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
          href="/items"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View All Items <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-around">
        <ProgrammeProgressChart {...progress} />
        <ul className="flex flex-col gap-2">
          {legend.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-sm">
              <span className={`size-2.5 rounded-full ${item.dotClassName}`} />
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-semibold">
                {item.value} ({progress.total > 0 ? Math.round((item.value / progress.total) * 100) : 0}%)
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

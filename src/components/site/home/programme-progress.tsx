import Link from "next/link";
import { getApiProgrammeProgress } from "@/lib/sahityotsav-api";
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
    <div className="h-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-base font-bold text-white">Programme Progress</h3>
        <Link
          href="/schedule"
          className="inline-flex items-center gap-1 text-xs font-medium text-white/70 hover:text-white transition-colors"
        >
          View Schedule <ArrowRight className="size-3" />
        </Link>
      </div>
      <div className="px-5 pb-5">
        {progress.total === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <CalendarDays className="size-8 text-white/70" />
            <p className="text-sm text-white/60">Schedule not published yet.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-around">
            <ProgrammeProgressChart {...progress} />
            <ul className="flex flex-col gap-3">
              {legend.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm">
                  <span className={`size-2.5 rounded-full ${item.dotClassName}`} />
                  <span className="text-white/70">{item.label}</span>
                  <span className="font-bold text-white">
                    {item.value}{" "}
                    <span className="font-normal text-white/60">
                      ({progress.total > 0 ? Math.round((item.value / progress.total) * 100) : 0}%)
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

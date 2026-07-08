import Link from "next/link";
import { getTeamPoints } from "@/lib/sahityotsav-api";
import { getDivisionsList } from "@/lib/queries";
import { ArrowRight, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const MEDAL_STYLES = [
  "bg-amber-400 text-amber-950",
  "bg-slate-300 text-slate-800",
  "bg-amber-700 text-amber-50",
];

export async function LiveStandings() {
  const [apiPoints, divisions] = await Promise.all([
    getTeamPoints(0),
    getDivisionsList(),
  ]);

  if (!apiPoints || apiPoints.length === 0) return null;

  const divisionMap = new Map(divisions.map((d) => [d.name.toLowerCase(), d]));
  const maxPoints = Math.max(...apiPoints.map((t) => t.point), 1);

  return (
    <div className="h-full rounded-2xl bg-emerald-950 p-6 text-white">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-sm font-bold tracking-wide uppercase">
          Live Division Standings
        </h2>
        <Link
          href="/standings"
          className="inline-flex items-center gap-1 text-sm font-medium text-emerald-200 hover:text-white"
        >
          View Full Standings <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <ul className="space-y-3">
        {apiPoints.map((team, index) => {
          const local = divisionMap.get(team.name.toLowerCase());
          const slug = local?.slug ?? team.name.toLowerCase().replace(/\s+/g, "-");
          const width = Math.max((team.point / maxPoints) * 100, 4);
          return (
            <li key={team.name} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  index < 3 ? MEDAL_STYLES[index] : "bg-white/10 text-white/70"
                )}
              >
                {index < 3 ? <Trophy className="size-3.5" /> : index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <Link
                    href={`/division/${slug}`}
                    className="truncate text-sm font-medium hover:underline"
                  >
                    {team.name}
                  </Link>
                  <span className="shrink-0 text-sm font-bold">
                    {team.point}{" "}
                    <span className="text-xs font-normal text-white/60">Points</span>
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

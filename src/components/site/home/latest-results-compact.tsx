import Link from "next/link";
import { getPublishedCompetitions } from "@/lib/sahityotsav-api";
import { Trophy, ArrowRight, Users, User } from "lucide-react";

export async function LatestResultsCompact() {
  const competitions = await getPublishedCompetitions();
  // Show latest 4 by highest resultNumber
  const latest = [...(competitions ?? [])]
    .sort((a, b) => b.resultNumber - a.resultNumber)
    .slice(0, 4);

  return (
    <div className="h-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-base font-bold text-white">Latest Results</h3>
        <Link
          href="/results"
          className="inline-flex items-center gap-1 text-xs font-medium text-white/70 hover:text-white transition-colors"
        >
          View All <ArrowRight className="size-3" />
        </Link>
      </div>
      <div className="px-5 pb-5">
        {latest.length === 0 ? (
          <p className="py-10 text-center text-sm text-white/60">
            Results will be published here soon.
          </p>
        ) : (
          <ul className="space-y-1">
            {latest.map((comp) => (
              <li key={comp.id}>
                <Link
                  href={`/results/${comp.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-400/30 text-amber-300">
                      <Trophy className="size-3.5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold leading-tight text-white">{comp.name}</p>
                      <p className="text-xs text-white/55">
                        {comp.category} ·{" "}
                        {comp.type === "Group" ? (
                          <span className="inline-flex items-center gap-0.5"><Users className="size-3" /> Group</span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5"><User className="size-3" /> Individual</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                    Done
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

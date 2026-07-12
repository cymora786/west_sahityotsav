"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const MEDAL_STYLES = [
  "bg-amber-400 text-amber-950",
  "bg-slate-300 text-slate-800",
  "bg-amber-700 text-amber-50",
];

type Row = { name: string; slug: string; points: number };

export function LiveStandings() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/standings?category=General`)
      .then((r) => r.json())
      .then((data) => { setRows(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const hasPoints = rows.some((r) => r.points > 0);
  const maxPoints = Math.max(...rows.map((r) => r.points), 1);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#2e6ab1" }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4">
        <h2 className="text-sm font-bold tracking-wide uppercase text-white">
          Live Division Standings
        </h2>
        <Link
          href="/standings"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-200 hover:text-white transition-colors"
        >
          View Full <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="px-6 pb-6">
        {loading ? (
          <ul className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex items-center gap-3 animate-pulse">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between">
                    <div className="h-3 w-32 rounded bg-white/20" />
                    <div className="h-3 w-10 rounded bg-white/20" />
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10" />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-3">
            {rows.map((d, index) => {
              const width = Math.max(maxPoints > 0 ? (d.points / maxPoints) * 100 : 0, d.points > 0 ? 4 : 0);
              return (
                <li key={d.name} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      hasPoints && index < 3 ? MEDAL_STYLES[index] : "bg-white/10 text-white/70"
                    )}
                  >
                    {hasPoints && index < 3 ? <Trophy className="size-3.5" /> : hasPoints ? index + 1 : "—"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      {d.points > 0 ? (
                        <Link href={`/division/${d.slug}`} className="truncate text-sm font-medium text-white hover:underline">
                          {d.name}
                        </Link>
                      ) : (
                        <span className="truncate text-sm font-medium text-white/70">{d.name}</span>
                      )}
                      <span className="shrink-0 text-sm font-bold text-white">
                        {d.points}{" "}
                        <span className="text-xs font-normal text-white/60">pts</span>
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

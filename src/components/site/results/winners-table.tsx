import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResultDetail } from "@/components/site/results/poster-templates";

const CREST_PALETTES = [
  "from-emerald-500 to-emerald-700",
  "from-blue-500 to-blue-700",
  "from-amber-500 to-amber-700",
  "from-rose-500 to-rose-700",
  "from-violet-500 to-violet-700",
  "from-cyan-500 to-cyan-700",
  "from-orange-500 to-orange-700",
  "from-teal-500 to-teal-700",
];

function crestPalette(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return CREST_PALETTES[hash % CREST_PALETTES.length];
}

function Crest({
  code,
  size = "lg",
}: {
  code: string;
  size?: "lg" | "sm";
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-black text-white shadow-md ring-2 ring-white/40",
        crestPalette(code),
        size === "lg" ? "size-16 text-xl" : "size-10 text-xs"
      )}
    >
      {code.slice(0, 3).toUpperCase()}
    </span>
  );
}

export function WinnersTable({ result }: { result: ResultDetail }) {
  const first = result.firstPlaceName
    ? { name: result.firstPlaceName, division: result.division }
    : null;
  const second = result.secondPlaceName
    ? { name: result.secondPlaceName, division: result.secondPlaceDivision }
    : null;
  const third = result.thirdPlaceName
    ? { name: result.thirdPlaceName, division: result.thirdPlaceDivision }
    : null;

  if (!first && !second && !third) return null;

  return (
    <div className="overflow-hidden rounded-2xl border bg-gradient-to-b from-emerald-950 to-emerald-900 text-white shadow-lg">
      {/* Match header */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
          {result.category.name}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Full Time
        </span>
      </div>

      {/* Winner showcase */}
      {first && (
        <div className="relative flex flex-col items-center px-6 py-7 text-center">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-amber-400/15 to-transparent" />
          <Trophy className="relative z-10 mb-2 size-7 text-amber-400" />
          <div className="relative z-10">
            <Crest code={first.division?.code ?? first.division?.name ?? "?"} size="lg" />
          </div>
          <p className="relative z-10 mt-3 text-xl font-black leading-tight">{first.name}</p>
          <p className="relative z-10 text-sm font-medium text-emerald-300">{first.division?.name}</p>
          <span className="relative z-10 mt-2 rounded-full bg-amber-400/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-400">
            1st Place
          </span>
        </div>
      )}

      {/* Runner-up bench */}
      {(second || third) && (
        <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10">
          {[
            { data: second, rank: "2nd Place", medal: "🥈" },
            { data: third, rank: "3rd Place", medal: "🥉" },
          ].map(({ data, rank, medal }, i) =>
            data ? (
              <div key={i} className="flex flex-col items-center gap-1.5 px-3 py-4 text-center">
                <Crest code={data.division?.code ?? data.division?.name ?? "?"} size="sm" />
                <p className="text-xs font-bold leading-tight">{data.name}</p>
                <p className="text-[11px] text-white/50">{data.division?.name}</p>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-white/40">
                  {medal} {rank}
                </span>
              </div>
            ) : (
              <div key={i} className="flex items-center justify-center px-3 py-4 text-xs text-white/30">
                —
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

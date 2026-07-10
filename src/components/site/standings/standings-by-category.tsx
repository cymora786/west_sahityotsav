import { getApiCategoryLeaders } from "@/lib/sahityotsav-api";
import { CATEGORY_NAMES } from "@/lib/constants";
import { Crown } from "lucide-react";

const CATEGORY_COLORS = [
  "bg-emerald-500/15 text-emerald-600",
  "bg-blue-500/15 text-blue-600",
  "bg-purple-500/15 text-purple-600",
  "bg-orange-500/15 text-orange-600",
  "bg-teal-500/15 text-teal-600",
  "bg-rose-500/15 text-rose-600",
  "bg-amber-500/15 text-amber-600",
];

export async function StandingsByCategory() {
  const leaders = await getApiCategoryLeaders();
  const leadersMap = new Map(leaders.map((l) => [l.category, l]));

  const categories = CATEGORY_NAMES.map((name, i) => ({
    name,
    leader: leadersMap.get(name) ?? null,
    colorClass: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-muted-foreground uppercase">
        <Crown className="size-4 text-primary" />
        Standings by Category
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map(({ name, leader, colorClass }) => (
          <div key={name} className="rounded-2xl border bg-card p-5 text-center">
            <div className={`mx-auto mb-3 flex size-10 items-center justify-center rounded-xl ${colorClass}`}>
              <Crown className="size-5" />
            </div>
            <h3 className="font-semibold">{name}</h3>
            {leader ? (
              <>
                <p className="mt-1 text-base font-bold">{leader.teamName}</p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-primary">{leader.wins}</span> first place{leader.wins === 1 ? "" : "s"}
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground italic">Results pending…</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

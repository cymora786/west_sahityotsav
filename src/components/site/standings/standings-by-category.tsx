import { getApiCategoryLeaders } from "@/lib/sahityotsav-api";
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

  if (leaders.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-muted-foreground uppercase">
        <Crown className="size-4 text-primary" />
        Standings by Category
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {leaders.map(({ category, teamName, wins }, i) => (
          <div key={category} className="rounded-2xl border bg-card p-5 text-center">
            <div
              className={`mx-auto mb-3 flex size-10 items-center justify-center rounded-xl ${
                CATEGORY_COLORS[i % CATEGORY_COLORS.length]
              }`}
            >
              <Crown className="size-5" />
            </div>
            <h3 className="font-semibold">{category}</h3>
            <p className="mt-1 text-base font-bold">{teamName}</p>
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-primary">{wins}</span> first place
              {wins === 1 ? "" : "s"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

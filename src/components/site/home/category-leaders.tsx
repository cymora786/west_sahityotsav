import Link from "next/link";
import { getApiCategoryLeaders } from "@/lib/sahityotsav-api";
import { CATEGORY_NAMES } from "@/lib/constants";
import { ArrowRight, Star } from "lucide-react";

const CATEGORY_COLORS = [
  "bg-emerald-500/15 text-emerald-600",
  "bg-blue-500/15 text-blue-600",
  "bg-purple-500/15 text-purple-600",
  "bg-orange-500/15 text-orange-600",
  "bg-teal-500/15 text-teal-600",
  "bg-rose-500/15 text-rose-600",
  "bg-amber-500/15 text-amber-600",
];

export async function CategoryLeaders() {
  const leaders = await getApiCategoryLeaders();
  const leadersMap = new Map(leaders.map((l) => [l.category, l]));

  const categories = CATEGORY_NAMES.map((name, i) => ({
    name,
    leader: leadersMap.get(name) ?? null,
    colorClass: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
          Category Leaders (Overall)
        </h2>
        <Link
          href="/results"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View All <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map(({ name, leader, colorClass }) => (
          <div key={name} className="rounded-2xl border bg-card p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex size-10 items-center justify-center rounded-xl ${colorClass}`}>
                <Star className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold">{name}</h3>
                <p className="text-xs text-muted-foreground">Topper</p>
              </div>
            </div>
            {leader ? (
              <>
                <p className="text-lg font-bold">{leader.teamName}</p>
                <p className="text-sm">
                  <span className="font-bold text-primary">{leader.wins}</span>{" "}
                  <span className="text-muted-foreground">first place{leader.wins === 1 ? "" : "s"}</span>
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground italic">Results pending…</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

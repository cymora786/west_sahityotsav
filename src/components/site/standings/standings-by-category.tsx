import { getCategoryLeaders } from "@/lib/queries";
import { Crown } from "lucide-react";

const CATEGORY_STYLES: Record<string, string> = {
  Senior: "bg-emerald-500/15 text-emerald-600",
  "Higher Secondary": "bg-blue-500/15 text-blue-600",
  "High School": "bg-purple-500/15 text-purple-600",
  Junior: "bg-orange-500/15 text-orange-600",
  Primary: "bg-teal-500/15 text-teal-600",
};

export async function StandingsByCategory() {
  const leaders = await getCategoryLeaders();

  if (leaders.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-muted-foreground uppercase">
        <Crown className="size-4 text-primary" />
        Standings by Category
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {leaders.map(({ category, division, wins }) => (
          <div key={category.id} className="rounded-2xl border bg-card p-5 text-center">
            <div
              className={`mx-auto mb-3 flex size-10 items-center justify-center rounded-xl ${
                CATEGORY_STYLES[category.name] ?? "bg-primary/10 text-primary"
              }`}
            >
              <Crown className="size-5" />
            </div>
            <h3 className="font-semibold">{category.name}</h3>
            <p className="mt-1 text-base font-bold">{division?.name ?? "TBD"}</p>
            {division && (
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-primary">{wins}</span> first place
                {wins === 1 ? "" : "s"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

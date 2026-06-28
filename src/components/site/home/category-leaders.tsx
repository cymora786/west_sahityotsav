import Link from "next/link";
import { getCategoryLeaders } from "@/lib/queries";
import { ArrowRight, Star } from "lucide-react";

const CATEGORY_STYLES: Record<string, string> = {
  Senior: "bg-emerald-500/15 text-emerald-600",
  "Higher Secondary": "bg-blue-500/15 text-blue-600",
  "High School": "bg-purple-500/15 text-purple-600",
  Junior: "bg-orange-500/15 text-orange-600",
  Primary: "bg-teal-500/15 text-teal-600",
};

export async function CategoryLeaders() {
  const leaders = await getCategoryLeaders();

  if (leaders.length === 0) return null;

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
          Category Leaders (Overall)
        </h2>
        <Link
          href="/categories"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View All <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {leaders.map(({ category, division, wins }) => (
        <div
          key={category.id}
          className="rounded-2xl border bg-card p-5"
        >
          <div className="mb-3 flex items-center gap-3">
            <div
              className={`flex size-10 items-center justify-center rounded-xl ${
                CATEGORY_STYLES[category.name] ?? "bg-primary/10 text-primary"
              }`}
            >
              <Star className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold">{category.name}</h3>
              <p className="text-xs text-muted-foreground">Topper</p>
            </div>
          </div>
          <p className="text-lg font-bold">{division?.name ?? "TBD"}</p>
          {division && (
            <p className="text-sm">
              <span className="font-bold text-primary">{wins}</span>{" "}
              <span className="text-muted-foreground">
                first place{wins === 1 ? "" : "s"}
              </span>
            </p>
          )}
        </div>
        ))}
      </div>
    </div>
  );
}

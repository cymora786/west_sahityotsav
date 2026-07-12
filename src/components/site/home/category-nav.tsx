import Link from "next/link";
import { Star } from "lucide-react";

const CATEGORIES = [
  { name: "Senior",           color: "bg-blue-500/15 text-blue-700" },
  { name: "Higher Secondary", color: "bg-indigo-500/15 text-indigo-700" },
  { name: "Junior",           color: "bg-orange-500/15 text-orange-600" },
  { name: "High School",      color: "bg-purple-500/15 text-purple-600" },
  { name: "Campus",           color: "bg-pink-500/15 text-pink-600" },
  { name: "Upper Primary",    color: "bg-teal-500/15 text-teal-600" },
  { name: "Lower Primary",    color: "bg-emerald-500/15 text-emerald-600" },
  { name: "General",          color: "bg-amber-500/15 text-amber-600" },
];

export function CategoryNav() {
  return (
    <div className="grid h-full grid-cols-2 gap-3 sm:grid-cols-2" style={{ gridAutoRows: "1fr" }}>
      {CATEGORIES.map(({ name, color }) => (
        <Link
          key={name}
          href={`/results?category=${encodeURIComponent(name)}`}
          className="flex items-center gap-3 rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${color}`}>
            <Star className="size-4" />
          </div>
          <span className="text-sm font-semibold leading-snug">{name}</span>
        </Link>
      ))}
    </div>
  );
}

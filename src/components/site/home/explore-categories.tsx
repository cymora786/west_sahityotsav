import Link from "next/link";
import { getCategories } from "@/lib/queries";
import { SectionHeading } from "@/components/site/section-heading";
import { ArrowRight, GraduationCap } from "lucide-react";

const CATEGORY_GRADIENTS: Record<string, string> = {
  Senior: "from-emerald-700 to-emerald-900",
  "Higher Secondary": "from-blue-600 to-blue-800",
  "High School": "from-purple-600 to-purple-800",
  Junior: "from-orange-500 to-orange-700",
  Primary: "from-teal-600 to-teal-800",
};

export async function ExploreCategories() {
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Browse"
          title="Explore Categories"
          description="Senior, Higher Secondary, High School, Junior and Primary."
          className="mb-0"
        />
        <Link
          href="/categories"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View All Categories <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories#${category.slug}`}
            className={`group relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white transition-transform hover:-translate-y-1 ${
              CATEGORY_GRADIENTS[category.name] ?? "from-primary to-primary/70"
            }`}
          >
            <GraduationCap className="size-6 text-white/80" />
            <div>
              <h3 className="text-lg font-bold">{category.name}</h3>
              <p className="text-sm text-white/80">
                {category._count.items} Items
              </p>
              <span className="mt-2 flex items-center gap-1 text-sm font-medium text-white">
                View Results{" "}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

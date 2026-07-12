"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trophy, Search, Users, User, ImageIcon } from "lucide-react";
import type { ApiCompetition } from "@/lib/sahityotsav-api";
import { competitionSlug } from "@/lib/competition-utils";
import Image from "next/image";

export function ApiResultsGrid({
  results,
  initialQuery = "",
  posterMap = {},
}: {
  results: ApiCompetition[];
  initialQuery?: string;
  posterMap?: Record<string, string>;
}) {
  const [query, setQuery] = React.useState(initialQuery);

  const filtered = results.filter((r) => {
    const q = query.toLowerCase();
    return (
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  });

  // Unique categories for quick-filter chips
  const categories = Array.from(new Set(results.map((r) => r.category)));
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  const displayed = activeCategory
    ? filtered.filter((r) => r.category === activeCategory)
    : filtered;

  return (
    <div className="space-y-6">
      {/* Search + category filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search competition or category…"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeCategory === null
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/50"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {displayed.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <Trophy className="mx-auto mb-2 size-8" />
          No results found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((comp) => {
            const posterImage = posterMap[comp.id];
            return (
              <Link key={comp.id} href={`/results/${competitionSlug(comp)}`} className="group block">
                <Card className="h-full overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                  {posterImage ? (
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={posterImage}
                        alt={`${comp.name} poster`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <Badge variant="secondary" className="mb-1 text-[10px]">{comp.category}</Badge>
                        <h3 className="text-sm font-bold leading-tight text-white">{comp.name}</h3>
                      </div>
                      <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                        <Trophy className="size-3" />
                        #{comp.resultNumber}
                      </span>
                    </div>
                  ) : (
                    <>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <Badge variant="secondary">{comp.category}</Badge>
                          <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {comp.type === "Group" ? <Users className="size-3" /> : <User className="size-3" />}
                            {comp.type}
                          </span>
                        </div>
                        <h3 className="mt-1 text-base font-semibold leading-tight group-hover:text-primary transition-colors">
                          {comp.name}
                        </h3>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          {comp.stage && <span className="text-xs text-muted-foreground">{comp.stage}</span>}
                          <span className="ml-auto flex items-center gap-1 text-xs font-medium text-primary">
                            <Trophy className="size-3" />
                            Result #{comp.resultNumber}
                          </span>
                        </div>
                      </CardContent>
                    </>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Showing {displayed.length} of {results.length} published results
      </p>
    </div>
  );
}

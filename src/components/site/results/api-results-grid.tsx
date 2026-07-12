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
  initialCategory = null,
  posterMap = {},
}: {
  results: ApiCompetition[];
  initialQuery?: string;
  initialCategory?: string | null;
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
  const [activeCategory, setActiveCategory] = React.useState<string | null>(initialCategory);

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
                <Card className="h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      {posterImage && (
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border">
                          <Image
                            src={posterImage}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <Badge variant="secondary" className="shrink-0">{comp.category}</Badge>
                          <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground shrink-0">
                            {comp.type === "Group" ? <Users className="size-3" /> : <User className="size-3" />}
                            {comp.type}
                          </span>
                        </div>
                        <h3 className="mt-1 text-base font-semibold leading-tight group-hover:text-primary transition-colors">
                          {comp.name}
                        </h3>
                      </div>
                    </div>
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

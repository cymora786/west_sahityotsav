"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ResultCard } from "@/components/site/result-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LayoutGrid,
  List,
  Search,
  Medal,
  Info,
  ChevronLeft,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getItemIcon } from "@/components/site/results/item-icon";
import type { getAllResults } from "@/lib/queries";

type ResultRow = Awaited<ReturnType<typeof getAllResults>>[number];

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const PRIZE_FILTERS = [
  { value: "first" as const, label: "First Prize Winners", rank: 1 },
  { value: "second" as const, label: "Second Prize Winners", rank: 2 },
  { value: "third" as const, label: "Third Prize Winners", rank: 3 },
];

const RANK_BADGES = [
  { className: "bg-amber-400 text-amber-950" },
  { className: "bg-slate-300 text-slate-800" },
  { className: "bg-amber-700 text-amber-50" },
];

function WinnerEntry({
  rank,
  name,
  divisionName,
}: {
  rank: number;
  name: string | null;
  divisionName?: string | null;
}) {
  if (!name) return <span className="text-muted-foreground">—</span>;
  const badge = RANK_BADGES[rank - 1];
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          badge?.className ?? "bg-muted text-muted-foreground"
        )}
      >
        {rank}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{name}</p>
        {divisionName && (
          <p className="truncate text-xs text-muted-foreground">{divisionName}</p>
        )}
      </div>
    </div>
  );
}

export function ResultsExplorer({
  results,
  categories,
  divisions,
}: {
  results: ResultRow[];
  categories: { id: string; name: string }[];
  divisions: { id: string; name: string; code: string; slug: string }[];
}) {
  const [search, setSearch] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<string>("all");
  const [divisionId, setDivisionId] = React.useState<string>("all");
  const [prizeFilter, setPrizeFilter] = React.useState<"all" | "first" | "second" | "third">("all");
  const [view, setView] = React.useState<"poster" | "table">("table");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const categoryItems = React.useMemo(
    () => ({
      all: "All Categories",
      ...Object.fromEntries(categories.map((category) => [category.id, category.name])),
    }),
    [categories]
  );

  const divisionItems = React.useMemo(
    () => ({
      all: "All Divisions",
      ...Object.fromEntries(divisions.map((division) => [division.id, division.name])),
    }),
    [divisions]
  );

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    return results.filter((result) => {
      if (categoryId !== "all" && result.categoryId !== categoryId)
        return false;
      if (divisionId !== "all" && result.divisionId !== divisionId)
        return false;
      if (term && !result.item.name.toLowerCase().includes(term))
        return false;
      if (prizeFilter === "first" && !result.firstPlaceName) return false;
      if (prizeFilter === "second" && !result.secondPlaceName) return false;
      if (prizeFilter === "third" && !result.thirdPlaceName) return false;
      return true;
    });
  }, [results, search, categoryId, divisionId, prizeFilter]);

  const activeFilterCount =
    (search.trim() ? 1 : 0) +
    (categoryId !== "all" ? 1 : 0) +
    (divisionId !== "all" ? 1 : 0) +
    (prizeFilter !== "all" ? 1 : 0);

  const clearFilters = () => {
    setSearch("");
    setCategoryId("all");
    setDivisionId("all");
    setPrizeFilter("all");
  };

  React.useEffect(() => {
    setPage(1);
  }, [search, categoryId, divisionId, prizeFilter, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pageNumbers = React.useMemo(() => {
    const numbers: (number | "ellipsis")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        Math.abs(i - currentPage) <= 1
      ) {
        numbers.push(i);
      } else if (numbers[numbers.length - 1] !== "ellipsis") {
        numbers.push("ellipsis");
      }
    }
    return numbers;
  }, [totalPages, currentPage]);

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <SlidersHorizontal className="size-4" />
            </span>
            <h2 className="text-sm font-semibold">Filter Results</h2>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="rounded-full">
                {activeFilterCount} active
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1 rounded-lg border p-1">
            <Button
              variant={view === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("table")}
            >
              <List className="size-4" />
              Table
            </Button>
            <Button
              variant={view === "poster" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("poster")}
            >
              <LayoutGrid className="size-4" />
              Posters
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by item or result..."
              className="pl-9"
            />
          </div>

          <Select
            items={categoryItems}
            value={categoryId}
            onValueChange={(value) => setCategoryId(value ?? "all")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            items={divisionItems}
            value={divisionId}
            onValueChange={(value) => setDivisionId(value ?? "all")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Division" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Divisions</SelectItem>
              {divisions.map((division) => (
                <SelectItem key={division.id} value={division.id}>
                  {division.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={activeFilterCount === 0}
            className="justify-center"
          >
            <X className="size-4" />
            Clear
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t pt-3">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Quick Filters
          </span>
          <button
            type="button"
            onClick={() => setPrizeFilter("all")}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              prizeFilter === "all"
                ? "border-primary bg-primary/10 text-primary"
                : "hover:border-primary/40"
            )}
          >
            <Medal className="size-4" />
            All Results
          </button>
          {PRIZE_FILTERS.map((filter) => {
            const badge = RANK_BADGES[filter.rank - 1];
            const active = prizeFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setPrizeFilter(active ? "all" : filter.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "hover:border-primary/40"
                )}
              >
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full text-[10px] font-bold",
                    badge.className
                  )}
                >
                  {filter.rank}
                </span>
                {filter.label}
              </button>
            );
          })}
          <span className="ml-auto text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "result" : "results"} found
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          No results match your filters.
        </div>
      ) : view === "poster" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="w-64">Item / Category</TableHead>
                <TableHead className="w-96">Winners</TableHead>
                <TableHead className="hidden w-44 sm:table-cell">Published On</TableHead>
                <TableHead className="w-40 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((result, index) => {
                const { Icon, className } = getItemIcon(result.item.name);
                return (
                  <TableRow key={result.id} className="hover:bg-muted/40">
                    <TableCell className="text-sm text-muted-foreground">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-lg",
                            className
                          )}
                        >
                          <Icon className="size-5" />
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/results/${result.id}`}
                            className="font-semibold hover:text-primary"
                          >
                            {result.item.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {result.category.name} · {result.division.name} Division
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid grid-cols-3 gap-3">
                        <WinnerEntry rank={1} name={result.firstPlaceName} divisionName={result.division.name} />
                        <WinnerEntry
                          rank={2}
                          name={result.secondPlaceName}
                          divisionName={result.secondPlaceDivision?.name}
                        />
                        <WinnerEntry
                          rank={3}
                          name={result.thirdPlaceName}
                          divisionName={result.thirdPlaceDivision?.name}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                      {result.publishedDate
                        ? format(result.publishedDate, "dd MMM yyyy, hh:mm a")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" nativeButton={false} render={
                        <Link href={`/results/${result.id}`}>
                          <Eye className="size-4" />
                          View Poster
                        </Link>
                      } />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            {pageNumbers.map((n, i) =>
              n === "ellipsis" ? (
                <span key={`e-${i}`} className="px-1 text-muted-foreground">
                  …
                </span>
              ) : (
                <Button
                  key={n}
                  variant={n === currentPage ? "default" : "outline"}
                  size="icon"
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Select
              items={Object.fromEntries(PAGE_SIZE_OPTIONS.map((n) => [String(n), `${n} / page`]))}
              value={String(pageSize)}
              onValueChange={(value) => setPageSize(Number(value ?? 10))}
            >
              <SelectTrigger size="sm" className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
        <Info className="size-4 shrink-0 text-primary" />
        <div>
          <p className="font-semibold text-foreground">About Results</p>
          <p>Results will be published after verification. Top three winners will be displayed for each item.</p>
        </div>
      </div>
    </div>
  );
}

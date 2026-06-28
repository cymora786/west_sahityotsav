"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResultDialog } from "./result-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteResult, togglePublishResult } from "./actions";
import { Search, ExternalLink } from "lucide-react";

type ResultRow = {
  id: string;
  categoryId: string;
  itemId: string;
  divisionId: string;
  venue: string | null;
  firstPlaceName: string | null;
  secondPlaceName: string | null;
  secondPlaceDivisionId: string | null;
  thirdPlaceName: string | null;
  thirdPlaceDivisionId: string | null;
  templateId: string | null;
  status: "PUBLISHED" | "DRAFT";
  category: { name: string };
  item: { name: string };
  division: { name: string };
};

export function ResultsTable({
  results,
  divisions,
  categories,
  items,
  templates,
}: {
  results: ResultRow[];
  divisions: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  items: { id: string; name: string; categoryId: string }[];
  templates: { id: string; name: string }[];
}) {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return results;
    return results.filter(
      (r) =>
        r.item.name.toLowerCase().includes(q) ||
        r.category.name.toLowerCase().includes(q) ||
        r.division.name.toLowerCase().includes(q) ||
        (r.firstPlaceName ?? "").toLowerCase().includes(q)
    );
  }, [results, query]);

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search results..."
            className="pl-8"
          />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Winning Division</TableHead>
                <TableHead>1st Place</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.item.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {result.category.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{result.division.name}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {result.firstPlaceName ?? "—"}
                  </TableCell>
                  <TableCell>
                    <form action={togglePublishResult.bind(null, result.id)}>
                      <button type="submit">
                        <Badge
                          variant={result.status === "PUBLISHED" ? "default" : "outline"}
                          className="cursor-pointer"
                        >
                          {result.status}
                        </Badge>
                      </button>
                    </form>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {result.status === "PUBLISHED" && (
                        <Button variant="ghost" size="icon-sm" nativeButton={false} render={
                          <Link href={`/results/${result.id}`} target="_blank">
                            <ExternalLink className="size-4" />
                          </Link>
                        } />
                      )}
                      <ResultDialog
                        result={result}
                        divisions={divisions}
                        categories={categories}
                        items={items}
                        templates={templates}
                      />
                      <DeleteButton
                        action={deleteResult.bind(null, result.id)}
                        confirmMessage={`Delete result for ${result.item.name}?`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {results.length} results
        </p>
      </CardContent>
    </Card>
  );
}

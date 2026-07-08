import { getPublishedCompetitions } from "@/lib/sahityotsav-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Info } from "lucide-react";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const competitions = await getPublishedCompetitions();

  // Derive unique categories with counts
  const categoryMap = new Map<string, number>();
  for (const c of competitions ?? []) {
    categoryMap.set(c.category, (categoryMap.get(c.category) ?? 0) + 1);
  }
  const categories = Array.from(categoryMap.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Competition categories synced from the sahityotsav.com API.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          This data is loaded live from the external API. Changes must be made on{" "}
          <strong>sahityotsav.com</strong> and will reflect here automatically.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead className="text-right">Competitions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No categories found from API.
                  </TableCell>
                </TableRow>
              )}
              {categories.map(([name, count], i) => (
                <TableRow key={name}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{count}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

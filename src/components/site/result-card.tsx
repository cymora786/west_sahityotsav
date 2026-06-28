import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trophy } from "lucide-react";
import { format } from "date-fns";
import type { Category, Division, Item, Result } from "@/generated/prisma/client";

type ResultWithRelations = Result & {
  category: Category;
  item: Item;
  division: Division;
  secondPlaceDivision: Division | null;
  thirdPlaceDivision: Division | null;
};

export function ResultCard({ result }: { result: ResultWithRelations }) {
  return (
    <Card className="flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary">{result.category.name}</Badge>
          {result.publishedDate && (
            <span className="text-xs text-muted-foreground">
              {format(result.publishedDate, "dd MMM yyyy")}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold">{result.item.name}</h3>
        {result.venue && (
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" /> {result.venue}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex-1 space-y-1.5 text-sm">
        {result.firstPlaceName && (
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-yellow-500" />
            <span className="font-medium">{result.firstPlaceName}</span>
          </div>
        )}
        {result.secondPlaceName && (
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-slate-400" />
            <span className="font-medium">{result.secondPlaceName}</span>
          </div>
        )}
        {result.thirdPlaceName && (
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-amber-700" />
            <span className="font-medium">{result.thirdPlaceName}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1">
          <Badge variant="outline">{result.division.name}</Badge>
          {result.secondPlaceDivision && (
            <Badge variant="outline">{result.secondPlaceDivision.name}</Badge>
          )}
          {result.thirdPlaceDivision && (
            <Badge variant="outline">{result.thirdPlaceDivision.name}</Badge>
          )}
        </div>
        <Link
          href={`/results/${result.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View Poster
        </Link>
      </CardFooter>
    </Card>
  );
}

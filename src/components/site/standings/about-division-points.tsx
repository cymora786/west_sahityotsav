import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function AboutDivisionPoints({ lastUpdated }: { lastUpdated: Date | null }) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Info className="size-4 text-primary" />
          About Standings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          Each division earns points based on the results published for
          every item across all categories. 1st, 2nd, and 3rd place finishes
          contribute points towards a division&apos;s overall total.
        </p>
        <p>
          Standings update automatically whenever a result is published or a
          division&apos;s points are adjusted by the organizing team.
        </p>
        <p className="pt-1 text-xs font-medium text-foreground">
          Last Updated:{" "}
          {lastUpdated
            ? formatDistanceToNow(lastUpdated, { addSuffix: true })
            : "Not yet updated"}
        </p>
      </CardContent>
    </Card>
  );
}

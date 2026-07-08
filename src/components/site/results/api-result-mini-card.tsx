import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, User } from "lucide-react";
import type { ApiCompetition } from "@/lib/sahityotsav-api";

export function ApiResultMiniCard({ competition }: { competition: ApiCompetition }) {
  return (
    <Link href={`/results/${competition.id}`} className="group block">
      <Card className="h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <Badge variant="secondary">{competition.category}</Badge>
            <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {competition.type === "Group" ? (
                <Users className="size-3" />
              ) : (
                <User className="size-3" />
              )}
              {competition.type}
            </span>
          </div>
          <h3 className="mt-1 text-base font-semibold leading-tight group-hover:text-primary transition-colors">
            {competition.name}
          </h3>
        </CardHeader>
        <CardContent className="pt-0">
          <span className="flex items-center gap-1 text-xs font-medium text-primary">
            <Trophy className="size-3" />
            Result #{competition.resultNumber}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

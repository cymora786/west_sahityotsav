import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const POINTS = [
  { label: "1st Place", value: 10, className: "bg-amber-400 text-amber-950" },
  { label: "2nd Place", value: 7, className: "bg-slate-300 text-slate-800" },
  { label: "3rd Place", value: 5, className: "bg-amber-700 text-amber-50" },
  { label: "Participation", value: 2, className: "bg-emerald-500/15 text-emerald-700" },
];

export function PointsSystem() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="size-4 text-primary" />
          Points System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {POINTS.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
          >
            <span className="text-sm font-medium">{item.label}</span>
            <span
              className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${item.className}`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

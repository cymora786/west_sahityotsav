import { Card, CardContent } from "@/components/ui/card";
import { Building2, Layers, Trophy, Users, CalendarDays } from "lucide-react";
import { getPublishedCompetitions } from "@/lib/sahityotsav-api";
import { EVENT_STATS } from "@/lib/constants";

export async function Stats() {
  const competitions = await getPublishedCompetitions();
  const results = competitions?.length ?? 0;

  const stats = [
    {
      label: "Divisions",
      sublabel: "Participating",
      value: EVENT_STATS.divisions,
      icon: Building2,
      className: "bg-blue-500/15 text-blue-700",
    },
    {
      label: "Competitions",
      sublabel: "Events",
      value: `${EVENT_STATS.items}+`,
      icon: Layers,
      className: "bg-blue-500/15 text-blue-600",
    },
    {
      label: "Participants",
      sublabel: "Taking Part",
      value: `${EVENT_STATS.participants.toLocaleString()}+`,
      icon: Users,
      className: "bg-orange-500/15 text-orange-600",
    },
    {
      label: "Days",
      sublabel: "Of Celebration",
      value: EVENT_STATS.days,
      icon: CalendarDays,
      className: "bg-pink-500/15 text-pink-600",
    },
    {
      label: "Results",
      sublabel: "Published",
      value: results,
      icon: Trophy,
      className: "bg-purple-500/15 text-purple-600",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Card className="py-6">
        <CardContent className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="group flex items-center gap-3">
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 ${stat.className}`}
              >
                <stat.icon className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-tight">{stat.value}</p>
                <p className="text-sm font-medium leading-tight">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

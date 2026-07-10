import { getApiSchedule } from "@/lib/sahityotsav-api";
import { getGallery } from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, CheckCircle2, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Schedule",
  description:
    "Day-wise event schedule for SSF Malappuram West Sahityotsav 2026.",
};

const STATUS_CONFIG = {
  Completed: {
    icon: CheckCircle2,
    className: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  "In Progress": {
    icon: Loader2,
    className: "text-amber-500 animate-spin",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  },
  Upcoming: {
    icon: Circle,
    className: "text-muted-foreground",
    badge: "bg-muted text-muted-foreground",
  },
};

export default async function SchedulePage() {
  const [apiSchedule, [bannerImage]] = await Promise.all([
    getApiSchedule(),
    getGallery(1),
  ]);

  const scheduleEntries = apiSchedule?.schedule ?? [];

  // Group by date
  const grouped = scheduleEntries.reduce<Record<string, typeof scheduleEntries>>(
    (acc, entry) => {
      const key = entry.date;
      acc[key] = acc[key] ? [...acc[key], entry] : [entry];
      return acc;
    },
    {}
  );

  const days = Object.keys(grouped).sort();

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <>
      <PageBanner
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Schedule" }]}
        title="Event Schedule"
        description="Day-wise schedule of competitions, ceremonies and stage events."
        imageUrl={bannerImage?.imageUrl}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {days.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            <CalendarDays className="mx-auto mb-2 size-8" />
            Schedule will be published soon.
          </div>
        ) : (
          <div className="space-y-10">
            {days.map((day, dayIndex) => {
              const entries = grouped[day];
              return (
                <section key={day}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CalendarDays className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold">Day {dayIndex + 1}</h3>
                      <p className="text-sm text-muted-foreground">{formatDate(day)}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {entries.map((entry) => {
                      const statusCfg = STATUS_CONFIG[entry.status] ?? STATUS_CONFIG.Upcoming;
                      const StatusIcon = statusCfg.icon;
                      return (
                        <Card key={`${entry.competitionId}-${entry.startTime}`}>
                          <CardContent className="flex flex-wrap items-start justify-between gap-3 py-4">
                            <div className="flex items-start gap-3">
                              <StatusIcon className={cn("mt-0.5 size-4 shrink-0", statusCfg.className)} />
                              <div>
                                <div className="mb-1 flex flex-wrap items-center gap-2">
                                  <h4 className="font-semibold">{entry.competitionName}</h4>
                                  <Badge variant="secondary">{entry.category}</Badge>
                                  <Badge variant="outline">{entry.type}</Badge>
                                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", statusCfg.badge)}>
                                    {entry.status}
                                  </span>
                                </div>
                                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="size-3.5" /> {entry.stageName}
                                </p>
                              </div>
                            </div>
                            <span className="flex items-center gap-1 text-sm font-medium text-primary">
                              <Clock className="size-3.5" />
                              {entry.startTime}
                              {entry.endTime && ` – ${entry.endTime}`}
                            </span>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

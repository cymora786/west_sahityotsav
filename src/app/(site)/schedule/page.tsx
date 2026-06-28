import { getSchedules, getGallery } from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

export const metadata = {
  title: "Schedule",
  description:
    "Day-wise event schedule for SSF Malappuram West Sahityotsav 2026.",
};

export default async function SchedulePage() {
  const [schedules, [bannerImage]] = await Promise.all([
    getSchedules(),
    getGallery(1),
  ]);

  const grouped = schedules.reduce<Record<string, typeof schedules>>(
    (acc, schedule) => {
      const key = format(schedule.date, "yyyy-MM-dd");
      acc[key] = acc[key] ? [...acc[key], schedule] : [schedule];
      return acc;
    },
    {}
  );

  const days = Object.keys(grouped).sort();

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
          {days.map((day) => {
            const entries = grouped[day];
            return (
              <section key={day}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CalendarDays className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{entries[0].day}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(entries[0].date, "EEEE, dd MMMM yyyy")}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {entries.map((entry) => (
                    <Card key={entry.id}>
                      <CardContent className="flex flex-wrap items-start justify-between gap-3 py-4">
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <h4 className="font-semibold">{entry.title}</h4>
                            {entry.category && (
                              <Badge variant="secondary">
                                {entry.category.name}
                              </Badge>
                            )}
                          </div>
                          {entry.description && (
                            <p className="text-sm text-muted-foreground">
                              {entry.description}
                            </p>
                          )}
                          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="size-3.5" /> {entry.venue}
                          </p>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-medium text-primary">
                          <Clock className="size-3.5" /> {entry.time}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
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

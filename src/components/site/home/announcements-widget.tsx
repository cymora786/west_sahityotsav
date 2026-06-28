import Link from "next/link";
import { getAnnouncements } from "@/lib/queries";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Megaphone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const priorityStyles: Record<string, string> = {
  HIGH: "bg-destructive/10 text-destructive border-destructive/30",
  NORMAL: "bg-primary/10 text-primary border-primary/30",
  LOW: "bg-muted text-muted-foreground",
};

export async function AnnouncementsWidget() {
  const announcements = await getAnnouncements(5);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Stay Updated"
          title="Announcements"
          description="Latest updates and priority notices."
          className="mb-0"
        />
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <Link href="/announcements">
              All Announcements <ArrowRight className="size-4" />
            </Link>
          }
        />
      </div>

      {announcements.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <Megaphone className="mx-auto mb-2 size-8" />
          No announcements yet.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="flex flex-wrap items-start justify-between gap-3 py-4">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(priorityStyles[announcement.priority])}
                    >
                      {announcement.priority}
                    </Badge>
                    <h3 className="font-semibold">{announcement.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {announcement.description}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDistanceToNow(announcement.createdAt, {
                    addSuffix: true,
                  })}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

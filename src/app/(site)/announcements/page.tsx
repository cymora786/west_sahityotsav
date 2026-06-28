import { getAnnouncements, getGallery } from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Announcements",
  description:
    "Latest announcements and priority notices for SSF Malappuram West Sahityotsav 2026.",
};

const priorityStyles: Record<string, string> = {
  HIGH: "bg-destructive/10 text-destructive border-destructive/30",
  NORMAL: "bg-primary/10 text-primary border-primary/30",
  LOW: "bg-muted text-muted-foreground",
};

export default async function AnnouncementsPage() {
  const [announcements, [bannerImage]] = await Promise.all([
    getAnnouncements(),
    getGallery(1),
  ]);

  return (
    <>
      <PageBanner
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Announcements" }]}
        title="Announcements"
        description="Latest updates and priority notices for the event."
        imageUrl={bannerImage?.imageUrl}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {announcements.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <Megaphone className="mx-auto mb-2 size-8" />
          No announcements yet.
        </div>
      ) : (
        <div className="space-y-3">
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
                  {format(announcement.createdAt, "dd MMM yyyy")}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </>
  );
}

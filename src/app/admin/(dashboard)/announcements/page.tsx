import { getAnnouncements } from "@/lib/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnnouncementDialog } from "./announcement-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteAnnouncement } from "./actions";

export const metadata = {
  title: "Announcements",
};

const PRIORITY_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  HIGH: "default",
  NORMAL: "secondary",
  LOW: "outline",
};

export default async function AdminAnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
          <p className="text-sm text-muted-foreground">
            Manage announcements shown on the public site.
          </p>
        </div>
        <AnnouncementDialog />
      </div>

      {announcements.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          No announcements yet. Add your first announcement to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="flex items-start justify-between gap-4 p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{announcement.title}</h3>
                    <Badge variant={PRIORITY_VARIANT[announcement.priority]}>
                      {announcement.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {announcement.description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <AnnouncementDialog
                    announcement={{
                      id: announcement.id,
                      title: announcement.title,
                      description: announcement.description,
                      imageUrl: announcement.imageUrl ?? undefined,
                      priority: announcement.priority,
                    }}
                  />
                  <DeleteButton
                    action={deleteAnnouncement.bind(null, announcement.id)}
                    confirmMessage={`Delete announcement "${announcement.title}"?`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

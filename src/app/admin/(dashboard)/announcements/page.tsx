import Link from "next/link";
import { getAnnouncements } from "@/lib/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteAnnouncement } from "./actions";
import { Plus, Pencil, CalendarDays, FileText } from "lucide-react";
import { format } from "date-fns";

export const metadata = { title: "News" };

const PRIORITY_STYLES: Record<string, string> = {
  HIGH: "bg-destructive/10 text-destructive border-destructive/30",
  NORMAL: "bg-primary/10 text-primary border-primary/30",
  LOW: "bg-muted text-muted-foreground",
};

export default async function AdminAnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">News</h1>
          <p className="text-sm text-muted-foreground">
            Manage news articles shown on the public site.
          </p>
        </div>
        <Button size="sm" nativeButton={false} render={<Link href="/admin/announcements/new"><Plus className="size-4" />Add Article</Link>} />
      </div>

      {announcements.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <FileText className="mx-auto mb-2 size-8" />
          No articles yet. Add your first news article.
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold leading-tight">{item.title}</h3>
                    <Badge variant="outline" className={PRIORITY_STYLES[item.priority]}>
                      {item.priority}
                    </Badge>
                    {item.body && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <FileText className="size-3" /> Full article
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="size-3" />
                    {format(item.createdAt, "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    nativeButton={false}
                    render={<Link href={`/admin/announcements/${item.id}/edit`}><Pencil className="size-4" /></Link>}
                  />
                  <DeleteButton
                    action={deleteAnnouncement.bind(null, item.id)}
                    confirmMessage={`Delete "${item.title}"?`}
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

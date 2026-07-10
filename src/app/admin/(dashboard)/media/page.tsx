import { getMedia } from "@/lib/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MediaDialog } from "./media-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteMedia } from "./actions";
import { PlayCircle } from "lucide-react";

export const metadata = { title: "Media (YouTube)" };

export default async function AdminMediaPage() {
  const videos = await getMedia();

  const byYear = videos.reduce<Record<number, typeof videos>>((acc, v) => {
    (acc[v.year] ??= []).push(v);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media (YouTube)</h1>
          <p className="text-sm text-muted-foreground">
            Manage YouTube videos shown on the public site, grouped by year.
          </p>
        </div>
        <MediaDialog />
      </div>

      {videos.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <PlayCircle className="mx-auto mb-2 size-8" />
          No videos yet. Add your first YouTube video.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(byYear)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([year, yearVideos]) => (
              <div key={year}>
                <h2 className="mb-3 text-lg font-bold">{year}</h2>
                <div className="space-y-3">
                  {yearVideos.map((video) => (
                    <Card key={video.id}>
                      <CardContent className="flex items-start gap-4 p-4">
                        <img
                          src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                          alt={video.title}
                          className="h-16 w-28 rounded-md object-cover"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{video.title}</h3>
                            <Badge variant="outline">{video.year}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">ID: {video.videoId}</p>
                          {video.description && (
                            <p className="text-sm text-muted-foreground">{video.description}</p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <MediaDialog media={{ ...video, description: video.description ?? undefined }} />
                          <DeleteButton
                            action={deleteMedia.bind(null, video.id)}
                            confirmMessage={`Delete "${video.title}"?`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

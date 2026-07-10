import Link from "next/link";
import { getMedia } from "@/lib/queries";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";

export async function MediaWidget({ inline }: { inline?: boolean } = {}) {
  const videos = await getMedia(inline ? 6 : 6);

  return (
    <section className={inline ? "" : "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Watch & Relive"
          title="Media"
          description="Highlights and memories from our events."
          className="mb-0"
        />
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/media">All Videos <ArrowRight className="size-4" /></Link>}
        />
      </div>

      {videos.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <PlayCircle className="mx-auto mb-2 size-8" />
          No videos yet.
        </div>
      ) : (
        <div className={`mt-6 grid gap-5 ${inline ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}>
          {videos.map((video) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex size-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
                    <PlayCircle className="size-6" />
                  </span>
                </div>
                <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
                  {video.year}
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold leading-snug group-hover:text-primary line-clamp-2">{video.title}</h3>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

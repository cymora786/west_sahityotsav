export const revalidate = 60;

import { getMediaByYear, getGallery } from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { PlayCircle } from "lucide-react";

export const metadata = {
  title: "Media",
  description: "Watch SSF Malappuram West Sahityotsav videos on YouTube, year by year.",
};

export default async function MediaPage() {
  const [yearGroups, [bannerImage]] = await Promise.all([
    getMediaByYear(),
    getGallery(1),
  ]);

  return (
    <>
      <PageBanner
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Media" }]}
        title="Media"
        description="Watch Sahityotsav videos year by year."
        imageUrl={bannerImage?.imageUrl}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        {yearGroups.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            <PlayCircle className="mx-auto mb-2 size-8" />
            No videos yet.
          </div>
        ) : (
          yearGroups.map(({ year, videos }) => (
            <section key={year}>
              <h2 className="mb-6 text-2xl font-extrabold tracking-tight">{year}</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                        <span className="flex size-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
                          <PlayCircle className="size-7" />
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold leading-snug group-hover:text-primary">{video.title}</h3>
                      {video.description && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
}

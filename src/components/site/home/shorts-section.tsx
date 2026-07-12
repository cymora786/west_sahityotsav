import { getYouTubeShorts } from "@/lib/sahityotsav-api";
import { Play } from "lucide-react";

export async function ShortsSection() {
  const shorts = await getYouTubeShorts(8);
  if (shorts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Latest Shorts</h2>
          <p className="text-sm text-muted-foreground">From our YouTube channel</p>
        </div>
        <a
          href="https://www.youtube.com/@SSFMlpmWestMedia/shorts"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <svg viewBox="0 0 24 24" className="size-4 fill-white" aria-hidden><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.8 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
          View All Shorts
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {shorts.map(({ id }) => (
          <a
            key={id}
            href={`https://www.youtube.com/shorts/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-xl border bg-muted"
            style={{ aspectRatio: "9/16" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.youtube.com/vi/${id}/0.jpg`}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex size-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
                <Play className="size-5 fill-white" />
              </span>
            </div>
            <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">#Shorts</span>
          </a>
        ))}
      </div>
    </section>
  );
}

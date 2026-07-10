import { Hero } from "@/components/site/home/hero";
import { LiveStandings } from "@/components/site/home/live-standings";
import { CategoryLeaders } from "@/components/site/home/category-leaders";
import { LatestResultsCompact } from "@/components/site/home/latest-results-compact";
import { QuickLinksGrid } from "@/components/site/home/quick-links-grid";
import { GalleryPreview } from "@/components/site/home/gallery-preview";
import { NewsWidget } from "@/components/site/home/news-widget";
import { MediaWidget } from "@/components/site/home/media-widget";
import { Reveal } from "@/components/site/reveal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 sm:grid-cols-1 lg:grid-cols-12 lg:px-8">
        <Reveal className="lg:col-span-5">
          <LiveStandings />
        </Reveal>
        <Reveal className="lg:col-span-7" delay={100}>
          <CategoryLeaders />
        </Reveal>
      </section>
      <section className="relative isolate overflow-hidden py-14">
        {/* Background */}
        <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(135deg, #2e6ab1 0%, #1d4e8f 60%, #163b70 100%)" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bg-pattern.svg" alt="" aria-hidden className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-30 select-none" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#2e6ab1]/70 via-transparent to-[#163b70]/50" />
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <Reveal>
            <LatestResultsCompact />
          </Reveal>
          <Reveal delay={100}>
            <QuickLinksGrid />
          </Reveal>
          <Reveal delay={200}>
            <MediaCompact />
          </Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <GalleryPreview inline />
          </Reveal>
          <Reveal delay={100}>
            <NewsWidget inline />
          </Reveal>
        </div>
      </section>
    </>
  );
}

// Inline media widget styled to match the glass panels
async function MediaCompact() {
  const { getMedia } = await import("@/lib/queries");
  const videos = await getMedia(4);

  return (
    <div className="h-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-base font-bold text-white">Media</h3>
        <a
          href="/media"
          className="inline-flex items-center gap-1 text-xs font-medium text-white/70 hover:text-white transition-colors"
        >
          All Videos →
        </a>
      </div>
      <div className="px-5 pb-5">
        {videos.length === 0 ? (
          <p className="py-10 text-center text-sm text-white/60">No videos yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {videos.map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all hover:bg-white/15"
              >
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full object-cover aspect-video"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="flex size-8 items-center justify-center rounded-full bg-red-600 text-white">
                      ▶
                    </span>
                  </div>
                </div>
                <p className="p-2 text-[11px] font-medium text-white/80 line-clamp-1">{video.title}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

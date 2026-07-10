import { Hero } from "@/components/site/home/hero";
import { LiveStandings } from "@/components/site/home/live-standings";
import { CategoryLeaders } from "@/components/site/home/category-leaders";
import { ProgrammeProgress } from "@/components/site/home/programme-progress";
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
            <ProgrammeProgress />
          </Reveal>
          <Reveal delay={100}>
            <LatestResultsCompact />
          </Reveal>
          <Reveal delay={200}>
            <QuickLinksGrid />
          </Reveal>
        </div>
      </section>
      <Reveal>
        <GalleryPreview />
      </Reveal>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12">
          <Reveal>
            <MediaWidget inline />
          </Reveal>
          <Reveal delay={100}>
            <NewsWidget inline />
          </Reveal>
        </div>
      </section>
    </>
  );
}

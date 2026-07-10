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
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8">
        <Reveal className="lg:col-span-5">
          <LiveStandings />
        </Reveal>
        <Reveal className="lg:col-span-7" delay={100}>
          <CategoryLeaders />
        </Reveal>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <Reveal>
          <ProgrammeProgress />
        </Reveal>
        <Reveal delay={100}>
          <LatestResultsCompact />
        </Reveal>
        <Reveal delay={200}>
          <QuickLinksGrid />
        </Reveal>
      </section>
      <Reveal>
        <GalleryPreview />
      </Reveal>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6">
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

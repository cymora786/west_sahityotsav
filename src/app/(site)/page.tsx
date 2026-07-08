import { Hero } from "@/components/site/home/hero";
import { Stats } from "@/components/site/home/stats";
import { LiveStandings } from "@/components/site/home/live-standings";
import { CategoryLeaders } from "@/components/site/home/category-leaders";
import { ProgrammeProgress } from "@/components/site/home/programme-progress";
import { LatestResultsCompact } from "@/components/site/home/latest-results-compact";
import { QuickLinksGrid } from "@/components/site/home/quick-links-grid";
import { GalleryPreview } from "@/components/site/home/gallery-preview";
import { AnnouncementsWidget } from "@/components/site/home/announcements-widget";
import { Reveal } from "@/components/site/reveal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Reveal>
        <Stats />
      </Reveal>
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
      <Reveal>
        <AnnouncementsWidget />
      </Reveal>
    </>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import { ImageIcon, ChevronLeft, ChevronRight, X, CalendarDays } from "lucide-react";

type GalleryCategory = {
  id: string;
  name: string;
  slug: string;
};

type GalleryImage = {
  id: string;
  imageUrl: string;
  caption: string | null;
  categoryId: string;
};

const CURRENT_YEAR = 2026;

function parseYear(categoryName: string): number {
  const match = categoryName.match(/^(\d{4})\s*[-–]/);
  return match ? parseInt(match[1]) : CURRENT_YEAR;
}

function categoryDisplayName(name: string): string {
  return name.replace(/^\d{4}\s*[-–]\s*/, "");
}

export function GalleryExplorer({
  images,
  categories,
}: {
  images: GalleryImage[];
  categories: GalleryCategory[];
}) {
  const [activeYear, setActiveYear] = React.useState<number>(CURRENT_YEAR);
  const [activeCategoryId, setActiveCategoryId] = React.useState<string | null>(null);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  // Group categories by year, sorted descending (2026 first)
  const yearMap = new Map<number, GalleryCategory[]>();
  for (const cat of categories) {
    const yr = parseYear(cat.name);
    if (!yearMap.has(yr)) yearMap.set(yr, []);
    yearMap.get(yr)!.push(cat);
  }
  const years = Array.from(yearMap.keys()).sort((a, b) => b - a);

  // Default year on mount
  React.useEffect(() => {
    if (years.length > 0) setActiveYear(years[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const yearCategories = yearMap.get(activeYear) ?? [];

  const filtered = images.filter((img) => {
    const cat = categories.find((c) => c.id === img.categoryId);
    if (!cat) return false;
    if (parseYear(cat.name) !== activeYear) return false;
    if (activeCategoryId && img.categoryId !== activeCategoryId) return false;
    return true;
  });

  const closeLightbox = React.useCallback(() => setActiveIndex(null), []);
  const showPrev = React.useCallback(() => {
    setActiveIndex((c) => (c === null ? null : (c - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);
  const showNext = React.useCallback(() => {
    setActiveIndex((c) => (c === null ? null : (c + 1) % filtered.length));
  }, [filtered.length]);

  React.useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, closeLightbox, showPrev, showNext]);

  const activeImage = activeIndex !== null ? filtered[activeIndex] : null;

  return (
    <>
      {/* Year tabs */}
      <div className="mb-6 flex items-center gap-2 border-b pb-4">
        <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
        <div className="flex flex-wrap gap-2">
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => {
                setActiveYear(yr);
                setActiveCategoryId(null);
                setActiveIndex(null);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                activeYear === yr
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {yr === CURRENT_YEAR ? `Sahityotsav ${yr}` : `${yr}`}
            </button>
          ))}
          {years.length === 0 && (
            <span className="text-sm text-muted-foreground">No photos yet.</span>
          )}
        </div>
      </div>

      {/* Category filter chips for active year */}
      {yearCategories.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => { setActiveCategoryId(null); setActiveIndex(null); }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeCategoryId === null
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            All
          </button>
          {yearCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategoryId(cat.id === activeCategoryId ? null : cat.id); setActiveIndex(null); }}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeCategoryId === cat.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {categoryDisplayName(cat.name)}
            </button>
          ))}
        </div>
      )}

      {/* Image grid */}
      <div>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            <ImageIcon className="mx-auto mb-2 size-8" />
            {years.length === 0
              ? "No photos have been added yet."
              : `No photos in ${activeYear} yet.`}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((image, index) => (
              <figure
                key={image.id}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-muted"
                onClick={() => setActiveIndex(index)}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.caption ?? "Event photo"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {image.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          {filtered.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); showPrev(); }}
                className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); showNext(); }}
                className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}

          <div
            className="relative flex max-h-full max-w-4xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              key={activeImage.id}
              className="relative h-[80vh] w-[90vw] max-w-5xl animate-in fade-in zoom-in-95 duration-300"
            >
              <Image
                src={activeImage.imageUrl}
                alt={activeImage.caption ?? "Event photo"}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            {activeImage.caption && (
              <p className="mt-3 text-center text-sm text-white/90 animate-in fade-in duration-300">
                {activeImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

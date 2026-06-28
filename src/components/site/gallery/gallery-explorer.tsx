"use client";

import * as React from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ImageIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

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

export function GalleryExplorer({
  images,
  categories,
}: {
  images: GalleryImage[];
  categories: GalleryCategory[];
}) {
  const [tab, setTab] = React.useState("all");
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const filtered =
    tab === "all" ? images : images.filter((image) => image.categoryId === tab);

  const closeLightbox = React.useCallback(() => setActiveIndex(null), []);

  const showPrev = React.useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + filtered.length) % filtered.length
    );
  }, [filtered.length]);

  const showNext = React.useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % filtered.length
    );
  }, [filtered.length]);

  React.useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, closeLightbox, showPrev, showNext]);

  const activeImage = activeIndex !== null ? filtered[activeIndex] : null;

  return (
    <>
      <Tabs
        value={tab}
        onValueChange={(value) => {
          setTab(value as string);
          setActiveIndex(null);
        }}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

      </Tabs>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            <ImageIcon className="mx-auto mb-2 size-8" />
            No photos in this category yet.
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

      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          {filtered.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrev();
                }}
                className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}

          <div
            className="relative flex max-h-full max-w-4xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
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
              <p
                key={`${activeImage.id}-caption`}
                className="mt-3 text-center text-sm text-white/90 animate-in fade-in duration-300"
              >
                {activeImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

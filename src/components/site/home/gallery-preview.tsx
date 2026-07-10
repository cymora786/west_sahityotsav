import Link from "next/link";
import Image from "next/image";
import { getGallery } from "@/lib/queries";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { ArrowRight, ImageIcon } from "lucide-react";

export async function GalleryPreview({ inline }: { inline?: boolean } = {}) {
  const images = await getGallery(6);

  return (
    <section className={inline ? "" : "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeading
          eyebrow="Moments"
          title="Event Gallery"
          description="Highlights from inauguration, competitions, and ceremonies."
          className="mb-0"
        />
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <Link href="/gallery">
              View Gallery <ArrowRight className="size-4" />
            </Link>
          }
        />
      </div>

      {images.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <ImageIcon className="mx-auto mb-2 size-8" />
          Photos will appear here once uploaded.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-3 gap-3">
          {images.map((image) => (
            <Link
              key={image.id}
              href="/gallery"
              className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
            >
              <Image
                src={image.imageUrl}
                alt={image.caption ?? "Event photo"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

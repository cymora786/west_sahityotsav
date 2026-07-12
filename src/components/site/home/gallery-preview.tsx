import Link from "next/link";
import Image from "next/image";
import { getGallery } from "@/lib/queries";
import { ArrowRight, ImageIcon, Images } from "lucide-react";

export async function GalleryPreview({ inline }: { inline?: boolean } = {}) {
  const images = await getGallery(7);

  return (
    <div className={inline ? "" : "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"}>
      {/* Header */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Moments</p>
          <h2 className="text-2xl font-bold tracking-tight">Event Gallery</h2>
          <p className="mt-1 text-sm text-muted-foreground">Highlights from inauguration, competitions &amp; ceremonies.</p>
        </div>
        <Link
          href="/gallery"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          View All <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {images.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <ImageIcon className="mx-auto mb-2 size-8" />
          Photos will appear here once uploaded.
        </div>
      ) : (
        <div className="grid grid-cols-4 grid-rows-3 gap-2 overflow-hidden rounded-2xl" style={{ height: 340 }}>
          {/* Featured large image */}
          <Link href="/gallery" className="group relative col-span-2 row-span-3 overflow-hidden bg-muted">
            <Image
              src={images[0].imageUrl}
              alt={images[0].caption ?? "Event photo"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          {/* Right side: 4 smaller images */}
          {images.slice(1, 5).map((image) => (
            <Link
              key={image.id}
              href="/gallery"
              className="group relative overflow-hidden bg-muted"
            >
              <Image
                src={image.imageUrl}
                alt={image.caption ?? "Event photo"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          ))}
          {/* Last cell with overlay showing more */}
          {images.length > 5 && (
            <Link href="/gallery" className="group relative overflow-hidden bg-muted">
              <Image
                src={images[5].imageUrl}
                alt=""
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-colors group-hover:bg-black/60">
                <div className="text-center text-white">
                  <Images className="mx-auto mb-1 size-5" />
                  <span className="text-xs font-bold">View All</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

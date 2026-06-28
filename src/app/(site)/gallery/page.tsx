import { getGallery, getGalleryCategories } from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { GalleryExplorer } from "@/components/site/gallery/gallery-explorer";

export const metadata = {
  title: "Gallery",
  description:
    "Photo gallery from SSF Malappuram West Sahityotsav 2026 — inauguration, competitions, stage events and more.",
};

export default async function GalleryPage() {
  const [images, categories] = await Promise.all([
    getGallery(),
    getGalleryCategories(),
  ]);

  return (
    <>
      <PageBanner
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
        title="Event Gallery"
        description="Highlights from inauguration, competitions, stage events, awards and the closing ceremony."
        imageUrl={images[0]?.imageUrl}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <GalleryExplorer
          images={images.map((image) => ({
            id: image.id,
            imageUrl: image.imageUrl,
            caption: image.caption,
            categoryId: image.categoryId,
          }))}
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
          }))}
        />
      </div>
    </>
  );
}

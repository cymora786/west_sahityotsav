import Image from "next/image";
import { getGallery, getGalleryCategories } from "@/lib/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GalleryDialog } from "./gallery-dialog";
import { CategoryDialog } from "./category-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteGalleryImage, deleteGalleryCategory } from "./actions";

export const metadata = {
  title: "Gallery",
};

export default async function AdminGalleryPage() {
  const [images, categories] = await Promise.all([
    getGallery(),
    getGalleryCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gallery</h1>
          <p className="text-sm text-muted-foreground">
            Manage event photos shown in the public gallery.
          </p>
        </div>
        <GalleryDialog categories={categories} />
      </div>

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Categories</h2>
            <CategoryDialog />
          </div>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No categories yet. Add one to start organizing photos.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-1 rounded-full border bg-muted/40 pl-3 pr-1"
                >
                  <span className="text-sm font-medium">{category.name}</span>
                  <CategoryDialog category={category} />
                  <DeleteButton
                    action={deleteGalleryCategory.bind(null, category.id)}
                    confirmMessage={`Delete category "${category.name}"? This will also delete all photos in it.`}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {images.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          No images yet. Add your first photo to get started.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image) => (
            <Card key={image.id}>
              <CardContent className="space-y-3 p-3">
                <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={image.imageUrl}
                    alt={image.caption ?? "Gallery image"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <Badge variant="secondary" className="mb-1">
                      {image.category.name}
                    </Badge>
                    <p className="truncate text-sm text-muted-foreground">
                      {image.caption ?? "—"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <GalleryDialog
                      image={{
                        id: image.id,
                        imageUrl: image.imageUrl,
                        caption: image.caption,
                        categoryId: image.categoryId,
                      }}
                      categories={categories}
                    />
                    <DeleteButton
                      action={deleteGalleryImage.bind(null, image.id)}
                      confirmMessage="Delete this image?"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

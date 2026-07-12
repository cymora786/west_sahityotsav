export const revalidate = 60;

import { getCategories, getItems, getGallery } from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export const metadata = {
  title: "Categories",
  description:
    "Explore all competition categories for SSF Malappuram West Sahityotsav 2026.",
};

export default async function CategoriesPage() {
  const [categories, items, [bannerImage]] = await Promise.all([
    getCategories(),
    getItems(),
    getGallery(1),
  ]);

  return (
    <>
      <PageBanner
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Categories" }]}
        title="Categories"
        description="Senior, Higher Secondary, High School, Junior and Primary divisions of competition."
        imageUrl={bannerImage?.imageUrl}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

      <div className="space-y-10">
        {categories.map((category) => {
          const categoryItems = items.filter(
            (item) => item.categoryId === category.id && item.status === "PUBLISHED"
          );

          return (
            <section key={category.id} id={category.slug} className="scroll-mt-24">
              <Card>
                <CardContent className="py-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <BookOpen className="size-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                        {category.description && (
                          <p className="text-sm text-muted-foreground">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {category._count.items} items
                      </Badge>
                      <Badge variant="outline">
                        {category._count.results} results published
                      </Badge>
                    </div>
                  </div>

                  {categoryItems.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {categoryItems.map((item) => (
                        <Badge key={item.id} variant="outline">
                          {item.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          );
        })}
      </div>
      </div>
    </>
  );
}

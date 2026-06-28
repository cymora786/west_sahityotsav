import { getCategories, getItems, getGallery } from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { ItemsExplorer } from "@/components/site/items/items-explorer";

export const metadata = {
  title: "Items",
  description:
    "Browse all competition items for SSF Malappuram West Sahityotsav 2026.",
};

export default async function ItemsPage() {
  const [items, categories, [bannerImage]] = await Promise.all([
    getItems(),
    getCategories(),
    getGallery(1),
  ]);

  const published = items.filter((item) => item.status === "PUBLISHED");

  return (
    <>
      <PageBanner
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Items" }]}
        title="Competition Items"
        description="All competition items across categories."
        imageUrl={bannerImage?.imageUrl}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ItemsExplorer
          items={published.map((item) => ({
            id: item.id,
            name: item.name,
            venue: item.venue,
            categoryId: item.categoryId,
            categoryName: item.category.name,
          }))}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        />
      </div>
    </>
  );
}

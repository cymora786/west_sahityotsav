import Image from "next/image";
import Link from "next/link";
import { getAnnouncements, getGallery } from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { Badge } from "@/components/ui/badge";
import { Newspaper } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "News",
  description: "Latest news and priority notices for SSF Malappuram West Sahityotsav 2026.",
};

const priorityStyles: Record<string, string> = {
  HIGH: "bg-destructive/10 text-destructive border-destructive/30",
  NORMAL: "bg-primary/10 text-primary border-primary/30",
  LOW: "bg-muted text-muted-foreground",
};

export default async function NewsPage() {
  const [announcements, [bannerImage]] = await Promise.all([
    getAnnouncements(),
    getGallery(1),
  ]);

  return (
    <>
      <PageBanner
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "News" }]}
        title="News"
        description="Latest updates and priority notices for the event."
        imageUrl={bannerImage?.imageUrl}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {announcements.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            <Newspaper className="mx-auto mb-2 size-8" />
            No news yet.
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md block">
                {item.imageUrl ? (
                  <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Newspaper className="size-8" />
                  </div>
                )}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className={cn(priorityStyles[item.priority])}>
                        {item.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(item.createdAt, "dd MMM yyyy")}
                      </span>
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

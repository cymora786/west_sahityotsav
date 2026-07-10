import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAnnouncementById, getAnnouncements } from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const priorityStyles: Record<string, string> = {
  HIGH: "bg-destructive/10 text-destructive border-destructive/30",
  NORMAL: "bg-primary/10 text-primary border-primary/30",
  LOW: "bg-muted text-muted-foreground",
};

const priorityLabel: Record<string, string> = {
  HIGH: "High Priority",
  NORMAL: "General",
  LOW: "Low Priority",
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getAnnouncementById(id);
  if (!item) return { title: "News Not Found" };
  return {
    title: item.title,
    description: item.description.slice(0, 160),
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, related] = await Promise.all([
    getAnnouncementById(id),
    getAnnouncements(4),
  ]);

  if (!item) notFound();

  const others = related.filter((r) => r.id !== item.id).slice(0, 3);

  return (
    <>
      <PageBanner
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
          { label: item.title },
        ]}
        title={item.title}
        imageUrl={item.imageUrl}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/news"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to News
        </Link>

        {/* Article card */}
        <article className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          {/* Cover image */}
          {item.imageUrl ? (
            <div className="relative h-64 w-full sm:h-80 lg:h-96">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <Newspaper className="size-16 text-primary/30" />
            </div>
          )}

          <div className="p-6 sm:p-10">
            {/* Meta */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge variant="outline" className={cn("text-sm px-3 py-1", priorityStyles[item.priority])}>
                {priorityLabel[item.priority]}
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="size-4" />
                {format(item.createdAt, "EEEE, dd MMMM yyyy")}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {item.title}
            </h1>

            {/* Body */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {item.description.split("\n").map((para, i) =>
                para.trim() ? <p key={i}>{para}</p> : <br key={i} />
              )}
            </div>
          </div>
        </article>

        {/* Related news */}
        {others.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-xl font-bold tracking-tight">More News</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {others.map((other) => (
                <Link
                  key={other.id}
                  href={`/news/${other.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  {other.imageUrl ? (
                    <div className="relative h-32 w-full overflow-hidden">
                      <Image src={other.imageUrl} alt={other.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="flex h-32 items-center justify-center bg-primary/5">
                      <Newspaper className="size-8 text-primary/30" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-4">
                    <Badge variant="outline" className={cn("mb-2 w-fit text-xs", priorityStyles[other.priority])}>
                      {other.priority}
                    </Badge>
                    <h3 className="text-sm font-semibold leading-snug group-hover:text-primary line-clamp-2">
                      {other.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {format(other.createdAt, "dd MMM yyyy")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

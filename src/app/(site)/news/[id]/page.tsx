export const revalidate = 60;

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAnnouncementById, getAnnouncements } from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, Newspaper, Clock } from "lucide-react";
import { ShareButton } from "@/components/site/news/share-button";
import { format, formatDistanceToNow } from "date-fns";
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
  const content = item.body || item.description;

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

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/news"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to News
        </Link>

        <article className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          {/* Cover image */}
          {item.imageUrl ? (
            <div className="relative h-64 w-full sm:h-80 lg:h-[420px]">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            </div>
          ) : (
            <div className="flex h-36 items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <Newspaper className="size-14 text-primary/20" />
            </div>
          )}

          <div className="p-6 sm:p-10">
            {/* Meta row */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <div className="flex flex-wrap items-center gap-3">
                {item.priority !== "NORMAL" && (
                  <Badge variant="outline" className={cn("px-3 py-1 text-xs font-semibold", priorityStyles[item.priority])}>
                    {priorityLabel[item.priority]}
                  </Badge>
                )}
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  {format(item.createdAt, "EEEE, dd MMMM yyyy")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                </span>
              </div>
              <ShareButton title={item.title} text={item.description} />
            </div>

            {/* Title */}
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              {item.title}
            </h1>

            {/* Short description as lead paragraph */}
            {item.body && (
              <p className="mb-8 text-lg font-medium leading-relaxed text-muted-foreground border-l-4 border-primary/30 pl-4">
                {item.description}
              </p>
            )}

            {/* Full body */}
            {/<[a-z][\s\S]*>/i.test(content) ? (
              <div
                className="prose prose-base dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="prose prose-base dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary">
                {content.split("\n").map((para, i) =>
                  para.trim() ? (
                    <p key={i} className="mb-4 leading-relaxed text-foreground/90">
                      {para}
                    </p>
                  ) : (
                    <div key={i} className="h-2" />
                  )
                )}
              </div>
            )}
          </div>
        </article>

        {/* Related news */}
        {others.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-5 text-xl font-bold tracking-tight">More News</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {others.map((other) => (
                <Link
                  key={other.id}
                  href={`/news/${other.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  {other.imageUrl ? (
                    <div className="relative h-32 w-full overflow-hidden">
                      <Image
                        src={other.imageUrl}
                        alt={other.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
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
                    <p className="mt-auto pt-2 text-xs text-muted-foreground">
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

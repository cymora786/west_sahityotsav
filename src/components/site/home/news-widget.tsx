import Link from "next/link";
import Image from "next/image";
import { getAnnouncements } from "@/lib/queries";
import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Newspaper } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const priorityStyles: Record<string, string> = {
  HIGH: "bg-destructive/10 text-destructive border-destructive/30",
  NORMAL: "bg-primary/10 text-primary border-primary/30",
  LOW: "bg-muted text-muted-foreground",
};

export async function NewsWidget({ inline }: { inline?: boolean } = {}) {
  const items = await getAnnouncements(5);

  return (
    <section className={inline ? "" : "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Stay Updated"
          title="News"
          description="Latest updates and priority notices."
          className="mb-0"
        />
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/news">All News <ArrowRight className="size-4" /></Link>}
        />
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <Newspaper className="mx-auto mb-2 size-8" />
          No news yet.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="group flex items-start gap-3 rounded-xl border bg-card p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              {item.imageUrl ? (
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Newspaper className="size-6" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={cn("text-xs", priorityStyles[item.priority])}>
                    {item.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

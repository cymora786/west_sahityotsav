import Link from "next/link";
import Image from "next/image";
import { getAnnouncements } from "@/lib/queries";
import { ArrowRight, Newspaper } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export async function NewsWidget({ inline }: { inline?: boolean } = {}) {
  const items = await getAnnouncements(4);

  return (
    <div className={inline ? "" : "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"}>
      {/* Header */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Stay Updated</p>
          <h2 className="text-2xl font-bold tracking-tight">News</h2>
          <p className="mt-1 text-sm text-muted-foreground">Latest updates and priority notices.</p>
        </div>
        <Link
          href="/news"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          All News <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <Newspaper className="mx-auto mb-2 size-8" />
          No news yet.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Featured first item */}
          <Link
            href={`/news/${items[0].id}`}
            className="group flex gap-4 overflow-hidden rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            {items[0].imageUrl ? (
              <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl">
                <Image src={items[0].imageUrl} alt={items[0].title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
            ) : (
              <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Newspaper className="size-8" />
              </div>
            )}
            <div className="min-w-0 flex-1 py-1">
              <p className="mb-1.5 text-xs text-muted-foreground">
                {formatDistanceToNow(items[0].createdAt, { addSuffix: true })}
              </p>
              <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {items[0].title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{items[0].description}</p>
            </div>
          </Link>

          {/* Remaining compact items */}
          {items.slice(1).map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="group flex items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              {item.imageUrl ? (
                <div className="relative size-11 shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Newspaper className="size-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-muted-foreground">{formatDistanceToNow(item.createdAt, { addSuffix: true })}</p>
                <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-1">
                  {item.title}
                </h3>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

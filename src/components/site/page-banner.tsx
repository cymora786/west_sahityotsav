import Link from "next/link";
import Image from "next/image";
import { ChevronRight, type LucideIcon } from "lucide-react";

type Breadcrumb = { label: string; href?: string };

type BannerStat = {
  icon: LucideIcon;
  value: string;
  label: string;
  href?: string;
};

export function PageBanner({
  breadcrumbs,
  title,
  description,
  imageUrl,
  stats,
}: {
  breadcrumbs: Breadcrumb[];
  title: string;
  description?: string;
  imageUrl?: string | null;
  stats?: BannerStat[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950">
      <div className="absolute inset-0">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover opacity-25"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-950/90 to-emerald-900/70" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <nav className="mb-3 flex items-center gap-1.5 text-sm text-emerald-200/70">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.label} className="flex items-center gap-1.5">
                  {index > 0 && <ChevronRight className="size-3.5" />}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-white">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-2xl text-emerald-100/80">{description}</p>
            )}
          </div>

          {stats && stats.length > 0 && (
            <div className="flex flex-wrap gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-900/40 p-3 backdrop-blur-sm">
              {stats.map((stat) => {
                const content = (
                  <div className="flex items-center gap-3 px-2">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-amber-400">
                      <stat.icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-lg font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-emerald-200/70">{stat.label}</p>
                    </div>
                  </div>
                );
                return stat.href ? (
                  <Link
                    key={stat.label}
                    href={stat.href}
                    className="transition-colors hover:bg-emerald-400/10 rounded-xl"
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={stat.label}>{content}</div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

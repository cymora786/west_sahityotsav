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
    <section className="relative isolate overflow-hidden" style={{ background: "linear-gradient(135deg, #2e6ab1 0%, #1d4e8f 60%, #163b70 100%)" }}>
      <div className="absolute inset-0">
        {/* Background SVG pattern — always visible */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bg-pattern.svg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-40 pointer-events-none select-none"
        />
        {imageUrl && (
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2e6ab1]/80 via-[#2e6ab1]/70 to-[#163b70]/60" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 sm:pt-36 sm:pb-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <nav className="mb-3 flex items-center gap-1.5 text-sm text-white/50">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.label} className="flex items-center gap-1.5">
                  {index > 0 && <ChevronRight className="size-3.5" />}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-white">{crumb.label}</Link>
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
              <p className="mt-3 max-w-2xl text-white/70">{description}</p>
            )}
          </div>

          {stats && stats.length > 0 && (
            <div className="flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              {stats.map((stat) => {
                const content = (
                  <div className="flex items-center gap-3 px-2">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2e6ab1]/20 text-amber-400">
                      <stat.icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-lg font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-white/50">{stat.label}</p>
                    </div>
                  </div>
                );
                return stat.href ? (
                  <Link key={stat.label} href={stat.href} className="transition-colors hover:bg-white/5 rounded-xl">
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

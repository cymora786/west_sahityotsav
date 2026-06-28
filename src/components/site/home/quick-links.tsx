import Link from "next/link";
import {
  Trophy,
  ListChecks,
  CalendarDays,
  ImageIcon,
  Megaphone,
  Layers,
} from "lucide-react";

const links = [
  { href: "/standings", label: "Standings", icon: Trophy },
  { href: "/results", label: "Results", icon: ListChecks },
  { href: "/categories", label: "Categories", icon: Layers },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
];

export function QuickLinks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:border-primary hover:shadow-md"
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <link.icon className="size-6" />
            </div>
            <span className="text-sm font-semibold">{link.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

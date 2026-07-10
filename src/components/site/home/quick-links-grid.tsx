import Link from "next/link";
import {
  Trophy,
  BarChart3,
  ImageIcon,
  Star,
  Megaphone,
} from "lucide-react";

const links = [
  {
    href: "/results",
    label: "All Results",
    icon: Trophy,
    iconBg: "bg-amber-400/25",
    iconColor: "text-amber-300",
  },
  {
    href: "/standings",
    label: "Division Standings",
    icon: BarChart3,
    iconBg: "bg-sky-400/25",
    iconColor: "text-sky-300",
  },
  {
    href: "/gallery",
    label: "Gallery",
    icon: ImageIcon,
    iconBg: "bg-violet-400/25",
    iconColor: "text-violet-300",
  },
  {
    href: "/categories",
    label: "Category Leaders",
    icon: Star,
    iconBg: "bg-yellow-400/25",
    iconColor: "text-yellow-300",
  },
  {
    href: "/announcements",
    label: "Announcements",
    icon: Megaphone,
    iconBg: "bg-pink-400/25",
    iconColor: "text-pink-300",
  },
];

export function QuickLinksGrid() {
  return (
    <div className="h-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-base font-bold text-white">Quick Links</h3>
      </div>
      <div className="px-5 pb-5">
        <div className="grid grid-cols-2 gap-2.5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 hover:border-white/25"
            >
              <span className={`flex size-10 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 ${link.iconBg} ${link.iconColor}`}>
                <link.icon className="size-5" />
              </span>
              <span className="text-xs font-semibold leading-tight text-white/85">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

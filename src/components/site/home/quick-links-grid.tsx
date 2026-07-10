import Link from "next/link";
import {
  Trophy,
  BarChart3,
  ImageIcon,
  Star,
  Megaphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const links = [
  {
    href: "/results",
    label: "All Results",
    icon: Trophy,
    className: "bg-emerald-500/15 text-emerald-600",
  },
  {
    href: "/standings",
    label: "Division Standings",
    icon: BarChart3,
    className: "bg-blue-500/15 text-blue-600",
  },
  {
    href: "/gallery",
    label: "Gallery",
    icon: ImageIcon,
    className: "bg-purple-500/15 text-purple-600",
  },
  {
    href: "/categories",
    label: "Category Leaders",
    icon: Star,
    className: "bg-yellow-500/15 text-yellow-600",
  },
  {
    href: "/announcements",
    label: "Announcements",
    icon: Megaphone,
    className: "bg-pink-500/15 text-pink-600",
  },
];

export function QuickLinksGrid() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-accent hover:shadow-sm"
            >
              <span className={`flex size-10 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${link.className}`}>
                <link.icon className="size-5" />
              </span>
              <span className="text-xs font-semibold leading-tight">{link.label}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

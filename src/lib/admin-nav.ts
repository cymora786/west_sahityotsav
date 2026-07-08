import {
  LayoutDashboard,
  Trophy,
  ListChecks,
  Image as ImageIcon,
  Megaphone,
  CalendarDays,
  LayoutTemplate,
  BookOpen,
  ListOrdered,
  Share2,
} from "lucide-react";

export const ADMIN_NAV_GROUPS = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Standings",
    items: [
      { href: "/admin/divisions", label: "Divisions", icon: Trophy },
      {
        href: "/admin/division-points",
        label: "Division Points",
        icon: ListOrdered,
      },
    ],
  },
  {
    title: "Competition",
    items: [
      { href: "/admin/categories", label: "Categories", icon: BookOpen },
      { href: "/admin/items", label: "Items", icon: ListChecks },
      { href: "/admin/results", label: "Results", icon: Trophy },
      {
        href: "/admin/templates",
        label: "Poster Templates",
        icon: LayoutTemplate,
      },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
      {
        href: "/admin/announcements",
        label: "Announcements",
        icon: Megaphone,
      },
      { href: "/admin/schedule", label: "Schedule", icon: CalendarDays },
    ],
  },
  {
    title: "Settings",
    items: [
      { href: "/admin/settings", label: "Share Settings", icon: Share2 },
    ],
  },
] as const;

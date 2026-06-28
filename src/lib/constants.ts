export const SITE_NAME = "SSF Malappuram West Sahityotsav 2026";
export const SITE_SHORT_NAME = "Sahityotsav 2026";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/standings", label: "Standings" },
  { href: "/results", label: "Results" },
  { href: "/categories", label: "Categories" },
  { href: "/items", label: "Items" },
  { href: "/schedule", label: "Schedule" },
  { href: "/gallery", label: "Gallery" },
  { href: "/announcements", label: "Announcements" },
] as const;

export const CATEGORY_NAMES = [
  "Senior",
  "Higher Secondary",
  "High School",
  "Junior",
  "Primary",
] as const;

export const EVENT_STATS = {
  divisions: 10,
  categories: 5,
  items: 90,
  participants: 2000,
  days: 3,
};

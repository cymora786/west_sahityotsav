"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Home,
  Trophy,
  BarChart3,
  ImageIcon,
  PlayCircle,
  Newspaper,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { SsfLogoMark } from "@/components/site/ssf-logo";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/results", label: "Results", icon: Trophy },
  { href: "/standings", label: "Standings", icon: BarChart3 },
  { href: "/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/media", label: "Media", icon: PlayCircle },
  { href: "/news", label: "News", icon: Newspaper },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        transparent
          ? "border-b border-white/10 bg-transparent"
          : "border-b bg-white/95 shadow-sm backdrop-blur-md dark:bg-background/95"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold">
          <SsfLogoMark className="h-10 w-auto shrink-0" white={transparent} />
          <span className="hidden leading-tight sm:block">
            <span className={cn(
              "block text-base font-extrabold tracking-tight transition-colors",
              transparent ? "text-white" : "text-gray-900 dark:text-foreground"
            )}>
              SSF Malappuram West
            </span>
            <span className={cn(
              "block text-sm font-semibold transition-colors",
              transparent ? "text-white/90" : "text-white"
            )}>
              Sahityotsav 2026
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors",
                  transparent
                    ? "text-white/80 hover:text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-muted-foreground dark:hover:text-foreground",
                  pathname === link.href &&
                    cn(
                      "after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:bg-[#ce416b]",
                      transparent ? "text-white" : "text-gray-900 dark:text-foreground"
                    )
                )}
              >
                <Icon className="size-3.5 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* My Details / Participant login */}
          <Link
            href="/participants"
            className={cn(
              "hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold transition-all hover:scale-105",
              transparent
                ? "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                : "bg-[#2e6ab1] text-white shadow-md shadow-[#2e6ab1]/30 hover:bg-[#1d4e8f]"
            )}
          >
            <User className="size-3.5" />
            Participant Login
          </Link>
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("lg:hidden", transparent && "text-white hover:bg-white/10")}
                >
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left text-[#ce416b]">Sahityotsav 2026</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                        pathname === link.href && "bg-accent text-[#ce416b]"
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}


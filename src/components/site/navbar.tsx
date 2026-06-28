"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Leaf, Trophy } from "lucide-react";
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
import { NAV_LINKS, SITE_SHORT_NAME } from "@/lib/constants";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-bold">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-950 text-white">
            <Leaf className="size-6" />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-base font-extrabold tracking-tight text-emerald-950 dark:text-foreground">
              SSF Malappuram West
            </span>
            <span className="block text-sm font-semibold text-primary">
              {SITE_SHORT_NAME}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.href &&
                  "text-primary after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            size="sm"
            className="hidden rounded-full bg-gradient-to-r from-amber-400 to-orange-500 font-bold text-amber-950 shadow-md shadow-amber-500/40 transition-transform hover:scale-105 hover:from-amber-300 hover:to-orange-400 sm:inline-flex"
            nativeButton={false}
            render={
              <Link href="/results">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-red-600" />
                </span>
                Live Results
              </Link>
            }
          />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="xl:hidden">
                  <Menu className="size-5" />
                </Button>
              }
            />

            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left text-primary">
                  {SITE_SHORT_NAME}
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === link.href && "bg-accent text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                >
                  Admin Panel
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

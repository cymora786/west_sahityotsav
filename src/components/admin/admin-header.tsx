"use client";

import * as React from "react";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminSidebarNav } from "@/components/admin/sidebar";

export function AdminHeader({
  user,
  onSignOut,
}: {
  user: { name?: string | null; email?: string | null; role?: string };
  onSignOut: () => Promise<void>;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="size-5" />
            </Button>
          }
        />
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <AdminSidebarNav />
        </SheetContent>
      </Sheet>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <div className="hidden text-right text-sm sm:block">
          <p className="font-medium leading-tight">{user.name}</p>
          <p className="text-xs text-muted-foreground leading-tight">
            {user.role}
          </p>
        </div>
        <ThemeToggle />
        <form action={onSignOut}>
          <Button type="submit" variant="outline" size="sm">
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </header>
  );
}

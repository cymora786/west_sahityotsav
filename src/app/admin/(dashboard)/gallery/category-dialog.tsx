"use client";

import * as React from "react";
import { useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil } from "lucide-react";
import {
  createGalleryCategory,
  updateGalleryCategory,
  type ActionState,
} from "./actions";

type Category = {
  id: string;
  name: string;
  slug: string;
};

const CURRENT_YEAR = 2026;
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

const initialState: ActionState = {};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseExistingName(name: string): { year: number; label: string } {
  const match = name.match(/^(\d{4})\s*[-–]\s*(.+)$/);
  if (match) return { year: parseInt(match[1]), label: match[2].trim() };
  return { year: CURRENT_YEAR, label: name };
}

function buildFullName(year: number, label: string): string {
  if (year === CURRENT_YEAR) return label;
  return `${year} - ${label}`;
}

export function CategoryDialog({ category }: { category?: Category }) {
  const [open, setOpen] = React.useState(false);

  const parsed = category ? parseExistingName(category.name) : null;
  const [year, setYear] = React.useState(parsed?.year ?? CURRENT_YEAR);
  const [label, setLabel] = React.useState(parsed?.label ?? "");
  const [slug, setSlug] = React.useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(Boolean(category));

  const fullName = buildFullName(year, label);

  const action = category
    ? updateGalleryCategory.bind(null, category.id)
    : createGalleryCategory;
  const [state, formAction, pending] = useActionState(action, initialState);

  React.useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success]);

  function handleLabelChange(value: string) {
    setLabel(value);
    if (!slugTouched) {
      const prefix = year !== CURRENT_YEAR ? `${year}-` : "";
      setSlug(slugify(prefix + value));
    }
  }

  function handleYearChange(value: number) {
    setYear(value);
    if (!slugTouched) {
      const prefix = value !== CURRENT_YEAR ? `${value}-` : "";
      setSlug(slugify(prefix + label));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          category ? (
            <Button variant="ghost" size="icon-sm">
              <Pencil className="size-4" />
            </Button>
          ) : (
            <Button size="sm" variant="outline">
              <Plus className="size-4" />
              Add Category
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          {/* Hidden field with full computed name */}
          <input type="hidden" name="name" value={fullName} />

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <select
              id="year"
              value={year}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
            >
              {YEARS.map((yr) => (
                <option key={yr} value={yr}>
                  {yr === CURRENT_YEAR ? `${yr} (Current)` : yr}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Category Name</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="e.g. Inauguration, Cultural Night…"
              required
            />
            {year !== CURRENT_YEAR && label && (
              <p className="text-xs text-muted-foreground">
                Will be stored as: <span className="font-medium">{fullName}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              placeholder="auto-generated"
              required
            />
          </div>

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

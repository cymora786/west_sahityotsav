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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil } from "lucide-react";
import { createItem, updateItem, type ActionState } from "./actions";

type Item = {
  id: string;
  name: string;
  categoryId: string;
  venue: string | null;
  status: "PUBLISHED" | "DRAFT";
};

const initialState: ActionState = {};

export function ItemDialog({
  item,
  categories,
}: {
  item?: Item;
  categories: { id: string; name: string }[];
}) {
  const [open, setOpen] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState(
    item?.categoryId ?? categories[0]?.id ?? ""
  );
  const [status, setStatus] = React.useState<"PUBLISHED" | "DRAFT">(
    item?.status ?? "DRAFT"
  );

  const categoryItems = React.useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category.name])),
    [categories]
  );

  const action = item ? updateItem.bind(null, item.id) : createItem;
  const [state, formAction, pending] = useActionState(action, initialState);

  React.useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          item ? (
            <Button variant="ghost" size="icon-sm">
              <Pencil className="size-4" />
            </Button>
          ) : (
            <Button size="sm">
              <Plus className="size-4" />
              Add Item
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={item?.name}
              placeholder="e.g. Group Song"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select items={categoryItems} value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="categoryId" value={categoryId} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                items={{ PUBLISHED: "Published", DRAFT: "Draft" }}
                value={status}
                onValueChange={(v) => setStatus((v as "PUBLISHED" | "DRAFT") ?? "DRAFT")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="status" value={status} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              name="venue"
              defaultValue={item?.venue ?? ""}
              placeholder="e.g. Main Auditorium"
            />
          </div>

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

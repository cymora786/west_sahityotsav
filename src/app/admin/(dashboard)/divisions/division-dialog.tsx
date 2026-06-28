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
import { ImageUpload } from "@/components/admin/image-upload";
import { Plus, Pencil } from "lucide-react";
import { createDivision, updateDivision, type ActionState } from "./actions";

type Division = {
  id: string;
  name: string;
  slug: string;
  code: string;
  logo: string | null;
};

const initialState: ActionState = {};

export function DivisionDialog({ division }: { division?: Division }) {
  const [open, setOpen] = React.useState(false);
  const [logo, setLogo] = React.useState(division?.logo ?? "");

  const action = division
    ? updateDivision.bind(null, division.id)
    : createDivision;

  const [state, formAction, pending] = useActionState(action, initialState);

  React.useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          division ? (
            <Button variant="ghost" size="icon-sm">
              <Pencil className="size-4" />
            </Button>
          ) : (
            <Button size="sm">
              <Plus className="size-4" />
              Add Division
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {division ? "Edit Division" : "Add Division"}
          </DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={division?.name}
              placeholder="e.g. Edappal"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={division?.slug}
                placeholder="edappal"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                name="code"
                defaultValue={division?.code}
                placeholder="EDP"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Logo</Label>
            <ImageUpload value={logo} onChange={setLogo} folder="divisions" />
            <input type="hidden" name="logo" value={logo} />
          </div>

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save Division"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

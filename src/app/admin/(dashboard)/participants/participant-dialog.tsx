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
import {
  createParticipant,
  updateParticipant,
  type ActionState,
} from "./actions";

type Participant = {
  id: string;
  name: string;
  divisionId: string;
  categoryId: string;
  itemId: string;
};

const initialState: ActionState = {};

export function ParticipantDialog({
  participant,
  divisions,
  categories,
  items,
}: {
  participant?: Participant;
  divisions: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  items: { id: string; name: string; categoryId: string }[];
}) {
  const [open, setOpen] = React.useState(false);
  const [divisionId, setDivisionId] = React.useState(
    participant?.divisionId ?? divisions[0]?.id ?? ""
  );
  const [categoryId, setCategoryId] = React.useState(
    participant?.categoryId ?? categories[0]?.id ?? ""
  );
  const [itemId, setItemId] = React.useState(participant?.itemId ?? "");

  const divisionItems = React.useMemo(
    () => Object.fromEntries(divisions.map((division) => [division.id, division.name])),
    [divisions]
  );
  const categoryItems = React.useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category.name])),
    [categories]
  );

  const filteredItems = items.filter((item) => item.categoryId === categoryId);
  const itemItems = React.useMemo(
    () => Object.fromEntries(filteredItems.map((item) => [item.id, item.name])),
    [filteredItems]
  );

  React.useEffect(() => {
    if (!filteredItems.some((item) => item.id === itemId)) {
      setItemId(filteredItems[0]?.id ?? "");
    }
  }, [categoryId, filteredItems, itemId]);

  const action = participant
    ? updateParticipant.bind(null, participant.id)
    : createParticipant;
  const [state, formAction, pending] = useActionState(action, initialState);

  React.useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          participant ? (
            <Button variant="ghost" size="icon-sm">
              <Pencil className="size-4" />
            </Button>
          ) : (
            <Button size="sm">
              <Plus className="size-4" />
              Add Participant
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {participant ? "Edit Participant" : "Add Participant"}
          </DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={participant?.name}
              placeholder="Participant name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Division</Label>
            <Select
              items={divisionItems}
              value={divisionId}
              onValueChange={(v) => setDivisionId(v ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Division" />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((division) => (
                  <SelectItem key={division.id} value={division.id}>
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="divisionId" value={divisionId} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                items={categoryItems}
                value={categoryId}
                onValueChange={(v) => setCategoryId(v ?? "")}
              >
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
              <Label>Item</Label>
              <Select items={itemItems} value={itemId} onValueChange={(v) => setItemId(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Item" />
                </SelectTrigger>
                <SelectContent>
                  {filteredItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="itemId" value={itemId} />
            </div>
          </div>

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save Participant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

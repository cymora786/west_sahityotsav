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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil } from "lucide-react";
import {
  createAnnouncement,
  updateAnnouncement,
  type ActionState,
} from "./actions";

type Priority = "HIGH" | "NORMAL" | "LOW";

type Announcement = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  priority: Priority;
};

const initialState: ActionState = {};

export function AnnouncementDialog({
  announcement,
}: {
  announcement?: Announcement;
}) {
  const [open, setOpen] = React.useState(false);
  const [priority, setPriority] = React.useState<Priority>(
    announcement?.priority ?? "NORMAL"
  );

  const action = announcement
    ? updateAnnouncement.bind(null, announcement.id)
    : createAnnouncement;
  const [state, formAction, pending] = useActionState(action, initialState);

  React.useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          announcement ? (
            <Button variant="ghost" size="icon-sm">
              <Pencil className="size-4" />
            </Button>
          ) : (
            <Button size="sm">
              <Plus className="size-4" />
              Add Announcement
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {announcement ? "Edit Announcement" : "Add Announcement"}
          </DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={announcement?.title}
              placeholder="Announcement title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={announcement?.description}
              placeholder="Announcement details"
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              defaultValue={announcement?.imageUrl}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              items={{ HIGH: "High", NORMAL: "Normal", LOW: "Low" }}
              value={priority}
              onValueChange={(v) => setPriority((v as Priority) ?? "NORMAL")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" name="priority" value={priority} />
          </div>

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save Announcement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

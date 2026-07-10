"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil } from "lucide-react";
import { createMedia, updateMedia, type ActionState } from "./actions";
import { useState } from "react";

type MediaRow = { id: string; title: string; videoId: string; year: number; description?: string | null };

export function MediaDialog({ media }: { media?: MediaRow }) {
  const [open, setOpen] = useState(false);
  const action = media ? updateMedia.bind(null, media.id) : createMedia;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          media ? (
            <Button variant="ghost" size="icon"><Pencil className="size-4" /></Button>
          ) : (
            <Button><Plus className="size-4 mr-1" /> Add Video</Button>
          )
        }
      />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{media ? "Edit Video" : "Add YouTube Video"}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={media?.title} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="videoId">YouTube Video ID</Label>
            <Input id="videoId" name="videoId" defaultValue={media?.videoId} placeholder="e.g. dQw4w9WgXcQ" required />
            <p className="text-xs text-muted-foreground">The part after ?v= in the YouTube URL</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="year">Year</Label>
            <Input id="year" name="year" type="number" defaultValue={media?.year ?? new Date().getFullYear()} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" name="description" defaultValue={media?.description ?? ""} rows={2} />
          </div>
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving…" : media ? "Save Changes" : "Add Video"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

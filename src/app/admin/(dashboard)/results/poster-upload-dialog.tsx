"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { savePoster, removePoster } from "./poster-actions";
import { toast } from "sonner";

interface Props {
  competitionId: string;
  competitionName: string;
  currentPoster?: string | null;
}

export function PosterUploadDialog({ competitionId, competitionName, currentPoster }: Props) {
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState(currentPoster ?? "");
  const [saving, setSaving] = React.useState(false);
  const [removing, setRemoving] = React.useState(false);

  async function handleSave() {
    if (!image) return;
    setSaving(true);
    try {
      await savePoster(competitionId, image);
      toast.success("Poster saved");
      setOpen(false);
    } catch {
      toast.error("Failed to save poster");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    setRemoving(true);
    try {
      await removePoster(competitionId);
      setImage("");
      toast.success("Poster removed");
      setOpen(false);
    } catch {
      toast.error("Failed to remove poster");
    } finally {
      setRemoving(false);
    }
  }

  const hasPoster = Boolean(currentPoster);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant={hasPoster ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
          >
            {hasPoster ? (
              <>
                <ImageIcon className="size-3.5" />
                Poster
              </>
            ) : (
              <>
                <Upload className="size-3.5" />
                Upload Poster
              </>
            )}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Custom Poster — {competitionName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Upload a custom poster image. It will be shown on the result page instead of the auto-generated poster.
          </p>
          <ImageUpload value={image} onChange={setImage} folder="posters" />
          {image && (
            <div className="overflow-hidden rounded-lg border aspect-[3/4] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Poster preview" className="w-full h-full object-contain bg-muted" />
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          {hasPoster && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={removing}
              className="mr-auto"
            >
              <Trash2 className="size-3.5" />
              {removing ? "Removing…" : "Remove"}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!image || saving}>
            {saving ? "Saving…" : "Save Poster"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

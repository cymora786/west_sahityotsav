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
import { ImageUpload } from "@/components/admin/image-upload";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";
import { Plus, Pencil } from "lucide-react";
import {
  createGalleryImage,
  createGalleryImages,
  updateGalleryImage,
  type ActionState,
} from "./actions";

type Category = {
  id: string;
  name: string;
};

type GalleryImage = {
  id: string;
  imageUrl: string;
  caption: string | null;
  categoryId: string;
};

const initialState: ActionState = {};

export function GalleryDialog({
  image,
  categories,
}: {
  image?: GalleryImage;
  categories: Category[];
}) {
  const [open, setOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState(image?.imageUrl ?? "");
  const [imageUrls, setImageUrls] = React.useState<string[]>([]);
  const [categoryId, setCategoryId] = React.useState(
    image?.categoryId ?? categories[0]?.id ?? ""
  );

  const action = image
    ? updateGalleryImage.bind(null, image.id)
    : createGalleryImages;
  const [state, formAction, pending] = useActionState(action, initialState);

  React.useEffect(() => {
    if (state.success) {
      setOpen(false);
      setImageUrls([]);
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          image ? (
            <Button variant="ghost" size="icon-sm">
              <Pencil className="size-4" />
            </Button>
          ) : (
            <Button size="sm">
              <Plus className="size-4" />
              Add Images
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{image ? "Edit Image" : "Add Images"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label>{image ? "Image" : "Images"}</Label>
            {image ? (
              <>
                <ImageUpload value={imageUrl} onChange={setImageUrl} folder="gallery" />
                <input type="hidden" name="imageUrl" value={imageUrl} />
              </>
            ) : (
              <>
                <MultiImageUpload
                  value={imageUrls}
                  onChange={setImageUrls}
                  folder="gallery"
                />
                {imageUrls.map((url) => (
                  <input key={url} type="hidden" name="imageUrls" value={url} />
                ))}
              </>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              name="caption"
              defaultValue={image?.caption ?? ""}
              placeholder="Optional caption"
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={categoryId}
              onValueChange={(v) => setCategoryId(v ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category">
                  {(value: string) =>
                    categories.find((c) => c.id === value)?.name ?? "Category"
                  }
                </SelectValue>
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

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : image ? "Save Image" : "Upload Images"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

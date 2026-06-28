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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil } from "lucide-react";
import { createTemplate, updateTemplate, type ActionState } from "./actions";

type Template = {
  id: string;
  name: string;
  thumbnail: string;
  backgroundImage: string;
  primaryColor?: string | null;
  accentColor?: string | null;
  textColor?: string | null;
  customCss?: string | null;
};

const initialState: ActionState = {};

const DEFAULT_PRIMARY = "#16a34a";
const DEFAULT_ACCENT = "#fde047";
const DEFAULT_TEXT = "#0f172a";

export function TemplateDialog({ template }: { template?: Template }) {
  const [open, setOpen] = React.useState(false);
  const [thumbnail, setThumbnail] = React.useState(template?.thumbnail ?? "");
  const [backgroundImage, setBackgroundImage] = React.useState(
    template?.backgroundImage ?? ""
  );
  const [customStyle, setCustomStyle] = React.useState(
    Boolean(template?.primaryColor || template?.accentColor || template?.textColor)
  );
  const [primaryColor, setPrimaryColor] = React.useState(
    template?.primaryColor ?? DEFAULT_PRIMARY
  );
  const [accentColor, setAccentColor] = React.useState(
    template?.accentColor ?? DEFAULT_ACCENT
  );
  const [textColor, setTextColor] = React.useState(
    template?.textColor ?? DEFAULT_TEXT
  );

  const action = template
    ? updateTemplate.bind(null, template.id)
    : createTemplate;
  const [state, formAction, pending] = useActionState(action, initialState);

  React.useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          template ? (
            <Button variant="ghost" size="icon-sm">
              <Pencil className="size-4" />
            </Button>
          ) : (
            <Button size="sm">
              <Plus className="size-4" />
              Add Template
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{template ? "Edit Template" : "Add Template"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={template?.name}
              placeholder="e.g. Classic"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <ImageUpload
              value={thumbnail}
              onChange={setThumbnail}
              folder="templates"
            />
            <input type="hidden" name="thumbnail" value={thumbnail} />
          </div>
          <div className="space-y-2">
            <Label>Background Image</Label>
            <ImageUpload
              value={backgroundImage}
              onChange={setBackgroundImage}
              folder="templates"
            />
            <input
              type="hidden"
              name="backgroundImage"
              value={backgroundImage}
            />
          </div>

          <div className="space-y-3 rounded-lg border p-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={customStyle}
                onChange={(e) => setCustomStyle(e.target.checked)}
                className="size-4"
              />
              Custom style
            </label>
            <p className="text-xs text-muted-foreground">
              Override this template&apos;s default colors on the poster.
            </p>
            {customStyle && (
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="primaryColor" className="text-xs">
                    Primary
                  </Label>
                  <input
                    id="primaryColor"
                    name="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-9 w-full rounded-md border bg-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="accentColor" className="text-xs">
                    Accent
                  </Label>
                  <input
                    id="accentColor"
                    name="accentColor"
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-9 w-full rounded-md border bg-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="textColor" className="text-xs">
                    Text
                  </Label>
                  <input
                    id="textColor"
                    name="textColor"
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-9 w-full rounded-md border bg-transparent"
                  />
                </div>
              </div>
            )}
            {!customStyle && (
              <>
                <input type="hidden" name="primaryColor" value="" />
                <input type="hidden" name="accentColor" value="" />
                <input type="hidden" name="textColor" value="" />
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customCss">Custom CSS</Label>
            <Textarea
              id="customCss"
              name="customCss"
              defaultValue={template?.customCss ?? ""}
              placeholder={`& {\n  border-radius: 0;\n}\n\nh2 {\n  font-style: italic;\n}`}
              className="font-mono text-xs"
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              Optional CSS automatically scoped to this poster. Use{" "}
              <code>&amp;</code> to style the poster card itself, or plain
              selectors (e.g. <code>h2</code>) for inner elements.
            </p>
          </div>

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save Template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

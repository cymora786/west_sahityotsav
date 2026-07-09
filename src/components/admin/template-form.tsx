"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Eye, EyeOff } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";
import { PosterDragEditor, parsePosterLayout } from "@/components/admin/poster-drag-editor";
import type { PosterLayout } from "@/components/admin/poster-drag-editor";
import { PosterPreviewPane } from "@/components/admin/poster-preview-pane";
import type { ActionState } from "@/app/admin/(dashboard)/templates/actions";

type Template = {
  id: string;
  name: string;
  thumbnail: string;
  backgroundImage: string;
  primaryColor?: string | null;
  accentColor?: string | null;
  textColor?: string | null;
  customCss?: string | null;
  layout?: string | null;
};

const DEFAULT_PRIMARY = "#16a34a";
const DEFAULT_ACCENT = "#fde047";
const DEFAULT_TEXT = "#0f172a";

const initialState: ActionState = {};

interface Props {
  template?: Template;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}

export function TemplateForm({ template, action }: Props) {
  const [thumbnail, setThumbnail] = React.useState(template?.thumbnail ?? "");
  const [backgroundImage, setBackgroundImage] = React.useState(template?.backgroundImage ?? "");
  const [customStyle, setCustomStyle] = React.useState(
    Boolean(template?.primaryColor || template?.accentColor || template?.textColor)
  );
  const [primaryColor, setPrimaryColor] = React.useState(template?.primaryColor ?? DEFAULT_PRIMARY);
  const [accentColor, setAccentColor] = React.useState(template?.accentColor ?? DEFAULT_ACCENT);
  const [textColor, setTextColor] = React.useState(template?.textColor ?? DEFAULT_TEXT);
  const [posterLayout, setPosterLayout] = React.useState<PosterLayout>(
    parsePosterLayout(template?.layout)
  );
  const [showPreview, setShowPreview] = React.useState(false);

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/templates" className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}>
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {template ? `Edit — ${template.name}` : "New Poster Template"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Use names like Classic, Modern, Minimal, Festive or Bold to match built-in layouts.
          </p>
        </div>
        <Button type="submit" disabled={pending} className="gap-2">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {pending ? "Saving…" : "Save Template"}
        </Button>
      </div>

      {state.error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {/* Two-column layout: settings left, drag editor right */}
      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">

        {/* LEFT — settings */}
        <div className="space-y-6">
          {/* Name */}
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

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <ImageUpload value={thumbnail} onChange={setThumbnail} folder="templates" />
            <input type="hidden" name="thumbnail" value={thumbnail} />
          </div>

          {/* Background image */}
          <div className="space-y-2">
            <Label>Background Image</Label>
            <ImageUpload value={backgroundImage} onChange={setBackgroundImage} folder="templates" />
            <input type="hidden" name="backgroundImage" value={backgroundImage} />
          </div>

          {/* Colors */}
          <div className="space-y-3 rounded-lg border p-4">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={customStyle}
                onChange={(e) => setCustomStyle(e.target.checked)}
                className="size-4"
              />
              Custom colours
            </label>
            <p className="text-xs text-muted-foreground">
              Override the default poster colours when no background image is set.
            </p>
            {customStyle ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="primaryColor" className="text-xs">Primary</Label>
                  <input
                    id="primaryColor" name="primaryColor" type="color"
                    value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-9 w-full rounded-md border bg-transparent cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="accentColor" className="text-xs">Accent</Label>
                  <input
                    id="accentColor" name="accentColor" type="color"
                    value={accentColor} onChange={(e) => setAccentColor(e.target.value)}
                    className="h-9 w-full rounded-md border bg-transparent cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="textColor" className="text-xs">Text</Label>
                  <input
                    id="textColor" name="textColor" type="color"
                    value={textColor} onChange={(e) => setTextColor(e.target.value)}
                    className="h-9 w-full rounded-md border bg-transparent cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <>
                <input type="hidden" name="primaryColor" value="" />
                <input type="hidden" name="accentColor" value="" />
                <input type="hidden" name="textColor" value="" />
              </>
            )}
          </div>

          {/* Custom CSS */}
          <div className="space-y-2">
            <Label htmlFor="customCss">Custom CSS</Label>
            <Textarea
              id="customCss" name="customCss"
              defaultValue={template?.customCss ?? ""}
              placeholder={`& {\n  border-radius: 0;\n}\n\nh2 {\n  font-style: italic;\n}`}
              className="font-mono text-xs"
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Use <code>&amp;</code> to style the poster card itself.
            </p>
          </div>
        </div>

        {/* RIGHT — drag layout editor + preview */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Block Layout</h2>
              <p className="text-sm text-muted-foreground">
                Drag chips to reposition. Click ▼ on any block to edit its text, size, font, and colour.
              </p>
            </div>
            <Button
              type="button"
              variant={showPreview ? "default" : "outline"}
              size="sm"
              className="shrink-0 gap-1.5"
              onClick={() => setShowPreview(v => !v)}
            >
              {showPreview ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              {showPreview ? "Hide Preview" : "Preview"}
            </Button>
          </div>

          {showPreview ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Live preview with sample data</p>
              <PosterPreviewPane
                layout={posterLayout}
                bgImage={backgroundImage || null}
                primaryColor={customStyle ? primaryColor : undefined}
                accentColor={customStyle ? accentColor : undefined}
                textColor={customStyle ? textColor : undefined}
              />
            </div>
          ) : (
            <PosterDragEditor
              layout={posterLayout}
              bgImage={backgroundImage || null}
              onChange={setPosterLayout}
            />
          )}

          <input type="hidden" name="layout" value={JSON.stringify(posterLayout)} />
        </div>
      </div>

      {/* Bottom save */}
      <div className="flex justify-end border-t pt-6">
        <Button type="submit" disabled={pending} className="gap-2">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {pending ? "Saving…" : "Save Template"}
        </Button>
      </div>
    </form>
  );
}

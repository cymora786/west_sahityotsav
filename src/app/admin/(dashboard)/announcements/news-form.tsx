"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { createAnnouncement, updateAnnouncement, type ActionState } from "./actions";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

type Priority = "HIGH" | "NORMAL" | "LOW";

type NewsItem = {
  id: string;
  title: string;
  description: string;
  body?: string | null;
  imageUrl?: string | null;
  priority: Priority;
};

const initialState: ActionState = {};

export function NewsForm({ item }: { item?: NewsItem }) {
  const router = useRouter();
  const [priority, setPriority] = React.useState<Priority>(item?.priority ?? "NORMAL");

  const action = item
    ? updateAnnouncement.bind(null, item.id)
    : createAnnouncement;

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => router.push("/admin/announcements")}
          className="gap-1.5"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {item ? "Edit News" : "Add News"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {item ? "Update this news article" : "Create a new news article"}
          </p>
        </div>
      </div>

      <form action={formAction} className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={item?.title}
            placeholder="News headline"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Short Description *
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              (shown in listings and cards)
            </span>
          </Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={item?.description}
            placeholder="Brief summary shown on the news listing page..."
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>
            Full Article Body
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              (shown on the detail page)
            </span>
          </Label>
          <RichTextEditor
            name="body"
            defaultValue={item?.body ?? ""}
            placeholder="Write the full article content here…"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">
              Cover Image URL
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              defaultValue={item?.imageUrl ?? ""}
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
                <SelectItem value="HIGH">High Priority</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="LOW">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" name="priority" value={priority} />
          </div>
        </div>

        {state?.error && (
          <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-3 border-t pt-4">
          <Button type="submit" disabled={pending} className="gap-2">
            <Save className="size-4" />
            {pending ? "Saving..." : item ? "Update Article" : "Publish Article"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/announcements")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

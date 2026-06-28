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
import { createResult, updateResult, type ActionState } from "./actions";

type Result = {
  id: string;
  categoryId: string;
  itemId: string;
  divisionId: string;
  venue: string | null;
  firstPlaceName: string | null;
  secondPlaceName: string | null;
  secondPlaceDivisionId: string | null;
  thirdPlaceName: string | null;
  thirdPlaceDivisionId: string | null;
  templateId: string | null;
  status: "PUBLISHED" | "DRAFT";
};

const initialState: ActionState = {};

export function ResultDialog({
  result,
  divisions,
  categories,
  items,
  templates,
}: {
  result?: Result;
  divisions: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  items: { id: string; name: string; categoryId: string }[];
  templates: { id: string; name: string }[];
}) {
  const [open, setOpen] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState(
    result?.categoryId ?? categories[0]?.id ?? ""
  );
  const [itemId, setItemId] = React.useState(result?.itemId ?? "");
  const [divisionId, setDivisionId] = React.useState(
    result?.divisionId ?? divisions[0]?.id ?? ""
  );
  const [secondPlaceDivisionId, setSecondPlaceDivisionId] = React.useState(
    result?.secondPlaceDivisionId ?? ""
  );
  const [thirdPlaceDivisionId, setThirdPlaceDivisionId] = React.useState(
    result?.thirdPlaceDivisionId ?? ""
  );
  const [templateId, setTemplateId] = React.useState(result?.templateId ?? "");
  const [status, setStatus] = React.useState<"PUBLISHED" | "DRAFT">(
    result?.status ?? "DRAFT"
  );

  const filteredItems = items.filter((item) => item.categoryId === categoryId);

  React.useEffect(() => {
    if (!filteredItems.some((item) => item.id === itemId)) {
      setItemId(filteredItems[0]?.id ?? "");
    }
  }, [categoryId, filteredItems, itemId]);

  const action = result ? updateResult.bind(null, result.id) : createResult;
  const [state, formAction, pending] = useActionState(action, initialState);

  React.useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          result ? (
            <Button variant="ghost" size="icon-sm">
              <Pencil className="size-4" />
            </Button>
          ) : (
            <Button size="sm">
              <Plus className="size-4" />
              Add Result
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{result ? "Edit Result" : "Add Result"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
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
            <div className="space-y-2">
              <Label>Item</Label>
              <Select value={itemId} onValueChange={(v) => setItemId(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Item">
                    {(value: string) =>
                      filteredItems.find((i) => i.id === value)?.name ?? "Item"
                    }
                  </SelectValue>
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

          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              name="venue"
              defaultValue={result?.venue ?? ""}
              placeholder="e.g. Main Stage"
            />
          </div>

          <div className="space-y-3 rounded-lg border p-3">
            <p className="text-sm font-medium">1st Place</p>
            <Input
              name="firstPlaceName"
              defaultValue={result?.firstPlaceName ?? ""}
              placeholder="Participant name"
            />
            <Select value={divisionId} onValueChange={(v) => setDivisionId(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Division">
                  {(value: string) =>
                    divisions.find((d) => d.id === value)?.name ?? "Division"
                  }
                </SelectValue>
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
          <div className="space-y-3 rounded-lg border p-3">
            <p className="text-sm font-medium">2nd Place</p>
            <Input
              name="secondPlaceName"
              defaultValue={result?.secondPlaceName ?? ""}
              placeholder="Participant name"
            />
            <Select
              value={secondPlaceDivisionId || "none"}
              onValueChange={(v) => setSecondPlaceDivisionId(v === "none" ? "" : v ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Division">
                  {(value: string) =>
                    value === "none"
                      ? "None"
                      : divisions.find((d) => d.id === value)?.name ?? "Division"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {divisions.map((division) => (
                  <SelectItem key={division.id} value={division.id}>
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="secondPlaceDivisionId" value={secondPlaceDivisionId} />
          </div>
          <div className="space-y-3 rounded-lg border p-3">
            <p className="text-sm font-medium">3rd Place</p>
            <Input
              name="thirdPlaceName"
              defaultValue={result?.thirdPlaceName ?? ""}
              placeholder="Participant name"
            />
            <Select
              value={thirdPlaceDivisionId || "none"}
              onValueChange={(v) => setThirdPlaceDivisionId(v === "none" ? "" : v ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Division">
                  {(value: string) =>
                    value === "none"
                      ? "None"
                      : divisions.find((d) => d.id === value)?.name ?? "Division"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {divisions.map((division) => (
                  <SelectItem key={division.id} value={division.id}>
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="thirdPlaceDivisionId" value={thirdPlaceDivisionId} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Poster Template</Label>
              <Select
                value={templateId || "none"}
                onValueChange={(v) => setTemplateId(v === "none" ? "" : v ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Template">
                    {(value: string) =>
                      value === "none"
                        ? "None"
                        : templates.find((t) => t.id === value)?.name ?? "Template"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="templateId" value={templateId} />
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

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save Result"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

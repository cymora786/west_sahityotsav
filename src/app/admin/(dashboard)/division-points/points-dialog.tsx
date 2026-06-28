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
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ListOrdered } from "lucide-react";
import { updateDivisionPoints, type ActionState } from "./actions";

const initialState: ActionState = {};

export function PointsDialog({
  divisionId,
  divisionName,
  currentPoints,
}: {
  divisionId: string;
  divisionName: string;
  currentPoints: number;
}) {
  const [open, setOpen] = React.useState(false);
  const action = updateDivisionPoints.bind(null, divisionId);
  const [state, formAction, pending] = useActionState(action, initialState);

  React.useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <ListOrdered className="size-4" />
        Update Points
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Points — {divisionName}</DialogTitle>
          <DialogDescription>
            Current points: {currentPoints}. Changes are recorded in the audit
            log.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="points">New Points</Label>
            <Input
              id="points"
              name="points"
              type="number"
              step="0.5"
              defaultValue={currentPoints}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              name="reason"
              placeholder="e.g. Points awarded for Group Song result"
              required
            />
          </div>

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

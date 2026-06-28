"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ParticipantDialog } from "./participant-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteParticipant } from "./actions";
import { Search } from "lucide-react";

type Participant = {
  id: string;
  name: string;
  divisionId: string;
  categoryId: string;
  itemId: string;
  division: { id: string; name: string };
  category: { id: string; name: string };
  item: { id: string; name: string; categoryId: string };
};

export function ParticipantsTable({
  participants,
  divisions,
  categories,
  items,
}: {
  participants: Participant[];
  divisions: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  items: { id: string; name: string; categoryId: string }[];
}) {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return participants;
    return participants.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.division.name.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q) ||
        p.item.name.toLowerCase().includes(q)
    );
  }, [participants, query]);

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search participants..."
            className="pl-8"
          />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No participants found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">{participant.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{participant.division.name}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {participant.category.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {participant.item.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <ParticipantDialog
                        participant={{
                          id: participant.id,
                          name: participant.name,
                          divisionId: participant.divisionId,
                          categoryId: participant.categoryId,
                          itemId: participant.itemId,
                        }}
                        divisions={divisions}
                        categories={categories}
                        items={items}
                      />
                      <DeleteButton
                        action={deleteParticipant.bind(null, participant.id)}
                        confirmMessage={`Remove ${participant.name} from participants?`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {participants.length} participants
        </p>
      </CardContent>
    </Card>
  );
}

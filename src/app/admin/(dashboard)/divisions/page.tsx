import Image from "next/image";
import { getStandings } from "@/lib/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DivisionDialog } from "./division-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteDivision } from "./actions";
import { Trophy } from "lucide-react";

export const metadata = {
  title: "Divisions",
};

export default async function AdminDivisionsPage() {
  const divisions = await getStandings();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Divisions</h1>
          <p className="text-sm text-muted-foreground">
            Manage competing divisions and their identity.
          </p>
        </div>
        <DivisionDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {divisions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No divisions yet. Add your first division to get started.
                  </TableCell>
                </TableRow>
              )}
              {divisions.map((division) => (
                <TableRow key={division.id}>
                  <TableCell>
                    {division.logo ? (
                      <div className="relative size-8 overflow-hidden rounded-full border">
                        <Image
                          src={division.logo}
                          alt={division.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Trophy className="size-4" />
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{division.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{division.code}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {division.slug}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    {division.points?.currentPoints ?? 0}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <DivisionDialog
                        division={{
                          id: division.id,
                          name: division.name,
                          slug: division.slug,
                          code: division.code,
                          logo: division.logo,
                        }}
                      />
                      <DeleteButton
                        action={deleteDivision.bind(null, division.id)}
                        confirmMessage={`Delete ${division.name}? This will remove all related points, results and participants.`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { getItems, getCategories } from "@/lib/queries";
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
import { ItemDialog } from "./item-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteItem } from "./actions";

export const metadata = {
  title: "Items",
};

export default async function AdminItemsPage() {
  const [items, categories] = await Promise.all([getItems(), getCategories()]);
  const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Items</h1>
          <p className="text-sm text-muted-foreground">
            Manage competition items within each category.
          </p>
        </div>
        <ItemDialog categories={categoryOptions} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No items yet. Add your first item to get started.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.category.name}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.venue ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === "PUBLISHED" ? "default" : "outline"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <ItemDialog
                        item={{
                          id: item.id,
                          name: item.name,
                          categoryId: item.categoryId,
                          venue: item.venue,
                          status: item.status,
                        }}
                        categories={categoryOptions}
                      />
                      <DeleteButton
                        action={deleteItem.bind(null, item.id)}
                        confirmMessage={`Delete ${item.name}? This will remove related participants and results.`}
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

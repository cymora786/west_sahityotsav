import { getSchedules, getCategories } from "@/lib/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScheduleDialog } from "./schedule-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteSchedule } from "./actions";

export const metadata = {
  title: "Schedule",
};

export default async function AdminSchedulePage() {
  const [schedules, categories] = await Promise.all([
    getSchedules(),
    getCategories(),
  ]);

  const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
          <p className="text-sm text-muted-foreground">
            Manage the event schedule shown on the public site.
          </p>
        </div>
        <ScheduleDialog categories={categoryOptions} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No schedule items yet. Add your first item to get started.
                  </TableCell>
                </TableRow>
              )}
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{schedule.day}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {schedule.date.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{schedule.time}</TableCell>
                  <TableCell>{schedule.title}</TableCell>
                  <TableCell className="text-muted-foreground">{schedule.venue}</TableCell>
                  <TableCell>
                    {schedule.category ? (
                      <Badge variant="secondary">{schedule.category.name}</Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <ScheduleDialog
                        schedule={{
                          id: schedule.id,
                          day: schedule.day,
                          date: schedule.date,
                          time: schedule.time,
                          title: schedule.title,
                          venue: schedule.venue,
                          categoryId: schedule.categoryId,
                          description: schedule.description,
                        }}
                        categories={categoryOptions}
                      />
                      <DeleteButton
                        action={deleteSchedule.bind(null, schedule.id)}
                        confirmMessage={`Delete schedule item "${schedule.title}"?`}
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

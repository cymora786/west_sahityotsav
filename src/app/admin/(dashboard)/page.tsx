import Link from "next/link";
import {
  getDashboardStats,
  getRecentPointLogs,
  getLatestResults,
} from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Users,
  ListChecks,
  Megaphone,
  CheckCircle2,
  PlusCircle,
  ListOrdered,
  ImageIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const [stats, pointLogs, recentResults] = await Promise.all([
    getDashboardStats(),
    getRecentPointLogs(5),
    getLatestResults(5),
  ]);

  const statCards = [
    { label: "Divisions", value: stats.divisions, icon: Trophy },
    { label: "Participants", value: stats.participants, icon: Users },
    { label: "Items", value: stats.items, icon: ListChecks },
    {
      label: "Published Results",
      value: `${stats.publishedResults}/${stats.results}`,
      icon: CheckCircle2,
    },
    { label: "Announcements", value: stats.announcements, icon: Megaphone },
  ];

  const quickActions = [
    { href: "/admin/divisions", label: "Manage Divisions", icon: Trophy },
    {
      href: "/admin/division-points",
      label: "Update Division Points",
      icon: ListOrdered,
    },
    { href: "/admin/results", label: "Add Result", icon: PlusCircle },
    { href: "/admin/gallery", label: "Upload Gallery Photo", icon: ImageIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of SSF Malappuram West Sahityotsav 2026.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 py-6">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <stat.icon className="size-6" />
              </span>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pointLogs.length === 0 && recentResults.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent activity yet.
              </p>
            ) : (
              <>
                {pointLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {log.division.name} points updated
                      </p>
                      <p className="text-muted-foreground">
                        {log.previousPoints} &rarr; {log.newPoints} &middot;{" "}
                        {log.reason}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDistanceToNow(log.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                ))}
                {recentResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        Result published: {result.item.name}
                      </p>
                      <p className="text-muted-foreground">
                        {result.category.name} &middot; {result.division.name}
                      </p>
                    </div>
                    {result.publishedDate && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDistanceToNow(result.publishedDate, {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.href}
                variant="outline"
                className="w-full justify-start"
                nativeButton={false}
                render={
                  <Link href={action.href}>
                    <action.icon className="size-4" />
                    {action.label}
                  </Link>
                }
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {stats.publishedResults < stats.results && (
        <Card>
          <CardContent className="flex items-center justify-between gap-3 py-4">
            <p className="text-sm">
              <Badge variant="outline" className="mr-2">
                {stats.results - stats.publishedResults} draft
              </Badge>
              results are awaiting publication.
            </p>
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/admin/results">Review Results</Link>}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

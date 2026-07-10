import Link from "next/link";
import {
  getTeamPoints,
  getPublishedCompetitions,
  getApiSchedule,
} from "@/lib/sahityotsav-api";
import { getGallery, getAnnouncements } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  ImageIcon,
  Megaphone,
  CalendarDays,
  ListChecks,
  Share2,
  LayoutTemplate,
  CheckCircle2,
  Loader2,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const [teams, competitions, apiSchedule, galleryImages, announcements] =
    await Promise.all([
      getTeamPoints(),
      getPublishedCompetitions(),
      getApiSchedule(),
      getGallery(),
      getAnnouncements(),
    ]);

  const scheduleEntries = apiSchedule?.schedule ?? [];
  const totalCompetitions = competitions?.length ?? 0;
  const publishedResults = competitions?.filter((c) => c.publishedAt).length ?? 0;
  const totalTeams = teams?.length ?? 0;

  const statCards = [
    { label: "Teams / Divisions", value: totalTeams, icon: Trophy, href: "/admin/divisions", color: "bg-blue-500/10 text-blue-700" },
    { label: "Competitions", value: totalCompetitions, icon: ListChecks, href: "/admin/items", color: "bg-blue-500/10 text-blue-600" },
    { label: "Results Published", value: `${publishedResults}/${totalCompetitions}`, icon: CheckCircle2, href: "/admin/results", color: "bg-amber-500/10 text-amber-600" },
    { label: "Schedule Items", value: scheduleEntries.length, icon: CalendarDays, href: "/admin/schedule", color: "bg-violet-500/10 text-violet-600" },
    { label: "Gallery Photos", value: galleryImages.length, icon: ImageIcon, href: "/admin/gallery", color: "bg-rose-500/10 text-rose-600" },
    { label: "Announcements", value: announcements.length, icon: Megaphone, href: "/admin/announcements", color: "bg-orange-500/10 text-orange-600" },
  ];

  const quickActions = [
    { href: "/admin/gallery", label: "Upload Gallery Photos", icon: ImageIcon },
    { href: "/admin/announcements", label: "New Announcement", icon: Megaphone },
    { href: "/admin/templates", label: "Poster Templates", icon: LayoutTemplate },
    { href: "/admin/settings", label: "Share Settings", icon: Share2 },
  ];

  const topTeams = (teams ?? []).slice(0, 5);

  const recentSchedule = scheduleEntries
    .filter((e) => e.status === "In Progress" || e.status === "Upcoming")
    .slice(0, 4);

  const recentResults = (competitions ?? [])
    .filter((c) => c.publishedAt)
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          SSF Malappuram West Sahityotsav 2026 — live data from API.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 py-5">
                <span className={`flex size-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="size-5" />
                </span>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Live Standings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              Live Standings
              <Link href="/admin/divisions" className="text-xs font-normal text-primary hover:underline">View all</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-0 pb-4">
            {topTeams.length === 0 ? (
              <p className="px-6 text-sm text-muted-foreground">No standings data from API yet.</p>
            ) : (
              topTeams.map((team, i) => (
                <div key={team.name} className="flex items-center gap-3 px-6 py-1">
                  <Badge variant={i === 0 ? "default" : "outline"} className="w-6 justify-center">{i + 1}</Badge>
                  <span className="flex-1 text-sm font-medium">{team.name}</span>
                  <span className="text-sm font-bold text-primary">{team.point}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              Schedule
              <Link href="/admin/schedule" className="text-xs font-normal text-primary hover:underline">View all</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-0 pb-4">
            {recentSchedule.length === 0 ? (
              <p className="px-6 text-sm text-muted-foreground">No upcoming schedule from API.</p>
            ) : (
              recentSchedule.map((entry) => (
                <div key={`${entry.competitionId}-${entry.startTime}`} className="flex items-start gap-3 px-6 py-1">
                  {entry.status === "In Progress"
                    ? <Loader2 className="mt-0.5 size-3.5 shrink-0 animate-spin text-amber-500" />
                    : <Clock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{entry.competitionName}</p>
                    <p className="text-xs text-muted-foreground">{entry.startTime} · {entry.stageName}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
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

      {/* Recent results */}
      {recentResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              Recent Results
              <Link href="/admin/results" className="text-xs font-normal text-primary hover:underline">View all</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentResults.map((comp) => (
                <div key={comp.id} className="flex items-center justify-between gap-3 px-6 py-3">
                  <div>
                    <p className="text-sm font-medium">{comp.name}</p>
                    <p className="text-xs text-muted-foreground">{comp.category} · {comp.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {comp.stage && <Badge variant="secondary">{comp.stage}</Badge>}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comp.publishedAt!), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

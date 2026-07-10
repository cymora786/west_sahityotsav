"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trophy, Medal, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

type StandingRow = {
  id: string;
  name: string;
  code: string;
  slug: string;
  points: number;
  itemsParticipated: number;
};

const STATUS_BADGES = [
  { label: "Leading", className: "bg-amber-400 text-amber-950 hover:bg-amber-400" },
  { label: "2nd", className: "bg-slate-300 text-slate-800 hover:bg-slate-300" },
  { label: "3rd", className: "bg-amber-700 text-amber-50 hover:bg-amber-700" },
];

const RANK_BADGES = [
  { icon: Crown, className: "bg-amber-400 text-amber-950" },
  { icon: Medal, className: "bg-slate-300 text-slate-800" },
  { icon: Medal, className: "bg-amber-700 text-amber-50" },
];

const RANK_ROW_TINTS = [
  "bg-amber-50/60 dark:bg-amber-400/5",
  "bg-slate-50 dark:bg-slate-400/5",
  "bg-amber-50/30 dark:bg-amber-700/5",
];

export function StandingsTable({ rows }: { rows: StandingRow[] }) {
  const sorted = [...rows].sort((a, b) => b.points - a.points);

  const handleExportPdf = async () => {
    try {
      const jspdfModule = await import("jspdf");
      const JsPDF = jspdfModule.jsPDF ?? jspdfModule.default;
      const doc = new JsPDF();

      doc.setFontSize(16);
      doc.text("SSF Malappuram West Sahityotsav 2026", 14, 16);
      doc.setFontSize(12);
      doc.text("Division Standings", 14, 24);

      doc.setFontSize(10);
      let y = 36;
      doc.text("Rank", 14, y);
      doc.text("Division", 34, y);
      doc.text("Total Points", 140, y);
      doc.text("Status", 175, y);
      y += 4;
      doc.line(14, y, 196, y);
      y += 6;

      sorted.forEach((row, index) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        const status = STATUS_BADGES[index]?.label ?? "-";
        doc.text(String(index + 1), 14, y);
        doc.text(`${row.name} (${row.code})`, 34, y);
        doc.text(String(row.points), 150, y);
        doc.text(status, 175, y);
        y += 7;
      });

      doc.save("ssf-sahityotsav-2026-standings.pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
    }
  };

  const topScore = sorted[0]?.points ?? 0;

  return (
    <div className="overflow-hidden rounded-2xl border shadow-sm">
      <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 to-emerald-900 px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-bold tracking-wide text-white uppercase">
          <Trophy className="size-5 text-amber-400" />
          Overall Standings
        </h2>
        <Button
          size="sm"
          className="bg-amber-400 text-amber-950 hover:bg-amber-300"
          onClick={handleExportPdf}
        >
          <Download className="size-4" />
          Download PDF
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Division</TableHead>
            <TableHead className="text-right">Total Points</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-muted-foreground"
              >
                No divisions found.
              </TableCell>
            </TableRow>
          )}
          {sorted.map((row, index) => {
            const rank = index + 1;
            const status = STATUS_BADGES[rank - 1];
            const rankBadge = RANK_BADGES[rank - 1];
            const tint = RANK_ROW_TINTS[rank - 1];
            return (
              <TableRow key={row.id} className={tint}>
                <TableCell>
                  {rankBadge ? (
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full shadow-sm",
                        rankBadge.className
                      )}
                    >
                      <rankBadge.icon className="size-4" />
                    </span>
                  ) : (
                    <span className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                      {rank}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {row.points > 0 ? (
                    <Link
                      href={`/division/${row.slug}`}
                      className={cn("font-medium hover:text-primary", rank <= 3 && "font-bold")}
                    >
                      {row.name}
                    </Link>
                  ) : (
                    <span className={cn("font-medium text-muted-foreground", rank <= 3 && "font-bold")}>
                      {row.name}
                    </span>
                  )}
                  <div className="mt-1.5 h-1.5 w-32 overflow-hidden rounded-full bg-muted sm:w-40">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                      style={{
                        width: `${topScore > 0 ? (row.points / topScore) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right text-lg font-extrabold text-primary">
                  {row.points}
                </TableCell>
                <TableCell className="text-right">
                  {status ? (
                    <Badge className={status.className}>{status.label}</Badge>
                  ) : (
                    <Badge variant="secondary">—</Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

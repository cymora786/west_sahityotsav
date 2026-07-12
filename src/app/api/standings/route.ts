import { NextResponse } from "next/server";
import { getTeamPoints, getCategoryTeamPoints } from "@/lib/sahityotsav-api";
import { getDivisionsList } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "General";

  const [apiPoints, divisions] = await Promise.all([
    category === "General" ? getTeamPoints(0) : getCategoryTeamPoints(category, 0),
    getDivisionsList(),
  ]);

  const rows = apiPoints && apiPoints.length > 0
    ? apiPoints.map((e) => {
        const local = divisions.find((d) => d.name.toLowerCase() === e.name.toLowerCase());
        return { name: e.name, slug: local?.slug ?? e.name.toLowerCase().replace(/\s+/g, "-"), points: e.point };
      })
    : divisions.map((d) => ({ name: d.name, slug: d.slug, points: 0 }));

  const sorted = rows.sort((a, b) => b.points - a.points);
  return NextResponse.json(sorted);
}

import { NextResponse } from "next/server";
import { getTeamPoints, getCategoryTeamPoints } from "@/lib/sahityotsav-api";
import { getDivisionsList } from "@/lib/queries";

const STATIC_GENERAL_STANDINGS = [
  { name: "Tirurangadi Division", points: 822 },
  { name: "Vengara Division",     points: 702 },
  { name: "Kottakkal Division",   points: 542 },
  { name: "Thenhippalam Division",points: 542 },
  { name: "Parappanangadi Division", points: 523 },
  { name: "Vailathur Division",   points: 444 },
  { name: "Tanur Division",       points: 438 },
  { name: "Valanchery Division",  points: 430 },
  { name: "Puthanathani Division",points: 419 },
  { name: "Edappal Division",     points: 412 },
  { name: "Ponnani Division",     points: 343 },
  { name: "Tirur Division",       points: 241 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "General";

  const [apiPoints, divisions] = await Promise.all([
    category === "General" ? getTeamPoints(0) : getCategoryTeamPoints(category, 0),
    getDivisionsList(),
  ]);

  let rows;
  if (category === "General") {
    // Always use static standings for General category
    rows = STATIC_GENERAL_STANDINGS.map((s) => {
      const local = divisions.find((d) => d.name.toLowerCase() === s.name.toLowerCase());
      return { name: s.name, slug: local?.slug ?? s.name.toLowerCase().replace(/\s+/g, "-"), points: s.points };
    });
  } else if (apiPoints && apiPoints.length > 0) {
    rows = apiPoints.map((e) => {
      const local = divisions.find((d) => d.name.toLowerCase() === e.name.toLowerCase());
      return { name: e.name, slug: local?.slug ?? e.name.toLowerCase().replace(/\s+/g, "-"), points: e.point };
    });
  } else {
    rows = divisions.map((d) => ({ name: d.name, slug: d.slug, points: 0 }));
  }

  const sorted = rows.sort((a, b) => b.points - a.points);
  return NextResponse.json(sorted);
}

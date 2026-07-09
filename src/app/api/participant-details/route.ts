import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://sahityotsav.com";
const API_KEY = process.env.SAHITYOTSAV_API_KEY ?? "";

export async function GET(req: NextRequest) {
  const chestNumber = req.nextUrl.searchParams.get("chestNumber");
  const dob = req.nextUrl.searchParams.get("dob");

  if (!chestNumber || !dob) {
    return NextResponse.json({ error: "chestNumber and dob are required" }, { status: 400 });
  }

  try {
    const url = `${BASE_URL}/api/public/participant-details?chestNumber=${encodeURIComponent(chestNumber)}&dob=${encodeURIComponent(dob)}`;
    const res = await fetch(url, {
      headers: { "x-api-key": API_KEY },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: json.msg ?? "Not found" }, { status: res.status });
    }

    return NextResponse.json(json.data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch participant details" }, { status: 500 });
  }
}

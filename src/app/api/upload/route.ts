import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = (formData.get("folder") as string | null) ?? "misc";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const url = await uploadImage(file, folder);
  return NextResponse.json({ url });
}

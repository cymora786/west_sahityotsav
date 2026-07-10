import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NewsForm } from "../../news-form";

export const metadata = { title: "Edit News" };

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.announcement.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <NewsForm
      item={{
        id: item.id,
        title: item.title,
        description: item.description,
        body: item.body,
        imageUrl: item.imageUrl,
        priority: item.priority,
      }}
    />
  );
}

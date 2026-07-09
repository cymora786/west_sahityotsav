import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TemplateForm } from "@/components/admin/template-form";
import { updateTemplate } from "../actions";

export const metadata = { title: "Edit Poster Template" };

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = await prisma.posterTemplate.findUnique({ where: { id } });
  if (!template) notFound();

  const action = updateTemplate.bind(null, template.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <TemplateForm template={template} action={action} />
    </div>
  );
}

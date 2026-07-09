import { TemplateForm } from "@/components/admin/template-form";
import { createTemplate } from "../actions";

export const metadata = { title: "New Poster Template" };

export default function NewTemplatePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <TemplateForm action={createTemplate} />
    </div>
  );
}

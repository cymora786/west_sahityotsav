import Image from "next/image";
import { getPosterTemplates } from "@/lib/queries";
import { Card, CardContent } from "@/components/ui/card";
import { TemplateDialog } from "./template-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteTemplate } from "./actions";

export const metadata = {
  title: "Poster Templates",
};

export default async function AdminTemplatesPage() {
  const templates = await getPosterTemplates();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Poster Templates</h1>
          <p className="text-sm text-muted-foreground">
            Manage poster templates used for result posters. Use names like
            Classic, Modern, Minimal, Festive or Bold to match the built-in
            layouts.
          </p>
        </div>
        <TemplateDialog />
      </div>

      {templates.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          No poster templates yet. Add your first template to get started.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardContent className="space-y-3 py-4">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={template.thumbnail}
                    alt={template.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{template.name}</h3>
                  <div className="flex items-center gap-1">
                    <TemplateDialog
                      template={{
                        id: template.id,
                        name: template.name,
                        thumbnail: template.thumbnail,
                        backgroundImage: template.backgroundImage,
                        primaryColor: template.primaryColor,
                        accentColor: template.accentColor,
                        textColor: template.textColor,
                        customCss: template.customCss,
                      }}
                    />
                    <DeleteButton
                      action={deleteTemplate.bind(null, template.id)}
                      confirmMessage={`Delete template "${template.name}"?`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

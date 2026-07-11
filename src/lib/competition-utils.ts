export function competitionSlug(comp: { name: string; category: string }) {
  return `${comp.name}-${comp.category}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

-- CreateTable
CREATE TABLE "gallery_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gallery_categories_slug_key" ON "gallery_categories"("slug");

-- Seed default categories (matching previous enum values)
INSERT INTO "gallery_categories" ("id", "name", "slug") VALUES
  ('inauguration', 'Inauguration', 'inauguration'),
  ('competitions', 'Competitions', 'competitions'),
  ('stage_events', 'Stage Events', 'stage-events'),
  ('awards', 'Awards', 'awards'),
  ('closing_ceremony', 'Closing Ceremony', 'closing-ceremony');

-- AlterTable: add categoryId, backfill from old enum column, then drop the old column
ALTER TABLE "gallery" ADD COLUMN "categoryId" TEXT;

UPDATE "gallery" SET "categoryId" = lower("category"::text);

ALTER TABLE "gallery" ALTER COLUMN "categoryId" SET NOT NULL;

ALTER TABLE "gallery" DROP COLUMN "category";

-- AddForeignKey
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "gallery_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropType
DROP TYPE "GalleryCategory";

-- AlterTable: poster template custom style fields
ALTER TABLE "poster_templates" ADD COLUMN "primaryColor" TEXT;
ALTER TABLE "poster_templates" ADD COLUMN "accentColor" TEXT;
ALTER TABLE "poster_templates" ADD COLUMN "textColor" TEXT;

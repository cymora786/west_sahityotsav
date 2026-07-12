-- AlterTable: add body and imageUrl columns to announcements
ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "body" TEXT;
ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;

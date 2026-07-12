-- Add layout column to poster_templates
ALTER TABLE "poster_templates" ADD COLUMN IF NOT EXISTS "layout" TEXT;

-- CreateTable competition_posters
CREATE TABLE IF NOT EXISTS "competition_posters" (
    "id" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "posterImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "competition_posters_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "competition_posters_competitionId_key" ON "competition_posters"("competitionId");

-- CreateTable media
CREATE TABLE IF NOT EXISTS "media" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable event_settings
CREATE TABLE IF NOT EXISTS "event_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "whatsappTemplate" TEXT,
    "instagramCaption" TEXT,
    "heroBadge" TEXT,
    "heroTitle" TEXT,
    "heroHighlight" TEXT,
    "heroDescription" TEXT,
    "footerTagline" TEXT,
    "footerPhone" TEXT,
    "footerEmail" TEXT,
    "footerAddress" TEXT,
    "footerOrganization" TEXT,
    "footerFacebook" TEXT,
    "footerInstagram" TEXT,
    "footerWhatsapp" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "event_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable certificate_settings
CREATE TABLE IF NOT EXISTS "certificate_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "firstBg" TEXT,
    "secondBg" TEXT,
    "thirdBg" TEXT,
    "firstTextColor" TEXT,
    "firstOverlay" DOUBLE PRECISION,
    "firstFont" TEXT,
    "secondTextColor" TEXT,
    "secondOverlay" DOUBLE PRECISION,
    "secondFont" TEXT,
    "thirdTextColor" TEXT,
    "thirdOverlay" DOUBLE PRECISION,
    "thirdFont" TEXT,
    "firstCustomCss" TEXT,
    "secondCustomCss" TEXT,
    "thirdCustomCss" TEXT,
    "firstLayout" TEXT,
    "secondLayout" TEXT,
    "thirdLayout" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "certificate_settings_pkey" PRIMARY KEY ("id")
);

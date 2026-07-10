import { prisma } from "@/lib/prisma";

export async function getStandings() {
  return prisma.division.findMany({
    include: { points: true },
    orderBy: { points: { currentPoints: "desc" } },
  });
}

export async function getTopStandings(limit = 5) {
  const standings = await getStandings();
  return standings.slice(0, limit);
}

export async function getStandingsWithStats() {
  const [standings, participantRows] = await Promise.all([
    getStandings(),
    prisma.participant.findMany({
      select: { divisionId: true, itemId: true },
      distinct: ["divisionId", "itemId"],
    }),
  ]);

  const itemCounts = new Map<string, number>();
  for (const row of participantRows) {
    itemCounts.set(row.divisionId, (itemCounts.get(row.divisionId) ?? 0) + 1);
  }

  return standings.map((division) => ({
    ...division,
    itemsParticipated: itemCounts.get(division.id) ?? 0,
  }));
}

export async function getDivisionBySlug(slug: string) {
  return prisma.division.findUnique({
    where: { slug },
    include: {
      points: true,
      results: {
        where: { status: "PUBLISHED" },
        include: {
          category: true,
          item: true,
          secondPlaceDivision: true,
          thirdPlaceDivision: true,
        },
        orderBy: { publishedDate: "desc" },
        take: 10,
      },
      participants: {
        include: { category: true, item: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getLatestResults(limit = 6) {
  return prisma.result.findMany({
    where: { status: "PUBLISHED" },
    include: {
      category: true,
      item: true,
      division: true,
      secondPlaceDivision: true,
      thirdPlaceDivision: true,
      template: true,
    },
    orderBy: { publishedDate: "desc" },
    take: limit,
  });
}

export async function getPublishedResultsCount() {
  return prisma.result.count({ where: { status: "PUBLISHED" } });
}

export async function getAllResults() {
  return prisma.result.findMany({
    where: { status: "PUBLISHED" },
    include: {
      category: true,
      item: true,
      division: true,
      secondPlaceDivision: true,
      thirdPlaceDivision: true,
      template: true,
    },
    orderBy: { publishedDate: "desc" },
  });
}

export async function getAllResultsAdmin() {
  return prisma.result.findMany({
    include: {
      category: true,
      item: true,
      division: true,
      secondPlaceDivision: true,
      thirdPlaceDivision: true,
      template: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDivisionsList() {
  return prisma.division.findMany({
    select: { id: true, name: true, code: true, slug: true },
    orderBy: { name: "asc" },
  });
}

export async function getResultById(id: string) {
  return prisma.result.findUnique({
    where: { id },
    include: {
      category: true,
      item: true,
      division: true,
      secondPlaceDivision: true,
      thirdPlaceDivision: true,
      template: true,
    },
  });
}

export async function getRelatedResults(resultId: string, categoryId: string, limit = 4) {
  return prisma.result.findMany({
    where: {
      id: { not: resultId },
      categoryId,
      status: "PUBLISHED",
    },
    include: {
      category: true,
      item: true,
      division: true,
      secondPlaceDivision: true,
      thirdPlaceDivision: true,
    },
    orderBy: { publishedDate: "desc" },
    take: limit,
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: {
        select: {
          items: { where: { status: "PUBLISHED" } },
          results: { where: { status: "PUBLISHED" } },
        },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryLeaders() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
  });

  const leaders = await Promise.all(
    categories.map(async (category) => {
      const winners = await prisma.result.groupBy({
        by: ["divisionId"],
        where: { categoryId: category.id, status: "PUBLISHED" },
        _count: { divisionId: true },
        orderBy: { _count: { divisionId: "desc" } },
        take: 1,
      });

      if (winners.length === 0) return { category, division: null, wins: 0 };

      const division = await prisma.division.findUnique({
        where: { id: winners[0].divisionId },
      });

      return { category, division, wins: winners[0]._count.divisionId };
    })
  );

  return leaders;
}

export async function getItems() {
  return prisma.item.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });
}

export async function getProgrammeProgress() {
  const items = await prisma.item.findMany({
    select: {
      results: { select: { status: true } },
    },
  });

  let completed = 0;
  let ongoing = 0;
  let pending = 0;

  for (const item of items) {
    if (item.results.some((r) => r.status === "PUBLISHED")) {
      completed++;
    } else if (item.results.length > 0) {
      ongoing++;
    } else {
      pending++;
    }
  }

  return { completed, ongoing, pending, total: items.length };
}

export async function getParticipants() {
  return prisma.participant.findMany({
    include: { division: true, category: true, item: true },
    orderBy: { name: "asc" },
  });
}

export async function getPosterTemplates() {
  return prisma.posterTemplate.findMany({ orderBy: { createdAt: "asc" } });
}

export async function getGallery(limit?: number) {
  return prisma.gallery.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getGalleryCategories() {
  return prisma.galleryCategory.findMany({ orderBy: { createdAt: "asc" } });
}

export async function getAnnouncements(limit?: number) {
  return prisma.announcement.findMany({
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function getAnnouncementById(id: string) {
  return prisma.announcement.findUnique({ where: { id } });
}

export async function getMedia(limit?: number) {
  return prisma.media.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function getMediaByYear() {
  const videos = await prisma.media.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });
  const byYear = new Map<number, typeof videos>();
  for (const v of videos) {
    if (!byYear.has(v.year)) byYear.set(v.year, []);
    byYear.get(v.year)!.push(v);
  }
  return Array.from(byYear.entries()).map(([year, videos]) => ({ year, videos }));
}

export async function getSchedules() {
  return prisma.schedule.findMany({
    include: { category: true },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });
}

export async function getRecentPointLogs(limit = 5) {
  return prisma.pointLog.findMany({
    include: { division: true, updatedBy: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getEventSettings() {
  return prisma.eventSettings.findUnique({ where: { id: "singleton" } });
}

export async function upsertEventSettings(data: {
  whatsappTemplate?: string;
  instagramCaption?: string;
  heroBadge?: string;
  heroTitle?: string;
  heroHighlight?: string;
  heroDescription?: string;
  footerTagline?: string;
  footerPhone?: string;
  footerEmail?: string;
  footerAddress?: string;
  footerOrganization?: string;
  footerFacebook?: string;
  footerInstagram?: string;
  footerWhatsapp?: string;
}) {
  return prisma.eventSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
}

export async function getCertificateSettings() {
  return prisma.certificateSettings.findUnique({ where: { id: "singleton" } });
}

export async function upsertCertificateSettings(data: {
  firstBg?: string | null;
  secondBg?: string | null;
  thirdBg?: string | null;
  firstTextColor?: string | null;
  firstOverlay?: number | null;
  firstFont?: string | null;
  secondTextColor?: string | null;
  secondOverlay?: number | null;
  secondFont?: string | null;
  thirdTextColor?: string | null;
  thirdOverlay?: number | null;
  thirdFont?: string | null;
  firstCustomCss?: string | null;
  secondCustomCss?: string | null;
  thirdCustomCss?: string | null;
  firstLayout?: string | null;
  secondLayout?: string | null;
  thirdLayout?: string | null;
}) {
  return prisma.certificateSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
}

export async function getDashboardStats() {
  const [
    divisions,
    participants,
    results,
    items,
    publishedResults,
    announcements,
  ] = await Promise.all([
    prisma.division.count(),
    prisma.participant.count(),
    prisma.result.count(),
    prisma.item.count(),
    prisma.result.count({ where: { status: "PUBLISHED" } }),
    prisma.announcement.count(),
  ]);

  return {
    divisions,
    participants,
    results,
    items,
    publishedResults,
    announcements,
  };
}

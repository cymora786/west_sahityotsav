import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DIVISIONS = [
  { name: "Malappuram", code: "MLP", slug: "malappuram" },
  { name: "Manjeri", code: "MNJ", slug: "manjeri" },
  { name: "Perinthalmanna", code: "PNM", slug: "perinthalmanna" },
  { name: "Tirur", code: "TIR", slug: "tirur" },
  { name: "Ponnani", code: "PON", slug: "ponnani" },
  { name: "Kondotty", code: "KDT", slug: "kondotty" },
  { name: "Wandoor", code: "WND", slug: "wandoor" },
  { name: "Nilambur", code: "NLB", slug: "nilambur" },
];

const CATEGORIES = [
  {
    name: "Sub Junior",
    slug: "sub-junior",
    description: "For participants up to 12 years of age",
    items: ["Quran Recitation", "Speech", "Essay Writing", "Drawing", "Quiz"],
  },
  {
    name: "Junior",
    slug: "junior",
    description: "For participants aged 13-15 years",
    items: ["Group Song", "Mono Act", "Story Writing", "Debate", "Quiz"],
  },
  {
    name: "Senior",
    slug: "senior",
    description: "For participants aged 16-18 years",
    items: ["Poem Recitation", "Group Song", "Essay Writing", "Debate", "Mono Act"],
  },
  {
    name: "Super Senior",
    slug: "super-senior",
    description: "For participants above 18 years",
    items: ["Speech", "Story Writing", "Group Song", "Quiz", "Drawing"],
  },
];

const TEMPLATES = [
  { name: "Classic" },
  { name: "Modern" },
  { name: "Minimal" },
  { name: "Festive" },
  { name: "Bold" },
];

function pick<T>(arr: T[], index: number) {
  return arr[index % arr.length];
}

async function main() {
  console.log("Seeding database...");

  // Admin user
  const passwordHash = await bcrypt.hash("Sahityotsav@2026", 10);
  await prisma.user.upsert({
    where: { email: "admin@ssfmalappuram.org" },
    update: {},
    create: {
      name: "SSF Malappuram Admin",
      email: "admin@ssfmalappuram.org",
      password: passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  // Divisions + initial points
  const divisions = [];
  for (const [index, division] of DIVISIONS.entries()) {
    const created = await prisma.division.upsert({
      where: { slug: division.slug },
      update: {},
      create: {
        ...division,
        points: { create: { currentPoints: (DIVISIONS.length - index) * 12 } },
      },
      include: { points: true },
    });
    divisions.push(created);
  }

  // Point logs (audit trail)
  for (const division of divisions) {
    await prisma.pointLog.create({
      data: {
        divisionId: division.id,
        previousPoints: 0,
        newPoints: division.points?.currentPoints ?? 0,
        reason: "Initial points allotment for Sahityotsav 2026",
      },
    });
  }

  // Categories + items
  const categories = [];
  for (const category of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });
    categories.push({ ...created, itemNames: category.items });
  }

  const items: { id: string; name: string; categoryId: string }[] = [];
  for (const category of categories) {
    for (const itemName of category.itemNames) {
      const existing = await prisma.item.findFirst({
        where: { name: itemName, categoryId: category.id },
      });
      const item =
        existing ??
        (await prisma.item.create({
          data: {
            name: itemName,
            categoryId: category.id,
            venue: "Main Auditorium",
            status: "PUBLISHED",
          },
        }));
      items.push({ id: item.id, name: item.name, categoryId: item.categoryId });
    }
  }

  // Poster templates
  const templates = [];
  for (const template of TEMPLATES) {
    const existing = await prisma.posterTemplate.findFirst({
      where: { name: template.name },
    });
    const created =
      existing ??
      (await prisma.posterTemplate.create({
        data: {
          name: template.name,
          thumbnail: `https://picsum.photos/seed/${template.name.toLowerCase()}-thumb/400/500`,
          backgroundImage: `https://picsum.photos/seed/${template.name.toLowerCase()}-bg/1080/1350`,
        },
      }));
    templates.push(created);
  }

  // Participants + results
  let participantCount = 0;
  let resultCount = 0;
  for (const item of items) {
    for (const [dIndex, division] of divisions.entries()) {
      const name = `${item.name.split(" ")[0]} Participant ${dIndex + 1}`;
      await prisma.participant.create({
        data: {
          name,
          divisionId: division.id,
          categoryId: item.categoryId,
          itemId: item.id,
        },
      });
      participantCount += 1;
    }

    // Publish a result for roughly every other item
    if (resultCount % 2 === 0) {
      const [first, second, third] = divisions;
      await prisma.result.create({
        data: {
          categoryId: item.categoryId,
          itemId: item.id,
          divisionId: first.id,
          venue: "Main Auditorium",
          firstPlaceName: `${item.name.split(" ")[0]} Participant 1`,
          secondPlaceName: `${item.name.split(" ")[0]} Participant 2`,
          secondPlaceDivisionId: second?.id,
          thirdPlaceName: `${item.name.split(" ")[0]} Participant 3`,
          thirdPlaceDivisionId: third?.id,
          templateId: pick(templates, resultCount).id,
          status: "PUBLISHED",
          publishedDate: new Date(),
        },
      });
    } else {
      await prisma.result.create({
        data: {
          categoryId: item.categoryId,
          itemId: item.id,
          divisionId: divisions[1].id,
          venue: "Main Auditorium",
          firstPlaceName: `${item.name.split(" ")[0]} Participant 2`,
          status: "DRAFT",
        },
      });
    }
    resultCount += 1;
  }

  // Gallery categories
  const GALLERY_CATEGORIES = [
    { id: "inauguration", name: "Inauguration", slug: "inauguration" },
    { id: "competitions", name: "Competitions", slug: "competitions" },
    { id: "stage_events", name: "Stage Events", slug: "stage-events" },
    { id: "awards", name: "Awards", slug: "awards" },
    { id: "closing_ceremony", name: "Closing Ceremony", slug: "closing-ceremony" },
  ];

  const galleryCategories = [];
  for (const category of GALLERY_CATEGORIES) {
    const created = await prisma.galleryCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    galleryCategories.push(created);
  }

  for (const [index, category] of galleryCategories.entries()) {
    await prisma.gallery.create({
      data: {
        imageUrl: `https://picsum.photos/seed/gallery-${index}/1200/800`,
        caption: `${category.name} - Sahityotsav 2026`,
        categoryId: category.id,
      },
    });
  }

  // Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: "Welcome to Sahityotsav 2026",
        description:
          "SSF Malappuram District Sahityotsav 2026 is officially open. Stay tuned for live updates on results and standings.",
        priority: "HIGH",
      },
      {
        title: "Item Cards Available",
        description:
          "Item cards for all categories are now available. Participants are requested to verify their details.",
        priority: "NORMAL",
      },
      {
        title: "Venue Change for Group Song",
        description:
          "The Group Song competition has been moved to the Main Auditorium due to high registrations.",
        priority: "LOW",
      },
    ],
  });

  // Schedule
  const day1 = new Date("2026-07-10T00:00:00.000Z");
  const day2 = new Date("2026-07-11T00:00:00.000Z");

  await prisma.schedule.createMany({
    data: [
      {
        day: "Day 1",
        date: day1,
        time: "9:00 AM",
        title: "Inauguration Ceremony",
        venue: "Main Stage",
        description: "Grand inauguration of Sahityotsav 2026",
      },
      {
        day: "Day 1",
        date: day1,
        time: "11:00 AM",
        title: "Quran Recitation (Sub Junior)",
        venue: "Hall A",
        categoryId: categories[0].id,
      },
      {
        day: "Day 1",
        date: day1,
        time: "2:00 PM",
        title: "Group Song (Junior & Senior)",
        venue: "Main Auditorium",
        categoryId: categories[1].id,
      },
      {
        day: "Day 2",
        date: day2,
        time: "10:00 AM",
        title: "Debate Finals",
        venue: "Hall B",
        categoryId: categories[2].id,
      },
      {
        day: "Day 2",
        date: day2,
        time: "5:00 PM",
        title: "Closing Ceremony & Prize Distribution",
        venue: "Main Stage",
      },
    ],
  });

  console.log(`Seed complete: ${divisions.length} divisions, ${categories.length} categories,`);
  console.log(`${items.length} items, ${participantCount} participants, ${resultCount} results.`);
  console.log("Admin login -> email: admin@ssfmalappuram.org / password: Sahityotsav@2026");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

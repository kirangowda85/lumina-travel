import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { packages } from "../lib/mock-data";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Seed default hero settings
  await prisma.heroSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      badge: "Four destinations, one standard of care",
      title: "Curated Journeys, Perfectly Reserved",
      description:
        "Every itinerary in our collection is planned to the day and paced to the traveler. Choose a journey, pick your dates, and we handle the rest.",
      videoUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-top-aerial-view-of-a-beach-resort-1662-large.mp4",
      imageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80",
    },
  });

  // Seed packages
  for (const pkg of packages) {
    console.log(`Seeding package: ${pkg.title}`);
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: {
        title: pkg.title,
        location: pkg.location,
        category: pkg.category,
        description: pkg.description,
        basePrice: pkg.basePrice,
        durationDays: pkg.durationDays,
        featured: pkg.featured,
        images: pkg.images,
        videoUrl: pkg.videoUrl ?? null,
        itinerary: JSON.parse(JSON.stringify(pkg.itinerary)),
      },
      create: {
        id: pkg.id,
        slug: pkg.slug,
        title: pkg.title,
        location: pkg.location,
        category: pkg.category,
        description: pkg.description,
        basePrice: pkg.basePrice,
        durationDays: pkg.durationDays,
        featured: pkg.featured,
        images: pkg.images,
        videoUrl: pkg.videoUrl ?? null,
        itinerary: JSON.parse(JSON.stringify(pkg.itinerary)),
        roomOptions: {
          create: pkg.roomOptions.map((ro) => ({
            id: ro.id,
            name: ro.name,
            description: ro.description,
            priceUpgrade: ro.priceUpgrade,
          })),
        },
        availability: {
          create: pkg.availability.map((av) => ({
            id: av.id,
            date: new Date(av.date),
            capacity: av.capacity,
            booked: av.booked,
            fastFilling: av.fastFilling,
          })),
        },
      },
    });
  }

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

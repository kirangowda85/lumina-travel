import "server-only";
import { prisma } from "@/lib/prisma";
import { packages as mockPackages } from "@/lib/mock-data";
import type {
  AvailabilityDate,
  Category,
  ItineraryDay,
  Package,
  RoomOption,
} from "@/types";
import type {
  AvailabilityDate as PrismaAvailabilityDate,
  Package as PrismaPackage,
  RoomOption as PrismaRoomOption,
} from "@prisma/client";

// Maps a Prisma Package row (with its relations loaded) onto the same
// `Package` shape `lib/mock-data.ts` used in Phase 1, so every component
// built against that shape (DestinationCard, Calendar, PriceSummaryCard,
// etc.) keeps working unchanged now that the data comes from the DB.
type PackageWithRelations = PrismaPackage & {
  roomOptions: PrismaRoomOption[];
  availability: PrismaAvailabilityDate[];
};

function toRoomOption(r: PrismaRoomOption): RoomOption {
  return {
    id: r.id,
    packageId: r.packageId,
    name: r.name,
    description: r.description,
    priceUpgrade: r.priceUpgrade,
  };
}

function toAvailability(a: PrismaAvailabilityDate): AvailabilityDate {
  return {
    id: a.id,
    packageId: a.packageId,
    date: a.date.toISOString().slice(0, 10),
    capacity: a.capacity,
    booked: a.booked,
    fastFilling: a.fastFilling,
  };
}

function toPackage(p: PackageWithRelations): Package {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    location: p.location,
    category: p.category as Category,
    description: p.description,
    basePrice: p.basePrice,
    durationDays: p.durationDays,
    images: p.images,
    videoUrl: p.videoUrl,
    featured: p.featured,
    // Force a plain-JS JSON round-trip so Prisma 7's JsonValue type
    // survives Next.js RSC serialization without becoming undefined.
    itinerary: JSON.parse(JSON.stringify(p.itinerary ?? [])) as ItineraryDay[],
    roomOptions: p.roomOptions.map(toRoomOption),
    availability: p.availability.map(toAvailability),
  };
}

export async function getHeroSettings() {
  const defaultHero = {
    id: "default",
    badge: "Four destinations, one standard of care",
    title: "Curated Journeys, Perfectly Reserved",
    description: "Every itinerary in our collection is planned to the day and paced to the traveler. Choose a journey, pick your dates, and we handle the rest.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-aerial-view-of-a-beach-resort-1662-large.mp4",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80",
  };
  if (!prisma) return defaultHero;
  try {
    const hero = await prisma.heroSettings.findUnique({ where: { id: "default" } });
    if (!hero) {
      return await prisma.heroSettings.create({ data: defaultHero });
    }
    return hero;
  } catch {
    return defaultHero;
  }
}


const withRelations = {
  roomOptions: true,
  // Only pull availability for the current month forward — same window
  // `buildAvailability` generated in the mock, and all the calendar needs.
  availability: {
    orderBy: { date: "asc" as const },
  },
};

export async function getAllPackages(): Promise<Package[]> {
  if (!prisma) return mockPackages;
  try {
    const rows = await prisma.package.findMany({
      include: withRelations,
      orderBy: { createdAt: "asc" },
    });
    if (rows.length === 0) return mockPackages;
    return rows.map(toPackage);
  } catch (err) {
    console.error("getAllPackages error:", err);
    return mockPackages;
  }
}

export async function getFeaturedPackages(): Promise<Package[]> {
  if (!prisma) return mockPackages.filter((p) => p.featured);
  try {
    const rows = await prisma.package.findMany({
      where: { featured: true },
      include: withRelations,
      orderBy: { createdAt: "asc" },
    });
    if (rows.length === 0) return mockPackages.filter((p) => p.featured);
    return rows.map(toPackage);
  } catch (err) {
    console.error("getFeaturedPackages error:", err);
    return mockPackages.filter((p) => p.featured);
  }
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  if (!prisma) return mockPackages.find((p) => p.slug === slug) ?? null;
  try {
    const row = await prisma.package.findUnique({
      where: { slug },
      include: withRelations,
    });
    if (!row) return mockPackages.find((p) => p.slug === slug) ?? null;
    return toPackage(row);
  } catch (err) {
    console.error("getPackageBySlug error:", err);
    return mockPackages.find((p) => p.slug === slug) ?? null;
  }
}

export async function getAllSlugs(): Promise<string[]> {
  if (!prisma) return mockPackages.map((p) => p.slug);
  try {
    const rows = await prisma.package.findMany({ select: { slug: true } });
    if (rows.length === 0) return mockPackages.map((p) => p.slug);
    return rows.map((r) => r.slug);
  } catch (err) {
    console.error("getAllSlugs error:", err);
    return mockPackages.map((p) => p.slug);
  }
}


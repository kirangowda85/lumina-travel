"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import type { VerificationStatus } from "@/types";

export async function toggleFeaturedPackage(packageId: string, featured: boolean) {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized. Admin session required." };

  if (!prisma) return { success: false, error: "Database unavailable" };
  try {
    await prisma.package.update({
      where: { id: packageId },
      data: { featured },
    });
    revalidatePath("/");
    revalidatePath("/destinations");
    revalidatePath("/admin/destinations");
    return { success: true };
  } catch (err: any) {
    console.error("toggleFeaturedPackage error:", err);
    return { success: false, error: "Failed to update featured status." };
  }
}

export async function deletePackage(packageId: string) {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized. Admin session required." };

  if (!prisma) return { success: false, error: "Database unavailable" };
  try {
    await prisma.$transaction([
      prisma.booking.deleteMany({ where: { packageId } }),
      prisma.favorite.deleteMany({ where: { packageId } }),
      prisma.roomOption.deleteMany({ where: { packageId } }),
      prisma.availabilityDate.deleteMany({ where: { packageId } }),
      prisma.package.delete({ where: { id: packageId } }),
    ]);
    revalidatePath("/");
    revalidatePath("/destinations");
    revalidatePath("/admin/destinations");
    return { success: true };
  } catch (err: any) {
    console.error("deletePackage error:", err);
    return { success: false, error: "Failed to delete package." };
  }
}

export async function savePackage(data: {
  id?: string;
  title: string;
  slug: string;
  location: string;
  category: string;
  description: string;
  basePrice: number;
  durationDays: number;
  featured: boolean;
  images: string[];
  videoUrl?: string | null;
  itinerary: { day: number; title: string; description: string }[];
  roomOptions: { name: string; description: string; priceUpgrade: number }[];
  availabilityDates: string[]; // array of ISO YYYY-MM-DD
}) {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized. Admin session required." };

  if (!prisma) return { success: false, error: "Database unavailable" };

  try {
    const slugExists = await prisma.package.findFirst({
      where: { slug: data.slug, NOT: data.id ? { id: data.id } : undefined },
    });
    if (slugExists) {
      return { success: false, error: `Slug "${data.slug}" is already in use by another destination.` };
    }

    let packageId = data.id;

    if (packageId) {
      // Update existing
      await prisma.package.update({
        where: { id: packageId },
        data: {
          title: data.title,
          slug: data.slug,
          location: data.location,
          category: data.category,
          description: data.description,
          basePrice: Math.round(data.basePrice * 100), // convert dollars to cents
          durationDays: data.durationDays,
          featured: data.featured,
          images: data.images,
          videoUrl: data.videoUrl || null,
          itinerary: data.itinerary,
        },
      });

      // Update room options
      await prisma.roomOption.deleteMany({ where: { packageId } });
      if (data.roomOptions.length > 0) {
        await prisma.roomOption.createMany({
          data: data.roomOptions.map((r) => ({
            packageId: packageId!,
            name: r.name,
            description: r.description,
            priceUpgrade: Math.round(r.priceUpgrade * 100),
          })),
        });
      }

      // Update availability
      await prisma.availabilityDate.deleteMany({ where: { packageId } });
      if (data.availabilityDates && data.availabilityDates.length > 0) {
        await prisma.availabilityDate.createMany({
          data: data.availabilityDates.map((dateStr) => ({
            packageId: packageId!,
            date: new Date(dateStr),
            capacity: 15,
            booked: 0,
          })),
        });
      }
    } else {
      // Create new
      const created = await prisma.package.create({
        data: {
          title: data.title,
          slug: data.slug,
          location: data.location,
          category: data.category,
          description: data.description,
          basePrice: Math.round(data.basePrice * 100),
          durationDays: data.durationDays,
          featured: data.featured,
          images: data.images.length > 0 ? data.images : ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e"],
          videoUrl: data.videoUrl || null,
          itinerary: data.itinerary,
        },
      });
      packageId = created.id;

      if (data.roomOptions.length > 0) {
        await prisma.roomOption.createMany({
          data: data.roomOptions.map((r) => ({
            packageId: packageId!,
            name: r.name,
            description: r.description,
            priceUpgrade: Math.round(r.priceUpgrade * 100),
          })),
        });
      }

      if (data.availabilityDates.length > 0) {
        await prisma.availabilityDate.createMany({
          data: data.availabilityDates.map((dateStr) => ({
            packageId: packageId!,
            date: new Date(dateStr),
            capacity: 10,
            booked: 0,
          })),
        });
      }
    }

    revalidatePath("/");
    revalidatePath("/destinations");
    revalidatePath(`/destinations/${data.slug}`);
    revalidatePath("/admin/destinations");

    return { success: true, packageId };
  } catch (err: any) {
    console.error("savePackage error:", err);
    return { success: false, error: "Failed to save package." };
  }
}

export async function updateVerificationStatus(verificationId: string, status: VerificationStatus) {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized. Admin session required." };

  if (!prisma) return { success: false, error: "Database unavailable" };
  try {
    await prisma.identityVerification.update({
      where: { id: verificationId },
      data: { status },
    });
    revalidatePath("/admin/verifications");
    revalidatePath("/profile/verification");
    return { success: true };
  } catch (err: any) {
    console.error("updateVerificationStatus error:", err);
    return { success: false, error: "Failed to update verification status." };
  }
}

const VALID_BOOKING_STATUSES = ["RESERVED", "CANCELLED", "COMPLETED"] as const;

export async function updateBookingStatus(bookingId: string, status: string) {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized. Admin session required." };

  if (!VALID_BOOKING_STATUSES.includes(status as any)) {
    return { success: false, error: `Invalid status. Must be one of: ${VALID_BOOKING_STATUSES.join(", ")}` };
  }

  if (!prisma) return { success: false, error: "Database unavailable" };
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
    revalidatePath("/admin/bookings");
    revalidatePath("/bookings");
    return { success: true };
  } catch (err: any) {
    console.error("updateBookingStatus error:", err);
    return { success: false, error: "Failed to update booking status." };
  }
}

export async function updateHeroSettings(data: {
  badge: string;
  title: string;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
}) {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized. Admin session required." };

  if (!prisma) return { success: false, error: "Database unavailable" };
  try {
    await prisma.heroSettings.upsert({
      where: { id: "default" },
      update: {
        badge: data.badge,
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl || null,
        imageUrl: data.imageUrl || null,
      },
      create: {
        id: "default",
        badge: data.badge,
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl || null,
        imageUrl: data.imageUrl || null,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/hero");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateAboutSettings(data: {
  badge: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}) {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized. Admin session required." };

  if (!prisma) return { success: false, error: "Database unavailable" };
  try {
    await prisma.aboutSettings.upsert({
      where: { id: "default" },
      update: {
        badge: data.badge,
        title: data.title,
        paragraph1: data.paragraph1,
        paragraph2: data.paragraph2,
        ctaTitle: data.ctaTitle,
        ctaDescription: data.ctaDescription,
        ctaButtonText: data.ctaButtonText,
        ctaButtonLink: data.ctaButtonLink,
      },
      create: {
        id: "default",
        badge: data.badge,
        title: data.title,
        paragraph1: data.paragraph1,
        paragraph2: data.paragraph2,
        ctaTitle: data.ctaTitle,
        ctaDescription: data.ctaDescription,
        ctaButtonText: data.ctaButtonText,
        ctaButtonLink: data.ctaButtonLink,
      },
    });
    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}


import "server-only";
import { prisma } from "@/lib/prisma";

export async function getAdminMetrics() {
  const fallback = {
    totalBookings: 0,
    totalDestinations: 0,
    pendingVerifications: 0,
    totalRevenue: 0,
  };

  if (!prisma) return fallback;

  try {
    const [totalBookings, totalDestinations, pendingVerifications, bookingsAggregate] = await Promise.all([
      prisma.booking.count(),
      prisma.package.count(),
      prisma.identityVerification.count({ where: { status: "pending" } }),
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: "CANCELLED" } },
      }),
    ]);

    return {
      totalBookings,
      totalDestinations,
      pendingVerifications,
      totalRevenue: Math.round((bookingsAggregate._sum.totalAmount || 0) / 100),
    };
  } catch (err) {
    console.error("getAdminMetrics error:", err);
    return fallback;
  }
}

export async function getAllVerifications() {
  if (!prisma) return [];
  try {
    const rows = await prisma.identityVerification.findMany({
      include: { user: true },
      orderBy: { submittedAt: "desc" },
    });
    return rows;
  } catch (err) {
    console.error("getAllVerifications error:", err);
    return [];
  }
}

export async function getAllBookingsAdmin() {
  if (!prisma) return [];
  try {
    const rows = await prisma.booking.findMany({
      include: {
        user: true,
        package: true,
        roomOption: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return rows;
  } catch (err) {
    console.error("getAllBookingsAdmin error:", err);
    return [];
  }
}

export async function getAdminPackageById(id: string) {
  if (!prisma) return null;
  try {
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        roomOptions: true,
        availability: {
          orderBy: { date: "asc" },
        },
      },
    });
    return pkg;
  } catch (err) {
    console.error("getAdminPackageById error:", err);
    return null;
  }
}


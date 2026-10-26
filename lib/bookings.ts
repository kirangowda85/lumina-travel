import "server-only";
import { prisma } from "@/lib/prisma";

export type UserBooking = {
  id: string;
  packageTitle: string;
  packageSlug: string;
  packageImage: string;
  location: string;
  selectedDate: string; // ISO date, YYYY-MM-DD
  adults: number;
  children: number;
  roomName: string | null;
  totalAmount: number; // cents
  status: string; // RESERVED | CANCELLED | COMPLETED
  createdAt: string;
};

export async function getBookingsForUser(userId: string): Promise<UserBooking[]> {
  if (!prisma) return [];
  const rows = await prisma.booking.findMany({
    where: { userId },
    include: { package: true, roomOption: true },
    orderBy: { selectedDate: "asc" },
  });

  return rows.map((b) => ({
    id: b.id,
    packageTitle: b.package.title,
    packageSlug: b.package.slug,
    packageImage: b.package.images[0] ?? "",
    location: b.package.location,
    selectedDate: b.selectedDate.toISOString().slice(0, 10),
    adults: b.adults,
    children: b.children,
    roomName: b.roomOption?.name ?? null,
    totalAmount: b.totalAmount,
    status: b.status,
    createdAt: b.createdAt.toISOString(),
  }));
}

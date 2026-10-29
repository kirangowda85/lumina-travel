"use server";

import { z } from "zod";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { calculatePrice } from "@/lib/pricing";
import { getPackageBySlug } from "@/lib/packages";

// Same formula lib/pricing.ts already used client-side for the live price
// summary — recomputed here so the client's numbers are never trusted for
// what actually gets charged/stored (Section 5 of the build plan).

const createBookingSchema = z.object({
  slug: z.string().min(1),
  selectedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected an ISO date (YYYY-MM-DD)"),
  adults: z.number().int().min(1).max(12),
  children: z.number().int().min(0).max(12),
  roomOptionId: z.string().min(1).nullable(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export type CreateBookingResult =
  | { ok: true; bookingId: string; totalAmount: number }
  | { ok: false; error: string };

async function ensureUserExists(userId: string) {
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress
      || clerkUser?.emailAddresses[0]?.emailAddress
      || `${userId}@user.clerk`;
    const name = `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || clerkUser?.username || "Traveler";
    const avatarUrl = clerkUser?.imageUrl || null;

    user = await prisma.user.upsert({
      where: { id: userId },
      update: { name, email, avatarUrl },
      create: { id: userId, name, email, avatarUrl },
    });
  }
  return user;
}

export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: "You need to sign in to reserve a journey." };
  }

  const parsed = createBookingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "That booking request doesn't look right — please try again." };
  }
  const { slug, selectedDate, adults, children, roomOptionId } = parsed.data;

  // Auto-sync User record if Clerk webhook hasn't fired yet
  await ensureUserExists(userId);

  const pkg = await getPackageBySlug(slug);
  if (!pkg) {
    return { ok: false, error: "That journey couldn't be found." };
  }

  const availability = pkg.availability.find((a) => a.date === selectedDate);
  if (!availability) {
    return { ok: false, error: "That date isn't open for booking." };
  }

  const partySize = adults + children;
  if (availability.booked + partySize > availability.capacity) {
    return { ok: false, error: "That date just sold out — please pick another." };
  }

  const roomOption = roomOptionId ? pkg.roomOptions.find((r) => r.id === roomOptionId) : null;
  if (roomOptionId && !roomOption) {
    return { ok: false, error: "That room option isn't available for this journey." };
  }

  const breakdown = calculatePrice(pkg, adults, children, roomOption ?? null);

  try {
    const booking = await prisma.$transaction(async (tx) => {
      // Re-read and re-check inside the transaction so two people booking
      // the last spots at the same moment can't both succeed.
      const current = await tx.availabilityDate.findUniqueOrThrow({
        where: { id: availability.id },
      });
      if (current.booked + partySize > current.capacity) {
        throw new Error("SOLD_OUT");
      }

      const newBooked = current.booked + partySize;
      await tx.availabilityDate.update({
        where: { id: availability.id },
        data: {
          booked: newBooked,
          fastFilling: current.fastFilling || newBooked / current.capacity >= 0.75,
        },
      });

      return tx.booking.create({
        data: {
          userId,
          packageId: pkg.id,
          selectedDate: new Date(`${selectedDate}T00:00:00Z`),
          adults,
          children,
          roomOptionId: roomOption?.id ?? null,
          baseRate: breakdown.baseRate + breakdown.childRate,
          upgradeFee: breakdown.upgradeFee,
          taxesFees: breakdown.taxesFees,
          totalAmount: breakdown.totalAmount,
          status: "RESERVED",
        },
      });
    });

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    revalidatePath("/bookings");
    revalidatePath("/destinations");
    revalidatePath(`/destinations/${pkg.slug}`);
    revalidatePath(`/destinations/${pkg.slug}/book`);

    return { ok: true, bookingId: booking.id, totalAmount: booking.totalAmount };
  } catch (err) {
    if (err instanceof Error && err.message === "SOLD_OUT") {
      return { ok: false, error: "That date just sold out — please pick another." };
    }
    console.error("createBooking failed", err);
    return { ok: false, error: "Something went wrong reserving that journey. Please try again." };
  }
}

export type CancelBookingResult = { ok: true } | { ok: false; error: string };

export async function cancelBooking(bookingId: string): Promise<CancelBookingResult> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: "You need to sign in to manage bookings." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({ where: { id: bookingId } });
      if (!booking || booking.userId !== userId) {
        throw new Error("NOT_FOUND");
      }
      if (booking.status === "CANCELLED") {
        return; // already cancelled, nothing to reverse
      }

      const partySize = booking.adults + booking.children;
      const availability = await tx.availabilityDate.findFirst({
        where: { packageId: booking.packageId, date: booking.selectedDate },
      });

      if (availability) {
        const newBooked = Math.max(0, availability.booked - partySize);
        await tx.availabilityDate.update({
          where: { id: availability.id },
          data: { booked: newBooked, fastFilling: newBooked / availability.capacity >= 0.75 },
        });
      }

      await tx.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED" } });
    });

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    revalidatePath("/bookings");
    revalidatePath("/destinations");

    return { ok: true };
  } catch (err) {
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return { ok: false, error: "That booking couldn't be found." };
    }
    console.error("cancelBooking failed", err);
    return { ok: false, error: "Something went wrong cancelling that booking. Please try again." };
  }
}

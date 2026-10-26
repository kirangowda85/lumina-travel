import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import BookingsList from "@/components/booking/BookingsList";
import { getBookingsForUser } from "@/lib/bookings";

export const metadata: Metadata = {
  title: "My Bookings | Payana",
  description: "View and manage your reserved Payana curated journeys.",
};

export default async function BookingsPage() {
  const { userId } = await auth();
  const bookings = userId ? await getBookingsForUser(userId) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">Profile</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-navy">My Bookings</h1>

      <BookingsList bookings={bookings} />
    </div>
  );
}

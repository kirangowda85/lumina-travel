import { getAllBookingsAdmin } from "@/lib/admin";
import BookingTable from "@/components/admin/BookingTable";

export const metadata = {
  title: "Customer Bookings | Payana Admin",
};

export default async function AdminBookingsPage() {
  const bookings = await getAllBookingsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-navy">Customer Reservations</h1>
        <p className="text-sm text-muted mt-1">View, track, and update all luxury travel reservations booked across the site.</p>
      </div>

      <BookingTable initialBookings={bookings} />
    </div>
  );
}

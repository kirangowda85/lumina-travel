"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserBooking } from "@/lib/bookings";
import { formatPrice } from "@/lib/pricing";
import { cancelBooking } from "@/lib/actions/booking";

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    RESERVED: "bg-navy/10 text-navy",
    CANCELLED: "bg-rust/10 text-rust",
    COMPLETED: "bg-muted/10 text-muted",
  };
  const labels: Record<string, string> = {
    RESERVED: "Reserved",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
  };
  return (
    <span className={`rounded-pill px-3 py-1 text-xs font-medium ${styles[status] ?? styles.COMPLETED}`}>
      {labels[status] ?? status}
    </span>
  );
}

function dateLabel(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function BookingRow({ booking }: { booking: UserBooking }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isPast = new Date(booking.selectedDate + "T00:00:00") < new Date();
  const canCancel = booking.status === "RESERVED" && !isPast;

  const handleCancel = () => {
    setError(null);
    startTransition(async () => {
      const result = await cancelBooking(booking.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-card bg-card p-4 ring-1 ring-navy/5 sm:flex-row sm:items-center sm:p-5">
      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-28">
        {booking.packageImage && (
          <Image
            src={booking.packageImage}
            alt={booking.packageTitle}
            fill
            sizes="(min-width: 640px) 112px, 100vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/destinations/${booking.packageSlug}`}
            className="font-serif text-base font-semibold text-navy hover:underline"
          >
            {booking.packageTitle}
          </Link>
          <StatusPill status={booking.status} />
        </div>
        <p className="mt-1 text-sm text-muted">{booking.location}</p>
        <p className="mt-1 text-sm text-muted">
          {dateLabel(booking.selectedDate)} · {booking.adults} adult{booking.adults !== 1 ? "s" : ""}
          {booking.children > 0 ? `, ${booking.children} child${booking.children !== 1 ? "ren" : ""}` : ""}
          {booking.roomName ? ` · ${booking.roomName}` : ""}
        </p>
        {error && <p className="mt-1 text-xs text-rust">{error}</p>}
      </div>

      <div className="flex flex-col items-end gap-2 sm:text-right">
        <p className="font-serif text-lg font-semibold text-navy">{formatPrice(booking.totalAmount)}</p>
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="text-xs font-medium text-rust hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Cancelling…" : "Cancel reservation"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function BookingsList({ bookings }: { bookings: UserBooking[] }) {
  if (bookings.length === 0) {
    return (
      <div className="mt-10 rounded-card bg-card p-12 text-center ring-1 ring-navy/5">
        <p className="font-serif text-lg font-semibold text-navy">No journeys reserved yet</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
          Once you reserve a journey, it will appear here with your dates, travelers, and
          status.
        </p>
        <Link
          href="/destinations"
          className="mt-6 inline-block rounded-pill bg-rust px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rust-light"
        >
          Explore Destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-4">
      {bookings.map((b) => (
        <BookingRow key={b.id} booking={b} />
      ))}
    </div>
  );
}

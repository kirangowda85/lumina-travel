"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Calendar from "@/components/booking/Calendar";
import TravelerCounter from "@/components/booking/TravelerCounter";
import RoomOptionCard from "@/components/booking/RoomOptionCard";
import PriceSummaryCard from "@/components/booking/PriceSummaryCard";
import { Package } from "@/types";
import { calculatePrice, formatPrice } from "@/lib/pricing";
import { createBooking } from "@/lib/actions/booking";

export default function BookingClient({ pkg }: { pkg: Package }) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomOptionId, setRoomOptionId] = useState(pkg.roomOptions[0]?.id ?? "");
  const [confirmation, setConfirmation] = useState<{ bookingId: string; totalAmount: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const roomOption = pkg.roomOptions.find((r) => r.id === roomOptionId) ?? null;

  const breakdown = useMemo(
    () => calculatePrice(pkg, adults, children, roomOption),
    [pkg, adults, children, roomOption]
  );

  const handleSubmit = () => {
    if (!selectedDate) return;
    setError(null);
    startTransition(async () => {
      const result = await createBooking({
        slug: pkg.slug,
        selectedDate,
        adults,
        children,
        roomOptionId: roomOption?.id ?? null,
      });

      if (!result.ok) {
        setError(result.error);
        // The date just sold out or someone else grabbed the last spots —
        // refresh so the calendar's availability reflects reality.
        router.refresh();
        return;
      }

      setConfirmation({ bookingId: result.bookingId, totalAmount: result.totalAmount });
    });
  };

  if (confirmation) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" strokeWidth={1.8}>
            <path d="M6 12.5 10 16.5 18 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-6 font-serif text-2xl font-semibold text-navy">Journey reserved</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Your spot on {pkg.title} is held — {formatPrice(confirmation.totalAmount)} total.
          Confirmation <span className="font-mono text-navy">{confirmation.bookingId}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">
        {pkg.title}
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-navy sm:text-4xl">
        Reserve Your Journey
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Calendar
            availability={pkg.availability}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            durationDays={pkg.durationDays}
          />

          <TravelerCounter
            adults={adults}
            children={children}
            onAdultsChange={setAdults}
            onChildrenChange={setChildren}
          />
          <RoomOptionCard
            options={pkg.roomOptions}
            selectedId={roomOptionId}
            onSelect={setRoomOptionId}
          />
        </div>

        <PriceSummaryCard
          pkg={pkg}
          adults={adults}
          children={children}
          roomName={roomOption?.name ?? ""}
          breakdown={breakdown}
          selectedDate={selectedDate}
          disabled={!selectedDate || isPending}
          submitting={isPending}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

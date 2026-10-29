"use client";

import { Package } from "@/types";
import { PriceBreakdown, formatPrice } from "@/lib/pricing";

export default function PriceSummaryCard({
  pkg,
  adults,
  children,
  roomName,
  breakdown,
  selectedDate,
  disabled,
  submitting,
  error,
  onSubmit,
}: {
  pkg: Package;
  adults: number;
  children: number;
  roomName: string;
  breakdown: PriceBreakdown;
  selectedDate: string | null;
  disabled: boolean;
  submitting?: boolean;
  error?: string | null;
  onSubmit: () => void;
}) {
  const getFullDateRangeLabel = () => {
    if (!selectedDate) return "Select a departure date";
    const startDate = new Date(selectedDate + "T00:00:00");
    const returnDate = new Date(startDate);
    returnDate.setDate(startDate.getDate() + pkg.durationDays);

    const startFormatted = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const returnFormatted = returnDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return `${startFormatted} – ${returnFormatted} (${pkg.durationDays} Days)`;
  };

  return (
    <div className="sticky top-24 rounded-card bg-navy p-6 text-white shadow-lg">
      <p className="font-serif text-lg font-semibold">{pkg.title}</p>
      <p className="mt-1 text-sm font-medium text-rust-light">{getFullDateRangeLabel()}</p>


      <div className="mt-5 space-y-2.5 border-t border-white/15 pt-5 text-sm">
        <div className="flex justify-between">
          <span className="text-white/70">
            Base rate × {adults} adult{adults !== 1 ? "s" : ""}
          </span>
          <span>{formatPrice(breakdown.baseRate)}</span>
        </div>
        {children > 0 && (
          <div className="flex justify-between">
            <span className="text-white/70">
              Child rate × {children} child{children !== 1 ? "ren" : ""}
            </span>
            <span>{formatPrice(breakdown.childRate)}</span>
          </div>
        )}
        {breakdown.upgradeFee > 0 && (
          <div className="flex justify-between">
            <span className="text-white/70">{roomName} upgrade</span>
            <span>{formatPrice(breakdown.upgradeFee)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-white/70">Taxes &amp; fees</span>
          <span>{formatPrice(breakdown.taxesFees)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between border-t border-white/15 pt-4">
        <span className="text-sm text-white/70">Total</span>
        <span className="font-serif text-2xl font-semibold">{formatPrice(breakdown.totalAmount)}</span>
      </div>

      {(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const hasAvailableDates =
          Boolean(pkg.availability && pkg.availability.length > 0) &&
          pkg.availability.some((a) => {
            const d = new Date(a.date + "T00:00:00");
            return d >= now && a.booked < a.capacity;
          });

        return (
          <>
            <button
              onClick={onSubmit}
              disabled={disabled || !hasAvailableDates}
              className="mt-5 w-full rounded-pill bg-rust py-3 text-sm font-medium text-white transition-colors hover:bg-rust-light disabled:cursor-not-allowed disabled:opacity-40"
            >
              {!hasAvailableDates
                ? "Upcoming · Dates To Be Announced"
                : submitting
                ? "Reserving…"
                : "Proceed to Booking"}
            </button>
            {error ? (
              <p className="mt-2 text-center text-xs text-rust-light">{error}</p>
            ) : !hasAvailableDates ? (
              <p className="mt-2 text-center text-xs text-white/60">
                Expedition dates are being scheduled soon
              </p>
            ) : (
              !selectedDate && (
                <p className="mt-2 text-center text-xs text-white/50">Select a date to continue</p>
              )
            )}
          </>
        );
      })()}
    </div>
  );
}

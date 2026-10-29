"use client";

import { AvailabilityDate } from "@/types";

export default function Calendar({
  availability,
  selectedDate,
  onSelect,
  durationDays = 7,
}: {
  availability: AvailabilityDate[];
  selectedDate: string | null;
  onSelect: (date: string) => void;
  durationDays?: number;
}) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);


  // Filter future available slots sorted by date
  const availableSlots = availability
    .filter((a) => {
      const d = new Date(a.date + "T00:00:00");
      return d >= now && a.booked < a.capacity;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getReturnDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + durationDays);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-card bg-card p-6 ring-1 ring-navy/5 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-navy/10 pb-4 gap-2">
        <div>
          <h3 className="font-serif text-lg font-semibold text-navy">Select Journey Date Range</h3>
          <p className="text-xs text-muted mt-0.5">
            Choose your preferred departure date range ({durationDays} Days / {Math.max(1, durationDays - 1)} Nights)
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-rust font-medium bg-rust/10 px-3 py-1 rounded-pill w-fit">
          <span>✨</span> All itineraries planned end-to-end
        </span>
      </div>

      {availableSlots.length === 0 ? (
        <div className="p-10 text-center bg-page rounded-card border border-dashed border-navy/20 space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rust/10 text-rust mx-auto">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rust bg-rust/10 px-3 py-1 rounded-pill mb-2">
              Upcoming Expedition
            </span>
            <h4 className="font-serif text-xl font-semibold text-navy">Departure Dates To Be Announced</h4>
            <p className="mt-1.5 text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
              We haven&apos;t opened departure dates for this journey yet. Our expedition team is finalizing itineraries and dates. Check back soon or reach out to our concierge for custom departures.
            </p>
          </div>
          <div className="pt-2">
            <a
              href="https://wa.me/?text=Hi%2C+I+would+like+to+know+upcoming+dates+for+this+journey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill bg-navy text-white text-xs font-semibold hover:bg-navy-light transition-colors shadow-sm"
            >
              <span>💬</span> Inquire with Travel Concierge
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {availableSlots.map((slot) => {
            const isSelected = selectedDate === slot.date;
            const startStr = formatDate(slot.date);
            const returnStr = getReturnDate(slot.date);
            const spotsRemaining = slot.capacity - slot.booked;
            const isFastFilling = slot.fastFilling || spotsRemaining <= 3;

            return (
              <div
                key={slot.id}
                onClick={() => onSelect(slot.date)}
                className={`cursor-pointer p-4 rounded-card border transition-all relative flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? "border-navy bg-navy text-white shadow-md ring-2 ring-navy/20"
                    : "border-navy/15 bg-page text-navy hover:border-rust hover:shadow-sm"
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-pill ${
                      isSelected
                        ? "bg-rust text-white"
                        : isFastFilling
                        ? "bg-rust/10 text-rust"
                        : "bg-navy/10 text-navy"
                    }`}
                  >
                    {isFastFilling ? "⚡ Fast Filling" : "Available"}
                  </span>
                  <span className={`text-xs font-medium ${isSelected ? "text-white/80" : "text-muted"}`}>
                    {spotsRemaining} spot{spotsRemaining !== 1 ? "s" : ""} left
                  </span>
                </div>

                {/* Date Window */}
                <div className="space-y-1">
                  <div className="text-xs text-muted/80 uppercase tracking-wider font-semibold">
                    {isSelected ? "Selected Window" : "Departure ➔ Return"}
                  </div>
                  <div className={`font-serif text-base font-semibold ${isSelected ? "text-white" : "text-navy"}`}>
                    {startStr}
                  </div>
                  <div className={`text-xs font-medium ${isSelected ? "text-rust-light" : "text-rust"}`}>
                    ➔ Return: {returnStr}
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className={`pt-2 border-t text-xs flex items-center justify-between ${isSelected ? "border-white/15 text-white/90" : "border-navy/10 text-muted"}`}>
                  <span>{durationDays} Days Duration</span>
                  <span className={`font-semibold ${isSelected ? "text-white" : "text-navy"}`}>
                    {isSelected ? "✓ Selected" : "Select Date →"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



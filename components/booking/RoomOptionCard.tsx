"use client";

import { RoomOption } from "@/types";
import { formatPrice } from "@/lib/pricing";

export default function RoomOptionCard({
  options,
  selectedId,
  onSelect,
}: {
  options: RoomOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="rounded-card bg-card p-5 ring-1 ring-navy/5 sm:p-6">
      <h3 className="font-serif text-base font-semibold text-navy">Room</h3>
      <div className="mt-3 space-y-2">
        {options.map((option) => {
          const selected = option.id === selectedId;
          return (
            <label
              key={option.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors ${
                selected ? "border-navy bg-page" : "border-navy/10 hover:bg-page/60"
              }`}
            >
              <input
                type="radio"
                name="room-option"
                checked={selected}
                onChange={() => onSelect(option.id)}
                className="mt-1 h-4 w-4 accent-navy"
              />
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-navy">{option.name}</p>
                  <p className="whitespace-nowrap text-sm font-medium text-navy">
                    {option.priceUpgrade === 0 ? "Included" : `+${formatPrice(option.priceUpgrade)}`}
                  </p>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{option.description}</p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

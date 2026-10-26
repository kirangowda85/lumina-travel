"use client";

function Stepper({
  label,
  sublabel,
  value,
  min,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-navy">{label}</p>
        <p className="text-xs text-muted">{sublabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label.toLowerCase()}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/20 text-navy transition-colors hover:bg-page disabled:cursor-not-allowed disabled:opacity-30"
        >
          −
        </button>
        <span className="w-4 text-center text-sm font-medium text-navy">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label.toLowerCase()}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/20 text-navy transition-colors hover:bg-page"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function TravelerCounter({
  adults,
  children,
  onAdultsChange,
  onChildrenChange,
}: {
  adults: number;
  children: number;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
}) {
  return (
    <div className="rounded-card bg-card p-5 ring-1 ring-navy/5 sm:p-6">
      <h3 className="font-serif text-base font-semibold text-navy">Travelers</h3>
      <div className="mt-1 divide-y divide-navy/10">
        <Stepper label="Adults" sublabel="Age 18+" value={adults} min={1} onChange={onAdultsChange} />
        <Stepper label="Children" sublabel="Age 2–17" value={children} min={0} onChange={onChildrenChange} />
      </div>
    </div>
  );
}

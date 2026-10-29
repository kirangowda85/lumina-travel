"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Package } from "@/types";
import { formatPrice } from "@/lib/pricing";
import { toggleFavorite } from "@/lib/actions/favorites";

export default function DestinationCard({
  pkg,
  initialFavorited = false,
}: {
  pkg: Package;
  initialFavorited?: boolean;
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPending) return;

    const optimistic = !favorited;
    setFavorited(optimistic); // instant feedback, reverted below on failure

    startTransition(async () => {
      const result = await toggleFavorite(pkg.id);
      if (!result.ok) {
        setFavorited(!optimistic);
        if (result.error.toLowerCase().includes("sign in")) {
          router.push("/sign-in");
        }
        return;
      }
      setFavorited(result.favorited);
    });
  };

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const hasFutureDates =
    Boolean(pkg.availability && pkg.availability.length > 0) &&
    pkg.availability.some((a) => {
      const d = new Date(a.date + "T00:00:00");
      return d >= now && a.booked < a.capacity;
    });

  return (
    <div className="group overflow-hidden rounded-card bg-card shadow-sm ring-1 ring-navy/5 transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={pkg.images[0]}
          alt={pkg.title}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span className="rounded-pill bg-white/90 px-3 py-1 text-xs font-medium text-navy shadow-sm">
            {pkg.category}
          </span>
          {!hasFutureDates && (
            <span className="rounded-pill bg-rust text-white px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase shadow-sm">
              Upcoming
            </span>
          )}
        </div>
        <button
          onClick={handleToggle}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorited}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white disabled:opacity-60"
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 transition-transform duration-200 active:scale-125 ${
              favorited ? "fill-rust stroke-rust" : "fill-none stroke-navy"
            }`}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-navy">{pkg.title}</h3>
        <p className="mt-1 text-sm text-muted">
          {pkg.location} · {pkg.durationDays} days
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold text-navy">{formatPrice(pkg.basePrice)}</span>
            <span className="text-xs text-muted"> / person</span>
          </div>
          <Link
            href={`/destinations/${pkg.slug}`}
            className="rounded-pill border border-navy px-4 py-2 text-xs font-medium text-navy transition-colors hover:bg-navy hover:text-white"
          >
            View Itinerary
          </Link>
        </div>
      </div>
    </div>
  );
}

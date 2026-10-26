"use client";

import { useMemo, useState } from "react";
import DestinationCard from "@/components/destinations/DestinationCard";
import FilterSidebar, { Filters, PRICE_CEILING } from "@/components/destinations/FilterSidebar";
import { Package } from "@/types";

// Filtering stays client-side over the full package list fetched once on
// the server — same behavior as the Phase 1 mock shell, just fed by the DB
// now instead of a hardcoded array.
export default function DestinationsExplorer({
  packages,
  favoritedIds = [],
}: {
  packages: Package[];
  favoritedIds?: string[];
}) {
  const [filters, setFilters] = useState<Filters>({ categories: [], maxPrice: PRICE_CEILING });
  const favorited = useMemo(() => new Set(favoritedIds), [favoritedIds]);

  const filtered = useMemo(() => {
    return packages.filter((pkg): pkg is Package => {
      if (!pkg) return false;
      const matchesCategory =
        filters.categories.length === 0 || filters.categories.includes(pkg.category);
      const matchesPrice = pkg.basePrice <= filters.maxPrice;
      return matchesCategory && matchesPrice;
    });
  }, [packages, filters]);

  return (
    <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
      <FilterSidebar filters={filters} onChange={setFilters} />

      <div>
        <p className="mb-4 text-sm text-muted">
          {filtered.length} journey{filtered.length !== 1 ? "s" : ""}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-card bg-card p-12 text-center ring-1 ring-navy/5">
            <p className="font-serif text-lg font-semibold text-navy">No journeys match yet</p>
            <p className="mt-1 text-sm text-muted">
              Try clearing a filter or raising the price range.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((pkg) => (
              <DestinationCard key={pkg.id} pkg={pkg} initialFavorited={favorited.has(pkg.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

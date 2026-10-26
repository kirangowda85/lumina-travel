"use client";

import { Category } from "@/types";
import { formatPrice } from "@/lib/pricing";

export type Filters = {
  categories: Category[];
  maxPrice: number;
};

const ALL_CATEGORIES: Category[] = ["Beach", "Mountain", "Culture", "Adventure"];
export const PRICE_CEILING = 900000;

export default function FilterSidebar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const toggleCategory = (category: Category) => {
    const next = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onChange({ ...filters, categories: next });
  };

  const clearAll = () => onChange({ categories: [], maxPrice: PRICE_CEILING });

  const hasActiveFilters = filters.categories.length > 0 || filters.maxPrice < PRICE_CEILING;

  return (
    <aside className="rounded-card bg-card p-5 ring-1 ring-navy/5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-base font-semibold text-navy">Filter</h2>
        {hasActiveFilters && (
          <button onClick={clearAll} className="text-xs font-medium text-rust hover:underline">
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-navy">Category</p>
        <div className="mt-3 space-y-2">
          {ALL_CATEGORIES.map((category) => (
            <label key={category} className="flex cursor-pointer items-center gap-2.5 text-sm text-navy">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="h-4 w-4 rounded border-navy/30 text-rust accent-rust focus:ring-rust"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-navy">Max price</p>
        <input
          type="range"
          min={100000}
          max={PRICE_CEILING}
          step={10000}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="mt-3 w-full accent-rust"
        />
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>{formatPrice(100000)}</span>
          <span className="font-medium text-navy">{formatPrice(filters.maxPrice)}</span>
        </div>
      </div>
    </aside>
  );
}

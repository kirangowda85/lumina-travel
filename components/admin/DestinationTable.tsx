"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toggleFeaturedPackage, deletePackage } from "@/lib/actions/admin";
import type { Package } from "@/types";

export default function DestinationTable({ initialPackages }: { initialPackages: Package[] }) {
  const [packages, setPackages] = useState(initialPackages);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = packages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleFeatured = (pkg: Package) => {
    const nextFeatured = !pkg.featured;
    setPackages((prev) =>
      prev.map((item) => (item.id === pkg.id ? { ...item, featured: nextFeatured } : item))
    );

    startTransition(async () => {
      const res = await toggleFeaturedPackage(pkg.id, nextFeatured);
      if (!res.success) {
        // Revert on error
        setPackages((prev) =>
          prev.map((item) => (item.id === pkg.id ? { ...item, featured: pkg.featured } : item))
        );
        alert(res.error || "Failed to update featured status");
      }
    });
  };

  const handleDelete = (pkg: Package) => {
    if (!confirm(`Are you sure you want to delete "${pkg.title}"? This will remove all associated room options and bookings.`)) {
      return;
    }

    setPackages((prev) => prev.filter((item) => item.id !== pkg.id));

    startTransition(async () => {
      const res = await deletePackage(pkg.id);
      if (!res.success) {
        setPackages(initialPackages);
        alert(res.error || "Failed to delete package");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <input
          type="text"
          placeholder="Search by title, location, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2.5 rounded-card border border-navy/20 bg-page text-sm focus:outline-none focus:border-rust max-w-md"
        />

        <Link
          href="/admin/destinations/new"
          className="rounded-pill bg-rust px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rust-light text-center flex items-center justify-center gap-2"
        >
          <span>+</span> Add New Destination
        </Link>
      </div>

      <div className="bg-card rounded-card border border-navy/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-navy">
          <thead className="bg-navy/5 text-xs uppercase tracking-wider text-muted border-b border-navy/10">
            <tr>
              <th className="p-4">Destination</th>
              <th className="p-4">Category</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Base Rate</th>
              <th className="p-4 text-center">Featured</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/10">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted">
                  No destinations found. Click "+ Add New Destination" to create your first journey.
                </td>
              </tr>
            ) : (
              filtered.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-navy/[0.02]">
                  <td className="p-4 font-medium">
                    <div>
                      <span className="font-semibold text-navy block">{pkg.title}</span>
                      <span className="text-xs text-muted">{pkg.location} • ({pkg.slug})</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2.5 py-1 text-xs rounded-pill bg-navy/10 font-medium">
                      {pkg.category}
                    </span>
                  </td>
                  <td className="p-4">{pkg.durationDays} Days</td>
                  <td className="p-4 font-medium">${(pkg.basePrice / 100).toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(pkg)}
                      disabled={isPending}
                      className={`px-3 py-1 text-xs rounded-pill font-medium transition-colors ${
                        pkg.featured ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-page text-muted border border-navy/15"
                      }`}
                    >
                      {pkg.featured ? "★ Featured" : "Standard"}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/admin/destinations/${pkg.id}/edit`}
                      className="inline-block px-3 py-1.5 text-xs font-medium text-navy bg-navy/10 hover:bg-navy/20 rounded-pill transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(pkg)}
                      disabled={isPending}
                      className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-pill transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

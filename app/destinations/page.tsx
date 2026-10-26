import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import DestinationsExplorer from "@/components/destinations/DestinationsExplorer";
import { getAllPackages } from "@/lib/packages";
import { getFavoritedPackageIds } from "@/lib/favorites";

export const metadata: Metadata = {
  title: "Destinations | Payana",
  description: "Browse Payana's curated luxury destination journeys by category and price.",
};

export default async function DestinationsPage() {
  const { userId } = await auth();
  const [packages, favoritedIds] = await Promise.all([
    getAllPackages(),
    getFavoritedPackageIds(userId),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">Destinations</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-navy sm:text-4xl">
          Curated Journeys
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Four collections, each planned end to end. Filter by category or price to find
          the journey that fits.
        </p>
      </div>

      <DestinationsExplorer packages={packages} favoritedIds={Array.from(favoritedIds)} />
    </div>
  );
}

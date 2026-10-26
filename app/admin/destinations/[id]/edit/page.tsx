import { notFound } from "next/navigation";
import { getAdminPackageById } from "@/lib/admin";
import DestinationForm from "@/components/admin/DestinationForm";
import type { Category, ItineraryDay, Package } from "@/types";

export const metadata = {
  title: "Edit Destination | Payana Admin",
};

export default async function EditDestinationPage({ params }: { params: { id: string } }) {
  const rawPkg = await getAdminPackageById(params.id);
  if (!rawPkg) notFound();

  const pkg: Package = {
    id: rawPkg.id,
    slug: rawPkg.slug,
    title: rawPkg.title,
    location: rawPkg.location,
    category: rawPkg.category as Category,
    description: rawPkg.description,
    basePrice: rawPkg.basePrice,
    durationDays: rawPkg.durationDays,
    images: rawPkg.images,
    videoUrl: rawPkg.videoUrl,
    featured: rawPkg.featured,
    itinerary: JSON.parse(JSON.stringify(rawPkg.itinerary ?? [])) as ItineraryDay[],
    roomOptions: rawPkg.roomOptions.map((r) => ({
      id: r.id,
      packageId: r.packageId,
      name: r.name,
      description: r.description,
      priceUpgrade: r.priceUpgrade,
    })),
    availability: rawPkg.availability.map((a) => ({
      id: a.id,
      packageId: a.packageId,
      date: a.date.toISOString().slice(0, 10),
      capacity: a.capacity,
      booked: a.booked,
      fastFilling: a.fastFilling,
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-navy">Edit {pkg.title}</h1>
        <p className="text-sm text-muted mt-1">Update details, images, video background, or itinerary.</p>
      </div>

      <DestinationForm initialPackage={pkg} />
    </div>
  );
}

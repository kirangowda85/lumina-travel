import { getAllPackages } from "@/lib/packages";
import DestinationTable from "@/components/admin/DestinationTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Manage Destinations | Payana Admin",
};

export default async function AdminDestinationsPage() {
  const packages = await getAllPackages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-navy">Destinations & Packages</h1>
        <p className="text-sm text-muted mt-1">Create, edit, or remove travel packages offered on the platform.</p>
      </div>

      <DestinationTable initialPackages={packages} />
    </div>
  );
}

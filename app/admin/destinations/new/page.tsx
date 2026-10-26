import DestinationForm from "@/components/admin/DestinationForm";

export const metadata = {
  title: "Create Destination | Payana Admin",
};

export default function NewDestinationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-navy">Add New Destination</h1>
        <p className="text-sm text-muted mt-1">Configure title, pricing, video background, room options, and day-by-day itinerary.</p>
      </div>

      <DestinationForm />
    </div>
  );
}

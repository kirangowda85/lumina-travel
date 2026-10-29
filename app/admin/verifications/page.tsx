import { getAllVerifications } from "@/lib/admin";
import VerificationTable from "@/components/admin/VerificationTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Identity Verifications | Payana Admin",
};

export default async function AdminVerificationsPage() {
  const verifications = await getAllVerifications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-navy">Identity Verifications Queue</h1>
        <p className="text-sm text-muted mt-1">Review user uploaded passports, licenses, and ID cards via ImageKit.</p>
      </div>

      <VerificationTable initialVerifications={verifications} />
    </div>
  );
}

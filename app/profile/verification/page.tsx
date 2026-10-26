import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import VerificationForm from "@/components/verification/VerificationForm";
import { getVerificationForUser } from "@/lib/verification";

export const metadata: Metadata = {
  title: "Identity Verification | Payana",
  description: "Verify your government ID before your first Payana curated journey.",
};

export default async function VerificationPage() {
  const { userId } = await auth();
  const verification = userId ? await getVerificationForUser(userId) : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">Profile</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-navy">
        Identity Verification
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        We verify one government ID per traveler before your first journey. Your
        document is encrypted and only used to confirm your identity.
      </p>

      <VerificationForm
        initial={
          verification
            ? {
                documentType: verification.documentType,
                documentNumber: verification.documentNumber,
                documentImageUrl: verification.documentImageUrl,
                status: verification.status,
              }
            : null
        }
      />
    </div>
  );
}

import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import ConciergeForm from "@/components/concierge/ConciergeForm";

export const metadata: Metadata = {
  title: "Custom Trip Plan",
  description: "Tell Payana about your dream journey and we will design a personalized custom plan for you.",
};

export default async function ConciergePage() {
  const user = await currentUser();
  const initialName = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") : "";
  const initialEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">Custom Trip Plan</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-navy">
        Request a Custom Plan
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Tell us about the trip you have in mind and Payana will curate a personalized itinerary for you within one business day.
      </p>



      <ConciergeForm initialName={initialName} initialEmail={initialEmail} />
    </div>
  );
}

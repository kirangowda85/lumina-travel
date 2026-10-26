import Link from "next/link";
import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Profile | Payana",
  description: "Manage your Payana account, bookings, and identity verification.",
};

export default async function ProfilePage() {
  const user = await currentUser();

  const name = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || "Traveler"
    : "Traveler";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">Account</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-navy">Profile</h1>

      <div className="mt-8 flex items-center gap-4 rounded-card bg-card p-6 ring-1 ring-navy/5">
        {user?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.imageUrl} alt={name} className="h-14 w-14 rounded-full object-cover" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-lg font-semibold text-white">
            {initial}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-navy">{name}</p>
          <p className="text-xs text-muted">{email}</p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-navy/10 rounded-card bg-card ring-1 ring-navy/5">
        <Link href="/bookings" className="flex items-center justify-between px-6 py-4 text-sm text-navy hover:bg-page">
          My bookings
          <span className="text-muted">→</span>
        </Link>
        <Link href="/profile/verification" className="flex items-center justify-between px-6 py-4 text-sm text-navy hover:bg-page">
          Identity verification
          <span className="text-muted">→</span>
        </Link>
        <Link href="/concierge" className="flex items-center justify-between px-6 py-4 text-sm text-navy hover:bg-page">
          Request a Custom Plan
          <span className="text-muted">→</span>
        </Link>


      </div>
    </div>
  );
}

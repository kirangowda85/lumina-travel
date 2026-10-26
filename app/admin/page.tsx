import Link from "next/link";
import { getAdminMetrics } from "@/lib/admin";

export default async function AdminDashboardPage() {
  const metrics = await getAdminMetrics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-navy">Dashboard Overview</h1>
        <p className="text-sm text-muted mt-1">Manage luxury destinations, hero videos, customer bookings, and verification requests.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-card border border-navy/10 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Active Destinations</p>
          <p className="font-serif text-3xl font-bold text-navy mt-2">{metrics.totalDestinations}</p>
          <Link href="/admin/destinations" className="text-xs font-medium text-rust hover:underline mt-4 inline-block">Manage Destinations →</Link>
        </div>

        <div className="bg-card p-6 rounded-card border border-navy/10 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Total Reservations</p>
          <p className="font-serif text-3xl font-bold text-navy mt-2">{metrics.totalBookings}</p>
          <Link href="/admin/bookings" className="text-xs font-medium text-rust hover:underline mt-4 inline-block">View Bookings →</Link>
        </div>

        <div className="bg-card p-6 rounded-card border border-navy/10 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Pending Verifications</p>
          <p className="font-serif text-3xl font-bold text-navy mt-2">{metrics.pendingVerifications}</p>
          <Link href="/admin/verifications" className="text-xs font-medium text-rust hover:underline mt-4 inline-block">Review Queue →</Link>
        </div>

        <div className="bg-card p-6 rounded-card border border-navy/10 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Total Revenue</p>
          <p className="font-serif text-3xl font-bold text-navy mt-2">${metrics.totalRevenue.toLocaleString()}</p>
          <span className="text-xs text-muted mt-4 block">Gross reserved value</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card p-6 rounded-card border border-navy/10 shadow-sm space-y-4">
        <h2 className="font-serif text-xl font-semibold text-navy">Quick Admin Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/destinations/new"
            className="flex flex-col items-center justify-center p-6 border border-rust/30 rounded-card bg-rust/5 hover:bg-rust/10 transition-colors text-center"
          >
            <span className="text-2xl mb-2">🏝️</span>
            <span className="font-medium text-navy text-sm">Add New Destination</span>
            <span className="text-xs text-muted mt-1">Create journey, room rates & dates</span>
          </Link>

          <Link
            href="/admin/hero"
            className="flex flex-col items-center justify-center p-6 border border-navy/20 rounded-card bg-navy/5 hover:bg-navy/10 transition-colors text-center"
          >
            <span className="text-2xl mb-2">🎬</span>
            <span className="font-medium text-navy text-sm">Change Hero Video</span>
            <span className="text-xs text-muted mt-1">Update home page video loop & text</span>
          </Link>

          <Link
            href="/admin/verifications"
            className="flex flex-col items-center justify-center p-6 border border-navy/20 rounded-card bg-navy/5 hover:bg-navy/10 transition-colors text-center"
          >
            <span className="text-2xl mb-2">🪪</span>
            <span className="font-medium text-navy text-sm">Approve Identity Uploads</span>
            <span className="text-xs text-muted mt-1">Review pending passport/ID uploads</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

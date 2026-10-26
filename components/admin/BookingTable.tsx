"use client";

import { useState, useTransition } from "react";
import { updateBookingStatus } from "@/lib/actions/admin";

type BookingRow = {
  id: string;
  selectedDate: Date;
  adults: number;
  children: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
  package: {
    title: string;
    location: string;
  };
  roomOption?: {
    name: string;
  } | null;
};

export default function BookingTable({ initialBookings }: { initialBookings: BookingRow[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const filtered = bookings.filter((b) => {
    const matchesStatus = filterStatus === "ALL" || b.status === filterStatus;
    const matchesSearch =
      b.user.name.toLowerCase().includes(search.toLowerCase()) ||
      b.user.email.toLowerCase().includes(search.toLowerCase()) ||
      b.package.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );

    startTransition(async () => {
      const res = await updateBookingStatus(id, newStatus);
      if (!res.success) {
        setBookings(initialBookings);
        alert(res.error || "Failed to update booking status");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <input
          type="text"
          placeholder="Search by customer name, email, or journey title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2.5 rounded-card border border-navy/20 bg-page text-sm focus:outline-none focus:border-rust max-w-md"
        />

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-card border border-navy/20 bg-page text-xs font-medium focus:outline-none focus:border-rust"
          >
            <option value="ALL">All Statuses</option>
            <option value="RESERVED">RESERVED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-card border border-navy/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-navy">
          <thead className="bg-navy/5 text-xs uppercase tracking-wider text-muted border-b border-navy/10">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Destination / Journey</th>
              <th className="p-4">Travel Date</th>
              <th className="p-4">Travelers</th>
              <th className="p-4">Total Value</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/10">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted">
                  No reservations found matching your criteria.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id} className="hover:bg-navy/[0.02]">
                  <td className="p-4">
                    <div className="font-medium text-navy">{b.user.name}</div>
                    <div className="text-xs text-muted">{b.user.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-navy">{b.package.title}</div>
                    <div className="text-xs text-muted">{b.roomOption?.name || "Standard Suite"}</div>
                  </td>
                  <td className="p-4 font-medium text-xs">
                    {new Date(b.selectedDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4 text-xs">
                    {b.adults} Adult{b.adults > 1 ? "s" : ""}
                    {b.children > 0 && `, ${b.children} Child${b.children > 1 ? "ren" : ""}`}
                  </td>
                  <td className="p-4 font-semibold text-navy">
                    ${(b.totalAmount / 100).toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 text-xs rounded-pill font-medium ${
                        b.status === "RESERVED"
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : b.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={b.status}
                      disabled={isPending}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className="px-2.5 py-1 rounded-card border border-navy/20 bg-page text-xs font-medium focus:outline-none focus:border-rust cursor-pointer"
                    >
                      <option value="RESERVED">RESERVED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
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

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { adminLogoutAction } from "@/lib/actions/admin-auth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // On login screen, don't show the admin management sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-page text-navy flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-navy text-white flex-shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-navy/20">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="flex flex-col gap-1">
            <div className="bg-white px-2.5 py-1 rounded-card inline-block shadow-sm">
              <Image
                src="/logo.png"
                alt="Payana - ಪಯಣ"
                width={140}
                height={38}
                className="h-7 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-2 pl-1">
              <span className="text-rust-light text-[10px] uppercase tracking-widest font-sans font-semibold">
                Admin Portal
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded font-mono">
                SECURE
              </span>
            </div>
          </Link>
        </div>

        <nav className="p-4 flex-1 space-y-1">
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-card transition-colors ${
              isActive("/admin") && pathname === "/admin"
                ? "bg-white/15 text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <DashboardIcon />
            Dashboard Overview
          </Link>
          <Link
            href="/admin/destinations"
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-card transition-colors ${
              isActive("/admin/destinations")
                ? "bg-white/15 text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <DestinationsIcon />
            Destinations & Journeys
          </Link>
          <Link
            href="/admin/hero"
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-card transition-colors ${
              isActive("/admin/hero")
                ? "bg-white/15 text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <VideoIcon />
            Home Hero & Video
          </Link>
          <Link
            href="/admin/verifications"
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-card transition-colors ${
              isActive("/admin/verifications")
                ? "bg-white/15 text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <VerificationIcon />
            Identity Verifications
          </Link>
          <Link
            href="/admin/bookings"
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-card transition-colors ${
              isActive("/admin/bookings")
                ? "bg-white/15 text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <BookingsIcon />
            Customer Bookings
          </Link>
          <Link
            href="/admin/about"
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-card transition-colors ${
              isActive("/admin/about")
                ? "bg-white/15 text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <AboutIcon />
            About Page Story
          </Link>
          <Link
            href="/admin/users"
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-card transition-colors ${
              isActive("/admin/users")
                ? "bg-white/15 text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <UsersIcon />
            Manage Admins
          </Link>
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <form action={adminLogoutAction}>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold text-red-200 bg-red-500/10 hover:bg-red-500/20 rounded-pill transition-colors"
            >
              <LogoutIcon />
              Sign Out
            </button>
          </form>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2 px-4 text-xs font-medium text-white/60 hover:text-white transition-colors"
          >
            ← Return to Main Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        {children}
      </main>
    </div>
  );
}

function DashboardIcon() {
  return (
    <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function DestinationsIcon() {
  return (
    <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function VerificationIcon() {
  return (
    <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function BookingsIcon() {
  return (
    <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-4 h-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

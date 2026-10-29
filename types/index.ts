// Central type definitions shared across client components, server actions,
// and data-layer modules. This file was reconstructed from the Prisma schema
// and the shapes actually consumed by the codebase.

// ── Destination / Package ─────────────────────────────────────────────

export type Category =
  | "Beach"
  | "Mountain"
  | "Culture"
  | "Adventure";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface RoomOption {
  id: string;
  packageId: string;
  name: string;
  description: string;
  priceUpgrade: number; // cents
}

export interface AvailabilityDate {
  id: string;
  packageId: string;
  date: string; // ISO YYYY-MM-DD
  endDate?: string | null; // ISO YYYY-MM-DD
  capacity: number;
  booked: number;
  fastFilling: boolean;
}

export interface Package {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: Category;
  description: string;
  basePrice: number; // cents
  durationDays: number;
  images: string[];
  videoUrl?: string | null;
  featured: boolean;
  itinerary: ItineraryDay[];
  roomOptions: RoomOption[];
  availability: AvailabilityDate[];
}

// ── Hero Settings ─────────────────────────────────────────────────────

export interface HeroSettings {
  id: string;
  badge: string;
  title: string;
  description: string;
  videoUrl: string | null;
  imageUrl: string | null;
}

// ── Identity Verification ─────────────────────────────────────────────

export type DocumentType = "passport" | "national_id" | "driver_license";

export type VerificationStatus = "pending" | "approved" | "rejected";

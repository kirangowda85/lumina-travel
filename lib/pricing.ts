import { Package, RoomOption } from "@/types";

export const CHILD_PRICE_FACTOR = 0.5;
export const TAX_RATE = 0.12;

export type PriceBreakdown = {
  baseRate: number; // basePrice * adults
  childRate: number; // discounted rate * children
  upgradeFee: number;
  subtotal: number;
  taxesFees: number;
  totalAmount: number;
};

// Mirrors the server-side formula in Section 5 of the build plan.
// Used client-side for Phase 1's live price summary; from Phase 4 the
// server action recomputes this same formula and is the source of truth.
export function calculatePrice(
  pkg: Package,
  adults: number,
  children: number,
  roomOption: RoomOption | null
): PriceBreakdown {
  const baseRate = pkg.basePrice * adults;
  const childRate = Math.round(pkg.basePrice * CHILD_PRICE_FACTOR) * children;
  const upgradeFee = (roomOption?.priceUpgrade ?? 0) * (adults + children);
  const subtotal = baseRate + childRate + upgradeFee;
  const taxesFees = Math.round(subtotal * TAX_RATE);
  const totalAmount = subtotal + taxesFees;

  return { baseRate, childRate, upgradeFee, subtotal, taxesFees, totalAmount };
}

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

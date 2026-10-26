import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingClient from "@/components/booking/BookingClient";
import { getPackageBySlug } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Reserve Your Journey",
};

export default async function BookPage({ params }: { params: { slug: string } }) {
  const pkg = await getPackageBySlug(params.slug);
  if (!pkg) notFound();

  return <BookingClient pkg={pkg} />;
}

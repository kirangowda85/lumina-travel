import type { Metadata } from "next";
import Link from "next/link";
import { getAboutSettings } from "@/lib/about";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutSettings();
  return {
    title: `${about.title} | Payana`,
    description: about.paragraph1?.slice(0, 160) || "Curated luxury journeys.",
  };
}

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const about = await getAboutSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">
        {about.badge || "About"}
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-navy sm:text-4xl">
        {about.title || "About Payana"}
      </h1>

      {about.paragraph1 && (
        <p className="mt-6 text-base leading-relaxed text-navy/80 whitespace-pre-line">
          {about.paragraph1}
        </p>
      )}

      {about.paragraph2 && (
        <p className="mt-4 text-base leading-relaxed text-navy/80 whitespace-pre-line">
          {about.paragraph2}
        </p>
      )}

      <div className="mt-10 rounded-card bg-card p-6 ring-1 ring-navy/5 shadow-sm">
        <p className="font-serif text-lg font-semibold text-navy">
          {about.ctaTitle || "Have a trip in mind?"}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {about.ctaDescription ||
            "Our team curates custom plans around what matters to you, not just fixed packages."}
        </p>
        <Link
          href={about.ctaButtonLink || "/concierge"}
          className="mt-4 inline-block rounded-pill bg-rust px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rust-light shadow-sm"
        >
          {about.ctaButtonText || "Request a Custom Plan"}
        </Link>
      </div>
    </div>
  );
}

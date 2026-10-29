import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getPackageBySlug } from "@/lib/packages";
import { formatPrice } from "@/lib/pricing";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const pkg = await getPackageBySlug(params.slug);
  if (!pkg) return { title: "Destination" };

  return {
    title: pkg.title,
    description: pkg.description,
    openGraph: {
      title: pkg.title,
      description: pkg.description,
      images: pkg.images[0] ? [{ url: pkg.images[0] }] : undefined,
    },
  };
}

export default async function PackageDetailPage({ params }: { params: { slug: string } }) {
  const pkg = await getPackageBySlug(params.slug);
  if (!pkg) notFound();

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const hasFutureDates =
    Boolean(pkg.availability && pkg.availability.length > 0) &&
    pkg.availability.some((a) => {
      const d = new Date(a.date + "T00:00:00");
      return d >= now && a.booked < a.capacity;
    });

  return (
    <div>
      <div className="relative h-[360px] w-full overflow-hidden sm:h-[440px]">
        <Image
          src={pkg.images[0]}
          alt={pkg.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="rounded-pill bg-white/90 px-3 py-1 text-xs font-medium text-navy">
              {pkg.category}
            </span>
            {!hasFutureDates && (
              <span className="rounded-pill bg-rust text-white px-3 py-1 text-xs font-semibold tracking-wide uppercase shadow-sm">
                Upcoming
              </span>
            )}
          </div>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl font-semibold text-white sm:text-4xl">
            {pkg.title}
          </h1>
          <p className="mt-1 text-sm text-white/80">
            {pkg.location} · {pkg.durationDays} days
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div>
          <p className="text-base leading-relaxed text-navy/80">{pkg.description}</p>

          <h2 className="mt-10 font-serif text-xl font-semibold text-navy">Itinerary</h2>
          <ol className="mt-5 space-y-6 border-l border-navy/10 pl-6">
            {pkg.itinerary.map((day) => (
              <li key={day.day} className="relative">
                <span className="absolute -left-[29px] flex h-4 w-4 items-center justify-center rounded-full bg-navy text-[9px] font-semibold text-white">
                  {day.day}
                </span>
                <p className="text-sm font-medium text-navy">{day.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{day.description}</p>
              </li>
            ))}
          </ol>

          <h2 className="mt-10 font-serif text-xl font-semibold text-navy">Room options</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {pkg.roomOptions.map((room) => (
              <div key={room.id} className="rounded-card bg-card p-4 ring-1 ring-navy/5">
                <p className="text-sm font-medium text-navy">{room.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{room.description}</p>
                <p className="mt-3 text-sm font-medium text-navy">
                  {room.priceUpgrade === 0 ? "Included" : `+${formatPrice(room.priceUpgrade)}`}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-card bg-navy p-6 text-white shadow-lg">
            <p className="text-xs uppercase tracking-wide text-white/60">From</p>
            <p className="mt-1 font-serif text-3xl font-semibold">{formatPrice(pkg.basePrice)}</p>
            <p className="text-xs text-white/60">per person, before taxes and fees</p>
            {!hasFutureDates ? (
              <div className="mt-5 space-y-3">
                <div className="rounded-card bg-white/10 p-3.5 border border-white/15 text-center">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-rust-light block mb-1">
                    ✨ Status: Upcoming
                  </span>
                  <p className="text-xs text-white/90 font-medium">
                    Departure dates opening soon
                  </p>
                  <p className="text-[11px] text-white/60 mt-1">
                    Specific dates for this trek are being scheduled.
                  </p>
                </div>
                <Link
                  href={`/destinations/${pkg.slug}/book`}
                  className="block rounded-pill border border-rust-light/40 bg-rust/20 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-rust"
                >
                  View Schedule Status →
                </Link>
                <a
                  href={`https://wa.me/?text=Hi%2C+I+am+interested+in+upcoming+dates+for+${encodeURIComponent(pkg.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-pill bg-white/10 py-2.5 text-center text-xs font-medium text-white/90 hover:bg-white/20 transition-colors"
                >
                  💬 Inquire via Concierge
                </a>
              </div>
            ) : (
              <Link
                href={`/destinations/${pkg.slug}/book`}
                className="mt-5 block rounded-pill bg-rust py-3 text-center text-sm font-medium text-white transition-colors hover:bg-rust-light"
              >
                Reserve Your Journey
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

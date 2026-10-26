import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import DestinationCard from "@/components/destinations/DestinationCard";
import { getFeaturedPackages, getHeroSettings } from "@/lib/packages";
import { getFavoritedPackageIds } from "@/lib/favorites";

export default async function Home() {
  const { userId } = await auth();
  const [featured, favoritedIds, hero] = await Promise.all([
    getFeaturedPackages(),
    getFavoritedPackageIds(userId),
    getHeroSettings(),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-navy">
        {hero.videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            poster={hero.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80"}
          >
            <source src={hero.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={hero.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80"}
            alt=""
            fill
            priority
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-navy/60 backdrop-blur-[2px]" />
        <div className="relative mx-auto flex min-h-[600px] max-w-7xl flex-col justify-center px-4 py-28 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-rust-light drop-shadow">
            {hero.badge}
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight text-white drop-shadow-md sm:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/90 drop-shadow">
            {hero.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/destinations"
              className="rounded-pill bg-rust px-8 py-3.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-rust-light hover:shadow-rust/20"
            >
              Explore Destinations
            </Link>
            <Link
              href="/concierge"
              className="rounded-pill border border-white/50 bg-white/10 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              Request Custom Plan
            </Link>


          </div>
        </div>
      </section>


      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">
              Featured
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-navy">
              Curated Journeys
            </h2>
          </div>
          <Link href="/destinations" className="hidden text-sm font-medium text-navy hover:underline sm:block">
            View all →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((pkg) => (
            <DestinationCard key={pkg.id} pkg={pkg} initialFavorited={favoritedIds.has(pkg.id)} />
          ))}
        </div>
      </section>
    </div>
  );
}

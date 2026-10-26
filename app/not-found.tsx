import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">404</p>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-navy sm:text-4xl">
        This journey isn&apos;t on the map
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
        The page you're looking for may have moved or never existed. Let's get you
        back to somewhere familiar.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-pill bg-rust px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rust-light"
        >
          Back home
        </Link>
        <Link
          href="/destinations"
          className="rounded-pill border border-navy/20 px-6 py-3 text-sm font-medium text-navy transition-colors hover:bg-page"
        >
          Explore destinations
        </Link>
      </div>
    </div>
  );
}

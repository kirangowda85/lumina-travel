"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled route error", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">Something went wrong</p>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-navy sm:text-4xl">
        We hit a snag
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
        Sorry about that — something on our end didn't load correctly. Trying again
        usually fixes it.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={reset}
          className="rounded-pill bg-rust px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rust-light"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-pill border border-navy/20 px-6 py-3 text-sm font-medium text-navy transition-colors hover:bg-page"
        >
          Back home
        </a>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-[360px] w-full bg-navy/10 sm:h-[440px]" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-navy/10" />
          <div className="h-4 w-5/6 rounded bg-navy/10" />
          <div className="h-4 w-2/3 rounded bg-navy/10" />

          <div className="mt-10 h-6 w-32 rounded bg-navy/10" />
          <div className="mt-5 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-40 rounded bg-navy/10" />
                <div className="h-3 w-full rounded bg-navy/10" />
              </div>
            ))}
          </div>
        </div>

        <div className="h-64 rounded-card bg-navy/10" />
      </div>
    </div>
  );
}

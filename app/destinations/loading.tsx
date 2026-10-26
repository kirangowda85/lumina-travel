export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-3 w-24 rounded bg-navy/10" />
      <div className="mt-3 h-9 w-64 rounded bg-navy/10" />
      <div className="mt-3 h-4 w-96 max-w-full rounded bg-navy/10" />

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <div className="h-64 rounded-card bg-card ring-1 ring-navy/5" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-card bg-card ring-1 ring-navy/5">
              <div className="aspect-[4/3] bg-navy/10" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-3/4 rounded bg-navy/10" />
                <div className="h-3 w-1/2 rounded bg-navy/10" />
                <div className="h-8 w-full rounded bg-navy/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

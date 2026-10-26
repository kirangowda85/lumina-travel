export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse px-4 py-12 sm:px-6">
      <div className="h-3 w-20 rounded bg-navy/10" />
      <div className="mt-3 h-9 w-48 rounded bg-navy/10" />

      <div className="mt-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-card bg-card p-4 ring-1 ring-navy/5">
            <div className="h-20 w-24 flex-shrink-0 rounded-lg bg-navy/10" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-1/2 rounded bg-navy/10" />
              <div className="h-3 w-1/3 rounded bg-navy/10" />
              <div className="h-3 w-1/4 rounded bg-navy/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

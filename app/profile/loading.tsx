export default function Loading() {
  return (
    <div className="mx-auto max-w-xl animate-pulse px-4 py-16 sm:px-6">
      <div className="h-3 w-16 rounded bg-navy/10" />
      <div className="mt-3 h-9 w-32 rounded bg-navy/10" />

      <div className="mt-8 flex items-center gap-4 rounded-card bg-card p-6 ring-1 ring-navy/5">
        <div className="h-14 w-14 rounded-full bg-navy/10" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-navy/10" />
          <div className="h-3 w-40 rounded bg-navy/10" />
        </div>
      </div>

      <div className="mt-4 space-y-px overflow-hidden rounded-card bg-card ring-1 ring-navy/5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 bg-navy/5" />
        ))}
      </div>
    </div>
  );
}

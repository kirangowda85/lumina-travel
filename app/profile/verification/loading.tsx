export default function Loading() {
  return (
    <div className="mx-auto max-w-xl animate-pulse px-4 py-12 sm:px-6">
      <div className="h-3 w-16 rounded bg-navy/10" />
      <div className="mt-3 h-9 w-64 rounded bg-navy/10" />
      <div className="mt-3 h-4 w-full rounded bg-navy/10" />
      <div className="mt-1 h-4 w-2/3 rounded bg-navy/10" />

      <div className="mt-8 space-y-6 rounded-card bg-card p-6 ring-1 ring-navy/5">
        <div className="h-16 rounded-lg bg-navy/10" />
        <div className="h-10 rounded-lg bg-navy/10" />
        <div className="h-32 rounded-card bg-navy/10" />
        <div className="h-11 rounded-pill bg-navy/10" />
      </div>
    </div>
  );
}
